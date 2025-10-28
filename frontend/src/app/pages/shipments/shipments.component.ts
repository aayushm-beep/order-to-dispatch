import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService, Shipment } from '../../services/api.service';

@Component({
  selector: 'app-shipments-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly displayedColumns = [
    'shipment_id',
    'order_id',
    'status',
    'carrier',
    'origin',
    'destination',
    'departed_at',
    'estimated_delivery',
    'tracking_events',
    'is_expedited'
  ];
  readonly dataSource = new MatTableDataSource<Shipment>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.getShipments().subscribe({
      next: (response) => {
        this.dataSource.data = response.rows;
      },
      error: (error) => console.error('Failed to load shipments', error),
      complete: () => this.loading.set(false)
    });
  }

  chipColor(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'primary';
      case 'Out for Delivery':
        return 'accent';
      case 'Exception':
        return 'warn';
      default:
        return '';
    }
  }
}
