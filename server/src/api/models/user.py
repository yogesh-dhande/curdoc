from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: str
    name: Optional[str] = None
    