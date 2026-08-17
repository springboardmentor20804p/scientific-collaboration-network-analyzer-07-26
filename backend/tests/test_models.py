"""
Tests for SQLAlchemy 2.0 ORM model metadata registration & constraints.
"""

from app.db.base import Base
from app.db.models import (
    AffiliationHistory,
    AuditLog,
    Citation,
    Conference,
    ConferenceParticipation,
    CoAuthorship,
    Department,
    ExternalReference,
    Institution,
    InstitutionalCollaboration,
    ProjectMember,
    Publication,
    ResearchProject,
    ResearcherProfile,
    Skill,
    User,
)


def test_model_metadata_table_names():
    """
    Verify all 17 ORM models are registered in SQLAlchemy metadata with expected table names.
    """
    table_names = set(Base.metadata.tables.keys())
    expected_tables = {
        "users",
        "session_audit_logs",
        "institutions",
        "departments",
        "skills",
        "researcher_skills",
        "researcher_profiles",
        "affiliation_history",
        "publications",
        "co_authorships",
        "research_projects",
        "project_members",
        "institutional_collaborations",
        "conferences",
        "conference_participations",
        "citations",
        "external_references",
    }
    assert expected_tables.issubset(table_names)


def test_user_model_columns():
    """
    Verify User model column attributes.
    """
    columns = Base.metadata.tables["users"].columns
    assert "id" in columns
    assert "email" in columns
    assert "password_hash" in columns
    assert "role" in columns
    assert "is_active" in columns


def test_publication_model_columns():
    """
    Verify Publication model column attributes.
    """
    columns = Base.metadata.tables["publications"].columns
    assert "id" in columns
    assert "title" in columns
    assert "publication_type" in columns
    assert "publication_status" in columns
    assert "doi" in columns
