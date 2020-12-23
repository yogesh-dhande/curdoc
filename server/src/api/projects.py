import os
from pathlib import Path

from database import db

LOCAL_BUCKET_PATH = "/"


def ensure_dir_recursive(dir_path):
    Path(dir_path).mkdir(parents=True, exist_ok=True)


class Project(object):

    cache = {}

    def __init__(self, user_name, name) -> None:
        self.user_name = user_name
        self.name = name
        self.cache[(user_name, name)] = self
        self.id = db.get_project_id(self.user_name, self.name)
        self.ensure_project_dir()
        # TODO ensure project folder exists locally and is up to date

    def ensure_project_dir(self):
        project_dir = self.get_project_dir_path()
        ensure_dir_recursive(project_dir)
        if not os.path.exists(project_dir):
            db.download_project_files(self.id, project_dir)

    @classmethod
    def from_cache(cls, user_name, name):
        return cls.cache.get((user_name, name), Project(user_name, name))

    def get_json(self):
        return db.get_project_json(self.id)

    def get_code(self, relative_file_path):
        return db.get_code_from_project(self.id, relative_file_path)
    
    def get_project_dir_path(self):
        prefix = db.get_blob_prefix(self.id)
        return os.path.join(LOCAL_BUCKET_PATH, prefix)

    def get_full_path(self, relative_file_path):
        path = os.path.join(self.get_project_dir_path(), relative_file_path)
        return path

    def write_to_filesystem(self, relative_file_path, code):
        path = self.get_full_path(relative_file_path)
        ensure_dir_recursive(os.path.dirname(path))
        with open(path, "w+") as code_file:
            code_file.write(code)

    def write_to_database(self, relative_file_path, code):
        db.write_code_to_project(self.id, relative_file_path, code)

    def write_code(self, relative_file_path, code):
        self.write_to_database(relative_file_path, code)
        self.write_to_filesystem(relative_file_path, code)

    def add_file(self, relative_file_path):
        self.write_to_filesystem(relative_file_path, "")
        db.add_file_to_project(self.id, relative_file_path)


def get_starter_code_for_project() -> str:
    with open("resources/default.py", "r") as code_file:
        return code_file.read()


def create_default_project(user_name, project_name, code=""):    
    project_data = db.add_project(user_name, project_name)
    project = Project(user_name, project_name)
    relative_file_path = "main.py"
    project.write_code(relative_file_path, code)
    return project_data
