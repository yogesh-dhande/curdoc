import os
import time
from typing import List

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage

load_dotenv()
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET") or "databrowser-ykd.appspot.com"

    
class Blob(object):
    def __init__(self, file_path, prefix):
        self.file_path = file_path
        self.relative_path = os.path.relpath(file_path, start=prefix)
        self.name = os.path.basename(file_path)

    def to_json(self):
        return {
            "filePath": self.file_path,
            "relativePath": self.relative_path,
            "name": self.name,
        }

class Database(object):

    def __init__(self) -> None:
        self.projects = None
        self.users = None
        self.constants = None
        self.blobs = None

    def get_user(self, user_name):
        raise NotImplementedError

    def does_project_exist(self, user_name, project_name):
        raise NotImplementedError

    def get_project_id(self, user_name, project_name):
        raise NotImplementedError

    def add_project(self, user_name, project_name):
        raise NotImplementedError

    def get_code_from_project(self, user_name, project_name, file_path):
        raise NotImplementedError

    def write_code_to_project(self, user_name, project_name, file_path):
        raise NotImplementedError


class Firebase(object):
    def __init__(self) -> None:
        cred = credentials.Certificate("databrowser-service-account-key.json")
        firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL"), "storageBucket": STORAGE_BUCKET})
        db = firestore.client()
        self.bucket: storage.storage.Bucket = storage.bucket(STORAGE_BUCKET)
        self.projects = db.collection("projects")
        self.users = db.collection("users")

    def get_user(self, user_name):
        snap = self.users.where("name", "==", user_name).get()
        try:
            return snap[0].to_dict()
        except IndexError:
            return {}

    def add_project(self, user_name, project_name):
        project_doc = self.projects.document()
        project_id = project_doc.id
        project_data = {
            "name": project_name, 
            "id": project_id,
            "user": user_name,
        }

        project_doc.set({**project_data, **{"timeCreated": firestore.SERVER_TIMESTAMP}})

        user_id = self.users.where("name", "==", user_name).get()[0].id
        self.users.document(user_id).update({
            f"projects.{project_doc.id}": {
                "id": project_doc.id,
                "name": project_name,
            }
        })
        return project_data

    def get_project_id(self, user_name, project_name):
        project_ref = self.projects.where(u"user", "==", user_name).where(u"name", "==", project_name).get()[0].reference
        try:
            return project_ref.id
        except AttributeError:
            return None

    def does_project_exist(self, project_id) -> bool:
        return self.projects.document(project_id).get().exists

    @staticmethod
    def get_blob_prefix(project_id):
        return f"projects/{project_id}"

    def list_blobs(self, project_id) -> List[storage.storage.Blob]:
        return self.bucket.list_blobs(prefix=self.get_blob_prefix(project_id))
    
    def download_project_files(self, project_id, project_dir):
        prefix = self.get_blob_prefix(project_id)
        for blob in self.list_blobs(project_id):
            relative_path = os.path.relpath(blob.name, start=prefix)
            blob.download_to_filename(os.path.join(project_dir, relative_path))

    def get_project_ref(self, project_id):
        return self.projects.document(project_id)
    
    def get_full_path(self, project_id, relative_file_path):
        prefix = self.get_blob_prefix(project_id)
        file_path = os.path.join(prefix, relative_file_path)
        return file_path

    def write_code_to_project(self, project_id, relative_file_path, code):
        # TODO update blob property in project
        file_path = self.get_full_path(project_id, relative_file_path)
        blob = self.bucket.blob(f"{file_path}")
        blob.upload_from_string(code)
        self.add_file_to_project(project_id, relative_file_path)

    def get_code_from_project(self, project_id, relative_file_path):
        return self.bucket.blob(self.get_full_path(project_id, relative_file_path)).download_as_text()

    def get_project_json(self, project_id):
        return self.get_project_ref(project_id).get().to_dict()

    def add_file_to_project(self, project_id, relative_file_path):
        project_ref = self.get_project_ref(project_id)
        snap = project_ref.collection("blob").where("relativePath", "==", relative_file_path).get()
        if not snap:
            prefix = self.get_blob_prefix(project_ref.id)
            project_ref.collection("blob").document().set(Blob(f"{prefix}/{relative_file_path}", prefix).to_json())


class MemoryDB(object):
    def __init__(self) -> None:
        self.projects = {}
        self.users = {}
        self.constants = {}
        self.blobs = {}

    def does_project_exist(self, user_name, project_name):
        return self.users[user_name]["projects"].get(project_name, False)

    def get_project_id(self, user_name, project_name):
        return self.users[user_name]["projects"][project_name]["id"]

    def add_project(self, user_name, project_name):
        self.users[user_name]["projects"][project_name] = {
            "name": project_name, 
            "id": str(time.time)
        }

    def get_code_from_project(self, user_name, project_name, file_path):
        self.projects[self.get_project_id(user_name, project_name)]["code"]

    def write_code_to_project(self, user_name, project_name, code):
        self.projects[self.get_project_id(user_name, project_name)]["code"] = code


db = Firebase()
