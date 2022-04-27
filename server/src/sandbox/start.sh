cd /projects
panel serve $1 --port $2 --prefix sandbox/$2 --allow-websocket-origin $ORIGIN_DOMAIN \
    --allow-websocket-origin localhost:$2 &> $1/log &