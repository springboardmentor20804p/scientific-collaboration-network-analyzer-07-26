"""
Researcher Profile, Skill, and Affiliation Schemas.
"""

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# SKILL SCHEMAS
# ==========================================

class SkillBase(BaseModel):
    name: str = Field(..., max_length=100)


class SkillResponse(SkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# ==========================================
# AFFILIATION SCHEMAS
# ==========================================

class AffiliationBase(BaseModel):
    institution_id: UUID
    role_title: str = Field(..., max_length=150)
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = True


class AffiliationResponse(AffiliationBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    researcher_id: UUID


# ==========================================
# RESEARCHER PROFILE SCHEMAS
# ==========================================

class ResearcherProfileBase(BaseModel):
    profile_picture: Optional[str] = Field(default=None, max_length=512)
    bio: Optional[str] = Field(default=None)
    orcid_id: Optional[str] = Field(
        default=None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$", description="ORCID ID format: 0000-0002-1825-0097"
    )
    department_id: Optional[UUID] = Field(default=None)


class ResearcherProfileCreate(ResearcherProfileBase):
    user_id: UUID
    skill_names: Optional[List[str]] = Field(default_factory=list)


class ResearcherProfileUpdate(BaseModel):
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    orcid_id: Optional[str] = None
    department_id: Optional[UUID] = None
    skill_names: Optional[List[str]] = None


class ResearcherProfileResponse(ResearcherProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    skills: List[SkillResponse] = Field(default_factory=list)
    affiliations: List[AffiliationResponse] = Field(default_factory=list)
