import React, { useState, useEffect } from 'react';
import { Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { searchConsoleService } from '../services/searchConsole';
import { SearchConsoleData, Keyword } from '../types';

interface ImportKeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (keywords: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>[]) => void;
}

export const ImportKeywordsModal: React.FC<ImportKeywordsModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchConsoleData, setSearchConsoleData] = useState<SearchConsoleData[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen && searchConsoleService.isAuthenticated()) {
      fetchKeywords();
    }
  }, [isOpen]);

  const fetchKeywords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchConsoleService.fetchKeywords(
        dateRange.startDate,
        dateRange.endDate,
        1000
      );
      
      // Group by query and aggregate data
      const aggregatedData = data.reduce((acc, item) => {
        if (!acc[item.query]) {
          acc[item.query] = {
            query: item.query,
            clicks: 0,
            impressions: 0,
            ctr: 0,
            position: 0,
            page: item.page,
            count: 0
          };
        }
        
        acc[item.query].clicks += item.clicks;
        acc[item.query].impressions += item.impressions;
        acc[item.query].position += item.position;
        acc[item.query].count += 1;
        
        return acc;
      }, {} as Record<string, SearchConsoleData & { count: number }>);

      // Calculate averages and format data
      const formattedData = Object.values(aggregatedData).map(item => ({
        query: item.query,
        clicks: item.clicks,
        impressions: item.impressions,
        ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0,
        position: Math.round(item.position / item.count),
        page: item.page
      }));

      // Sort by impressions descending
      formattedData.sort((a, b) => b.impressions - a.impressions);
      
      setSearchConsoleData(formattedData);
      
      // Auto-select top performing keywords
      const topKeywords = formattedData
        .slice(0, 50)
        .map(item => item.query);
      setSelectedKeywords(new Set(topKeywords));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const keywordsToImport = searchConsoleData
      .filter(item => selectedKeywords.has(item.query))
      .map(item => ({
        keyword: item.query,
        currentRank: item.position,
        previousRank: null,
        searchVolume: item.impressions,
        competition: item.position <= 10 ? 'High' as const : 
                    item.position <= 30 ? 'Medium' as const : 'Low' as const,
        cpc: 0, // Search Console doesn't provide CPC data
        url: item.page
      }));

    onImport(keywordsToImport);
    onClose();
  };

  const toggleKeyword = (query: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(query)) {
      newSelected.delete(query);
    } else {
      newSelected.add(query);
    }
    setSelectedKeywords(newSelected);
  };

  const selectAll = () => {
    setSelectedKeywords(new Set(searchConsoleData.map(item => item.query)));
  };

  const selectNone = () => {
    setSelectedKeywords(new Set());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Importeer Zoekwoorden van Search Console
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Startdatum
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Einddatum
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchKeywords}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Ophalen...' : 'Gegevens Ophalen'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Zoekwoorden ophalen van Search Console...</p>
            </div>
          )}

          {!loading && searchConsoleData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    {searchConsoleData.length} zoekwoorden gevonden • {selectedKeywords.size} geselecteerd
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Alles Selecteren
                    </button>
                    <button
                      onClick={selectNone}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Niets Selecteren
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <input
                          type="checkbox"
                          checked={selectedKeywords.size === searchConsoleData.length}
                          onChange={selectedKeywords.size === searchConsoleData.length ? selectNone : selectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Zoekwoord
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Positie
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vertoningen
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Klikken
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchConsoleData.map((item) => (
                      <tr
                        key={item.query}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedKeywords.has(item.query) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleKeyword(item.query)}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedKeywords.has(item.query)}
                            onChange={() => toggleKeyword(item.query)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {item.query}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            item.position <= 3 ? 'text-green-600' :
                            item.position <= 10 ? 'text-blue-600' :
                            item.position <= 20 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {item.position}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.impressions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.clicks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.ctr.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleImport}
                  disabled={selectedKeywords.size === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Importeer {selectedKeywords.size} Zoekwoorden
                </button>
              </div>
            </div>
          )}

          {!loading && searchConsoleData.length === 0 && !error && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Geen Gegevens Gevonden</h3>
              <p className="text-gray-500">
                Geen zoekwoord gegevens gevonden voor het geselecteerde datumbereik. Probeer de datums aan te passen of controleer uw Search Console instellingen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};