import os

import firebase_admin
from fastapi import HTTPException
from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from firebase_admin import auth
from firebase_admin import credentials

cred = credentials.Certificate(f"{os.getenv('DEPLOY_TARGET')}-service-account-key.json")
firebase_admin.initialize_app(cred)


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> str:
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                print("Invalid authentication scheme.")
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            uid = self.verify_jwt(credentials.credentials)
            if not uid:
                print("Invalid or expired token.")
                raise HTTPException(status_code=403, detail="Invalid or expired token.")
            return uid
        else:
            print("Invalid authorization code.")
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        decoded_token = auth.verify_id_token(jwtoken)
        return decoded_token
