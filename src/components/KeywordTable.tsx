import React, { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Filter, Tag, Eye } from 'lucide-react';
import { Keyword } from '../types';

interface KeywordTableProps {
  keywords: Keyword[];
  onEditKeyword: (keyword: Keyword) => void;
}

export const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, onEditKeyword }) => {
  const [sortBy, setSortBy] = useState<'rank' | 'volume' | 'difficulty' | 'visibility'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');

  const getRankChange = (current: number | null, previous: number | null) => {
    if (!current || !previous) return { type: 'neutral', value: 0 };
    const change = previous - current; // Lower rank number is better
    return {
      type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
      value: Math.abs(change)
    };
  };

  const getRankColor = (rank: number | null) => {
    if (!rank) return 'text-gray-400';
    if (rank <= 3) return 'text-green-600 font-semibold';
    if (rank <= 10) return 'text-blue-600 font-medium';
    if (rank <= 20) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'bg-green-100 text-green-800';
    if (difficulty <= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Informational': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-purple-100 text-purple-800';
      case 'Transactional': return 'bg-green-100 text-green-800';
      case 'Navigational': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredKeywords = keywords.filter(keyword => {
    if (filterIntent !== 'all' && keyword.intent !== filterIntent) return false;
    if (filterDevice !== 'all' && keyword.device !== filterDevice) return false;
    return true;
  });

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'rank':
        aValue = a.currentRank || 999;
        bValue = b.currentRank || 999;
        break;
      case 'volume':
        aValue = a.searchVolume;
        bValue = b.searchVolume;
        break;
      case 'difficulty':
        aValue = a.difficulty;
        bValue = b.difficulty;
        break;
      case 'visibility':
        aValue = a.history[a.history.length - 1]?.visibility || 0;
        bValue = b.history[b.history.length - 1]?.visibility || 0;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Keywords Performance</h2>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Alle Intenties</option>
                <option value="Informatief">Informatief</option>
                <option value="Commercieel">Commercieel</option>
                <option value="Transactioneel">Transactioneel</option>
                <option value="Navigatie">Navigatie</option>
              </select>
            </div>
            
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Apparaten</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobiel">Mobiel</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zoekwoord
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center gap-1">
                  Huidige Ranking
                  {sortBy === 'rank' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verandering
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('visibility')}
              >
                <div className="flex items-center gap-1">
                  Zichtbaarheid
                  {sortBy === 'visibility' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center gap-1">
                  Zoekvolume
                  {sortBy === 'volume' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('difficulty')}
              >
                <div className="flex items-center gap-1">
                  Moeilijkheid
                  {sortBy === 'difficulty' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intentie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedKeywords.map((keyword) => {
              const rankChange = getRankChange(keyword.currentRank, keyword.previousRank);
              const currentVisibility = keyword.history[keyword.history.length - 1]?.visibility || 0;
              
              return (
                <tr 
                  key={keyword.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => onEditKeyword(keyword)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {keyword.keyword}
                      </div>
                      <div className="flex items-center gap-2">
                        {keyword.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {keyword.device} • {keyword.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-medium ${getRankColor(keyword.currentRank)}`}>
                      {keyword.currentRank || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {rankChange.type === 'positive' && (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">+{rankChange.value}</span>
                        </>
                      )}
                      {rankChange.type === 'negative' && (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-600">-{rankChange.value}</span>
                        </>
                      )}
                      {rankChange.type === 'neutral' && (
                        <>
                          <Minus className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">0</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {currentVisibility.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {keyword.searchVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                      {keyword.difficulty}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntentColor(keyword.intent)}`}>
                      {keyword.intent}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {keyword.url}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};