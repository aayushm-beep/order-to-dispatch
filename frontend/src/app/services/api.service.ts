import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`);
  }

  getOrders(limit = 50, status?: string): Observable<OrderResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (status) {
      params.set('status', status);
    }

    const url = `${this.baseUrl}/orders?${params.toString()}`;
    return this.http.get<OrderResponse>(url);
  }

  getShipments(limit = 50): Observable<TableResponse<Shipment>> {
    return this.http.get<TableResponse<Shipment>>(`${this.baseUrl}/shipments?limit=${limit}`);
  }

  getWarehouses(): Observable<TableResponse<Warehouse>> {
    return this.http.get<TableResponse<Warehouse>>(`${this.baseUrl}/warehouses`);
  }

  getForecastSettings(): Observable<ForecastSettings> {
    return this.http.get<ForecastSettings>(`${this.baseUrl}/forecast/settings`);
  }

  getForecastOverview(): Observable<ForecastOverview> {
    return this.http.get<ForecastOverview>(`${this.baseUrl}/forecast/overview`);
  }
}

export interface DashboardSummary {
  totals: {
    orders: number;
    shipments: number;
    warehouses: number;
    order_value: number;
  };
  late_orders: number;
  pipeline: Record<string, number>;
  warehouse_utilization: number;
}

export interface OrderResponse {
  columns: string[];
  rows: Array<Record<string, unknown>>;
}

export interface TableResponse<T> {
  rows: T[];
}

export interface Shipment {
  shipment_id: string;
  order_id: string;
  status: string;
  carrier: string;
  origin: string;
  destination: string;
  departed_at: string;
  estimated_delivery: string;
  tracking_events: number;
  is_expedited: boolean;
}

export interface Warehouse {
  warehouse_id: string;
  name: string;
  region: string;
  capacity: number;
  current_units: number;
  utilization: number;
  active_orders: number;
  open_positions: number;
}

export interface ForecastSettings {
  horizon_months: number;
  model: string;
  confidence_interval: number;
  seasonality: Record<string, boolean>;
  demand_drivers: string[];
  scenarios: Array<{ name: string; growth: number }>;
}

export interface ForecastOverview {
  labels: string[];
  demand: number[];
  supply: number[];
}
