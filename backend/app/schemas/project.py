"""
Research Project, Member, and Institutional Collaboration Schemas.
"""

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# PROJECT MEMBER SCHEMAS
# ==========================================

class ProjectMemberInput(BaseModel):
    researcher_id: UUID
    role: str = "Collaborator"


class ProjectMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    project_id: UUID
    researcher_id: UUID
    role: str
    joined_date: date


# ==========================================
# INSTITUTIONAL COLLABORATION SCHEMAS
# ==========================================

class InstitutionalCollaborationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID
    institution_a_id: UUID
    institution_b_id: UUID
    collaboration_notes: Optional[str] = None


# ==========================================
# RESEARCH PROJECT SCHEMAS
# ==========================================

class ResearchProjectBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    grant_number: Optional[str] = Field(default=None, max_length=100)
    funding_agency: Optional[str] = Field(default=None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    lead_researcher_id: Optional[UUID] = None


class ResearchProjectCreate(ResearchProjectBase):
    members: Optional[List[ProjectMemberInput]] = Field(default_factory=list)
    collaborating_institution_ids: Optional[List[UUID]] = Field(default_factory=list)


class ResearchProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    grant_number: Optional[str] = None
    funding_agency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    lead_researcher_id: Optional[UUID] = None


class ResearchProjectResponse(ResearchProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    members: List[ProjectMemberResponse] = Field(default_factory=list)
    institutional_collaborations: List[InstitutionalCollaborationResponse] = Field(
        default_factory=list
    )
