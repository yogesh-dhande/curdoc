from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi.responses import JSONResponse


class CustomHTTPException(HTTPException):
    status_code = status.HTTP_404_NOT_FOUND

    def get_message(self):
        raise NotImplementedError

    @classmethod
    def handle(cls, request: Request, exc: "CustomHTTPException"):
        return JSONResponse(
            status_code=cls.status_code, content={"message": exc.get_message()}
        )


class UserNotFoundError(CustomHTTPException):
    def __init__(self, user_name: str) -> None:
        self.user_name = user_name

    def get_message(self):
        return f"User {self.user_name} was not found."


class UserIDNotFoundError(CustomHTTPException):
    def __init__(self, user_id: str) -> None:
        self.user_id = user_id

    def get_message(self):
        return f"User {self.user_id} was not found."


class ProjectNotFoundError(CustomHTTPException):
    def __init__(self, user_name: str, project_name: str) -> None:
        self.user_name = user_name
        self.project_name = project_name

    def get_message(self):
        return f"Project {self.project_name} by {self.user_name} was not found."


class ProjectIDNotFoundError(CustomHTTPException):
    def __init__(self, project_id: str) -> None:
        self.project_id = project_id

    def get_message(self):
        return f"Project {self.project_id} was not found."


class ProjectAleadyExistsError(ProjectNotFoundError):
    status_code = status.HTTP_409_CONFLICT

    def get_message(self):
        return f"Project named {self.project_name} by user {self.user_name} already exists."


class BlobNotFoundError(CustomHTTPException):
    def __init__(self, project_id: str, relative_path: str) -> None:
        self.project_id = project_id
        self.relative_path = relative_path

    def get_message(self):
        return f"File at location {self.relative_path} was not found for project {self.project_id}."


class InvalidAPIKey(CustomHTTPException):
    status_code = status.HTTP_403_FORBIDDEN

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def get_message(self):
        return f"Invalid api key {self.api_key}"


def register_exception_handlers(app: FastAPI):
    for exception_type in CustomHTTPException.__subclasses__():
        app.exception_handler(exception_type)(exception_type.handle)
