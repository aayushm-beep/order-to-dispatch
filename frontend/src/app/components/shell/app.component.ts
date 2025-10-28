import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { ThemeService } from '../../services/theme.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  readonly title = 'Order to Dispatch Dashboard';
  readonly sidenavOpened = signal(true);

  readonly navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'assignment', label: 'Orders', route: '/orders' },
    { icon: 'local_shipping', label: 'Shipments', route: '/shipments' },
    { icon: 'inventory_2', label: 'Warehouses', route: '/warehouses' },
    { icon: 'insights', label: 'Forecast Settings', route: '/forecast-settings' }
  ];

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((value) => !value);
  }
}
