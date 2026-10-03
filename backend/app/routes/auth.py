from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import (
    ALGORITHM,
    SECRET_KEY,
    create_access_token,
    hash_password,
    verify_password,
)
from backend.app.database import get_db
from backend.app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

security = HTTPBearer()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    grade: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class SetupRequest(BaseModel):
    name: str
    grade: str
    subjects: list[str]
    daily_goal: str
    preferred_study_time: str


def user_response(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "grade": user.grade,
        "subjects": [
            item for item in user.subjects.split(",") if item
        ],
        "daily_goal": user.daily_goal,
        "preferred_study_time": user.preferred_study_time,
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token",
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user


@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    email = data.email.strip().lower()
    name = data.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required",
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required",
        )

    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    existing = db.query(User).filter(User.email == email).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered",
        )

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(data.password),
        grade=data.grade.strip(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Account created successfully",
        "user": user_response(user),
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
    }


@router.put("/setup")
def setup_profile(
    data: SetupRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    name = data.name.strip()
    grade = data.grade.strip()
    subjects = [item.strip() for item in data.subjects if item.strip()]
    daily_goal = data.daily_goal.strip()
    preferred_study_time = data.preferred_study_time.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required",
        )

    if not grade:
        raise HTTPException(
            status_code=400,
            detail="Grade is required",
        )

    if not subjects:
        raise HTTPException(
            status_code=400,
            detail="Select at least one subject",
        )

    user.name = name
    user.grade = grade
    user.subjects = ",".join(subjects)
    user.daily_goal = daily_goal
    user.preferred_study_time = preferred_study_time

    db.commit()
    db.refresh(user)

    return {
        "message": "Setup completed successfully",
        "user": user_response(user),
    }



@router.patch("/account")
def update_account(
    data: SetupRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user.name = data.name.strip()
    user.grade = data.grade.strip()
    user.subjects = ",".join(
        subject.strip()
        for subject in data.subjects
        if subject.strip()
    )
    user.daily_goal = data.daily_goal.strip()
    user.preferred_study_time = data.preferred_study_time.strip()

    db.commit()
    db.refresh(user)

    return user_response(user)


@router.delete("/account")
def delete_account(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.delete(user)
    db.commit()

    return {
        "message": "Account deleted successfully",
    }



@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return {
        "message": "Login successful",
        "user": user_response(user),
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
    }


@router.get("/me")
def me(
    user: User = Depends(get_current_user),
):
    return {
        "user": user_response(user),
    }
