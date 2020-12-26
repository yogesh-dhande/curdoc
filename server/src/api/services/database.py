from typing import Optional

from firebase_admin.firestore import firestore

from services import db

id_cache = {}


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


class Firebase(Database):
    def __init__(self) -> None:
        self.projects: firestore.CollectionReference = db.collection("projects")
        self.users: firestore.CollectionReference = db.collection("users")

    def get_user_json(self, user_name) -> dict:
        snap: firestore.firestore.DocumentSnapshot = self.users.where("name", "==", user_name).get()
        try:
            return snap[0].to_dict()
        except IndexError:
            return {}

    def get_project_id(self, user_name, project_name) -> Optional[str]:
        try:
            return id_cache.get((user_name, project_name), 
                self.projects
                .where(u"user_name", "==", user_name)
                .where(u"name", "==", project_name)
                .get()[0]
                .reference.id
            )
        except IndexError:
            return None

    def get_project_json(self, project_id) -> dict:
        return self.projects.document(project_id).get().to_dict()

    def create_project(self, project_json) -> str:
        project_doc: firestore.DocumentReference = self.projects.document()
        project_id = project_doc.id
        project_json["id"] = project_id

        project_doc.set({**project_json, **{"timeCreated": firestore.SERVER_TIMESTAMP}})

        user_id = self.users.where("name", "==", project_json["user_name"]).get()[0].id
        self.users.document(user_id).update({
            f"projects.{project_doc.id}": {
                "id": project_doc.id,
                "name": project_json["name"],
            }
        })
        return project_id

    def add_blob_to_project(self, project_id: str, blob_json: dict):
        project_ref: firestore.DocumentReference = self.projects.document(project_id)
        project_doc_snap: firestore.DocumentSnapshot = project_ref.get()
        if blob_json not in project_doc_snap.get("blob"):
            project_ref.update({"blob": firestore.ArrayUnion([blob_json])})
       

database = Firebase()

