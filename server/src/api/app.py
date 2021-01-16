from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Depends
from starlette import status

from models.blob import Blob
from models.project import Project
from models.user import User
from services.auth import JWTBearer
from services.cloud_storage import cloud_storage_service
from services.container import container_service
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


@app.on_event("shutdown")
async def shutdown_event():
    print("shuting the server down ...")
    container_service.stop_all_containers()
    cloud_storage_service.sync()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/user/{name}")
async def get_user(name: str):
    # TODO filter out private projects if current_user_id != id
    return User.from_name(name).get()


@app.get("/project")
async def get_project(user_name: str, project_name: str):
    user = User.from_name(user_name)
    return Project(user=user, name=project_name).get()


@app.get("/blob")
async def get_blob(user_name: str, project_name: str, relative_file_path: str):
    return Project(user=User.from_name(user_name), name=project_name).get_blob(relative_file_path)


@app.get("/script")
async def get_script(user_name: str, project_name: str):
    return Project(user=User.from_name(user_name), name=project_name).get_app_script()


@app.post("/project")
async def create_project(project: Project):
    print(project)
    project.create()
    return project


@app.put("/blob")
async def update_blob(project: Project, blob: Blob, current_user_id: str = Depends(JWTBearer())):
    if current_user_id != project.user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You do not have permission to edit this project",
        )

    project.update_blob(blob)
    return blob
