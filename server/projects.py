import os
from bokeh.embed import server_document

PROJECTS_FOLDER_PATH = "/projects"


def get_file_path(user_id, project_id):
    return os.path.join(PROJECTS_FOLDER_PATH, project_id + '.py')


def get_app_script_from_project_id(user_id, project_id):
    app_url = f"http://localhost:5006/main"
    script = server_document(arguments={'project': project_id}, url=app_url)
    return script

def get_code_for_project(user_id, project_id):
    with open(get_file_path(user_id, project_id), "r") as code_file:
        return code_file.read()

def write_code_to_project(user_id, project_id, code):
    with open(get_file_path(user_id, project_id), "w+") as code_file:
        code_file.write(code)


def does_project_exists(user_id, project_id):
    return os.path.exists(get_file_path(user_id, project_id))


def create_default_project_if_needed(user_id, project_id):
    if not does_project_exists(user_id, project_id):
        code = get_code_for_project(user_id, 'default')
        write_code_to_project(user_id, project_id, code)