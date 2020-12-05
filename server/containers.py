import subprocess
import threading
import time
from contextlib import closing
import socket

from bokeh.embed import server_document
from bokeh.client import pull_session

allowed_ports = [5006, 5007, 5008]

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
        self.port = None
        self.client_sessions = set()

    def start(self):
        raise NotImplementedError

    def stop(self):
        raise NotImplementedError

    def _get_app_script(self):
        raise NotImplementedError

    def get_app_script(self):
        self.last_used = time.time()
        return self._get_app_script()


class MockContainerSession(ContainerSessionBase):
    time_out_sec = 1

    def start(self):
        pass

    def stop(self):
        pass

    def _get_app_script(self):
        pass


class ContainerSession(ContainerSessionBase):
    
    def start(self):
        print(f"starting bokeh container for {self.project_id}")
        for p in allowed_ports:
            container_name =  f"sandbox{p}"
            process = subprocess.Popen(
                ['./run_sanbox.sh', str(p), container_name], 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE
            )

            stdout, _ = process.communicate()
            print(stdout.decode("utf-8"))
            if not process.returncode:
                print(f"Started bokeh server on port {p} for {self.project_id}")
                self.port = p
                self.container_name = container_name
                return

    def stop(self):
        subprocess.Popen(['docker', 'stop', self.container_name], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        ).communicate()

    def _get_app_script(self):
        app_url = f"http://localhost:{self.port}/main"

        while True:
            try:
                pull_session(url=f"http://sandbox{self.port}:5006/main")
                break
            except Exception as e:
                print(str(e))
                time.sleep(1)
                
        script = server_document(arguments={'project': self.project_id}, url=app_url)
        self.last_used = time.time()
        return script

class ContainerService(object):
    container_sessions = {}  # project.id to container_session mapping

    def __init__(self, container_session_type=ContainerSession) -> None:
        self.container_session_type = container_session_type
        thread = threading.Thread(target=self.prune_containers)
        thread.daemon = True
        thread.start()

    def start_container(self, project_id):
        container_session = self.container_session_type(project_id)
        container_session.start()
        self.container_sessions[project_id] = container_session
        print(self.container_sessions)
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
                        self.stop_container(project_id)
            except RuntimeError:
                # TODO stopping containers changes dict size during iteration
                pass
            print(self.container_sessions)
            time.sleep(60)

    def get_container_session_for_project(self, project_id):
        # TODO check if the container is still running
        if project_id in self.container_sessions:
            return self.container_sessions[project_id]
        else:
            return self.start_container(project_id)
            
    def get_app_script(self, client_session):  # TODO replace argument with a ClientSession object?
        container_session = self.get_container_session_for_project(client_session.project.id)
        container_session.client_sessions.add(client_session)
        return container_session.get_app_script()


container_service = ContainerService()