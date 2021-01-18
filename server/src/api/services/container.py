import os
import socket
import threading
import time
from contextlib import closing
from typing import Dict

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

    time_out_sec = 3 * 60

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
                            "bind": f"/{self.project_id}",
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
    container_sessions: Dict[str, ContainerSessionBase] = {}  # project.id to container_session mapping

    def __init__(self, container_session_type: ContainerSessionBase=ContainerSession) -> None:
        self.container_session_type = container_session_type
        thread = threading.Thread(target=self.prune_containers, daemon=True)
        thread.start()

    
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
        container_session = self.container_session_type(project_id)
        container_session.start()
        self.container_sessions[project_id] = container_session
        return container_session

    def stop_container(self, project_id):  # TODO make this function async
        if project_id in self.container_sessions:
            self.get_container_session_for_project(project_id).stop()
            del self.container_sessions[project_id]

    def prune_containers(self):  # TODO make this function async
        while True:
            try:
                for project_id, container_session in self.container_sessions.items():
                    container_age = time.time() - container_session.last_used
                    print(f"Container for {project_id} has been running for {container_age} seconds")
                    if container_age > container_session.time_out_sec:
                        print(f"Stopping container for {project_id}")
                        self.stop_container(project_id)
            except RuntimeError:
                # TODO stopping containers changes dict size during iteration, 
                # fix by first retreiving the list to be stopped
                pass
            time.sleep(60)
    
    def ensure_container_for_project(self, project_id):
        try:
            container_session = self.container_sessions[project_id]
            if not container_session.is_container_running():
                print(f"container for {project_id} named {container_session.container_name} was not running")
                self.container_sessions.pop(project_id)
                raise KeyError
        except KeyError:
            self.start_container(project_id)

    def get_container_session_for_project(self, project_id) -> ContainerSessionBase:
        self.ensure_container_for_project(project_id)
        container_session = self.container_sessions[project_id]
        container_session.last_used = time.time()
        return container_session


container_service = ContainerService()


