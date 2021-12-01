import time
from concurrent.futures import ThreadPoolExecutor
from typing import List
from typing import Optional

import requests
from bokeh.client.session import pull_session
from bokeh.embed.server import server_document
from pydantic import BaseModel
from services.container import container_service

from models.blob import Blob
from models.user import User

with open("src/api/resources/default.py", "r") as file:
    STARTER_CODE = file.read()


class Project(BaseModel):
    id: str
    slug: str
    user: User
    blob: Optional[List[Blob]] = []

    def get_blob(self, relative_path) -> Blob:
        blob = Blob(relative_path=relative_path)
        blob.reload(self.id)
        return blob

    def update_blob(self, blob: Blob):
        blob.save(self.id)

    def ensure_locally(self) -> None:
        for blob in self.blob:
            blob.ensure_locally(self.id)

    def get_app_script(self) -> Optional[str]:
        self.ensure_locally()
        container_session = container_service.get_container_session_for_project(self.id)
        self.wait_for_server_to_be_ready(container_session)

        app_url = f"http://localhost:{container_session.port}/{self.id}"
        return server_document(arguments={"project": self.id}, url=app_url)

    def wait_for_server_to_be_ready(self, container_session):
        url = f"http://sandbox{container_session.port}:5006/{self.id}"

        def is_server_ready():
            try:
                requests.get(url=url)
                return True
            except Exception as e:
                print(str(e))
                return False

        wait_period = 0.1
        for i in range(1, 151):  # Time out after 15 sec
            with ThreadPoolExecutor() as executor:
                future = executor.submit(is_server_ready)
                result = future.result()
                if result:
                    break
            time.sleep(wait_period)
        print(f"Waited {i*wait_period} seconds for Bokeh server to be ready")
