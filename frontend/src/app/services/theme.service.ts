import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const THEME_KEY = 'order-to-dispatch-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly body: HTMLElement;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.body = this.document.body;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.applyLightTheme();
      return;
    }

    this.applyDarkTheme();
  }

  isDarkMode(): boolean {
    return this.body.classList.contains('dark-theme');
  }

  private applyDarkTheme(): void {
    this.body.classList.remove('light-theme');
    this.body.classList.add('dark-theme');
    localStorage.setItem(THEME_KEY, 'dark');
  }

  private applyLightTheme(): void {
    this.body.classList.remove('dark-theme');
    this.body.classList.add('light-theme');
    localStorage.setItem(THEME_KEY, 'light');
  }
}
