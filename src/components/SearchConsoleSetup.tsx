import React, { useState } from 'react';
import { X, ExternalLink, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface SearchConsoleSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function SearchConsoleSetup({ isOpen, onClose, onConnected }: SearchConsoleSetupProps) {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: 'http://localhost:5173/auth/callback'
  });

  if (!isOpen) return null;

  const handleConnect = () => {
    // Store credentials in localStorage for demo purposes
    localStorage.setItem('gsc_credentials', JSON.stringify(credentials));
    
    // Generate OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${credentials.clientId}&` +
      `redirect_uri=${encodeURIComponent(credentials.redirectUri)}&` +
      `response_type=code&` +
      `scope=https://www.googleapis.com/auth/webmasters.readonly&` +
      `access_type=offline`;
    
    // Open OAuth flow in new window
    window.open(authUrl, '_blank');
    
    // For demo purposes, simulate successful connection
    setTimeout(() => {
      onConnected();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Google Search Console Koppelen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800 mb-2">
                      Belangrijk voor Nederlandse Gebruikers
                    </h3>
                    <p className="text-sm text-amber-700 mb-3">
                      Directe API koppeling werkt niet in deze browser omgeving vanwege CORS beperkingen. 
                      We raden de <strong>CSV import methode</strong> aan voor betrouwbare resultaten.
                    </p>
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">Aanbevolen Workflow:</h4>
                      <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                        <li>Ga naar <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google Search Console <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                        <li>Selecteer uw website eigenschap</li>
                        <li>Ga naar Prestaties → Zoekresultaten</li>
                        <li>Stel gewenste datumbereik in</li>
                        <li>Klik "Exporteren" → "CSV downloaden"</li>
                        <li>Gebruik de "Importeer CSV" knop in dit dashboard</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Stap 1: Google Cloud Project Instellen
                </h3>
                <p className="text-gray-600">
                  Voor API toegang heeft u een Google Cloud project nodig met Search Console API ingeschakeld.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Instructies:</h4>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>
                      Ga naar <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                        Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </li>
                    <li>Maak een nieuw project aan of selecteer bestaand project</li>
                    <li>Schakel de "Google Search Console API" in</li>
                    <li>Ga naar "Credentials" en maak OAuth 2.0 Client ID aan</li>
                    <li>Voeg <code className="bg-gray-200 px-1 rounded">http://localhost:5173/auth/callback</code> toe als redirect URI</li>
                  </ol>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Volgende Stap
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Stap 2: OAuth Credentials Invoeren
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                    placeholder="123456789-abcdefghijklmnop.apps.googleusercontent.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={credentials.clientSecret}
                    onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                    placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redirect URI
                  </label>
                  <input
                    type="text"
                    value={credentials.redirectUri}
                    onChange={(e) => setCredentials(prev => ({ ...prev, redirectUri: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deze URI moet exact overeenkomen met wat u in Google Cloud Console heeft ingesteld
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Klaar om te Verbinden</h4>
                    <p className="text-sm text-blue-700">
                      Na het klikken op "Verbinden" wordt u doorgestuurd naar Google voor autorisatie.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Vorige
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!credentials.clientId || !credentials.clientSecret}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verbinden met Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}