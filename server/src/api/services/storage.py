import os
from pathlib import Path

PROJECTS_DIR = "/projects"


def ensure_dir_recursive(dir_path):
    Path(dir_path).mkdir(parents=True, exist_ok=True)


class StorageBase(object):
    @staticmethod
    def get_prefix(project_id):
        raise NotImplementedError

    def write_text_to_blob(self, project_id, relative_path, text):
        raise NotImplementedError

    def download_project_files(self, project_id, project_dir):
        raise NotImplementedError

    def get_text_from_blob(self, project_id, relative_path) -> str:
        raise NotImplementedError


class StorageService(StorageBase):
    @staticmethod
    def get_local_path(project_id, relative_path):
        return os.path.join(PROJECTS_DIR, project_id, relative_path)

    @staticmethod
    def get_log_path(project_id):
        path = os.path.join(PROJECTS_DIR, project_id, "log")
        return path

    def does_blob_exist_locally(self, project_id, relative_path) -> bool:
        path = self.get_local_path(project_id, relative_path)
        return os.path.exists(path)

    def write_text_to_blob(self, project_id, relative_path, text):
        local_path = self.get_local_path(project_id, relative_path)
        ensure_dir_recursive(os.path.dirname(local_path))

        with open(local_path, "w+") as file:
            file.write(text)

    def get_text_from_blob(self, project_id, relative_path) -> str:
        with open(self.get_local_path(project_id, relative_path)) as file:
            return file.read()


storage_service = StorageService()
