"""
SQLAlchemy 2.0 Async ORM Models for Scientific Collaboration Network Analyzer.

Modules:
1. User & Authentication Management
2. Institution & Department Management
3. Researcher Management & Profiles
4. Publication Repository
5. Research Projects & Collaboration
6. Conference & Event Tracking
7. Citation & Reference Management
"""

import enum
import uuid
from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


# ==========================================
# ENUMS
# ==========================================

class UserRole(str, enum.Enum):
    RESEARCHER = "RESEARCHER"
    INSTITUTION_ADMIN = "INSTITUTION_ADMIN"
    REVIEWER = "REVIEWER"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"


class PublicationType(str, enum.Enum):
    JOURNAL = "Journal"
    CONFERENCE = "Conference"
    BOOK = "Book"
    PATENT = "Patent"
    TECH_REPORT = "TechReport"


class PublicationStatus(str, enum.Enum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    PUBLISHED = "Published"
    ARCHIVED = "Archived"


class ConferenceRole(str, enum.Enum):
    SPEAKER = "Speaker"
    ATTENDEE = "Attendee"
    ORGANIZER = "Organizer"


# ==========================================
# 1. USER & AUTHENTICATION MANAGEMENT
# ==========================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", native_enum=True),
        nullable=False,
        default=UserRole.RESEARCHER,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    researcher_profile: Mapped[Optional["ResearcherProfile"]] = relationship(
        "ResearcherProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog", back_populates="user", cascade="all, delete-orphan"
    )
    created_publications: Mapped[List["Publication"]] = relationship(
        "Publication", back_populates="creator"
    )


class AuditLog(Base):
    __tablename__ = "session_audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship(
        "User", back_populates="audit_logs"
    )


# ==========================================
# 2. INSTITUTION & DEPARTMENT MANAGEMENT
# ==========================================

class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    country: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, index=True
    )
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    departments: Mapped[List["Department"]] = relationship(
        "Department", back_populates="institution", cascade="all, delete-orphan"
    )
    affiliations: Mapped[List["AffiliationHistory"]] = relationship(
        "AffiliationHistory", back_populates="institution", cascade="all, delete-orphan"
    )
    lead_collaborations: Mapped[List["InstitutionalCollaboration"]] = relationship(
        "InstitutionalCollaboration",
        foreign_keys="InstitutionalCollaboration.institution_a_id",
        back_populates="institution_a",
    )
    partner_collaborations: Mapped[List["InstitutionalCollaboration"]] = relationship(
        "InstitutionalCollaboration",
        foreign_keys="InstitutionalCollaboration.institution_b_id",
        back_populates="institution_b",
    )


class Department(Base):
    __tablename__ = "departments"
    __table_args__ = (
        UniqueConstraint("institution_id", "name", name="uq_institution_department_name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    institution: Mapped["Institution"] = relationship(
        "Institution", back_populates="departments"
    )
    researchers: Mapped[List["ResearcherProfile"]] = relationship(
        "ResearcherProfile", back_populates="department"
    )


# ==========================================
# 3. RESEARCHER MANAGEMENT & PROFILES
# ==========================================

class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )

    # Relationships
    researchers: Mapped[List["ResearcherProfile"]] = relationship(
        "ResearcherProfile", secondary="researcher_skills", back_populates="skills"
    )


class ResearcherSkill(Base):
    __tablename__ = "researcher_skills"

    researcher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    )


