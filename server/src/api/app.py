import os

from fastapi import APIRouter
from fastapi import FastAPI
from fastapi import Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models.session import Session
from services.container import container_service
from services.validation import register_exception_handlers

app = FastAPI()

router = APIRouter()

origins = [
    f"{os.getenv('ORIGIN_PROTOCOL')}://{os.getenv('ORIGIN_DOMAIN')}",
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
    print("shuting the server down")
    container_service.stop_all_containers()


@router.get("/")
async def root():
    return {"message": "from sandbox"}


@router.get("/test")
async def test():
    return {"message": "from sandbox/test"}


@router.post("/project")
async def get_app_url(session: Session, api_key: str = Header(None)):
    # if api_key != os.getenv("SANDBOX_API_KEY"):
    #     raise InvalidAPIKey(api_key=api_key)
    return JSONResponse(
        content={
            "url": session.project.get_app_url(session.new, query=session.query),
            "logs": session.project.get_logs(),
        }
    )


app.include_router(router, prefix="/sandbox")
