"""
Authentication & User API endpoints.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for registering a new user.
    """
    raise NotImplementedError("User registration endpoint stub")


@router.post("/login")
async def login_user(db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for user authentication and JWT generation.
    """
    raise NotImplementedError("User login endpoint stub")
