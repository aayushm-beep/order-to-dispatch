import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService, ForecastSettings } from '../../services/api.service';

@Component({
  selector: 'app-forecast-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './forecast-settings.component.html',
  styleUrls: ['./forecast-settings.component.scss']
})
export class ForecastSettingsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly settings = signal<ForecastSettings | null>(null);
  readonly selectedScenario = signal<{ name: string; growth: number } | null>(null);
  readonly confidence = signal(0.9);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading.set(true);
    this.api.getForecastSettings().subscribe({
      next: (settings) => {
        this.settings.set(settings);
        this.confidence.set(settings.confidence_interval);
        this.selectedScenario.set(settings.scenarios[0]);
      },
      error: (error) => console.error('Failed to load forecast settings', error),
      complete: () => this.loading.set(false)
    });
  }

  selectScenario(name: string): void {
    const settings = this.settings();
    if (!settings) {
      return;
    }
    const scenario = settings.scenarios.find((item) => item.name === name) ?? null;
    this.selectedScenario.set(scenario);
  }

  confidenceLabel(): string {
    return `${Math.round(this.confidence() * 100)}%`;
  }
}
