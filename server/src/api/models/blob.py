from typing import Optional

from pydantic import BaseModel
from services.storage import storage_service


class Blob(BaseModel):
    relative_path: str
    text: Optional[str] = None

    def reload(self, project_id):
        self.text = storage_service.get_text_from_blob(project_id, self.relative_path)
        return self

    def save(self, project_id) -> None:
        if not self.text:
            raise ValueError("Blob.save must be called with the text to be saved")
        storage_service.write_text_to_blob(project_id, self.relative_path, self.text)

    def exists_locally(self, project_id) -> bool:
        return storage_service.does_blob_exist_locally(project_id, self.relative_path)

    def download(self, project_id) -> None:
        if not self.exists_locally(project_id):
            self.reload(project_id)
            self.save(project_id)

