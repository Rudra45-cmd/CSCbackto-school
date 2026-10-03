import os

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.announcement import (
    Announcement,
    AnnouncementRead,
)
from backend.app.models.user import User
from backend.app.routes.auth import get_current_user

router = APIRouter(
    prefix="/api/announcements",
    tags=["Announcements"],
)


class CreateAnnouncementRequest(BaseModel):
    title: str
    content: str


def is_admin(user: User) -> bool:
    configured = os.getenv(
        "STUDYSYNC_ADMIN_EMAILS",
        "",
    )

    allowed = {
        item.strip().lower()
        for item in configured.split(",")
        if item.strip()
    }

    return user.email.lower() in allowed


def announcement_response(
    db: Session,
    announcement: Announcement,
    user_id: int,
):
    read = (
        db.query(AnnouncementRead)
        .filter(
            AnnouncementRead.announcement_id == announcement.id,
            AnnouncementRead.user_id == user_id,
        )
        .first()
        is not None
    )

    creator = (
        db.query(User)
        .filter(User.id == announcement.created_by)
        .first()
    )

    return {
        "id": announcement.id,
        "title": announcement.title,
        "content": announcement.content,
        "created_at": announcement.created_at.isoformat(),
        "created_by": creator.name if creator else "StudySync Admin",
        "read": read,
    }


@router.get("")
def get_announcements(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    announcements = (
        db.query(Announcement)
        .order_by(Announcement.created_at.desc())
        .limit(100)
        .all()
    )

    return {
        "announcements": [
            announcement_response(db, item, user.id)
            for item in announcements
        ],
    }


@router.get("/unread-count")
def unread_count(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total = db.query(Announcement).count()

    read = (
        db.query(AnnouncementRead)
        .filter(AnnouncementRead.user_id == user.id)
        .count()
    )

    return {
        "count": max(total - read, 0),
    }


@router.post("/{announcement_id}/read")
def mark_read(
    announcement_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    announcement = (
        db.query(Announcement)
        .filter(Announcement.id == announcement_id)
        .first()
    )

    if not announcement:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found",
        )

    existing = (
        db.query(AnnouncementRead)
        .filter(
            AnnouncementRead.announcement_id == announcement_id,
            AnnouncementRead.user_id == user.id,
        )
        .first()
    )

    if not existing:
        db.add(
            AnnouncementRead(
                announcement_id=announcement_id,
                user_id=user.id,
            )
        )
        db.commit()

    return {
        "message": "Announcement marked as read",
    }


@router.post("")
def create_announcement(
    data: CreateAnnouncementRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not is_admin(user):
        raise HTTPException(
            status_code=403,
            detail="Only StudySync administrators can create announcements",
        )

    title = data.title.strip()
    content = data.content.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Announcement title is required",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Announcement content is required",
        )

    announcement = Announcement(
        title=title,
        content=content,
        created_by=user.id,
    )

    db.add(announcement)
    db.commit()
    db.refresh(announcement)

    return {
        "announcement": announcement_response(
            db,
            announcement,
            user.id,
        ),
    }


@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not is_admin(user):
        raise HTTPException(
            status_code=403,
            detail="Only StudySync administrators can delete announcements",
        )

    announcement = (
        db.query(Announcement)
        .filter(Announcement.id == announcement_id)
        .first()
    )

    if not announcement:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found",
        )

    db.query(AnnouncementRead).filter(
        AnnouncementRead.announcement_id == announcement_id
    ).delete(synchronize_session=False)

    db.delete(announcement)
    db.commit()

    return {
        "message": "Announcement deleted",
    }
