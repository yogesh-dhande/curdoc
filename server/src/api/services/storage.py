import os
from pathlib import Path

from services.cloud_storage import cloud_storage_service


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
        return os.path.join(f"/app/projects/{project_id}", relative_path)

    @staticmethod
    def get_cloud_path(project_id, relative_path):
        return os.path.join(f"projects/{project_id}", relative_path)

    def write_text_to_blob(self, project_id, relative_path, text):
        local_path = self.get_local_path(project_id, relative_path)
        ensure_dir_recursive(os.path.dirname(local_path))

        with open(local_path, "w+") as file:
            file.write(text)

        cloud_path = self.get_cloud_path(project_id, relative_path)
        cloud_storage_service.write_text_to_blob(cloud_path, text)

    def get_text_from_blob(self, project_id, relative_path) -> str:
        cloud_path = self.get_cloud_path(project_id, relative_path)
        return cloud_storage_service.get_text_from_blob(cloud_path)


storage_service = StorageService()
