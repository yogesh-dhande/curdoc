# !/bin/bash

chmod 666 /var/run/docker.sock
docker build -t $SANDBOX_IMAGE src/sandbox
uvicorn app:app --port $PORT --reload --app-dir src/api
