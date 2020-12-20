from projects import Project, create_default_project
from users import User
from containers import container_service


class ClientSession(object):
    def __init__(self, user, container_service=container_service) -> None:
        self.user = User(user)
        self.container_service = container_service
        self.project = None

    def get_user(self):
        return self.user.get()

    def load_project(self, user_name, project_name):
        self.project = Project(user_name, project_name)
        self.container_service.ensure_container_for_project(self.project.id)
        return self.project

    def load_default_project(self, user_name, project_name, code):
        self.project = Project(user_name, project_name)
        project_data = create_default_project(user_name, project_name, code)
        self.container_service.ensure_container_for_project(self.project.id)
        return project_data

    def get_code(self, user_name, project_name):
        print(user_name)
        self.load_project(user_name, project_name)
        return self.project.get_code()
        
    def get_app_script(self, user_name, project_name):
        # this function creates files
        self.load_project(user_name, project_name)
        self.project.write_to_filesystem()
        return self.container_service.get_app_script(self)