cd /projects
bokeh serve $1 --port $2 --prefix $SERVICE_NAME/$2 --allow-websocket-origin $ORIGIN_DOMAIN \
    --allow-websocket-origin localhost:$2 &