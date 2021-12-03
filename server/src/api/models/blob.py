from typing import Optional

from pydantic import BaseModel
from services.storage import storage_service


class Blob(BaseModel):
    relativePath: str
    fullPath: str
    text: Optional[str] = None

    def reload(self, project_id):
        if not self.text:
            self.text = storage_service.get_text_from_blob(project_id, self.relativePath)
        return self

    def save(self, project_id) -> None:
        if self.text is None:
            # TODO convert to http exception
            raise ValueError("Blob.save must be called with the text to be saved")
        storage_service.write_text_to_blob(project_id, self.relativePath, self.text)

    def exists_locally(self, project_id) -> bool:
        return storage_service.does_blob_exist_locally(project_id, self.relativePath)

    def ensure_locally(self, project_id) -> None:
        self.save(project_id)
