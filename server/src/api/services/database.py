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

    def get_user_id_from_name(self, user_name) -> str:
        raise NotImplementedError


class Firebase(Database):
    def __init__(self) -> None:
        self.projects: firestore.CollectionReference = db.collection("projects")
        self.users: firestore.CollectionReference = db.collection("users")

    def get_user_json(self, user_id: str) -> dict:
        return self.users.document(user_id).get().to_dict()
    
    def get_user_id_from_name(self, user_name) -> dict:
        try:
            return self.users.where("name", "==", user_name).get()[0].reference.id
        except IndexError:
            return None

    def get_project_id(self, user_name, project_name) -> Optional[str]:
        try:
            project_id =  id_cache.get((user_name, project_name), None)
            if project_id is None:
                project_id = self.projects.where(u"user.name", "==", user_name).where(u"name", "==", project_name).get()[0].reference.id
            return project_id
        except IndexError:
            return None

    def get_project_json(self, project_id) -> dict:
        return self.projects.document(project_id).get().to_dict()

    def create_project(self, project_json) -> str:
        project_doc: firestore.DocumentReference = self.projects.document()
        project_id = project_doc.id
        project_json["id"] = project_id

        project_doc.set({**project_json, **{"timeCreated": firestore.SERVER_TIMESTAMP}})

        user_id = project_json["user"]["id"]
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

