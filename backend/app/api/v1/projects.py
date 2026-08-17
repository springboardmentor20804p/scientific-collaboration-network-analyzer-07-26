"""
Research Projects & Collaborations API endpoints.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.project import ResearchProjectCreate, ResearchProjectResponse

router = APIRouter(prefix="/projects", tags=["Research Projects"])


@router.get("/", response_model=List[ResearchProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving research projects.
    """
    raise NotImplementedError("List projects endpoint stub")


@router.get("/{project_id}", response_model=ResearchProjectResponse)
async def get_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Stub endpoint for retrieving a single research project by ID.
    """
    raise NotImplementedError("Get project endpoint stub")


@router.post("/", response_model=ResearchProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ResearchProjectCreate, db: AsyncSession = Depends(get_db)
):
    """
    Stub endpoint for creating a new research project.
    """
    raise NotImplementedError("Create project endpoint stub")
