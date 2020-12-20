#!/bin/bash
PORT=$1
CONTAINER_NAME=$2
# SANDBOX_IMAGE=bokeh_play_sandbox

exec docker run -d --rm \
    -p $PORT:5006 \
    --network bokeh-play_default \
    --network-alias $CONTAINER_NAME \
    -v bokeh-play_projects:/app/projects:ro \
    --name $CONTAINER_NAME \
    $SANDBOX_IMAGE
