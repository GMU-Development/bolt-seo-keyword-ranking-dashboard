import { SearchConsoleData, SearchConsoleCredentials } from '../types';
import { authManager } from './authManager';

class SearchConsoleService {
  private credentials: SearchConsoleCredentials | null = null;
  private accessToken: string | null = null;

  setCredentials(credentials: SearchConsoleCredentials) {
    this.credentials = credentials;
    localStorage.setItem('gsc_credentials', JSON.stringify(credentials));
    authManager.updateSearchConsoleStatus(true);
  }

  getStoredCredentials(): SearchConsoleCredentials | null {
    const stored = localStorage.getItem('gsc_credentials');
    if (stored) {
      this.credentials = JSON.parse(stored);
      return this.credentials;
    }
    return null;
  }

  async authenticate(): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.credentials.clientId);
    authUrl.searchParams.set('redirect_uri', this.credentials.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/webmasters.readonly');
    authUrl.searchParams.set('access_type', 'offline');

    return authUrl.toString();
  }

  async exchangeCodeForToken(code: string): Promise<void> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.credentials.redirectUri,
      }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      localStorage.setItem('gsc_access_token', data.access_token);
      
      if (data.refresh_token) {
        localStorage.setItem('gsc_refresh_token', data.refresh_token);
      }
    } else {
      throw new Error('Failed to get access token');
    }
  }

  getStoredToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('gsc_access_token');
    }
    return this.accessToken;
  }

  async fetchKeywords(
    startDate: string = '2024-01-01',
    endDate: string = new Date().toISOString().split('T')[0],
    rowLimit: number = 1000
  ): Promise<SearchConsoleData[]> {
    const token = this.getStoredToken();
    if (!token || !this.credentials) {
      throw new Error('Not authenticated');
    }

    const requestBody = {
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit,
      startRow: 0,
    };

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.credentials.siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken();
        return this.fetchKeywords(startDate, endDate, rowLimit);
      }
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.rows?.map((row: any) => ({
      query: row.keys[0],
      page: row.keys[1],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: Math.round(row.position),
    })) || [];
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('gsc_refresh_token');
    if (!refreshToken || !this.credentials) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      localStorage.setItem('gsc_access_token', data.access_token);
    } else {
      throw new Error('Failed to refresh token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  disconnect(): void {
    this.accessToken = null;
    this.credentials = null;
    localStorage.removeItem('gsc_access_token');
    localStorage.removeItem('gsc_refresh_token');
    localStorage.removeItem('gsc_credentials');
    authManager.updateSearchConsoleStatus(false);
  }
}

export const searchConsoleService = new SearchConsoleService();