import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService, Warehouse } from '../../services/api.service';

@Component({
  selector: 'app-warehouses-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly warehouses = signal<Warehouse[]>([]);
  readonly loading = signal(false);

  readonly displayedColumns = ['warehouse_id', 'name', 'region', 'capacity', 'current_units', 'utilization', 'active_orders', 'open_positions'];

  readonly regionSummary = computed(() => {
    const summary = new Map<string, { capacity: number; current: number; sites: number }>();
    for (const warehouse of this.warehouses()) {
      const entry = summary.get(warehouse.region) ?? { capacity: 0, current: 0, sites: 0 };
      entry.capacity += warehouse.capacity;
      entry.current += warehouse.current_units;
      entry.sites += 1;
      summary.set(warehouse.region, entry);
    }
    return Array.from(summary.entries()).map(([region, data]) => ({
      region,
      capacity: data.capacity,
      current: data.current,
      utilization: data.capacity ? data.current / data.capacity : 0,
      sites: data.sites
    }));
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.getWarehouses().subscribe({
      next: (response) => this.warehouses.set(response.rows),
      error: (error) => console.error('Failed to load warehouses', error),
      complete: () => this.loading.set(false)
    });
  }
}
