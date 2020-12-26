import time
from typing import List
from typing import Optional

from bokeh.client.session import pull_session
from bokeh.embed.server import server_document
from pydantic import BaseModel
from services.container import container_service
from services.database import database

from models.blob import Blob


class Project(BaseModel):
    name: str
    user_name: str
    id: Optional[str] = None
    blob: Optional[List[Blob]] = []

    def create(self) -> None:
        self.id = database.create_project(self.dict())
        with open("resources/default.py", "r") as file:  
            blob = Blob(project_id=self.id, relative_path="main.py", text=file.read())
            self.add_blob(blob)
        return self

    def get(self) -> "Project":  # TODO
        self.id = database.get_project_id(self.user_name, self.name)
        # Get data from the project document in firestore
        project = Project.parse_obj(database.get_project_json(self.id))
        return project

    def get_blob(self, relative_path) -> Blob:
        self.id = database.get_project_id(self.user_name, self.name)
        blob = Blob(project_id=self.id, relative_path=relative_path)
        blob.reload()
        return blob
    
    def add_blob(self, blob: Blob) -> None:
        self.id = database.get_project_id(self.user_name, self.name)
        blob_json = blob.dict()
        if blob.relative_path != "main.py":
            blob_json.pop("text", None)
        database.add_blob_to_project(self.id, blob_json)
        blob.save()
        self.blob.append(blob)

    def download(self) -> None:
        for blob in self.blob:
            blob.download()

    def get_app_script(self) -> str:
        self.id = database.get_project_id(self.user_name, self.name)

        container_session = container_service.get_container_session_for_project(self.id)
        app_url = f"http://localhost:{container_session.port}/{self.id}"

        wait_period = 1
        for i in range(15):  # Time out after 15 sec
            try:
                url = f"http://sandbox{container_session.port}:5006/{self.id}"
                pull_session(url=url)
                script = server_document(arguments={'project': self.id}, url=app_url)
                return script
            except Exception as e:
                time.sleep(wait_period)
                print(str(e))
                print(f"Waited {i*wait_period} seconds for Bokeh server to be ready")
