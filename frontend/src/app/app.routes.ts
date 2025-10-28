import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipmentsComponent } from './pages/shipments/shipments.component';
import { WarehousesComponent } from './pages/warehouses/warehouses.component';
import { ForecastSettingsComponent } from './pages/forecast-settings/forecast-settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'orders', component: OrdersComponent, title: 'Orders' },
  { path: 'shipments', component: ShipmentsComponent, title: 'Shipments' },
  { path: 'warehouses', component: WarehousesComponent, title: 'Warehouses' },
  {
    path: 'forecast-settings',
    component: ForecastSettingsComponent,
    title: 'Forecast Settings'
  },
  { path: '**', redirectTo: 'dashboard' }
];
