from fastapi import FastAPI

from models.blob import Blob
from models.project import Project
from models.user import User

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/user")
async def get_user(user_name: str):
    return User(name=user_name).get()


@app.get("/project")
async def get_project(user_name: str, project_name: str):
    return Project(user_name=user_name, name=project_name).get()


@app.get("/blob")
async def get_blob(user_name: str, project_name: str, relative_file_path: str):
    return Project(user_name=user_name, name=project_name).get_blob(relative_file_path)


@app.get("/script")
async def get_script(user_name: str, project_name: str):
    return Project(user_name=user_name, name=project_name).get_app_script()


@app.post("/project")
async def create_project(project: Project):
    project.create()
    return project


@app.put("/blob")
async def update_blob(blob: Blob):
    blob.save()
    return blob
