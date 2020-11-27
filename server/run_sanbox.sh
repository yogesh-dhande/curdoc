#!/bin/bash
PORT=$1

exec docker run -d --rm \
    -p $PORT:5006 \
    -v /Users/yogesh/projects/bokeh-play/server/sandbox:/app \
    $SANDBOX_IMAGE