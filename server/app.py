import os
from projects import (
    create_default_project_if_needed,
    get_app_script_from_project_id,
    get_code_for_project,
    write_code_to_project,
)
from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def index():
    return {"message": "ok"}


@app.route("/code", methods=["GET"])
def get_code():
    user_id = request.args.get('userId')
    project_id = request.args.get('projectId')
    create_default_project_if_needed(user_id, project_id)
    return {"code": get_code_for_project(user_id, project_id)}


@app.route("/script", methods=["GET"])
def get_script(project_id):
    user_id = request.args.get('userId')
    project_id = request.args.get('projectId')
    create_default_project_if_needed(user_id, project_id)
    return {"script": get_app_script_from_project_id(user_id, project_id)}


@app.route("/code", methods=["POST"])
def post_code():
    user_id = request.json.get('userId')
    project_id = request.json.get('projectId')
    code = request.json.get("code")
    write_code_to_project(user_id, project_id, code)
    return {"script": get_app_script_from_project_id(user_id, project_id)}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(threaded=True, host="0.0.0.0", port=port, debug=True)
