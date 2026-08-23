from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_user, require_permission
from app.core.audit import record_audit
from app.db.session import get_db
from app.models.team import Team
from app.models.user import User
from app.schemas.team import TeamResponse, TeamCreate, TeamUpdate

router = APIRouter()


@router.get("/", response_model=List[TeamResponse])
async def list_teams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    result = await db.execute(select(Team))
    return result.scalars().all()


@router.post("/", response_model=TeamResponse)
async def create_team(
    team_in: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("research.manageProjects")),
) -> Any:
    team = Team(**team_in.model_dump())
    db.add(team)
    await record_audit(db, actor=current_user.name, action="created team", target=team.name)
    await db.commit()
    await db.refresh(team)
    return team


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: int,
    team_in: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("research.manageProjects")),
) -> Any:
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    for field, value in team_in.model_dump(exclude_unset=True).items():
        setattr(team, field, value)
    await record_audit(db, actor=current_user.name, action="updated team", target=team.name)
    await db.commit()
    await db.refresh(team)
    return team
