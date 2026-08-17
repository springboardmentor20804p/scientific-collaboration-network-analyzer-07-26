"""
Unified API v1 router combining module routers.
"""

from fastapi import APIRouter

from .auth import router as auth_router
from .projects import router as projects_router
from .publications import router as publications_router
from .researchers import router as researchers_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(researchers_router)
api_router.include_router(publications_router)
api_router.include_router(projects_router)
