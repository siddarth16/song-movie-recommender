import { Seed, Domain, AppState } from '@/types';

const STORAGE_KEY = 'recommend-app-state';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  state: AppState;
}

const defaultState: AppState = {
  lastSeeds: {
    songs: [],
    movies: [],
    tvshows: []
  },
  lastCount: 10,
  theme: 'light'
};

export class Storage {
  private static instance: Storage;
  private state: AppState;

  private constructor() {
    this.state = this.loadState();
  }

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private loadState(): AppState {
    try {
      if (typeof window === 'undefined') {
        return { ...defaultState };
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...defaultState };
      }

      const data: StorageData = JSON.parse(stored);
      
      // Check version and migrate if needed
      if (data.version !== STORAGE_VERSION) {
        console.log('Storage version mismatch, resetting to default');
        return { ...defaultState };
      }

      // Validate and merge with defaults
      return {
        lastSeeds: {
          songs: Array.isArray(data.state.lastSeeds?.songs) ? data.state.lastSeeds.songs : [],
          movies: Array.isArray(data.state.lastSeeds?.movies) ? data.state.lastSeeds.movies : [],
          tvshows: Array.isArray(data.state.lastSeeds?.tvshows) ? data.state.lastSeeds.tvshows : []
        },
        lastCount: typeof data.state.lastCount === 'number' ? 
                   Math.max(1, Math.min(20, data.state.lastCount)) : 10,
        theme: data.state.theme === 'dark' ? 'dark' : 'light'
      };
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
      return { ...defaultState };
    }
  }

  private saveState(): void {
    try {
      if (typeof window === 'undefined') return;

      const data: StorageData = {
        version: STORAGE_VERSION,
        state: this.state
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  getLastSeeds(domain: Domain): Seed[] {
    return [...this.state.lastSeeds[domain]];
  }

  setLastSeeds(domain: Domain, seeds: Seed[]): void {
    this.state.lastSeeds[domain] = seeds.slice(0, 5); // Limit to 5 seeds
    this.saveState();
  }

  getLastCount(): number {
    return this.state.lastCount;
  }

  setLastCount(count: number): void {
    this.state.lastCount = Math.max(1, Math.min(20, count));
    this.saveState();
  }

  getTheme(): 'light' | 'dark' {
    return this.state.theme;
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.state.theme = theme;
    this.saveState();
  }

  reset(): void {
    this.state = { ...defaultState };
    this.saveState();
  }

  // Get all state for debugging
  getState(): AppState {
    return { ...this.state };
  }
}

// Singleton instance
export const storage = Storage.getInstance();