import os
import socket
import threading
import time
from contextlib import closing
from typing import Dict
from typing import List

import docker

allowed_ports = range(5001, 5010)
client = docker.from_env()


def get_container_name_for_port(port):
    return f"sandbox{port}"


def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('0.0.0.0', port)) == 0


class ContainerSessionBase(object):

    time_out_sec = 1 * 60

    def __init__(self, project_id) -> None:
        self.project_id = project_id
        self.last_used = time.time()
        self.container_name = None
        self.container = None
        self.port = None

    def start(self):
        raise NotImplementedError

    def stop(self):
        raise NotImplementedError

    def is_container_running(self):
        raise NotImplementedError

    def _get_app_script(self):
        raise NotImplementedError


class MockContainerSession(ContainerSessionBase):
    time_out_sec = 1

    def start(self):
        pass

    def stop(self):
        pass

    def is_container_running(self):
        return True


class ContainerSession(ContainerSessionBase):
    
    def start(self):
        print(f"starting bokeh container for {self.project_id}")
        for p in allowed_ports:
            container_name =  get_container_name_for_port(p)
            try:
                self.container = client.containers.run(
                    name=container_name,
                    image=os.environ.get("SANDBOX_IMAGE"),
                    detach=True,
                    remove=True,
                    ports={5006: p},
                    network="bokeh-play_default",
                    volumes={
                        os.path.join(os.environ.get("PROJECTS_DIR"), self.project_id): {
                            "bind": f"/app/workspace/{self.project_id}",
                            "mode": "ro"
                        }
                    },
                    environment={
                        "PROJECT_ID": self.project_id
                    }
                )
                print(f"Started bokeh server on port {p} for {self.project_id}")
                self.port = p
                self.container_name = container_name
                return

            except Exception as e:
                # Container name or port is already in use.
                print(str(e))

    def stop(self):
        if self.container:
            self.container.stop()

    def is_container_running(self):
        try:
            client.containers.get(self.container_name)
            return True
        except Exception as e:
            print(str(e))
            return False
                

class ContainerService(object):
    container_sessions: Dict[int, ContainerSessionBase] = {}  # port to container_session mapping

    def __init__(self, container_session_type: ContainerSessionBase=ContainerSession) -> None:
        self.container_session_type = container_session_type
        thread = threading.Thread(target=self.prune_containers, daemon=True)
        thread.start()

    def get_oldest_container_session(self):
        container_sessions = sorted(self.container_sessions.values(), key=lambda session: session.last_used)
        if container_sessions:
            return container_sessions[0]

    def get_recent_container_session_for_project(self, project_id):
        # Return the most recent container
        container_sessions = sorted([
                container_session for container_session in self.container_sessions.values() 
                if container_session.project_id == project_id
            ], key=lambda session: session.last_used, reverse=True)
        if container_sessions:
            return container_sessions[0]

    def stop_all_containers(self):
        for port in allowed_ports:
            container_name = get_container_name_for_port(port)
            try:
                container = client.containers.get(container_name)
                print(container.name)
                container.stop()
            except Exception as e:
                print(str(e))


    def start_container(self, project_id):
        if len(self.container_sessions) == len(allowed_ports):
            self.get_oldest_container_session().stop()

        container_session = self.container_session_type(project_id)
        container_session.start()
        self.container_sessions[container_session.port] = container_session
        return container_session

    def stop_container(self, container_session: ContainerSessionBase):  # TODO make this function async
        container_session.stop()
        del self.container_sessions[container_session.port]

    def prune_containers(self):  # TODO make this function async
        while True:
            try:
                for port, container_session in self.container_sessions.items():
                    container_age = time.time() - container_session.last_used
                    print(f"Container for {container_session.project_id} has been running for {container_age} seconds on port {port}")
                    if container_age > container_session.time_out_sec:
                        print(f"Stopping container for {container_session.project_id}")
                        self.stop_container(container_session)
            except RuntimeError:
                # TODO stopping containers changes dict size during iteration, 
                # fix by first retreiving the list to be stopped
                pass
            time.sleep(10)
    
    def ensure_container_for_project(self, project_id: str) -> ContainerSessionBase:
        try:
            container_session = self.get_recent_container_session_for_project(project_id)
            if container_session:
                if container_session.is_container_running():
                    return container_session
                else:
                    print(f"No running container session found for {project_id}")
                    del self.container_sessions[container_session.port]
            raise IndexError

        except IndexError:
            return self.start_container(project_id)

    def get_container_session_for_project(self, project_id, new=False) -> ContainerSessionBase:
        if new:
            container_session = self.start_container(project_id)
        else:
            container_session = self.ensure_container_for_project(project_id)

        container_session.last_used = time.time()
        return container_session


container_service = ContainerService()


