from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(String(255))
    grade: Mapped[str] = mapped_column(String(50), default="")
    subjects: Mapped[str] = mapped_column(String(1000), default="")
    daily_goal: Mapped[str] = mapped_column(String(50), default="2 hours")
    preferred_study_time: Mapped[str] = mapped_column(
        String(50),
        default="evening",
    )
