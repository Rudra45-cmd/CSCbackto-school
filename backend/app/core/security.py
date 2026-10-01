import os
from datetime import datetime, timedelta, timezone

import bcrypt
from dotenv import load_dotenv
from jose import jwt

load_dotenv("/workspaces/CSCbackto-school/backend/.env")

SECRET_KEY = os.environ["STUDYSYNC_SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        raise ValueError("Password cannot exceed 72 bytes")

    return bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    return bcrypt.checkpw(
        password_bytes,
        password_hash.encode("utf-8"),
    )


def create_access_token(user_id: int) -> str:
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expires,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
