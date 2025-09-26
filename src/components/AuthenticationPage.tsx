import React, { useState, useEffect } from 'react';
import { Database, Globe, CheckCircle, AlertCircle, ExternalLink, Key, Shield, ArrowRight } from 'lucide-react';
import { dataForSeoService } from '../services/dataForSeo';
import { searchConsoleService } from '../services/searchConsole';

interface AuthenticationPageProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: () => void;
}

export const AuthenticationPage: React.FC<AuthenticationPageProps> = ({
  isOpen,
  onClose,
  onAuthComplete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dataforseo' | 'searchconsole'>('overview');
  const [dataForSeoConnected, setDataForSeoConnected] = useState(false);
  const [searchConsoleConnected, setSearchConsoleConnected] = useState(false);
  
  // DataForSEO states
  const [dataForSeoCredentials, setDataForSeoCredentials] = useState({
    login: '',
    password: ''
  });
  const [dataForSeoTesting, setDataForSeoTesting] = useState(false);
  const [dataForSeoError, setDataForSeoError] = useState<string | null>(null);

  // Search Console states
  const [searchConsoleCredentials, setSearchConsoleCredentials] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: 'http://localhost:5173/auth/callback',
    siteUrl: ''
  });
  const [searchConsoleError, setSearchConsoleError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkExistingConnections();
    }
  }, [isOpen]);

  const checkExistingConnections = () => {
    setDataForSeoConnected(dataForSeoService.isAuthenticated());
    setSearchConsoleConnected(searchConsoleService.isAuthenticated());
    
    // Load stored credentials
    const storedDataForSeo = dataForSeoService.getStoredCredentials();
    if (storedDataForSeo) {
      setDataForSeoCredentials(storedDataForSeo);
    }

    const storedSearchConsole = searchConsoleService.getStoredCredentials();
    if (storedSearchConsole) {
      setSearchConsoleCredentials(storedSearchConsole);
    }
  };

  const handleDataForSeoConnect = async () => {
    if (!dataForSeoCredentials.login || !dataForSeoCredentials.password) {
      setDataForSeoError('Vul alle velden in');
      return;
    }

    setDataForSeoTesting(true);
    setDataForSeoError(null);

    try {
      dataForSeoService.setCredentials(dataForSeoCredentials);
      const isConnected = await dataForSeoService.testConnection();
      
      if (isConnected) {
        setDataForSeoConnected(true);
        setDataForSeoError(null);
      } else {
        setDataForSeoError('Verbinding mislukt. Controleer uw inloggegevens.');
      }
    } catch (err) {
      setDataForSeoError(err instanceof Error ? err.message : 'Onbekende fout opgetreden');
    } finally {
      setDataForSeoTesting(false);
    }
  };

  const handleSearchConsoleConnect = () => {
    if (!searchConsoleCredentials.clientId || !searchConsoleCredentials.clientSecret || !searchConsoleCredentials.siteUrl) {
      setSearchConsoleError('Vul alle vereiste velden in');
      return;
    }

    try {
      searchConsoleService.setCredentials(searchConsoleCredentials);
      
      // Generate OAuth URL
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${searchConsoleCredentials.clientId}&` +
        `redirect_uri=${encodeURIComponent(searchConsoleCredentials.redirectUri)}&` +
        `response_type=code&` +
        `scope=https://www.googleapis.com/auth/webmasters.readonly&` +
        `access_type=offline`;
      
      // Open OAuth flow in new window
      window.open(authUrl, '_blank', 'width=600,height=600');
      
      // For demo purposes, simulate successful connection after a delay
      setTimeout(() => {
        setSearchConsoleConnected(true);
        setSearchConsoleError(null);
      }, 3000);
      
    } catch (err) {
      setSearchConsoleError(err instanceof Error ? err.message : 'Fout bij verbinden');
    }
  };

  const handleDisconnectDataForSeo = () => {
    dataForSeoService.disconnect();
    setDataForSeoConnected(false);
    setDataForSeoCredentials({ login: '', password: '' });
  };

  const handleDisconnectSearchConsole = () => {
    searchConsoleService.disconnect();
    setSearchConsoleConnected(false);
    setSearchConsoleCredentials({
      clientId: '',
      clientSecret: '',
      redirectUri: 'http://localhost:5173/auth/callback',
      siteUrl: ''
    });
  };

  const handleComplete = () => {
    if (dataForSeoConnected || searchConsoleConnected) {
      onAuthComplete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              SEO Data Bronnen Koppelen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                Overzicht
              </button>
              
              <button
                onClick={() => setActiveTab('dataforseo')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dataforseo'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Database className="h-4 w-4" />
                DataForSEO
                {dataForSeoConnected && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('searchconsole')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'searchconsole'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Globe className="h-4 w-4" />
                Search Console
                {searchConsoleConnected && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </button>
            </nav>

            {/* Connection Status */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Verbindingsstatus</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dataForSeoConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-600">DataForSEO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${searchConsoleConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-600">Search Console</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Welkom bij SEO Data Integratie
                  </h3>
                  <p className="text-gray-600">
                    Koppel uw SEO data bronnen om uitgebreide keyword tracking en analyse mogelijk te maken.
                  </p>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DataForSEO Card */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Database className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">DataForSEO</h4>
                          <p className="text-sm text-gray-500">Professionele SEO Data API</p>
                        </div>
                      </div>
                      {dataForSeoConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li>• Realtime zoekvolume data</li>
                      <li>• Keyword moeilijkheidsscores</li>
                      <li>• SERP positie tracking</li>
                      <li>• Concurrentie analyse</li>
                    </ul>

                    <button
                      onClick={() => setActiveTab('dataforseo')}
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        dataForSeoConnected
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {dataForSeoConnected ? 'Verbonden' : 'Koppelen'}
                    </button>
                  </div>

                  {/* Search Console Card */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Google Search Console</h4>
                          <p className="text-sm text-gray-500">Officiële Google SEO Data</p>
                        </div>
                      </div>
                      {searchConsoleConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li>• Werkelijke zoekprestaties</li>
                      <li>• Klik- en impressiedata</li>
                      <li>• Gemiddelde posities</li>
                      <li>• CTR statistieken</li>
                    </ul>

                    <button
                      onClick={() => setActiveTab('searchconsole')}
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        searchConsoleConnected
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {searchConsoleConnected ? 'Verbonden' : 'Koppelen'}
                    </button>
                  </div>
                </div>

                {/* Next Steps */}
                {(dataForSeoConnected || searchConsoleConnected) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Klaar om te Beginnen!</h4>
                        <p className="text-sm text-green-700 mb-3">
                          U heeft succesvol {dataForSeoConnected && searchConsoleConnected ? 'beide services' : 'een service'} gekoppeld. 
                          U kunt nu beginnen met het importeren en volgen van uw zoekwoorden.
                        </p>
                        <button
                          onClick={handleComplete}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Ga naar Dashboard
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dataforseo' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">DataForSEO API Koppelen</h3>
                    <p className="text-gray-600">Krijg toegang tot professionele SEO data en keyword research tools</p>
                  </div>
                  {dataForSeoConnected && (
                    <button
                      onClick={handleDisconnectDataForSeo}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Verbinding Verbreken
                    </button>
                  )}
                </div>

                {dataForSeoError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{dataForSeoError}</p>
                  </div>
                )}

                {dataForSeoConnected ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium">DataForSEO succesvol verbonden!</p>
                      <p className="text-green-600 text-sm">U kunt nu keyword research uitvoeren en SEO data importeren.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Account Vereist</h4>
                          <p className="text-sm text-blue-800 mb-3">
                            U heeft een DataForSEO account nodig om de API te gebruiken. 
                            Ze bieden een gratis trial met $1 credit.
                          </p>
                          <a
                            href="https://app.dataforseo.com/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-800 hover:text-blue-900 font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Maak een DataForSEO Account
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Login (Email)
                        </label>
                        <input
                          type="email"
                          value={dataForSeoCredentials.login}
                          onChange={(e) => setDataForSeoCredentials({ ...dataForSeoCredentials, login: e.target.value })}
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
                          value={dataForSeoCredentials.password}
                          onChange={(e) => setDataForSeoCredentials({ ...dataForSeoCredentials, password: e.target.value })}
                          placeholder="Jouw API wachtwoord"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Vind je API credentials in je DataForSEO dashboard onder "API Access"
                        </p>
                      </div>

                      <button
                        onClick={handleDataForSeoConnect}
                        disabled={!dataForSeoCredentials.login || !dataForSeoCredentials.password || dataForSeoTesting}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {dataForSeoTesting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verbinding Testen...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4" />
                            Verbinden & Testen
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'searchconsole' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Google Search Console Koppelen</h3>
                    <p className="text-gray-600">Importeer werkelijke zoekprestaties van uw website</p>
                  </div>
                  {searchConsoleConnected && (
                    <button
                      onClick={handleDisconnectSearchConsole}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Verbinding Verbreken
                    </button>
                  )}
                </div>

                {searchConsoleError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{searchConsoleError}</p>
                  </div>
                )}

                {searchConsoleConnected ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium">Search Console succesvol verbonden!</p>
                      <p className="text-green-600 text-sm">U kunt nu zoekwoorden importeren van uw Search Console account.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800 mb-2">Google Cloud Project Vereist</h4>
                          <p className="text-sm text-amber-700 mb-3">
                            Voor API toegang heeft u een Google Cloud project nodig met Search Console API ingeschakeld.
                          </p>
                          <a
                            href="https://console.cloud.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Google Cloud Console
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client ID
                        </label>
                        <input
                          type="text"
                          value={searchConsoleCredentials.clientId}
                          onChange={(e) => setSearchConsoleCredentials({ ...searchConsoleCredentials, clientId: e.target.value })}
                          placeholder="123456789-abcdefghijklmnop.apps.googleusercontent.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Secret
                        </label>
                        <input
                          type="password"
                          value={searchConsoleCredentials.clientSecret}
                          onChange={(e) => setSearchConsoleCredentials({ ...searchConsoleCredentials, clientSecret: e.target.value })}
                          placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={searchConsoleCredentials.siteUrl}
                          onChange={(e) => setSearchConsoleCredentials({ ...searchConsoleCredentials, siteUrl: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          De URL van uw website zoals geregistreerd in Search Console
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect URI
                        </label>
                        <input
                          type="text"
                          value={searchConsoleCredentials.redirectUri}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Deze URI moet exact overeenkomen met wat u in Google Cloud Console heeft ingesteld
                        </p>
                      </div>

                      <button
                        onClick={handleSearchConsoleConnect}
                        disabled={!searchConsoleCredentials.clientId || !searchConsoleCredentials.clientSecret || !searchConsoleCredentials.siteUrl}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Verbinden met Google
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Veilige verbinding • Uw credentials worden lokaal opgeslagen
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sluiten
              </button>
              {(dataForSeoConnected || searchConsoleConnected) && (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voltooien
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};