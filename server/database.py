import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate("databrowser-service-account-key.json")
app = firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL")})

db = firestore.client()
projects_collection = db.collection("projects")
users_collection = db.collection("users")
constants_collection = db.collection("constants")
blob_collection = db.collection("blob")


def add_project(user_name, project_name):
    # TODO add fields like timeCreated: "timeCreated": firestore.SERVER_TIMESTAMP
    project_doc = projects_collection.document()
    project_doc.set({"name": project_name, "refKey": project_doc.id})
    user_doc = users_collection.document(user_name)
    user_doc.collection("projects").document(project_name).set(
        {
            "refKey": project_doc.id,
            "name": project_name,
        }
    )


def does_project_exist(user_name, project_name):
    user_doc = users_collection.document(user_name)
    project_doc = user_doc.collection("projects").document(project_name)
    return project_doc.get().exists


def get_project_id(user_name, project_name):
    user_doc = users_collection.document(user_name)
    project_doc = user_doc.collection("projects").document(project_name)
    return project_doc.get().to_dict()["refKey"]


def get_project_ref(user_name, project_name):
    project_id = get_project_id(user_name, project_name)
    return projects_collection.document(project_id)


def write_code_to_project(user_name, project_name, code):
    project_ref = get_project_ref(user_name, project_name)
    project_ref.update({"code": code})
    return project_ref.get().to_dict()


def get_starter_code():
    return constants_collection.document("starterCode").get().to_dict()["text"]


def get_code_from_project(user_name, project_name):
    return get_project_ref(user_name, project_name).get().to_dict()["code"]
