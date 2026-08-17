"""
Database package initialization re-exporting Base, Session, and all ORM models.
"""

from .base import Base
from .models import (
    AffiliationHistory,
    AuditLog,
    Citation,
    Conference,
    ConferenceParticipation,
    ConferenceRole,
    CoAuthorship,
    Department,
    ExternalReference,
    Institution,
    InstitutionalCollaboration,
    ProjectMember,
    Publication,
    PublicationStatus,
    PublicationType,
    ResearchProject,
    ResearcherProfile,
    ResearcherSkill,
    Skill,
    User,
    UserRole,
)
from .session import AsyncSessionLocal, engine, get_db

__all__ = [
    "Base",
    "engine",
    "AsyncSessionLocal",
    "get_db",
    "UserRole",
    "PublicationType",
    "PublicationStatus",
    "ConferenceRole",
    "User",
    "AuditLog",
    "Institution",
    "Department",
    "Skill",
    "ResearcherSkill",
    "ResearcherProfile",
    "AffiliationHistory",
    "Publication",
    "CoAuthorship",
    "ResearchProject",
    "ProjectMember",
    "InstitutionalCollaboration",
    "Conference",
    "ConferenceParticipation",
    "Citation",
    "ExternalReference",
]
