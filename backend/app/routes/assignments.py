from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.assignment import Assignment
from backend.app.models.user import User
from backend.app.routes.auth import get_current_user

router = APIRouter(prefix="/api/assignments", tags=["Assignments"])


class AssignmentCreate(BaseModel):
    title: str
    subject: str
    assignment_type: str = "Assignment"
    description: str = ""
    due_date: str = ""
    priority: str = "Medium"
    estimated_minutes: int = 60
    add_to_plan: bool = False


class AssignmentUpdate(BaseModel):
    title: str | None = None
    subject: str | None = None
    assignment_type: str | None = None
    description: str | None = None
    due_date: str | None = None
    priority: str | None = None
    estimated_minutes: int | None = None
    add_to_plan: bool | None = None
    completed: bool | None = None


def assignment_response(item: Assignment):
    return {
        "id": item.id,
        "title": item.title,
        "subject": item.subject,
        "assignment_type": item.assignment_type,
        "description": item.description,
        "due_date": item.due_date,
        "priority": item.priority,
        "estimated_minutes": item.estimated_minutes,
        "add_to_plan": item.add_to_plan,
        "completed": item.completed,
        "completed_at": item.completed_at,
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }


@router.get("")
def list_assignments(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(Assignment)
        .filter(Assignment.user_id == user.id)
        .order_by(
            Assignment.completed.asc(),
            Assignment.due_date.asc(),
            Assignment.id.desc(),
        )
        .all()
    )

    return {
        "assignments": [assignment_response(item) for item in items]
    }


@router.post("")
def create_assignment(
    data: AssignmentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    title = data.title.strip()
    subject = data.subject.strip()

    if not title:
        raise HTTPException(status_code=400, detail="Assignment title is required")

    if not subject:
        raise HTTPException(status_code=400, detail="Subject is required")

    if data.estimated_minutes <= 0:
        raise HTTPException(
            status_code=400,
            detail="Estimated time must be greater than zero",
        )

    item = Assignment(
        user_id=user.id,
        title=title,
        subject=subject,
        assignment_type=data.assignment_type.strip() or "Assignment",
        description=data.description.strip(),
        due_date=data.due_date.strip(),
        priority=data.priority.strip() or "Medium",
        estimated_minutes=data.estimated_minutes,
        add_to_plan=data.add_to_plan,
        completed=False,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "message": "Assignment added",
        "assignment": assignment_response(item),
    }


@router.patch("/{assignment_id}")
def update_assignment(
    assignment_id: int,
    data: AssignmentUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.user_id == user.id,
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Assignment not found")

    updates = data.model_dump(exclude_unset=True)

    if "estimated_minutes" in updates:
        if updates["estimated_minutes"] is not None and updates["estimated_minutes"] <= 0:
            raise HTTPException(
                status_code=400,
                detail="Estimated time must be greater than zero",
            )

    if "completed" in updates:
        if updates["completed"]:
            item.completed_at = datetime.utcnow().isoformat()
        else:
            item.completed_at = None

    for key, value in updates.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return {
        "message": "Assignment updated",
        "assignment": assignment_response(item),
    }


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.user_id == user.id,
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(item)
    db.commit()

    return {"message": "Assignment deleted"}
