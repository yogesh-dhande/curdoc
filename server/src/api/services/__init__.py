import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials
from firebase_admin import firestore

load_dotenv()
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET") or "databrowser-ykd.appspot.com"

cred = credentials.Certificate("databrowser-service-account-key.json")
firebase_admin.initialize_app(cred, {"databaseURL": os.getenv("DATABASE_URL"), "storageBucket": STORAGE_BUCKET})
db = firestore.client()
