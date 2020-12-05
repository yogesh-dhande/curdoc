import os

from flask import Flask, request
from flask_cors import CORS

from projects import create_default_project
from sessions import ClientSession


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
        auth_user = request.args.get("authUser")
        print(user_name, project_name, auth_user)
        return {"code": ClientSession(auth_user).get_code(user_name, project_name)}
    except Exception as e:
        return str(e)

@app.route("/script", methods=["GET"])
def get_script():
    try:
        user_name = request.args.get("userName")
        project_name = request.args.get("projectName")
        auth_user = request.args.get("authUser")
        return {"script": ClientSession(auth_user).get_app_script(user_name, project_name)}
    except Exception as e:
        print(str(e))
        return str(e)

# TODO get endpoint on projects for client to retrieve a project id
# so other requests can be made with using id

@app.route("/projects", methods=["POST"])
def create_project():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        code = request.json.get("code")
        return create_default_project(user_name, project_name, code)
    except Exception as e:
        print(str(e))
        return f"Error occurred: {e}"


@app.route("/code", methods=["POST"])
def post_code():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        auth_user = request.args.get("authUser")
        code = request.json.get("code")
        ClientSession(auth_user).load_project(user_name, project_name).write_to_database(code)
        return {"status": "ok"}
    except Exception as e:
        print(str(e))
        return str(e)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(threaded=True, host="0.0.0.0", port=port, debug=True)
