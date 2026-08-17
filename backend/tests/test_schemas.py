"""
Tests for Pydantic v2 schemas validation.
"""

from uuid import uuid4
from app.db.models import PublicationStatus, PublicationType, UserRole
from app.schemas.auth import UserBase, UserCreate
from app.schemas.publication import PublicationBase
from app.schemas.researcher import ResearcherProfileBase


def test_user_schema_validation():
    """
    Test UserCreate schema validation.
    """
    user_data = {
        "email": "researcher@university.edu",
        "password": "securepassword123",
        "role": UserRole.RESEARCHER,
    }
    user = UserCreate(**user_data)
    assert user.email == "researcher@university.edu"
    assert user.role == UserRole.RESEARCHER


def test_researcher_profile_orcid_validation():
    """
    Test ResearcherProfileBase ORCID regex format validation.
    """
    profile = ResearcherProfileBase(
        orcid_id="0000-0002-1825-0097",
        bio="Senior Computer Science Researcher",
    )
    assert profile.orcid_id == "0000-0002-1825-0097"


def test_publication_schema_defaults():
    """
    Test PublicationBase defaults.
    """
    pub = PublicationBase(
        title="Graph Neural Networks in Collaboration Analysis",
        publication_type=PublicationType.JOURNAL,
    )
    assert pub.publication_status == PublicationStatus.DRAFT
    assert pub.publication_type == PublicationType.JOURNAL
