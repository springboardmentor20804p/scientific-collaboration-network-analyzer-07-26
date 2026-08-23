from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_user, require_permission
from app.core.audit import record_audit
from app.db.session import get_db
from app.models.task import ProjectTask
from app.models.user import User
from app.schemas.task import TaskResponse, TaskCreate, TaskUpdate

router = APIRouter()


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    result = await db.execute(select(ProjectTask))
    return result.scalars().all()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("research.manageProjects")),
) -> Any:
    task = ProjectTask(**task_in.model_dump())
    db.add(task)
    await record_audit(db, actor=current_user.name, action="created task", target=task.title)
    await db.commit()
    await db.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("research.manageProjects")),
) -> Any:
    result = await db.execute(select(ProjectTask).where(ProjectTask.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await record_audit(db, actor=current_user.name, action="updated task", target=task.title)
    await db.commit()
    await db.refresh(task)
    return task
