"""FastAPI application entry point for the Order to Dispatch dashboard."""
from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .data import (
    get_dashboard_summary,
    get_forecast_overview,
    get_forecast_settings,
    get_orders,
    get_shipments,
    get_warehouses,
)

app = FastAPI(title="Order to Dispatch API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/dashboard")
def dashboard_summary() -> dict:
    """Return high level metrics for the dashboard cards and charts."""
    return get_dashboard_summary()


@app.get("/api/orders")
def orders(
    limit: int = Query(25, ge=1, le=200, description="Number of records to return"),
    status: str | None = Query(None, description="Optional status filter"),
) -> dict:
    """Return paginated order data with dynamic 160+ column support."""
    return get_orders(limit=limit, status=status)


@app.get("/api/shipments")
def shipments(
    limit: int = Query(25, ge=1, le=200, description="Number of shipments to return"),
) -> dict:
    """Return shipment level tracking data."""
    return {"rows": get_shipments(limit=limit)}


@app.get("/api/warehouses")
def warehouses() -> dict:
    """Return warehouse capacity and utilization data."""
    return {"rows": get_warehouses()}


@app.get("/api/forecast/settings")
def forecast_settings() -> dict:
    """Return forecast model configuration and supported scenarios."""
    return get_forecast_settings()


@app.get("/api/forecast/overview")
def forecast_overview() -> dict:
    """Return demand and supply overview data for charting."""
    return get_forecast_overview()


@app.get("/")
def healthcheck() -> dict:
    """Simple health endpoint for availability checks."""
    return {"status": "ok"}
