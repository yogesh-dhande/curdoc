import os

from firebase_admin.storage import bucket
from firebase_admin.storage import storage

STORAGE_BUCKET = os.getenv("STORAGE_BUCKET") or "databrowser-ykd.appspot.com"


class CloudStorageBase(object):

    def get_text_from_blob(self, path) -> str:
        raise NotImplementedError

    def write_text_to_blob(self, path, text):
        pass


class GoogleCloudStorage(CloudStorageBase):

    def __init__(self) -> None:
        super().__init__()
        self.bucket: storage.Bucket = bucket(STORAGE_BUCKET)

    def get_text_from_blob(self, path) -> str:
        return self.bucket.blob(path).download_as_text()

    def write_text_to_blob(self, path, text) -> None:
        self.bucket.blob(path).upload_from_string(text)


cloud_storage_service = GoogleCloudStorage()
