# !/bin/bash

gcloud auth activate-service-account --key-file=databrowser-service-account-key.json 

chmod 666 /var/run/docker.sock
docker build -t $SANDBOX_IMAGE src/sandbox
uvicorn app:app --port $PORT --reload-dir src/api --reload --app-dir src/api --host 0.0.0.0
