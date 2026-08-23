# Import all SQLAlchemy models here for Alembic migrations
from app.db.session import Base  # noqa
from app.models.user import User  # noqa
from app.models.publication import Publication  # noqa
from app.models.project import Project  # noqa
from app.models.conference import Conference  # noqa
from app.models.citation import Citation  # noqa
from app.models.audit import AuditLog  # noqa
from app.models.team import Team  # noqa
from app.models.task import ProjectTask  # noqa
from app.models.assignment import Assignment  # noqa
from app.models.link import PublicationLink  # noqa
