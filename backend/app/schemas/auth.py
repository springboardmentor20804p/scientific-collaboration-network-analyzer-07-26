"""
User & Session Audit Schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from ..db.models import UserRole


# ==========================================
# USER SCHEMAS
# ==========================================

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.RESEARCHER
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Plaintext user password")


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8)


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


# ==========================================
# SESSION AUDIT LOG SCHEMAS
# ==========================================

class AuditLogBase(BaseModel):
    action: str = Field(..., max_length=100)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    user_id: Optional[UUID] = None


class AuditLogResponse(AuditLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime
