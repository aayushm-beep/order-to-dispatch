import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { ApiService, OrderResponse } from '../../services/api.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTooltipModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  private readonly api = inject(ApiService);

  readonly dataSource = new MatTableDataSource<Record<string, unknown>>([]);
  readonly displayedColumns = signal<string[]>([]);
  readonly statuses = signal<string[]>([]);
  readonly loading = signal<boolean>(false);
  readonly filterValue = signal<string>('');

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.configureFilter();
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadOrders(status?: string): void {
    this.loading.set(true);
    this.api.getOrders(60, status).subscribe({
      next: (response) => this.handleResponse(response),
      error: (error) => {
        console.error('Failed to load orders', error);
      },
      complete: () => this.loading.set(false)
    });
  }

  private handleResponse(response: OrderResponse): void {
    this.displayedColumns.set(response.columns);
    this.dataSource.data = response.rows;
    const uniqueStatuses = Array.from(
      new Set(response.rows.map((row) => String(row['status'] ?? '')).filter(Boolean))
    ).sort();
    this.statuses.set(uniqueStatuses);
    this.applyFilter(this.filterValue());
  }

  applyFilter(value: string): void {
    this.filterValue.set(value);
    const filterValue = value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearFilter(): void {
    this.applyFilter('');
  }

  onStatusChange(status: string): void {
    const normalized = status === 'ALL' ? undefined : status;
    this.loadOrders(normalized);
  }

  trackColumn(_: number, column: string): string {
    return column;
  }

  private configureFilter(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      if (!filter) {
        return true;
      }
      const columns = this.displayedColumns();
      return columns.some((column) => {
        const value = data[column];
        return value !== undefined && String(value).toLowerCase().includes(filter);
      });
    };
  }
}
