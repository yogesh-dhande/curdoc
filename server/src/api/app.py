from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware

from models.project import Project
from services.container import container_service

# from services.validation import register_exception_handlers

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

# register_exception_handlers(app)


@app.on_event("shutdown")
async def shutdown_event():
    print("shuting the server down")
    container_service.stop_all_containers()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/project")
async def get_script(project: Project, request: Request):
    print(request.client)
    return project.get_app_script()
