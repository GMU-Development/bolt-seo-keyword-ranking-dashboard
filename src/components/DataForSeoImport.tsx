import React, { useState } from 'react';
import { Download, Database, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { dataForSeoService } from '../services/dataForSeo';
import { Keyword } from '../types';

interface DataForSeoImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (keywords: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>[]) => void;
}

export const DataForSeoImport: React.FC<DataForSeoImportProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [location, setLocation] = useState('Nederland');
  const [language, setLanguage] = useState('Nederlands');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordData, setKeywordData] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<number>>(new Set());

  const locationCodes = dataForSeoService.getLocationCodes();
  const languageCodes = dataForSeoService.getLanguageCodes();

  const handleFetchKeywords = async () => {
    if (!keywordInput.trim()) {
      setError('Voer minimaal één zoekwoord in');
      return;
    }

    const keywords = keywordInput
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywords.length === 0) {
      setError('Geen geldige zoekwoorden gevonden');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationCode = locationCodes[location];
      const languageCode = languageCodes[language];

      // Fetch keyword data
      const volumeData = await dataForSeoService.getKeywordData(
        keywords,
        locationCode,
        languageCode
      );

      // Fetch difficulty data
      const difficultyData = await dataForSeoService.getKeywordDifficulty(
        keywords,
        locationCode,
        languageCode
      );

      // Combine data
      const combinedData = volumeData.map((item, index) => {
        const difficulty = difficultyData[index];
        return {
          ...item,
          keyword_difficulty: difficulty?.keyword_difficulty || 50,
        };
      });

      setKeywordData(combinedData);
      setSelectedKeywords(new Set(combinedData.map((_, index) => index)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij ophalen data');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const keywordsToImport = keywordData
      .filter((_, index) => selectedKeywords.has(index))
      .map(item => ({
        keyword: item.keyword,
        currentRank: null,
        previousRank: null,
        searchVolume: item.search_volume || 0,
        competition: item.competition_level === 'HIGH' ? 'Hoog' as const :
                    item.competition_level === 'MEDIUM' ? 'Gemiddeld' as const : 'Laag' as const,
        cpc: item.cpc || 0,
        url: '/',
        tags: [],
        difficulty: item.keyword_difficulty || 50,
        intent: 'Informatief' as const,
        location: location,
        device: 'Desktop' as const
      }));

    onImport(keywordsToImport);
    onClose();
    setKeywordData([]);
    setSelectedKeywords(new Set());
    setKeywordInput('');
  };

  const toggleKeyword = (index: number) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedKeywords(newSelected);
  };

  const selectAll = () => {
    setSelectedKeywords(new Set(keywordData.map((_, index) => index)));
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
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              DataForSEO Keyword Research
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

          {keywordData.length === 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locatie
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(locationCodes).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taal
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(languageCodes).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoekwoorden (één per regel)
                </label>
                <textarea
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder={`seo tools\nkeyword research\nwebsite optimalisatie\nzoekmachine optimalisatie`}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Voer elk zoekwoord op een nieuwe regel in. Maximum 100 zoekwoorden per keer.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">DataForSEO Data (Demo Modus)</h4>
                    <p className="text-sm text-blue-700">
                      Demo modus toont gesimuleerde zoekvolume, CPC, concurrentie niveau en keyword moeilijkheid 
                      data. Voor productie gebruik is server-side implementatie vereist.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFetchKeywords}
                disabled={loading || !keywordInput.trim()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Demo Data Genereren...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Demo Keyword Data Ophalen
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-gray-600">
                      {keywordData.length} zoekwoorden • {selectedKeywords.size} geselecteerd
                    </p>
                  </div>
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
                          checked={selectedKeywords.size === keywordData.length}
                          onChange={selectedKeywords.size === keywordData.length ? selectNone : selectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Zoekwoord
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Volume
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        CPC
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Concurrentie
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Moeilijkheid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keywordData.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedKeywords.has(index) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleKeyword(index)}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedKeywords.has(index)}
                            onChange={() => toggleKeyword(index)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {item.keyword}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.search_volume?.toLocaleString() || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          €{item.cpc?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.competition_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                            item.competition_level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.competition_level === 'HIGH' ? 'Hoog' :
                             item.competition_level === 'MEDIUM' ? 'Gemiddeld' : 'Laag'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            item.keyword_difficulty >= 70 ? 'text-red-600' :
                            item.keyword_difficulty >= 40 ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {item.keyword_difficulty || 50}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    setKeywordData([]);
                    setSelectedKeywords(new Set());
                    setKeywordInput('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nieuwe Zoekopdracht
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
        </div>
      </div>
    </div>
  );
};