"""
Publication, CoAuthor, and Citation Schemas.
"""

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from ..db.models import PublicationStatus, PublicationType


# ==========================================
# CO-AUTHOR SCHEMAS
# ==========================================

class CoAuthorInput(BaseModel):
    researcher_id: UUID
    author_order: int = Field(..., ge=1)
    is_corresponding_author: bool = False


class CoAuthorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    publication_id: UUID
    researcher_id: UUID
    author_order: int
    is_corresponding_author: bool


# ==========================================
# CITATION SCHEMAS
# ==========================================

class CitationCreate(BaseModel):
    source_publication_id: UUID
    cited_publication_id: UUID


class CitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source_publication_id: UUID
    cited_publication_id: UUID
    created_at: datetime


# ==========================================
# PUBLICATION SCHEMAS
# ==========================================

class PublicationBase(BaseModel):
    title: str = Field(..., min_length=1)
    abstract: Optional[str] = None
    publication_type: PublicationType
    publication_status: PublicationStatus = PublicationStatus.DRAFT
    doi: Optional[str] = Field(default=None, max_length=100)
    publication_date: Optional[date] = None
    file_url: Optional[str] = Field(default=None, max_length=512)


class PublicationCreate(PublicationBase):
    authors: List[CoAuthorInput] = Field(..., min_length=1)


class PublicationUpdate(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    publication_type: Optional[PublicationType] = None
    publication_status: Optional[PublicationStatus] = None
    doi: Optional[str] = None
    publication_date: Optional[date] = None
    file_url: Optional[str] = None


class PublicationResponse(PublicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    co_authors: List[CoAuthorResponse] = Field(default_factory=list)
