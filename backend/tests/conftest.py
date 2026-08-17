"""
Pytest fixtures for Scientific Collaboration Network Analyzer backend.
"""

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest_asyncio.fixture
async def async_client():
    """
    Async HTTPX client for testing FastAPI application endpoints.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as client:
        yield client
