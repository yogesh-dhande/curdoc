import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from bokeh.client import pull_session
from bokeh.embed import server_document

# Initialize Flask app
app = Flask(__name__)

CORS(app)

PROJECTS_FOLDER_PATH = "/projects"


def get_file_path(filename):
    return os.path.join(PROJECTS_FOLDER_PATH, filename + '.py')


def get_app_script_from_filename(filename):
    app_url = "http://localhost:5006/main"
    return server_document(url=app_url)

@app.route("/", methods=["GET"])
def index():
    return {'message': 'ok'}

@app.route("/code/<filename>", methods=["GET"])
def get_code(filename):
    try:
        print(filename)
        script = get_app_script_from_filename(filename)

        with open(get_file_path(filename), "r") as code_file:
            code = code_file.read()

        return {"code": code, "script": script}

    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/code/<filename>", methods=["POST"])
def post_code(filename):
    try:
        print(filename)
        code = request.json["code"]
        print(code)

        with open(get_file_path(filename), "w+") as code_file:
            code_file.write(code)

        return {"script": get_app_script_from_filename(filename)}

    except Exception as e:
        return f"An Error Occured: {e}"


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(threaded=True, host="0.0.0.0", port=port)
