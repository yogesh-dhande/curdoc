from pydantic import BaseModel

from models.project import Project


class Session(BaseModel):
    project: Project
    new: bool = False
