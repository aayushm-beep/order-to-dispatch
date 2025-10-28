"""Synthetic data generation for the Order to Dispatch dashboard."""
from __future__ import annotations

import itertools
import random
from datetime import date, datetime, timedelta
from typing import Dict, List

_RANDOM_SEED = 42
_RANDOM = random.Random(_RANDOM_SEED)

ORDER_METRIC_COUNT = 160

_STATUS_PIPELINE = [
    "Pending",
    "Confirmed",
    "Allocated",
    "Packed",
    "Shipped",
    "Delivered",
]

_SHIPMENT_STATUSES = [
    "Label Created",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Exception",
]

_WAREHOUSE_REGIONS = [
    "North",
    "South",
    "East",
    "West",
]


def _random_date(start: date, end: date) -> date:
    """Return a random date between ``start`` and ``end`` inclusive."""
    delta_days = (end - start).days
    return start + timedelta(days=_RANDOM.randint(0, delta_days))


def _generate_metrics(prefix: str, count: int) -> Dict[str, float]:
    return {
        f"{prefix}_{index:03}": round(_RANDOM.uniform(0, 1000), 2)
        for index in range(1, count + 1)
    }


def _paginate(data: List[dict], limit: int | None) -> List[dict]:
    if limit is None:
        return data
    return data[:limit]


def get_orders(limit: int | None = None, status: str | None = None) -> Dict[str, List[dict]]:
    """Return synthetic order records with 160+ columns."""
    orders: List[dict] = []
    base_date = date.today()
    for order_id in range(1, 51):
        placed = _random_date(base_date - timedelta(days=90), base_date)
        promised = placed + timedelta(days=_RANDOM.randint(1, 14))
        pipeline_position = _RANDOM.randint(0, len(_STATUS_PIPELINE) - 1)
        status_value = _STATUS_PIPELINE[pipeline_position]
        order = {
            "order_id": f"ORD-{order_id:05}",
            "customer_name": f"Customer {order_id:03}",
            "status": status_value,
            "priority": _RANDOM.choice(["Low", "Medium", "High", "Critical"]),
            "order_date": placed.isoformat(),
            "promised_date": promised.isoformat(),
            "sales_channel": _RANDOM.choice(["Online", "Retail", "Wholesale", "Marketplace"]),
            "country": _RANDOM.choice(["US", "CA", "DE", "FR", "JP", "AU"]),
            "total_value": round(_RANDOM.uniform(50, 5000), 2),
            "currency": "USD",
            "units": _RANDOM.randint(1, 250),
            "late_risk": round(_RANDOM.uniform(0, 1), 2),
            "pipeline_step": pipeline_position + 1,
            "carrier": _RANDOM.choice(["UPS", "FedEx", "DHL", "USPS", "Royal Mail"]),
            "warehouse": _RANDOM.choice(["New York", "Dallas", "Berlin", "Tokyo", "Sydney"]),
        }
        order.update(_generate_metrics("metric", ORDER_METRIC_COUNT))
        orders.append(order)

    if status:
        status_lower = status.lower()
        orders = [item for item in orders if item["status"].lower() == status_lower]

    columns = list(orders[0].keys()) if orders else []
    return {"columns": columns, "rows": _paginate(orders, limit)}


def get_shipments(limit: int | None = None) -> List[dict]:
    shipments: List[dict] = []
    base_date = datetime.now()
    for shipment_id in range(1, 41):
        departed = base_date - timedelta(days=_RANDOM.randint(1, 15))
        eta = departed + timedelta(days=_RANDOM.randint(1, 10))
        shipments.append(
            {
                "shipment_id": f"SHP-{shipment_id:05}",
                "order_id": f"ORD-{_RANDOM.randint(1, 50):05}",
                "status": _RANDOM.choice(_SHIPMENT_STATUSES),
                "carrier": _RANDOM.choice(["UPS", "FedEx", "DHL", "USPS"]),
                "origin": _RANDOM.choice(["New York", "Atlanta", "Los Angeles", "Berlin", "Tokyo"]),
                "destination": _RANDOM.choice(["Chicago", "Dallas", "San Francisco", "Paris", "Osaka"]),
                "departed_at": departed.isoformat(),
                "estimated_delivery": eta.isoformat(),
                "tracking_events": _RANDOM.randint(3, 12),
                "is_expedited": _RANDOM.choice([True, False]),
            }
        )
    return _paginate(shipments, limit)


def get_warehouses() -> List[dict]:
    warehouses: List[dict] = []
    for index, (region, name) in enumerate(
        itertools.product(_WAREHOUSE_REGIONS, ["Alpha", "Beta", "Gamma", "Delta"]), start=1
    ):
        capacity = _RANDOM.randint(5000, 15000)
        current = _RANDOM.randint(2000, capacity)
        warehouses.append(
            {
                "warehouse_id": f"WH-{index:03}",
                "name": f"{region} {name}",
                "region": region,
                "capacity": capacity,
                "current_units": current,
                "utilization": round(current / capacity, 2),
                "active_orders": _RANDOM.randint(50, 600),
                "open_positions": _RANDOM.randint(0, 25),
            }
        )
    return warehouses


def get_forecast_settings() -> Dict[str, object]:
    horizon_months = 6
    return {
        "horizon_months": horizon_months,
        "model": "Prophet",
        "confidence_interval": 0.9,
        "seasonality": {"weekly": True, "monthly": True, "yearly": False},
        "demand_drivers": [
            "seasonal_index",
            "promotion_calendar",
            "economic_indicator",
            "new_product_launches",
        ],
        "scenarios": [
            {"name": "Baseline", "growth": 1.0},
            {"name": "Optimistic", "growth": 1.15},
            {"name": "Conservative", "growth": 0.9},
        ],
    }


def get_forecast_overview() -> Dict[str, List[dict]]:
    months = [
        (datetime.now() + timedelta(days=30 * offset)).strftime("%b %Y")
        for offset in range(0, 7)
    ]
    demand = [_RANDOM.randint(800, 1800) for _ in months]
    supply = [int(value * _RANDOM.uniform(0.8, 1.1)) for value in demand]
    return {
        "labels": months,
        "demand": demand,
        "supply": supply,
    }


def get_dashboard_summary() -> Dict[str, object]:
    orders = get_orders()["rows"]
    shipments = get_shipments()
    warehouses = get_warehouses()

    total_order_value = round(sum(order["total_value"] for order in orders), 2)
    late_orders = sum(1 for order in orders if order["late_risk"] > 0.6)
    average_utilization = round(
        sum(warehouse["utilization"] for warehouse in warehouses) / len(warehouses), 2
    )

    return {
        "totals": {
            "orders": len(orders),
            "shipments": len(shipments),
            "warehouses": len(warehouses),
            "order_value": total_order_value,
        },
        "late_orders": late_orders,
        "pipeline": {
            status: sum(1 for order in orders if order["status"] == status)
            for status in _STATUS_PIPELINE
        },
        "warehouse_utilization": average_utilization,
    }
