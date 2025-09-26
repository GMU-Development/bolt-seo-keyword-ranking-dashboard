export interface DataForSeoCredentials {
  login: string;
  password: string;
}

export interface DataForSeoKeywordData {
  keyword: string;
  location_code: number;
  language_code: string;
  search_volume: number;
  cpc: number;
  competition: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
  monthly_searches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
  keyword_difficulty: number;
  serp_info: {
    se_type: string;
    check_url: string;
    serp_item_types: string[];
    se_results_count: number;
  };
}

export interface DataForSeoRankingData {
  se_type: string;
  check_url: string;
  datetime: string;
  spell: any;
  refinement_chips: any;
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: Array<{
    type: string;
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    domain: string;
    title: string;
    url: string;
    breadcrumb: string;
    website_name: string;
    description: string;
    is_image: boolean;
    is_video: boolean;
    is_featured_snippet: boolean;
    is_malicious: boolean;
    is_web_story: boolean;
    amp_version: boolean;
    rating: any;
    highlighted: string[];
    links: any[];
    about_this_result: any;
    related_searches: any[];
    timestamp: string;
  }>;
}

class DataForSeoService {
  private credentials: DataForSeoCredentials | null = null;
  private baseUrl = 'https://api.dataforseo.com/v3';

  setCredentials(credentials: DataForSeoCredentials) {
    this.credentials = credentials;
    localStorage.setItem('dataforseo_credentials', JSON.stringify(credentials));
  }

  getStoredCredentials(): DataForSeoCredentials | null {
    const stored = localStorage.getItem('dataforseo_credentials');
    if (stored) {
      this.credentials = JSON.parse(stored);
      return this.credentials;
    }
    return null;
  }

  private getAuthHeaders(): HeadersInit {
    if (!this.credentials) {
      throw new Error('DataForSEO credentials niet ingesteld');
    }

    const auth = btoa(`${this.credentials.login}:${this.credentials.password}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('DataForSEO connection test failed:', error);
      return false;
    }
  }

  async getKeywordData(
    keywords: string[],
    locationCode: number = 2528, // Netherlands
    languageCode: string = 'nl'
  ): Promise<DataForSeoKeywordData[]> {
    if (!this.credentials) {
      throw new Error('DataForSEO credentials niet ingesteld');
    }

    const requestData = keywords.map(keyword => ({
      keyword,
      location_code: locationCode,
      language_code: languageCode,
    }));

    const response = await fetch(`${this.baseUrl}/keywords_data/google_ads/search_volume/live`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tasks?.[0]?.result || [];
  }

  async getKeywordDifficulty(
    keywords: string[],
    locationCode: number = 2528,
    languageCode: string = 'nl'
  ): Promise<any[]> {
    if (!this.credentials) {
      throw new Error('DataForSEO credentials niet ingesteld');
    }

    const requestData = keywords.map(keyword => ({
      keyword,
      location_code: locationCode,
      language_code: languageCode,
    }));

    const response = await fetch(`${this.baseUrl}/keywords_data/google_ads/keyword_difficulty/live`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tasks?.[0]?.result || [];
  }

  async getSerpResults(
    keyword: string,
    locationCode: number = 2528,
    languageCode: string = 'nl',
    device: 'desktop' | 'mobile' = 'desktop'
  ): Promise<DataForSeoRankingData> {
    if (!this.credentials) {
      throw new Error('DataForSEO credentials niet ingesteld');
    }

    const requestData = [{
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      device,
      os: device === 'mobile' ? 'android' : 'windows',
    }];

    const response = await fetch(`${this.baseUrl}/serp/google/organic/live/advanced`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tasks?.[0]?.result?.[0] || null;
  }

  async getRankingForDomain(
    keyword: string,
    domain: string,
    locationCode: number = 2528,
    languageCode: string = 'nl'
  ): Promise<number | null> {
    try {
      const serpData = await this.getSerpResults(keyword, locationCode, languageCode);
      
      if (!serpData?.items) {
        return null;
      }

      const domainResult = serpData.items.find(item => 
        item.domain === domain || item.url.includes(domain)
      );

      return domainResult ? domainResult.rank_absolute : null;
    } catch (error) {
      console.error('Error getting ranking for domain:', error);
      return null;
    }
  }

  async getCompetitorAnalysis(
    keywords: string[],
    targetDomain: string,
    locationCode: number = 2528
  ): Promise<any> {
    // Implementation for competitor analysis
    // This would involve multiple API calls to analyze competitor rankings
    return {};
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  disconnect(): void {
    this.credentials = null;
    localStorage.removeItem('dataforseo_credentials');
  }

  // Helper method to get location codes for different countries
  getLocationCodes(): Record<string, number> {
    return {
      'Nederland': 2528,
      'België': 2056,
      'Duitsland': 2276,
      'Frankrijk': 2250,
      'Verenigd Koninkrijk': 2826,
      'Verenigde Staten': 2840,
    };
  }

  // Helper method to get language codes
  getLanguageCodes(): Record<string, string> {
    return {
      'Nederlands': 'nl',
      'Engels': 'en',
      'Duits': 'de',
      'Frans': 'fr',
    };
  }
}

export const dataForSeoService = new DataForSeoService();