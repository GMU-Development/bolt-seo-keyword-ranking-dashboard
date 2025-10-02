import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Filter,
  Calendar,
  Award,
  Medal,
  Star,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Keyword } from '../types';
import { StatsCard } from './StatsCard';

interface RankingsPageProps {
  keywords: Keyword[];
}

export const RankingsPage: React.FC<RankingsPageProps> = ({ keywords }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [filterDevice, setFilterDevice] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const rankingStats = useMemo(() => {
    const rankedKeywords = keywords.filter(k => k.currentRank && k.currentRank > 0);
    
    const topThree = keywords.filter(k => k.currentRank && k.currentRank <= 3).length;
    const fourToTen = keywords.filter(k => k.currentRank && k.currentRank >= 4 && k.currentRank <= 10).length;
    const elevenToTwenty = keywords.filter(k => k.currentRank && k.currentRank >= 11 && k.currentRank <= 20).length;
    const twentyOneToFifty = keywords.filter(k => k.currentRank && k.currentRank >= 21 && k.currentRank <= 50).length;
    const fiftyOneToHundred = keywords.filter(k => k.currentRank && k.currentRank >= 51 && k.currentRank <= 100).length;
    const notRanking = keywords.filter(k => !k.currentRank || k.currentRank > 100).length;

    const improving = keywords.filter(k => 
      k.currentRank && k.previousRank && k.currentRank < k.previousRank
    ).length;
    
    const declining = keywords.filter(k => 
      k.currentRank && k.previousRank && k.currentRank > k.previousRank
    ).length;

    const stable = keywords.filter(k => 
      k.currentRank && k.previousRank && k.currentRank === k.previousRank
    ).length;

    const averageRank = rankedKeywords.length > 0 
      ? rankedKeywords.reduce((sum, k) => sum + (k.currentRank || 0), 0) / rankedKeywords.length
      : 0;

    const averageVisibility = keywords.length > 0 ? keywords.reduce((sum, k) => {
      const latestVisibility = k.history[k.history.length - 1]?.visibility || 0;
      return sum + latestVisibility;
    }, 0) / keywords.length : 0;

    return {
      topThree,
      fourToTen,
      elevenToTwenty,
      twentyOneToFifty,
      fiftyOneToHundred,
      notRanking,
      improving,
      declining,
      stable,
      averageRank: Math.round(averageRank),
      averageVisibility: Math.round(averageVisibility)
    };
  }, [keywords]);

  const filteredKeywords = keywords.filter(keyword => {
    if (filterDevice !== 'all' && keyword.device !== filterDevice) return false;
    if (filterLocation !== 'all' && keyword.location !== filterLocation) return false;
    return true;
  });

  const getRankingDistributionData = () => {
    const total = keywords.filter(k => k.currentRank || k.currentRank === null).length;
    return [
      {
        label: 'Top 3',
        count: rankingStats.topThree,
        percentage: total > 0 ? Math.round((rankingStats.topThree / total) * 100) : 0,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        icon: Trophy
      },
      {
        label: 'Positie 4-10',
        count: rankingStats.fourToTen,
        percentage: total > 0 ? Math.round((rankingStats.fourToTen / total) * 100) : 0,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        icon: Medal
      },
      {
        label: 'Positie 11-20',
        count: rankingStats.elevenToTwenty,
        percentage: total > 0 ? Math.round((rankingStats.elevenToTwenty / total) * 100) : 0,
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        icon: Star
      },
      {
        label: 'Positie 21-50',
        count: rankingStats.twentyOneToFifty,
        percentage: total > 0 ? Math.round((rankingStats.twentyOneToFifty / total) * 100) : 0,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        icon: Target
      },
      {
        label: 'Positie 51-100',
        count: rankingStats.fiftyOneToHundred,
        percentage: total > 0 ? Math.round((rankingStats.fiftyOneToHundred / total) * 100) : 0,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        icon: BarChart3
      },
      {
        label: 'Niet Gerangschikt',
        count: rankingStats.notRanking,
        percentage: total > 0 ? Math.round((rankingStats.notRanking / total) * 100) : 0,
        color: 'bg-gray-400',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        icon: Eye
      }
    ];
  };

  const getTopPerformers = () => {
    return keywords
      .filter(k => k.currentRank && k.currentRank <= 10)
      .sort((a, b) => (a.currentRank || 999) - (b.currentRank || 999))
      .slice(0, 10);
  };

  const getBiggestMovers = () => {
    return keywords
      .filter(k => k.currentRank && k.previousRank)
      .map(k => ({
        ...k,
        change: Math.abs((k.previousRank || 0) - (k.currentRank || 0)) > 0 ? (k.previousRank || 0) - (k.currentRank || 0) : 0
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .filter(k => k.change !== 0)
      .slice(0, 10);
  };

  const distributionData = getRankingDistributionData();
  const topPerformers = getTopPerformers();
  const biggestMovers = getBiggestMovers();

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Laatste 7 dagen</option>
              <option value="30d">Laatste 30 dagen</option>
              <option value="90d">Laatste 90 dagen</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Apparaten</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobiel">Mobiel</option>
            </select>
          </div>

          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle Locaties</option>
            <option value="Nederland">Nederland</option>
            <option value="België">België</option>
            <option value="Duitsland">Duitsland</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gemiddelde Ranking"
          value={rankingStats.averageRank > 0 ? rankingStats.averageRank : '-'}
          icon={Target}
          color="blue"
          subtitle="Over alle zoekwoorden"
        />
        <StatsCard
          title="Verbeterend"
          value={rankingStats.improving}
          change={{ value: rankingStats.improving, type: 'positive' }}
          icon={TrendingUp}
          color="green"
          subtitle="Rankings omhoog"
        />
        <StatsCard
          title="Dalend"
          value={rankingStats.declining}
          change={{ value: rankingStats.declining, type: 'negative' }}
          icon={TrendingDown}
          color="red"
          subtitle="Rankings omlaag"
        />
        <StatsCard
          title="Totale Zichtbaarheid"
          value={`${rankingStats.averageVisibility}%`}
          icon={Eye}
          color="purple"
          subtitle="Gemiddelde zichtbaarheid"
        />
      </div>

      {/* Ranking Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ranking Verdeling</h3>
        
        {/* Progress Bar */}
        <div className="flex rounded-lg overflow-hidden mb-6 h-4">
          {distributionData.map((segment, index) => (
            <div
              key={index}
              className={segment.color}
              style={{ width: `${segment.percentage}%` }}
              title={`${segment.label}: ${segment.count} zoekwoorden (${segment.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>

        {/* Distribution Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {distributionData.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <div key={index} className={`${segment.bgColor} rounded-lg p-4 border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${segment.textColor}`} />
                    <span className="text-sm font-medium text-gray-900">{segment.label}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{segment.count}</span>
                  <span className="text-sm text-gray-500">({segment.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performers and Biggest Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Top Presteerders</h3>
          </div>
          
          <div className="space-y-3">
            {topPerformers.map((keyword, index) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{keyword.keyword}</div>
                    <div className="text-xs text-gray-500">{keyword.searchVolume.toLocaleString()} zoekvolume</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    (keyword.currentRank || 0) <= 3 ? 'text-green-600' :
                    (keyword.currentRank || 0) <= 10 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    #{keyword.currentRank}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biggest Movers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Grootste Bewegers</h3>
          </div>
          
          <div className="space-y-3">
            {biggestMovers.map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    keyword.change > 0 ? 'bg-green-100' :
                    keyword.change < 0 ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {keyword.change > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : keyword.change < 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{keyword.keyword}</div>
                    <div className="text-xs text-gray-500">
                      {keyword.previousRank} → {keyword.currentRank}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    keyword.change > 0 ? 'text-green-600' :
                    keyword.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {keyword.change > 0 ? '+' : ''}{keyword.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};