class ResearcherProfile(Base):
    __tablename__ = "researcher_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    profile_picture: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True
    )
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    orcid_id: Mapped[Optional[str]] = mapped_column(
        String(19), unique=True, index=True, nullable=True
    )
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="researcher_profile")
    department: Mapped[Optional["Department"]] = relationship(
        "Department", back_populates="researchers"
    )
    skills: Mapped[List["Skill"]] = relationship(
        "Skill", secondary="researcher_skills", back_populates="researchers"
    )
    affiliations: Mapped[List["AffiliationHistory"]] = relationship(
        "AffiliationHistory", back_populates="researcher", cascade="all, delete-orphan"
    )
    co_authorships: Mapped[List["CoAuthorship"]] = relationship(
        "CoAuthorship", back_populates="researcher", cascade="all, delete-orphan"
    )
    project_memberships: Mapped[List["ProjectMember"]] = relationship(
        "ProjectMember", back_populates="researcher", cascade="all, delete-orphan"
    )
    lead_projects: Mapped[List["ResearchProject"]] = relationship(
        "ResearchProject", back_populates="lead_researcher"
    )
    conference_participations: Mapped[List["ConferenceParticipation"]] = relationship(
        "ConferenceParticipation", back_populates="researcher", cascade="all, delete-orphan"
    )


class AffiliationHistory(Base):
    __tablename__ = "affiliation_history"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    researcher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role_title: Mapped[str] = mapped_column(String(150), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    researcher: Mapped["ResearcherProfile"] = relationship(
        "ResearcherProfile", back_populates="affiliations"
    )
    institution: Mapped["Institution"] = relationship(
        "Institution", back_populates="affiliations"
    )


# ==========================================
# 4. PUBLICATION REPOSITORY
# ==========================================

class Publication(Base):
    __tablename__ = "publications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(Text, nullable=False, index=True)
    abstract: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    publication_type: Mapped[PublicationType] = mapped_column(
        Enum(PublicationType, name="publication_type_enum", native_enum=True),
        nullable=False,
        index=True,
    )
    publication_status: Mapped[PublicationStatus] = mapped_column(
        Enum(PublicationStatus, name="publication_status_enum", native_enum=True),
        nullable=False,
        default=PublicationStatus.DRAFT,
        index=True,
    )
    doi: Mapped[Optional[str]] = mapped_column(
        String(100), unique=True, index=True, nullable=True
    )
    publication_date: Mapped[Optional[date]] = mapped_column(
        Date, nullable=True, index=True
    )
    file_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    creator: Mapped[Optional["User"]] = relationship(
        "User", back_populates="created_publications"
    )
    co_authors: Mapped[List["CoAuthorship"]] = relationship(
        "CoAuthorship", back_populates="publication", cascade="all, delete-orphan"
    )
    citations_given: Mapped[List["Citation"]] = relationship(
        "Citation",
        foreign_keys="Citation.source_publication_id",
        back_populates="source_publication",
        cascade="all, delete-orphan",
    )
    citations_received: Mapped[List["Citation"]] = relationship(
        "Citation",
        foreign_keys="Citation.cited_publication_id",
        back_populates="cited_publication",
        cascade="all, delete-orphan",
    )
    external_references: Mapped[List["ExternalReference"]] = relationship(
        "ExternalReference", back_populates="publication", cascade="all, delete-orphan"
    )
    conference_participations: Mapped[List["ConferenceParticipation"]] = relationship(
        "ConferenceParticipation", back_populates="publication"
    )


class CoAuthorship(Base):
    __tablename__ = "co_authorships"
    __table_args__ = (
        UniqueConstraint("publication_id", "author_order", name="uq_publication_author_order"),
        Index("idx_coauthorship_researcher_pub", "researcher_id", "publication_id"),
    )

    publication_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publications.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    researcher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    author_order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_corresponding_author: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    # Relationships
    publication: Mapped["Publication"] = relationship(
        "Publication", back_populates="co_authors"
    )
    researcher: Mapped["ResearcherProfile"] = relationship(
        "ResearcherProfile", back_populates="co_authorships"
    )


# ==========================================
# 5. RESEARCH PROJECTS & COLLABORATION
# ==========================================

class ResearchProject(Base):
    __tablename__ = "research_projects"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    grant_number: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, index=True
    )
    funding_agency: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    lead_researcher_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    lead_researcher: Mapped[Optional["ResearcherProfile"]] = relationship(
        "ResearcherProfile", back_populates="lead_projects"
    )
    members: Mapped[List["ProjectMember"]] = relationship(
        "ProjectMember", back_populates="project", cascade="all, delete-orphan"
    )
    institutional_collaborations: Mapped[List["InstitutionalCollaboration"]] = relationship(
        "InstitutionalCollaboration",
        back_populates="project",
        cascade="all, delete-orphan",
    )


