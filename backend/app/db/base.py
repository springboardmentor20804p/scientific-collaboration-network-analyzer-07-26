"""
Database models package initialization and base declarative class.
SQLAlchemy 2.0 Async ORM standard setup.
"""
from typing import Any
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base declarative class for all SQLAlchemy models."""
    pass
