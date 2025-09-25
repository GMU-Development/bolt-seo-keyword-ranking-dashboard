export interface Keyword {
  id: string;
  keyword: string;
  currentRank: number | null;
  previousRank: number | null;
  searchVolume: number;
  competition: 'Laag' | 'Gemiddeld' | 'Hoog';
  cpc: number;
  url: string;
  dateAdded: string;
  lastUpdated: string;
  history: RankingHistory[];
  tags: string[];
  difficulty: number;
  intent: 'Informatief' | 'Commercieel' | 'Transactioneel' | 'Navigatie';
  location: string;
  device: 'Desktop' | 'Mobiel';
}

export interface RankingHistory {
  date: string;
  rank: number | null;
  serp: string;
  visibility: number;
}

export interface DashboardStats {
  totalKeywords: number;
  averageRank: number;
  improvingKeywords: number;
  decliningKeywords: number;
  topThreeKeywords: number;
  topTenKeywords: number;
  visibilityScore: number;
  estimatedTraffic: number;
}

export interface SearchConsoleData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  page: string;
}

export interface SearchConsoleCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  siteUrl: string;
}

export interface CompetitorData {
  id: string;
  domain: string;
  keywords: number;
  averageRank: number;
  visibility: number;
  estimatedTraffic: number;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  location: string;
  searchEngine: string;
  createdAt: string;
  keywords: number;
  visibility: number;
}

export interface RankDistribution {
  topThree: number;
  fourToTen: number;
  elevenToTwenty: number;
  twentyOneToFifty: number;
  fiftyOneToHundred: number;
  notRanking: number;
}