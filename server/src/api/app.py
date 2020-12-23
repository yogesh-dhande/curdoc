import os

from flask import Flask
from flask import request
from flask_cors import CORS

from sessions import ClientSession

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def index():
    return {"message": "ok"}


@app.route("/users/<user_name>", methods=["GET"])
def get_user(user_name):
    try:
        return ClientSession(user_name).get_user()
    except Exception as e:
        return str(e)


@app.route("/projects", methods=["GET"])
def get_project():
    try:
        user_name = request.args.get("userName")
        project_name = request.args.get("projectName")
        auth_user = request.args.get("authUser")
        print(user_name, project_name, auth_user)
        return ClientSession(auth_user).get_project(user_name, project_name)
    except Exception as e:
        return str(e)


@app.route("/code", methods=["GET"])
def get_code():
    try:
        user_name = request.args.get("userName")
        project_name = request.args.get("projectName")
        auth_user = request.args.get("authUser")
        relative_file_path = request.args.get("relativePath")
        code = ClientSession(auth_user).get_code(user_name, project_name, relative_file_path)
        return {"code": code}
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


@app.route("/projects", methods=["POST"])
def create_project():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        code = request.json.get("code")
        return ClientSession(user_name).load_default_project(user_name, project_name, code)
    except Exception as e:
        print(str(e))
        return f"Error occurred: {e}"


@app.route("/code", methods=["POST"])
def post_code():
    try:
        user_name = request.json.get("userName")
        project_name = request.json.get("projectName")
        auth_user = request.json.get("authUser")
        relative_file_path = request.json.get("relativePath")
        code = request.json.get("code")
        ClientSession(auth_user).load_project(user_name, project_name).write_code(relative_file_path, code)
        return {"status": "ok"}
    except Exception as e:
        print(str(e))
        return str(e)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(port)
    app.run(threaded=True, host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG_MODE"))
