import React, { useState } from 'react';
import { X, ExternalLink, Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { dataForSeoService } from '../services/dataForSeo';

interface DataForSeoSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const DataForSeoSetup: React.FC<DataForSeoSetupProps> = ({ 
  isOpen, 
  onClose, 
  onConnected 
}) => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: ''
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    if (!credentials.login || !credentials.password) {
      setError('Vul alle velden in');
      return;
    }

    setTesting(true);
    setError(null);
    setTestResult(null);

    try {
      dataForSeoService.setCredentials(credentials);
      const isConnected = await dataForSeoService.testConnection();
      
      if (isConnected) {
        setTestResult('success');
        setTimeout(() => {
          onConnected();
          onClose();
        }, 1500);
      } else {
        setTestResult('error');
        setError('Verbinding mislukt. Controleer uw inloggegevens.');
      }
    } catch (err) {
      setTestResult('error');
      setError(err instanceof Error ? err.message : 'Onbekende fout opgetreden');
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              DataForSEO API Koppelen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">
                  Over DataForSEO API
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  DataForSEO biedt professionele SEO data inclusief zoekvolumes, keyword moeilijkheid, 
                  SERP resultaten en concurrentie analyse voor meer dan 200 landen.
                </p>
                <div className="bg-white rounded p-3 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Wat krijg je:</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Realtime zoekvolume data</li>
                    <li>Keyword moeilijkheidsscores</li>
                    <li>SERP positie tracking</li>
                    <li>Concurrentie analyse</li>
                    <li>Historische trends</li>
                    <li>Lokale SEO data voor Nederland</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Account Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">API Toegang Instellen</h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">Account Vereist</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Je hebt een DataForSEO account nodig om de API te gebruiken. 
                    Ze bieden een gratis trial met $1 credit.
                  </p>
                  <a
                    href="https://app.dataforseo.com/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Maak een DataForSEO Account
                  </a>
                </div>
              </div>
            </div>

            {/* Credentials Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Login (Email)
                </label>
                <input
                  type="email"
                  value={credentials.login}
                  onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
                  placeholder="jouw-email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Wachtwoord
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Jouw API wachtwoord"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vind je API credentials in je DataForSEO dashboard onder "API Access"
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {testResult === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700">
                  Verbinding succesvol! DataForSEO API is nu gekoppeld.
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Hoe vind je je API credentials:</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>
                  Log in op <a href="https://app.dataforseo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    app.dataforseo.com
                  </a>
                </li>
                <li>Ga naar "API Dashboard" in het hoofdmenu</li>
                <li>Klik op "API Access" of "Credentials"</li>
                <li>Kopieer je Login (email) en Password</li>
                <li>Plak ze in de velden hierboven</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleTestConnection}
              disabled={!credentials.login || !credentials.password || testing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Verbinding Testen...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Verbinden & Testen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};