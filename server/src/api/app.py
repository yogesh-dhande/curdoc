from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.blob import Blob
from models.project import Project
from models.user import User
from services.validation import register_exception_handlers

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/user/{id}")
async def get_user(id: str):
    return User(id=id).get()


@app.get("/project")
async def get_project(user_name: str, project_name: str):
    return Project(user=User.from_name(user_name), name=project_name).get()


@app.get("/blob")
async def get_blob(user_name: str, project_name: str, relative_file_path: str):
    return Project(user=User.from_name(user_name), name=project_name).get_blob(relative_file_path)


@app.get("/script")
async def get_script(user_name: str, project_name: str):
    return Project(user=User.from_name(user_name), name=project_name).get_app_script()


@app.post("/project")
async def create_project(project: Project):
    project.create()
    return project


@app.put("/blob")
async def update_blob(project: Project, blob: Blob):
    project.update_blob(blob)
    return blob
