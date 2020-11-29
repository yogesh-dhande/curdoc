# !/bin/bash

chmod 666 /var/run/docker.sock

docker inspect --type=image $SANDBOX_IMAGE > /dev/null 2>&1 \
    || docker build -t $SANDBOX_IMAGE sandbox


python app.py
