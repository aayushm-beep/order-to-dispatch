import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

import { ApiService, DashboardSummary, ForecastOverview } from '../../services/api.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatChipsModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly overview = signal<ForecastOverview | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    forkJoin({
      summary: this.api.getDashboard(),
      overview: this.api.getForecastOverview()
    }).subscribe({
      next: ({ summary, overview }) => {
        this.summary.set(summary);
        this.overview.set(overview);
      },
      error: (err) => {
        console.error('Failed loading dashboard data', err);
      },
      complete: () => this.loading.set(false)
    });
  }

  pipelineEntries(summary: DashboardSummary | null): Array<[string, number]> {
    if (!summary) {
      return [];
    }
    return Object.entries(summary.pipeline);
  }
}
