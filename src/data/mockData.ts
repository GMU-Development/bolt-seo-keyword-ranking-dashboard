import { Keyword, CompetitorData, Project, RankDistribution } from '../types';

export const mockKeywords: Keyword[] = [
  {
    id: '1',
    keyword: 'react dashboard template',
    currentRank: 3,
    previousRank: 5,
    searchVolume: 8100,
    competition: 'Hoog',
    cpc: 2.45,
    url: '/dashboard',
    dateAdded: '2024-01-15',
    lastUpdated: '2024-01-20',
    tags: ['dashboard', 'react'],
    difficulty: 75,
    intent: 'Commercieel',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 8, serp: 'desktop', visibility: 12.5 },
      { date: '2024-01-16', rank: 7, serp: 'desktop', visibility: 14.3 },
      { date: '2024-01-17', rank: 5, serp: 'desktop', visibility: 20.0 },
      { date: '2024-01-18', rank: 4, serp: 'desktop', visibility: 25.0 },
      { date: '2024-01-19', rank: 4, serp: 'desktop', visibility: 25.0 },
      { date: '2024-01-20', rank: 3, serp: 'desktop', visibility: 33.3 },
    ]
  },
  {
    id: '2',
    keyword: 'typescript tutorial',
    currentRank: 12,
    previousRank: 18,
    searchVolume: 12400,
    competition: 'Gemiddeld',
    cpc: 1.85,
    url: '/tutorials/typescript',
    dateAdded: '2024-01-10',
    lastUpdated: '2024-01-20',
    tags: ['tutorial', 'typescript'],
    difficulty: 65,
    intent: 'Informatief',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 25, serp: 'desktop', visibility: 4.0 },
      { date: '2024-01-16', rank: 22, serp: 'desktop', visibility: 4.5 },
      { date: '2024-01-17', rank: 18, serp: 'desktop', visibility: 5.6 },
      { date: '2024-01-18', rank: 15, serp: 'desktop', visibility: 6.7 },
      { date: '2024-01-19', rank: 14, serp: 'desktop', visibility: 7.1 },
      { date: '2024-01-20', rank: 12, serp: 'desktop', visibility: 8.3 },
    ]
  },
  {
    id: '3',
    keyword: 'web development services',
    currentRank: 2,
    previousRank: 4,
    searchVolume: 5900,
    competition: 'Hoog',
    cpc: 4.20,
    url: '/services',
    dateAdded: '2024-01-08',
    lastUpdated: '2024-01-20',
    tags: ['services', 'web-dev'],
    difficulty: 82,
    intent: 'Commercieel',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 6, serp: 'desktop', visibility: 16.7 },
      { date: '2024-01-16', rank: 5, serp: 'desktop', visibility: 20.0 },
      { date: '2024-01-17', rank: 4, serp: 'desktop', visibility: 25.0 },
      { date: '2024-01-18', rank: 3, serp: 'desktop', visibility: 33.3 },
      { date: '2024-01-19', rank: 2, serp: 'desktop', visibility: 50.0 },
      { date: '2024-01-20', rank: 2, serp: 'desktop', visibility: 50.0 },
    ]
  },
  {
    id: '4',
    keyword: 'seo optimization tips',
    currentRank: 8,
    previousRank: 11,
    searchVolume: 3200,
    competition: 'Gemiddeld',
    cpc: 3.10,
    url: '/blog/seo-tips',
    dateAdded: '2024-01-12',
    lastUpdated: '2024-01-20',
    tags: ['seo', 'tips'],
    difficulty: 58,
    intent: 'Informatief',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 15, serp: 'desktop', visibility: 6.7 },
      { date: '2024-01-16', rank: 13, serp: 'desktop', visibility: 7.7 },
      { date: '2024-01-17', rank: 11, serp: 'desktop', visibility: 9.1 },
      { date: '2024-01-18', rank: 10, serp: 'desktop', visibility: 10.0 },
      { date: '2024-01-19', rank: 9, serp: 'desktop', visibility: 11.1 },
      { date: '2024-01-20', rank: 8, serp: 'desktop', visibility: 12.5 },
    ]
  },
  {
    id: '5',
    keyword: 'mobile app development',
    currentRank: 25,
    previousRank: 28,
    searchVolume: 18600,
    competition: 'Hoog',
    cpc: 5.75,
    url: '/mobile-development',
    dateAdded: '2024-01-05',
    lastUpdated: '2024-01-20',
    tags: ['mobile', 'development'],
    difficulty: 88,
    intent: 'Commercieel',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 35, serp: 'desktop', visibility: 2.9 },
      { date: '2024-01-16', rank: 32, serp: 'desktop', visibility: 3.1 },
      { date: '2024-01-17', rank: 30, serp: 'desktop', visibility: 3.3 },
      { date: '2024-01-18', rank: 28, serp: 'desktop', visibility: 3.6 },
      { date: '2024-01-19', rank: 26, serp: 'desktop', visibility: 3.8 },
      { date: '2024-01-20', rank: 25, serp: 'desktop', visibility: 4.0 },
    ]
  },
  {
    id: '6',
    keyword: 'best seo tools',
    currentRank: 1,
    previousRank: 2,
    searchVolume: 9800,
    competition: 'Hoog',
    cpc: 6.50,
    url: '/tools/seo',
    dateAdded: '2024-01-01',
    lastUpdated: '2024-01-20',
    tags: ['seo', 'tools'],
    difficulty: 92,
    intent: 'Commercieel',
    location: 'Nederland',
    device: 'Desktop',
    history: [
      { date: '2024-01-15', rank: 3, serp: 'desktop', visibility: 33.3 },
      { date: '2024-01-16', rank: 2, serp: 'desktop', visibility: 50.0 },
      { date: '2024-01-17', rank: 2, serp: 'desktop', visibility: 50.0 },
      { date: '2024-01-18', rank: 1, serp: 'desktop', visibility: 100.0 },
      { date: '2024-01-19', rank: 1, serp: 'desktop', visibility: 100.0 },
      { date: '2024-01-20', rank: 1, serp: 'desktop', visibility: 100.0 },
    ]
  }
];

export const mockCompetitors: CompetitorData[] = [
  {
    id: '1',
    domain: 'competitor1.com',
    keywords: 1250,
    averageRank: 15.2,
    visibility: 68.5,
    estimatedTraffic: 45200
  },
  {
    id: '2',
    domain: 'competitor2.com',
    keywords: 980,
    averageRank: 18.7,
    visibility: 52.3,
    estimatedTraffic: 32100
  },
  {
    id: '3',
    domain: 'competitor3.com',
    keywords: 1450,
    averageRank: 12.8,
    visibility: 75.2,
    estimatedTraffic: 58900
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Main Website',
    domain: 'example.com',
    location: 'United States',
    searchEngine: 'Google',
    createdAt: '2024-01-01',
    keywords: 156,
    visibility: 72.5
  },
  {
    id: '2',
    name: 'Blog Subdomain',
    domain: 'blog.example.com',
    location: 'United States',
    searchEngine: 'Google',
    createdAt: '2024-01-15',
    keywords: 89,
    visibility: 45.2
  }
];

export const mockRankDistribution: RankDistribution = {
  topThree: 12,
  fourToTen: 28,
  elevenToTwenty: 35,
  twentyOneToFifty: 45,
  fiftyOneToHundred: 25,
  notRanking: 11
};