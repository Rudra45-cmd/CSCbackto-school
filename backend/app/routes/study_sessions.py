from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.assignment import Assignment
from backend.app.models.study_session import StudySession
from backend.app.routes.auth import get_current_user
from backend.app.models.user import User


router = APIRouter(
    prefix="/api/study-sessions",
    tags=["Study Sessions"],
)


class CreateSessionRequest(BaseModel):
    subject: str = ""
    duration_seconds: int
    started_at: datetime | None = None
    ended_at: datetime | None = None
    assignment_id: int | None = None


def session_response(session: StudySession):
    def utc_iso(value):
        if not value:
            return None

        # Database values are stored as UTC-naive datetimes.
        # Add Z so JavaScript interprets them as UTC.
        return value.isoformat() + "Z"

    return {
        "id": session.id,
        "subject": session.subject,
        "duration_minutes": session.duration_minutes,
        "duration_seconds": session.duration_seconds,
        "started_at": utc_iso(session.started_at),
        "ended_at": utc_iso(session.ended_at),
        "assignment_id": session.assignment_id,
    }


@router.post("")
def create_session(
    data: CreateSessionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.duration_seconds <= 0:
        raise HTTPException(
            status_code=400,
            detail="Session duration must be greater than 0 seconds",
        )

    # Make sure the selected assignment belongs to this user.
    if data.assignment_id is not None:
        assignment = (
            db.query(Assignment)
            .filter(
                Assignment.id == data.assignment_id,
                Assignment.user_id == user.id,
            )
            .first()
        )

        if assignment is None:
            raise HTTPException(
                status_code=404,
                detail="Assignment not found",
            )

    started_at = data.started_at or datetime.utcnow()
    ended_at = data.ended_at or (
        started_at + timedelta(seconds=data.duration_seconds)
    )

    session = StudySession(
        user_id=user.id,
        assignment_id=data.assignment_id,
        subject=data.subject.strip(),
        duration_minutes=data.duration_seconds // 60,
        duration_seconds=data.duration_seconds,
        started_at=started_at,
        ended_at=ended_at,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "message": "Study session saved",
        "session": session_response(session),
    }


@router.get("")
def get_sessions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(StudySession)
        .filter(StudySession.user_id == user.id)
        .order_by(StudySession.started_at.desc())
        .all()
    )

    return {
        "sessions": [session_response(session) for session in sessions],
        "count": len(sessions),
        "user_id": user.id,
    }


@router.delete("/{session_id}")
def delete_session(
    session_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(StudySession)
        .filter(
            StudySession.id == session_id,
            StudySession.user_id == user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found",
        )

    db.delete(session)
    db.commit()

    return {"message": "Study session deleted"}
