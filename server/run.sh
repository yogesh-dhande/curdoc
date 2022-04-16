# !/bin/bash
echo starting server

# Hack to serve static panel resources because they panel serve does not respect --prefix
panel serve --port 10000 panel &

if [[ "$DEPLOY_TARGET" == dev ]]
then
    uvicorn app:app --port 8000 --reload-dir api --reload --app-dir api --host 0.0.0.0 &
else
    uvicorn app:app --port 8000 --app-dir api --host 0.0.0.0 &
fi

caddy run &

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
