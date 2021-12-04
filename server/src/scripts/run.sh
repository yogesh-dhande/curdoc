# !/bin/bash
uvicorn app:app --port $PORT --reload-dir src/api --reload --app-dir src/api --host 0.0.0.0
