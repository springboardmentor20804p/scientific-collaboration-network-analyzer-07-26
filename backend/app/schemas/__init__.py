"""
Modular schemas export.
"""

from .auth import (
    AuditLogBase,
    AuditLogCreate,
    AuditLogResponse,
    UserBase,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from .project import (
    InstitutionalCollaborationResponse,
    ProjectMemberInput,
    ProjectMemberResponse,
    ResearchProjectBase,
    ResearchProjectCreate,
    ResearchProjectResponse,
    ResearchProjectUpdate,
)
from .publication import (
    CitationCreate,
    CitationResponse,
    CoAuthorInput,
    CoAuthorResponse,
    PublicationBase,
    PublicationCreate,
    PublicationResponse,
    PublicationUpdate,
)
from .researcher import (
    AffiliationBase,
    AffiliationResponse,
    ResearcherProfileBase,
    ResearcherProfileCreate,
    ResearcherProfileResponse,
    ResearcherProfileUpdate,
    SkillBase,
    SkillResponse,
)

__all__ = [
    # Auth
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "AuditLogBase",
    "AuditLogCreate",
    "AuditLogResponse",
    # Researcher
    "SkillBase",
    "SkillResponse",
    "AffiliationBase",
    "AffiliationResponse",
    "ResearcherProfileBase",
    "ResearcherProfileCreate",
    "ResearcherProfileResponse",
    "ResearcherProfileUpdate",
    # Publication
    "CoAuthorInput",
    "CoAuthorResponse",
    "CitationCreate",
    "CitationResponse",
    "PublicationBase",
    "PublicationCreate",
    "PublicationUpdate",
    "PublicationResponse",
    # Project
    "ProjectMemberInput",
    "ProjectMemberResponse",
    "InstitutionalCollaborationResponse",
    "ResearchProjectBase",
    "ResearchProjectCreate",
    "ResearchProjectResponse",
    "ResearchProjectUpdate",
]
