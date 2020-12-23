from containers import ContainerService
from containers import container_service
from projects import Project
from projects import create_default_project
from users import User


class ClientSession(object):
    def __init__(self, user) -> None:
        self.user: User = User(user)
        self.project: Project = None

    def get_user(self):
        return self.user.get()

    def load_project(self, user_name, project_name):
        self.project = Project.from_cache(user_name, project_name)
        container_service.ensure_container_for_project(self.project.id)
        return self.project

    def load_default_project(self, user_name, project_name, code):
        project_data = create_default_project(user_name, project_name, code)
        self.load_project(user_name, project_name)
        return project_data

    def get_project(self, user_name, project_name):
        self.load_project(user_name, project_name)
        return self.project.get_json()

    def get_code(self, user_name, project_name, relative_file_path):
        print(user_name)
        self.load_project(user_name, project_name)
        return self.project.get_code(relative_file_path)
        
    def get_app_script(self, user_name, project_name):
        # this function creates files
        self.load_project(user_name, project_name)
        return container_service.get_app_script(self)
