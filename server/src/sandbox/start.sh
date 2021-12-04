cd /projects
bokeh serve $1 --port $2 --dev --allow-websocket-origin localhost:8080 \
    --allow-websocket-origin localhost:$2 &

