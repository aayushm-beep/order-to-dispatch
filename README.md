# Order to Dispatch Dashboard

A full-stack reference implementation for an order-to-dispatch control tower. The project pairs a Python FastAPI
backend that emits rich operational datasets (including an order table with 160 programmatically generated columns)
with an Angular 18 front-end that provides dashboards, operational grids, shipment tracking, warehouse monitoring,
and configurable forecasting levers.

## Project Structure

```
backend/    # FastAPI application that exposes JSON APIs for the dashboard
frontend/   # Angular 18 single page application consuming the backend
```

## Backend (FastAPI)

### Requirements

* Python 3.11+
* `pip`

### Install and Run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Key endpoints include:

* `GET /api/dashboard` – Summary metrics for dashboard cards and charts
* `GET /api/orders` – Order records with 160+ metrics (supports `limit` and `status` query params)
* `GET /api/shipments` – Shipment tracking data
* `GET /api/warehouses` – Warehouse capacity/utilization dataset
* `GET /api/forecast/settings` – Forecast configuration metadata
* `GET /api/forecast/overview` – Demand vs supply projection for the dashboard chart

## Frontend (Angular 18)

### Requirements

* Node.js 20+
* `npm`

### Install and Run

```bash
cd frontend
npm install
npm start
```

The Angular development server will run on `http://localhost:4200` and automatically proxy requests to the backend
when it is running on `http://localhost:8000` (update `environment.ts` if you host the API elsewhere).

### Feature Highlights

* **Dashboard** – KPI cards, late-risk pipeline visualization, and demand vs. supply chart with theme-aware styling.
* **Orders** – Virtual-like wide table with all 160 dynamic columns, ad-hoc search, and status filtering.
* **Shipments** – Active shipments grid with carrier metadata and milestone insight chips.
* **Warehouses** – Regional utilization summary cards plus detailed warehouse roster table.
* **Forecast Settings** – Interactive panel to review model horizons, seasonality switches, drivers, and growth scenarios.
* **Theme Toggle** – Persistent light/dark theme switch stored in local storage and reflected across the application.

## Theming

CSS variables control the design tokens for both themes. Modify `frontend/src/styles.scss` to tweak the palettes or to
introduce additional themes.

## Data Generation

The backend synthesizes deterministic datasets using Python's standard library. The orders endpoint enriches each
order with 160 numeric metrics (`metric_001` – `metric_160`) to emulate high-dimensional exports for BI workloads.

## License

This project is provided as reference material without warranty. Adapt and extend as required for your environment.
