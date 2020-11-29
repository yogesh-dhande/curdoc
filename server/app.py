import os
from projects import (
    create_default_project,
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
    try:
        user_name = request.args.get("userName")
        project_name = request.args.get("projectName")
        return {"code": get_code_for_project(user_name, project_name)}
    except Exception as e:
        return str(e)

@app.route("/script", methods=["GET"])
def get_script():
    try:
        user_name = request.args.get("userName")
        project_name = request.args.get("projectName")
        return {"script": get_app_script_from_project_id(user_name, project_name)}
    except Exception as e:
        return str(e)


@app.route("/projects", methods=["POST"])
def create_project():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        return create_default_project(user_name, project_name)
    except Exception as e:
        print(str(e))
        return str(e)


@app.route("/code", methods=["POST"])
def post_code():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        code = request.json.get("code")
        write_code_to_project(user_name, project_name, code)
        return {"status": "ok"}
    except Exception as e:
        return str(e)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(threaded=True, host="0.0.0.0", port=port, debug=True)
