export interface AuthStatus {
  dataForSeo: boolean;
  searchConsole: boolean;
  lastChecked: string;
}

class AuthManager {
  private static instance: AuthManager;
  private authStatus: AuthStatus = {
    dataForSeo: false,
    searchConsole: false,
    lastChecked: new Date().toISOString()
  };

  private constructor() {
    this.loadAuthStatus();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private loadAuthStatus(): void {
    const stored = localStorage.getItem('auth_status');
    if (stored) {
      try {
        this.authStatus = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse auth status:', error);
      }
    }
  }

  private saveAuthStatus(): void {
    this.authStatus.lastChecked = new Date().toISOString();
    localStorage.setItem('auth_status', JSON.stringify(this.authStatus));
  }

  updateDataForSeoStatus(connected: boolean): void {
    this.authStatus.dataForSeo = connected;
    this.saveAuthStatus();
  }

  updateSearchConsoleStatus(connected: boolean): void {
    this.authStatus.searchConsole = connected;
    this.saveAuthStatus();
  }

  getAuthStatus(): AuthStatus {
    return { ...this.authStatus };
  }

  isAnyServiceConnected(): boolean {
    return this.authStatus.dataForSeo || this.authStatus.searchConsole;
  }

  getAllConnectedServices(): string[] {
    const services: string[] = [];
    if (this.authStatus.dataForSeo) services.push('DataForSEO');
    if (this.authStatus.searchConsole) services.push('Search Console');
    return services;
  }

  clearAllAuth(): void {
    this.authStatus = {
      dataForSeo: false,
      searchConsole: false,
      lastChecked: new Date().toISOString()
    };
    this.saveAuthStatus();
  }
}

export const authManager = AuthManager.getInstance();