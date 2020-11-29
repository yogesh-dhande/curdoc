import os
from bokeh.embed import server_document
import database as db

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
    app_url = f"http://localhost:5006/main"
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