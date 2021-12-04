cd /projects
bokeh serve $1 --port $2 --prefix $2 --allow-websocket-origin localhost:8080 \
    --allow-websocket-origin localhost:5000 \
    --allow-websocket-origin localhost:$2 &