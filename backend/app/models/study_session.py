from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )

    assignment_id: Mapped[int | None] = mapped_column(
        ForeignKey("assignments.id"),
        nullable=True,
        index=True,
    )

    subject: Mapped[str] = mapped_column(
        String(100),
        default="",
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )
