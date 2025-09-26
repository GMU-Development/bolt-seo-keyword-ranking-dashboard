import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Trash2,
  RefreshCw,
  Key,
  Shield,
  Info
} from 'lucide-react';
import { searchConsoleService } from '../services/searchConsole';
import { dataForSeoService } from '../services/dataForSeo';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('data-connections');
  const [isGSCConnected, setIsGSCConnected] = useState(false);
  const [isDataForSeoConnected, setIsDataForSeoConnected] = useState(false);
  const [gscCredentials, setGscCredentials] = useState({
    clientId: '',
    clientSecret: '',
    siteUrl: ''
  });
  const [dataForSeoCredentials, setDataForSeoCredentials] = useState({
    login: '',
    password: ''
  });
  const [testingGSC, setTestingGSC] = useState(false);
  const [testingDataForSeo, setTestingDataForSeo] = useState(false);
  const [gscError, setGscError] = useState<string | null>(null);
  const [dataForSeoError, setDataForSeoError] = useState<string | null>(null);

  useEffect(() => {
    // Check connection status
    setIsGSCConnected(searchConsoleService.isAuthenticated());
    setIsDataForSeoConnected(dataForSeoService.isAuthenticated());

    // Load stored credentials
    const storedGSC = searchConsoleService.getStoredCredentials();
    if (storedGSC) {
      setGscCredentials({
        clientId: storedGSC.clientId,
        clientSecret: storedGSC.clientSecret,
        siteUrl: storedGSC.siteUrl
      });
    }

    const storedDataForSeo = dataForSeoService.getStoredCredentials();
    if (storedDataForSeo) {
      setDataForSeoCredentials(storedDataForSeo);
    }
  }, []);

  const handleGSCConnect = async () => {
    if (!gscCredentials.clientId || !gscCredentials.clientSecret || !gscCredentials.siteUrl) {
      setGscError('Vul alle velden in');
      return;
    }

    setTestingGSC(true);
    setGscError(null);

    try {
      searchConsoleService.setCredentials({
        ...gscCredentials,
        redirectUri: 'http://localhost:5173/auth/callback'
      });

      // For demo purposes, simulate successful connection
      setTimeout(() => {
        setIsGSCConnected(true);
        setTestingGSC(false);
      }, 2000);
    } catch (error) {
      setGscError('Verbinding mislukt. Controleer uw gegevens.');
      setTestingGSC(false);
    }
  };

  const handleDataForSeoConnect = async () => {
    if (!dataForSeoCredentials.login || !dataForSeoCredentials.password) {
      setDataForSeoError('Vul alle velden in');
      return;
    }

    setTestingDataForSeo(true);
    setDataForSeoError(null);

    try {
      dataForSeoService.setCredentials(dataForSeoCredentials);
      const isConnected = await dataForSeoService.testConnection();
      
      if (isConnected) {
        setIsDataForSeoConnected(true);
      } else {
        setDataForSeoError('Verbinding mislukt. Controleer uw inloggegevens.');
      }
    } catch (error) {
      setDataForSeoError('Verbinding mislukt. Controleer uw inloggegevens.');
    } finally {
      setTestingDataForSeo(false);
    }
  };

  const handleGSCDisconnect = () => {
    searchConsoleService.disconnect();
    setIsGSCConnected(false);
    setGscCredentials({ clientId: '', clientSecret: '', siteUrl: '' });
  };

  const handleDataForSeoDisconnect = () => {
    dataForSeoService.disconnect();
    setIsDataForSeoConnected(false);
    setDataForSeoCredentials({ login: '', password: '' });
  };

  const sections = [
    { id: 'data-connections', label: 'Data Koppelingen', icon: Database },
    { id: 'general', label: 'Algemeen', icon: Settings },
    { id: 'security', label: 'Beveiliging', icon: Shield },
  ];

  const renderDataConnections = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Koppelingen</h2>
        <p className="text-gray-600">
          Koppel uw SEO data bronnen om automatisch zoekterm rankings te tracken en analyseren.
        </p>
      </div>

      {/* Google Search Console */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Search Console</h3>
              <p className="text-sm text-gray-600">
                Importeer uw werkelijke zoekterm prestaties en rankings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGSCConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Verbonden</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">Niet Verbonden</span>
              </>
            )}
          </div>
        </div>

        {!isGSCConnected ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Setup Instructies</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>
                      Ga naar <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center gap-1">
                        Google Cloud Console <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>Maak een nieuw project of selecteer bestaand project</li>
                    <li>Schakel de "Google Search Console API" in</li>
                    <li>Maak OAuth 2.0 Client ID credentials aan</li>
                    <li>Voeg <code className="bg-blue-100 px-1 rounded">http://localhost:5173/auth/callback</code> toe als redirect URI</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={gscCredentials.clientId}
                  onChange={(e) => setGscCredentials({ ...gscCredentials, clientId: e.target.value })}
                  placeholder="123456789-abc...googleusercontent.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={gscCredentials.clientSecret}
                  onChange={(e) => setGscCredentials({ ...gscCredentials, clientSecret: e.target.value })}
                  placeholder="GOCSPX-xxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={gscCredentials.siteUrl}
                onChange={(e) => setGscCredentials({ ...gscCredentials, siteUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {gscError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{gscError}</p>
              </div>
            )}

            <button
              onClick={handleGSCConnect}
              disabled={testingGSC || !gscCredentials.clientId || !gscCredentials.clientSecret || !gscCredentials.siteUrl}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testingGSC ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Verbinden...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Verbind Search Console
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Search Console Verbonden</p>
                  <p className="text-sm text-green-700">Website: {gscCredentials.siteUrl}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleGSCDisconnect}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Verbinding Verbreken
            </button>
          </div>
        )}
      </div>

      {/* DataForSEO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">DataForSEO</h3>
              <p className="text-sm text-gray-600">
                Krijg toegang tot zoekvolumes, keyword moeilijkheid en SERP data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDataForSeoConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Verbonden</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">Niet Verbonden</span>
              </>
            )}
          </div>
        </div>

        {!isDataForSeoConnected ? (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Account Vereist</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    U heeft een DataForSEO account nodig. Ze bieden een gratis trial met $1 credit.
                  </p>
                  <a
                    href="https://app.dataforseo.com/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-purple-800 hover:text-purple-900 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Maak DataForSEO Account
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Login (Email)
                </label>
                <input
                  type="email"
                  value={dataForSeoCredentials.login}
                  onChange={(e) => setDataForSeoCredentials({ ...dataForSeoCredentials, login: e.target.value })}
                  placeholder="jouw-email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {dataForSeoError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{dataForSeoError}</p>
              </div>
            )}

            <button
              onClick={handleDataForSeoConnect}
              disabled={testingDataForSeo || !dataForSeoCredentials.login || !dataForSeoCredentials.password}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testingDataForSeo ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Verbinden...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Verbind DataForSEO
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">DataForSEO Verbonden</p>
                  <p className="text-sm text-green-700">Account: {dataForSeoCredentials.login}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleDataForSeoDisconnect}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Verbinding Verbreken
            </button>
          </div>
        )}
      </div>

      {/* Connection Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voordelen van Data Koppelingen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Search Console
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Werkelijke zoekterm prestaties</li>
              <li>• Klik- en impressiegegevens</li>
              <li>• Gemiddelde posities</li>
              <li>• CTR statistieken</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-600" />
              DataForSEO
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Zoekvolume data</li>
              <li>• Keyword moeilijkheid</li>
              <li>• Concurrentie analyse</li>
              <li>• SERP tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Algemene Instellingen</h2>
        <p className="text-gray-600">Beheer uw dashboard voorkeuren en configuratie.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Voorkeuren</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Automatisch Vernieuwen</label>
              <p className="text-sm text-gray-500">Rankings automatisch bijwerken elke 24 uur</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Email Notificaties</label>
              <p className="text-sm text-gray-500">Ontvang updates over ranking veranderingen</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Beveiliging</h2>
        <p className="text-gray-600">Beheer uw account beveiliging en privacy instellingen.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Beveiliging</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Lokale Opslag</p>
                <p className="text-sm text-green-700">
                  Uw credentials worden veilig opgeslagen in uw browser en niet gedeeld met derden.
                </p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4" />
            Alle Opgeslagen Data Wissen
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'data-connections' && renderDataConnections()}
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'security' && renderSecuritySettings()}
      </div>
    </div>
  );
};