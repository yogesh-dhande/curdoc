import os
import time
from bokeh.embed import server_document
from bokeh.client import pull_session
import database as db
from containers import start_bokeh_server

PROJECTS_FOLDER_PATH = "/projects"


def get_code_for_project(user_name, project_name):
    return db.get_code_from_project(user_name, project_name)


def get_file_path(project_id):
    return os.path.join(PROJECTS_FOLDER_PATH, project_id + '.py')


def write_project_to_filesystem(user_name, project_name):
    project_id = db.get_project_id(user_name, project_name)
    code = get_code_for_project(user_name, project_name)
    with open(get_file_path(project_id), "w+") as code_file:
        code_file.write(code)


def get_app_script_from_project_id(user_name, project_name):
    # this function creates files
    write_project_to_filesystem(user_name, project_name)
    project_id = db.get_project_id(user_name, project_name)
    port = start_bokeh_server(project_id)
    app_url = f"http://localhost:{port}/main"

    while True:
        try:
            pull_session(url=f"http://sandbox{port}:5006/main")
            break
        except Exception as e:
            print(str(e))
            time.sleep(1)
            
    script = server_document(arguments={'project': project_id}, url=app_url)
    return script


def get_starter_code_for_project():
    with open("resources/default.py", "r") as code_file:
        return code_file.read()


def write_code_to_project(user_name, project_name, code):
    # Writes to database
    db.write_code_to_project(user_name, project_name, code)


def create_default_project(user_name, project_name):
    db.add_project(user_name, project_name)
    code = get_starter_code_for_project()
    return db.write_code_to_project(user_name, project_name, code)