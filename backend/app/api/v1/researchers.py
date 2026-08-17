"""
Researcher Profiles & Affiliations API endpoints.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...db.session import get_db
from ...schemas.researcher import ResearcherProfileCreate, ResearcherProfileResponse

router = APIRouter(prefix="/researchers", tags=["Researchers"])


@router.get("/", response_model=List[ResearcherProfileResponse])
async def list_researchers(db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving researcher profiles.
    """
    raise NotImplementedError("List researchers endpoint stub")


@router.get("/{researcher_id}", response_model=ResearcherProfileResponse)
async def get_researcher_profile(researcher_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving a single researcher profile by ID.
    """
    raise NotImplementedError("Get researcher profile endpoint stub")


@router.post("/", response_model=ResearcherProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_researcher_profile(
    profile_in: ResearcherProfileCreate, db: AsyncSession = Depends(get_db)
):
    """
    Stub endpoint for creating a researcher profile.
    """
    raise NotImplementedError("Create researcher profile endpoint stub")
