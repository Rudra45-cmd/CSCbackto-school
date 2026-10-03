from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.community import (
    CommunityLike,
    CommunityPost,
    CommunityReply,
)
from backend.app.models.user import User
from backend.app.routes.auth import get_current_user

router = APIRouter(
    prefix="/api/community",
    tags=["Community"],
)


class CreatePostRequest(BaseModel):
    content: str


class CreateReplyRequest(BaseModel):
    content: str


def user_name(db: Session, user_id: int) -> str:
    user = db.query(User).filter(User.id == user_id).first()
    return user.name if user else "Student"


def post_response(
    db: Session,
    post: CommunityPost,
    current_user_id: int,
):
    likes = (
        db.query(CommunityLike)
        .filter(CommunityLike.post_id == post.id)
        .count()
    )

    liked = (
        db.query(CommunityLike)
        .filter(
            CommunityLike.post_id == post.id,
            CommunityLike.user_id == current_user_id,
        )
        .first()
        is not None
    )

    replies = (
        db.query(CommunityReply)
        .filter(CommunityReply.post_id == post.id)
        .order_by(CommunityReply.created_at.asc())
        .all()
    )

    return {
        "id": post.id,
        "content": post.content,
        "author": user_name(db, post.user_id),
        "author_id": post.user_id,
        "created_at": post.created_at.isoformat(),
        "likes": likes,
        "liked": liked,
        "replies": [
            {
                "id": reply.id,
                "content": reply.content,
                "author": user_name(db, reply.user_id),
                "author_id": reply.user_id,
                "created_at": reply.created_at.isoformat(),
            }
            for reply in replies
        ],
    }


@router.get("/posts")
def get_posts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    posts = (
        db.query(CommunityPost)
        .order_by(CommunityPost.created_at.desc())
        .limit(100)
        .all()
    )

    return {
        "posts": [
            post_response(db, post, user.id)
            for post in posts
        ],
    }


@router.post("/posts")
def create_post(
    data: CreatePostRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = data.content.strip()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Post cannot be empty",
        )

    if len(content) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Post cannot exceed 2000 characters",
        )

    post = CommunityPost(
        user_id=user.id,
        content=content,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "post": post_response(db, post, user.id),
    }


@router.post("/posts/{post_id}/like")
def toggle_like(
    post_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(CommunityPost)
        .filter(CommunityPost.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    existing = (
        db.query(CommunityLike)
        .filter(
            CommunityLike.post_id == post_id,
            CommunityLike.user_id == user.id,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        liked = False
    else:
        db.add(
            CommunityLike(
                post_id=post_id,
                user_id=user.id,
            )
        )
        liked = True

    db.commit()

    likes = (
        db.query(CommunityLike)
        .filter(CommunityLike.post_id == post_id)
        .count()
    )

    return {
        "liked": liked,
        "likes": likes,
    }


@router.post("/posts/{post_id}/replies")
def create_reply(
    post_id: int,
    data: CreateReplyRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = data.content.strip()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Reply cannot be empty",
        )

    if len(content) > 1000:
        raise HTTPException(
            status_code=400,
            detail="Reply cannot exceed 1000 characters",
        )

    post = (
        db.query(CommunityPost)
        .filter(CommunityPost.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    reply = CommunityReply(
        post_id=post_id,
        user_id=user.id,
        content=content,
    )

    db.add(reply)
    db.commit()
    db.refresh(reply)

    return {
        "reply": {
            "id": reply.id,
            "content": reply.content,
            "author": user.name,
            "author_id": user.id,
            "created_at": reply.created_at.isoformat(),
        }
    }


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.user_id == user.id,
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found or not owned by you",
        )

    db.query(CommunityReply).filter(
        CommunityReply.post_id == post_id
    ).delete(synchronize_session=False)

    db.query(CommunityLike).filter(
        CommunityLike.post_id == post_id
    ).delete(synchronize_session=False)

    db.delete(post)
    db.commit()

    return {
        "message": "Post deleted",
    }
