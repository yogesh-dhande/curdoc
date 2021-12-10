import os
import time
from concurrent.futures import ThreadPoolExecutor
from typing import List
from typing import Optional

import requests
from bokeh.embed.server import server_document
from pydantic import BaseModel
from services.container import ContainerSessionBase
from services.container import container_service

from models.blob import Blob
from models.user import User


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

    def ensure_locally(self, overwrite=False) -> None:
        for blob in self.blob:
            blob.ensure_locally(self.id, overwrite=overwrite)

    def get_app_script(self, new=False, query=None) -> Optional[str]:
        self.ensure_locally(overwrite=new)
        container_session = container_service.get_container_session_for_project(self.id, new=new)
        self.wait_for_server_to_be_ready(container_session)

        # External link to the app
        app_url = f"http://{os.getenv('ORIGIN_DOMAIN')}/{os.getenv('SERVICE_NAME')}/{container_session.port}/{self.id}"
        return server_document(url=app_url, arguments=query)

    def wait_for_server_to_be_ready(self, container_session: ContainerSessionBase):
        # Internal link to the app
        url =  f"http://localhost:{container_session.port}/sandbox/{container_session.port}/{self.id}"

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
