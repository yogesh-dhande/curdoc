# !/bin/bash

chmod 666 /var/run/docker.sock
docker build -t $SANDBOX_IMAGE src/sandbox
python src/api/app.py
