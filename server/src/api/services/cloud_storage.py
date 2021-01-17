import os
import subprocess

from firebase_admin.storage import bucket
from firebase_admin.storage import storage

from services.storage import PROJECTS_DIR
from services.validation import BlobNotFoundError

STORAGE_BUCKET = os.getenv("STORAGE_BUCKET")


class CloudStorageBase(object):
    def get_text_from_blob(self, path) -> str:
        raise NotImplementedError

    def write_text_to_blob(self, path, text):
        pass


class GoogleCloudStorage(CloudStorageBase):
    def __init__(self) -> None:
        super().__init__()
        self.bucket: storage.Bucket = bucket(STORAGE_BUCKET)

    @staticmethod
    def get_path(project_id, relative_path):
        return os.path.join(f"projects/{project_id}", relative_path)

    def get_text_from_blob(self, project_id, relative_path) -> str:
        path = self.get_path(project_id, relative_path)
        blob: storage.Blob = self.bucket.blob(path)
        if not blob.exists():
            raise BlobNotFoundError(project_id=project_id, relative_path=relative_path)
        return self.bucket.blob(path).download_as_text()

    def write_text_to_blob(self, project_id, relative_path, text) -> None:
        path = self.get_path(project_id, relative_path)
        self.bucket.blob(path).upload_from_string(text)

    @staticmethod
    def sync():
        # TODO run at a regular interval?
        process = subprocess.Popen(["gsutil", "-m", "rsync", "-r", PROJECTS_DIR, os.getenv("CLOUD_PROJECTS_DIR")])
        process.communicate()


cloud_storage_service = GoogleCloudStorage()
