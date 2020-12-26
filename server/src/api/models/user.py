from typing import Optional

from pydantic import BaseModel
from services.database import database


class User(BaseModel):
    name: str
    id: Optional[str] = None

    def get(self):
        return database.get_user_json(self.name)
    