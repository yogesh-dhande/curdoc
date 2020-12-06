from database import db

class User(object):
    def __init__(self, user_name) -> None:
        self.user_name = user_name
    
    def get(self):
        return db.get_user(self.user_name)