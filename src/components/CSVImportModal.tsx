import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Keyword } from '../types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (keywords: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>[]) => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<number>>(new Set());

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '').trim()));
        const headers = rows[0];
        
        // Expected headers from Search Console export
        const expectedHeaders = ['Query', 'Clicks', 'Impressions', 'CTR', 'Position'];
        const hasValidHeaders = expectedHeaders.every(header => 
          headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
        );

        if (!hasValidHeaders) {
          setError('Invalid CSV format. Please export from Google Search Console with Query, Clicks, Impressions, CTR, and Position columns.');
          return;
        }

        const data = rows.slice(1).filter(row => row.length >= 5 && row[0]).map((row, index) => ({
          index,
          query: row[0],
          clicks: parseInt(row[1]) || 0,
          impressions: parseInt(row[2]) || 0,
          ctr: parseFloat(row[3]) || 0,
          position: Math.round(parseFloat(row[4]) || 0)
        }));

        setCsvData(data);
        setSelectedKeywords(new Set(data.map((_, index) => index)));
        setError(null);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
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
    setSelectedKeywords(new Set(csvData.map((_, index) => index)));
  };

  const selectNone = () => {
    setSelectedKeywords(new Set());
  };

  const handleImport = () => {
    const keywordsToImport = csvData
      .filter((_, index) => selectedKeywords.has(index))
      .map(item => ({
        keyword: item.query,
        currentRank: item.position,
        previousRank: null,
        searchVolume: item.impressions,
        competition: item.position <= 10 ? 'High' as const : 
                    item.position <= 30 ? 'Medium' as const : 'Low' as const,
        cpc: 0,
        url: '/'
      }));

    onImport(keywordsToImport);
    onClose();
    setCsvData([]);
    setSelectedKeywords(new Set());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Upload className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Import Keywords from CSV
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

          {csvData.length === 0 ? (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Hoe te Exporteren vanuit Search Console</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Ga naar <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Search Console</a></li>
                  <li>Navigeer naar Prestaties → Zoekresultaten</li>
                  <li>Stel uw gewenste datumbereik in</li>
                  <li>Klik op de Exporteren knop en selecteer "CSV downloaden"</li>
                  <li>Upload het gedownloade bestand hier</li>
                </ol>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sleep uw CSV bestand hierheen
                </h3>
                <p className="text-gray-500 mb-4">
                  of klik om een bestand te selecteren
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Kies Bestand
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-gray-600">
                      {csvData.length} zoekwoorden gevonden • {selectedKeywords.size} geselecteerd
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
                          checked={selectedKeywords.size === csvData.length}
                          onChange={selectedKeywords.size === csvData.length ? selectNone : selectAll}
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
                    {csvData.map((item, index) => (
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
        </div>
      </div>
    </div>
  );
};