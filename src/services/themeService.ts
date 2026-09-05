export type ThemeMode = 'light' | 'dark' | 'contrast';

const STORAGE_KEY = 'twinx-theme-preference';

class ThemeService {
  private currentTheme: ThemeMode = 'light';
  private listeners: ((theme: ThemeMode) => void)[] = [];

  constructor() {
    // Read initial theme from localStorage safely
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'contrast')) {
        this.currentTheme = saved;
      }
      this.applyThemeToDOM(this.currentTheme);
    }
  }

  public getTheme(): ThemeMode {
    return this.currentTheme;
  }

  public setTheme(theme: ThemeMode) {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme);
      this.applyThemeToDOM(theme);
    }
    this.listeners.forEach((listener) => listener(theme));
  }

  public subscribe(listener: (theme: ThemeMode) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentTheme);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private applyThemeToDOM(theme: ThemeMode) {
    const root = document.documentElement;
    root.classList.remove('dark', 'contrast');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'contrast') {
      root.classList.add('contrast', 'dark');
    }
  }
}

export const themeService = new ThemeService();
