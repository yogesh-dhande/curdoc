import os
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from dotenv import load_dotenv

load_dotenv()


class Database(object):

    def __init__(self) -> None:
        self.projects = None
        self.users = None
        self.constants = None
        self.blobs = None

    def does_project_exist(self, user_name, project_name):
        raise NotImplementedError

    def get_project_id(self, user_name, project_name):
        raise NotImplementedError

    def add_project(self, user_name, project_name):
        raise NotImplementedError

    def get_code_from_project(self, user_name, project_name):
        raise NotImplementedError

    def write_code_to_project(self, user_name, project_name):
        raise NotImplementedError

class MemoryDB(object):
    def __init__(self) -> None:
        self.projects = {}
        self.users = {}
        self.constants = {}
        self.blobs = {}

    def does_project_exist(self, user_name, project_name):
        return self.users[user_name]["projects"].get(project_name, False)

    def get_project_id(self, user_name, project_name):
        return self.users[user_name]["projects"][project_name]["refKey"]

    def add_project(self, user_name, project_name):
        self.users[user_name]["projects"][project_name] = {
            "name": project_name, 
            "refKey": str(time.time)
        }

    def get_code_from_project(self, user_name, project_name):
        self.projects[self.get_project_id(user_name, project_name)]["code"]

    def write_code_to_project(self, user_name, project_name, code):
        self.projects[self.get_project_id(user_name, project_name)]["code"] = code

class Firebase(object):
    def __init__(self) -> None:
        cred = credentials.Certificate("databrowser-service-account-key.json")
        app = firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL")})

        db = firestore.client()
        self.projects = db.collection("projects")
        self.users = db.collection("users")
        self.constants = db.collection("constants")
        self.blobs = db.collection("blob")

    def does_project_exist(self, user_name, project_name):
        user_doc = self.users.document(user_name)
        project_doc = user_doc.collection("projects").document(project_name)
        return project_doc.get().exists

    def get_project_id(self, user_name, project_name):
        user_doc = self.users.document(user_name)
        project_doc = user_doc.collection("projects").document(project_name)
        return project_doc.get().to_dict()["refKey"]

    def add_project(self, user_name, project_name):
        # TODO add fields like timeCreated: "timeCreated": firestore.SERVER_TIMESTAMP
        project_doc = self.projects.document()
        project_doc.set({"name": project_name, "refKey": project_doc.id})
        user_doc = self.users.document(user_name)
        user_doc.collection("projects").document(project_name).set(
            {
                "refKey": project_doc.id,
                "name": project_name,
            }
        )


    def get_project_ref(self, user_name, project_name):
        project_id = self.get_project_id(user_name, project_name)
        return self.projects.document(project_id)


    def write_code_to_project(self, user_name, project_name, code):
        project_ref = self.get_project_ref(user_name, project_name)
        project_ref.update({"code": code})
        return project_ref.get().to_dict()


    def get_code_from_project(self, user_name, project_name):
        return self.get_project_ref(user_name, project_name).get().to_dict()["code"]


