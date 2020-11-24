import os
from flask import Flask, request
from flask_cors import CORS
from bokeh.embed import server_document

# Initialize Flask app
app = Flask(__name__)

CORS(app)

PROJECTS_FOLDER_PATH = "/projects"


def get_file_path(project_id):
    return os.path.join(PROJECTS_FOLDER_PATH, project_id + '.py')


def get_app_script_from_project_id(project_id):
    app_url = f"http://localhost:5006/main"
    script = server_document(arguments={'project': project_id}, url=app_url)
    return script

def get_code_for_project(project_id):
    with open(get_file_path(project_id), "r") as code_file:
        return code_file.read()


def write_code_to_project(project_id, code):
    with open(get_file_path(project_id), "w+") as code_file:
        code_file.write(code)


def does_project_exists(project_id):
    return os.path.exists(get_file_path(project_id))


def create_default_project_if_needed(project_id):
    if not does_project_exists(project_id):
        code = get_code_for_project('default')
        write_code_to_project(project_id, code)


@app.route("/", methods=["GET"])
def index():
    return {'message': 'ok'}


@app.route("/code/<project_id>", methods=["GET"])
def get_code(project_id):
    try:
        create_default_project_if_needed(project_id)    
        return {"code": get_code_for_project(project_id)}

    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/script/<project_id>", methods=["GET"])
def get_script(project_id):
    try:
        create_default_project_if_needed(project_id)
        return {"script": get_app_script_from_project_id(project_id)}

    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/code/<project_id>", methods=["POST"])
def post_code(project_id):
    try:
        print(project_id)
        print(request.json)
        code = request.json["code"]
        write_code_to_project(project_id, code)

        return {"script": get_app_script_from_project_id(project_id)}

    except Exception as e:
        return f"An Error Occured: {e}"


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(threaded=True, host="0.0.0.0", port=port, debug=True)
