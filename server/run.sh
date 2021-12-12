# !/bin/bash
echo starting server
cd lsp && node app.js &
if [[ "$DEPLOY_TARGET" == dev ]]
then
    uvicorn app:app --port 8000 --reload-dir src/api --reload --app-dir src/api --host 0.0.0.0 &
else
    uvicorn app:app --port 8000 --app-dir src/api --host 0.0.0.0 &
fi

caddy run &

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
