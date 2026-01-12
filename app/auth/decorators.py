from functools import wraps
from flask import session, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session.get('user_data')
        if not user:
            return redirect("/")
        return f(*args, **kwargs)
    return decorated_function