class ProjectMember(Base):
    __tablename__ = "project_members"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("research_projects.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    researcher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    role: Mapped[str] = mapped_column(
        String(100), nullable=False, default="Collaborator"
    )
    joined_date: Mapped[date] = mapped_column(
        Date, server_default=func.current_date(), nullable=False
    )

    # Relationships
    project: Mapped["ResearchProject"] = relationship(
        "ResearchProject", back_populates="members"
    )
    researcher: Mapped["ResearcherProfile"] = relationship(
        "ResearcherProfile", back_populates="project_memberships"
    )


class InstitutionalCollaboration(Base):
    __tablename__ = "institutional_collaborations"
    __table_args__ = (
        CheckConstraint("institution_a_id != institution_b_id", name="chk_different_institutions"),
        UniqueConstraint("project_id", "institution_a_id", "institution_b_id", name="uq_project_institutions_pair"),
        Index("idx_inst_collab_pair", "institution_a_id", "institution_b_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("research_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    institution_a_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    institution_b_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    collaboration_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    project: Mapped["ResearchProject"] = relationship(
        "ResearchProject", back_populates="institutional_collaborations"
    )
    institution_a: Mapped["Institution"] = relationship(
        "Institution",
        foreign_keys=[institution_a_id],
        back_populates="lead_collaborations",
    )
    institution_b: Mapped["Institution"] = relationship(
        "Institution",
        foreign_keys=[institution_b_id],
        back_populates="partner_collaborations",
    )


# ==========================================
# 6. CONFERENCE & EVENT TRACKING
# ==========================================

class Conference(Base):
    __tablename__ = "conferences"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    participations: Mapped[List["ConferenceParticipation"]] = relationship(
        "ConferenceParticipation", back_populates="conference", cascade="all, delete-orphan"
    )


class ConferenceParticipation(Base):
    __tablename__ = "conference_participations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    conference_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conferences.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    researcher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role: Mapped[ConferenceRole] = mapped_column(
        Enum(ConferenceRole, name="conference_role_enum", native_enum=True),
        nullable=False,
    )
    publication_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publications.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Relationships
    conference: Mapped["Conference"] = relationship(
        "Conference", back_populates="participations"
    )
    researcher: Mapped["ResearcherProfile"] = relationship(
        "ResearcherProfile", back_populates="conference_participations"
    )
    publication: Mapped[Optional["Publication"]] = relationship(
        "Publication", back_populates="conference_participations"
    )


# ==========================================
# 7. CITATION & REFERENCE MANAGEMENT
# ==========================================

class Citation(Base):
    __tablename__ = "citations"
    __table_args__ = (
        CheckConstraint("source_publication_id != cited_publication_id", name="chk_self_citation"),
        UniqueConstraint("source_publication_id", "cited_publication_id", name="uq_citation_pair"),
        Index("idx_citations_cited_source", "cited_publication_id", "source_publication_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source_publication_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    cited_publication_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    source_publication: Mapped["Publication"] = relationship(
        "Publication",
        foreign_keys=[source_publication_id],
        back_populates="citations_given",
    )
    cited_publication: Mapped["Publication"] = relationship(
        "Publication",
        foreign_keys=[cited_publication_id],
        back_populates="citations_received",
    )


class ExternalReference(Base):
    __tablename__ = "external_references"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    publication_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    reference_text: Mapped[str] = mapped_column(Text, nullable=False)
    external_doi: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, index=True
    )

    # Relationships
    publication: Mapped["Publication"] = relationship(
        "Publication", back_populates="external_references"
    )
