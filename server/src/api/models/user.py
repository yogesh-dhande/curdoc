from typing import Optional

from pydantic import BaseModel
from services.database import database


class User(BaseModel):
    id: str
    name: Optional[str] = None

    def get(self):
        return database.get_user_json(self.id)

    @classmethod
    def from_name(cls, name):
        id = database.get_user_id_from_name(name)
        return cls(id=id, name=name)
    