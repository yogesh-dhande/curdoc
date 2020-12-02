from projects import Project
from containers import container_service


class ClientSession(object):
    def __init__(self, user, container_service=container_service) -> None:
        self.user = user
        self.container_service = container_service
        self.project = None

    def load_project(self, user_name, project_name):
        self.project = Project(user_name, project_name)
        return self.project

    def get_code(self, user_name, project_name):
        self.load_project(user_name, project_name)
        self.project.get_code()
        
    def get_app_script(self, user_name, project_name):
        # this function creates files
        self.load_project(user_name, project_name)
        self.project.write_to_filesystem()
        return self.container_service.get_app_script(self)