import os
from database import db

PROJECTS_FOLDER_PATH = "/projects"
class Project(object):

    projects = {}

    def __init__(self, user_name, name) -> None:
        self.user_name = user_name
        self.name = name
        self.id = f"{user_name}-{name}"

    def get_code(self):
        return db.get_code_from_project(self.user_name, self.name)

    def get_file_path(self):
        return os.path.join(PROJECTS_FOLDER_PATH, self.id + '.py')

    def write_to_filesystem(self):
        with open(self.get_file_path(), "w+") as code_file:
            code_file.write(self.get_code())

    def write_to_database(self, code):
        # Writes to database
        db.write_code_to_project(self.user_name, self.name, code)


def get_starter_code_for_project():
    with open("resources/default.py", "r") as code_file:
        return code_file.read()


def create_default_project(user_name, project_name, code=""):    
    project_data = db.add_project(user_name, project_name, code)
    project = Project(user_name, project_name)
    project.write_to_filesystem()
    return project_data