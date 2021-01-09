from typing import Dict
from typing import Optional

from firebase_admin.firestore import firestore
from google.cloud.firestore_v1.document import DocumentReference

from services import db
from services.validation import ProjectAleadyExistsError
from services.validation import ProjectIDNotFoundError
from services.validation import ProjectNotFoundError
from services.validation import UserIDNotFoundError
from services.validation import UserNotFoundError

project_id_cache: Dict[str, str] = {}
user_id_cache: Dict[str, str] = {}


class Database(object):
    def __init__(self) -> None:
        self.projects = None
        self.users = None

    def get_user_json(self, user_name) -> dict:
        raise NotImplementedError

    def get_project_id(self, user_name, project_name) -> Optional[str]:
        raise NotImplementedError

    def get_project_json(self, project_id) -> dict:
        raise NotImplementedError

    def create_project(self, user_name, project_name) -> str:
        raise NotImplementedError

    def add_blob_to_project(self, project_id: str, relative_path: str):
        raise NotImplementedError

    def get_user_id_from_name(self, user_name) -> str:
        raise NotImplementedError


class Firebase(Database):
    def __init__(self) -> None:
        self.projects: firestore.CollectionReference = db.collection("projects")
        self.users: firestore.CollectionReference = db.collection("users")

    def get_user_json(self, user_id: str) -> dict:
        user_doc: DocumentReference = self.users.document(user_id).get()
        if not user_doc.exists:
            raise UserIDNotFoundError(user_id=user_id)
        return user_doc.to_dict()

    def get_user_id_from_name(self, user_name) -> dict:
        user_id = user_id_cache.get(user_name, None)
        if user_id is None:
            try:
                user_id = self.users.where("name", "==", user_name).get()[0].reference.id
            except IndexError:
                raise UserNotFoundError(user_name=user_name)
        return user_id

    def get_project_id(self, user_name, project_name) -> Optional[str]:
        project_id = project_id_cache.get((user_name, project_name), None)
        if project_id is None:
            try:
                project_id = (
                    self.projects.where("user.name", "==", user_name)
                    .where("name", "==", project_name)
                    .get()[0]
                    .reference.id
                )
            except IndexError:
                raise ProjectNotFoundError(user_name=user_name, project_name=project_name)
        return project_id

    def get_project_json(self, project_id) -> dict:
        project_doc: DocumentReference = self.projects.document(project_id).get()
        if not project_doc.exists:
            raise ProjectIDNotFoundError(project_id=project_id)
        return project_doc.to_dict()

    def create_project(self, project_json) -> str:
        user_name = project_json["user"]["name"]
        project_name = project_json["name"]
        try:
            self.get_project_id(user_name, project_name)
            raise ProjectAleadyExistsError(user_name, project_name)
        except ProjectNotFoundError:
            project_doc: firestore.DocumentReference = self.projects.document()
            project_id = project_doc.id
            project_json["id"] = project_id
            project_doc.set({**project_json, **{"timeCreated": firestore.SERVER_TIMESTAMP}})
            return project_id

    def add_blob_to_project(self, project_id: str, blob_json: dict):
        project_ref: firestore.DocumentReference = self.projects.document(project_id)
        project_doc_snap: firestore.DocumentSnapshot = project_ref.get()
        if blob_json not in project_doc_snap.get("blob"):
            project_ref.update({"blob": firestore.ArrayUnion([blob_json])})


database = Firebase()
