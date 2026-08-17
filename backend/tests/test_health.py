"""
Tests for health check endpoint.
"""

import pytest


@pytest.mark.asyncio
async def test_health_check_endpoint(async_client):
    """
    Test GET /health returns 200 OK and healthy status payload.
    """
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project"] == "Scientific Collaboration Network Analyzer"
    assert data["version"] == "1.0.0"
