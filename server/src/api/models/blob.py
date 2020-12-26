import os
from threading import local
from typing import Optional

from pydantic import BaseModel
from services.cloud_storage import cloud_storage_service
from services.storage import storage_service


class Blob(BaseModel):
    relative_path: str
    project_id: str
    text: Optional[str] = None

    def reload(self):
        self.text = storage_service.get_text_from_blob(self.project_id, self.relative_path)
        return self

    def save(self) -> None:
        if not self.text:
            raise ValueError("Blob.save must be called with the text to be saved")
        storage_service.write_text_to_blob(self.project_id, self.relative_path, self.text)

    def exists_locally(self) -> bool:
        return storage_service.does_blob_exist_locally(self.project_id, self.relative_path)

    def download(self) -> None:
        if not self.exists_locally():
            self.reload()
            self.save()

