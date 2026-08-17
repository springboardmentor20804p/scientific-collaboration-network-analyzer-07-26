"""
Publications & Repository API endpoints.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.publication import PublicationCreate, PublicationResponse

router = APIRouter(prefix="/publications", tags=["Publications"])


@router.get("/", response_model=List[PublicationResponse])
async def list_publications(db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving publication records.
    """
    raise NotImplementedError("List publications endpoint stub")


@router.get("/{publication_id}", response_model=PublicationResponse)
async def get_publication(publication_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving a single publication by ID.
    """
    raise NotImplementedError("Get publication endpoint stub")


@router.post("/", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
async def create_publication(
    publication_in: PublicationCreate, db: AsyncSession = Depends(get_db)
):
    """
    Stub endpoint for publishing / creating a new publication entry.
    """
    raise NotImplementedError("Create publication endpoint stub")
