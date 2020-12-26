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
        storage_service.write_text_to_blob(self.project_id, self.relative_path, self.text)

    def download(self) -> None:
        self.reload()
        self.save()

