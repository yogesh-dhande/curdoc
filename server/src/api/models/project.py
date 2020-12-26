import concurrent.futures
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

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.id = database.get_project_id(self.user_name, self.name)
        self.download()

    def create(self) -> None:
        self.id = database.create_project(self.dict())
        with open("resources/default.py", "r") as file:  
            blob = Blob(project_id=self.id, relative_path="main.py", text=file.read())
            self.add_blob(blob)
        return self

    def get(self) -> "Project":  # TODO
        # Get data from the project document in firestore
        project = Project.parse_obj(database.get_project_json(self.id))
        return project

    def get_blob(self, relative_path) -> Blob:
        blob = Blob(project_id=self.id, relative_path=relative_path)
        blob.reload()
        return blob
    
    def add_blob(self, blob: Blob) -> None:
        blob_json = blob.dict()
        if blob.relative_path != "main.py":
            blob_json.pop("text", None)
        database.add_blob_to_project(self.id, blob_json)
        blob.save()
        self.blob.append(blob)

    def download(self) -> None:
        for blob in self.blob:
            blob.download()

    def get_app_script(self) -> Optional[str]:
        container_session = container_service.get_container_session_for_project(self.id)
        self.wait_for_server_to_be_ready(container_session)

        app_url = f"http://localhost:{container_session.port}/{self.id}"
        return server_document(arguments={'project': self.id}, url=app_url)

    def wait_for_server_to_be_ready(self, container_session):
        url = f"http://sandbox{container_session.port}:5006/{self.id}"
        def is_server_ready():
            try:
                pull_session(url=url)
                return True
            except Exception as e:
                print(str(e))
                return False

        wait_period = 0.1
        for i in range(1, 151):  # Time out after 15 sec 
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(is_server_ready)
                result = future.result()
                if result:
                    break
            time.sleep(wait_period)
            print(f"Waited {i*wait_period} seconds for Bokeh server to be ready")

        
