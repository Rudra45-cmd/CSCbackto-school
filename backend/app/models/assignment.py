from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    title: Mapped[str] = mapped_column(String(200))
    subject: Mapped[str] = mapped_column(String(100))
    assignment_type: Mapped[str] = mapped_column(String(50), default="Assignment")
    description: Mapped[str] = mapped_column(Text, default="")
    due_date: Mapped[str] = mapped_column(String(50), default="")
    priority: Mapped[str] = mapped_column(String(20), default="Medium")
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=60)
    add_to_plan: Mapped[bool] = mapped_column(Boolean, default=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
