import React from 'react';
import { Shield, Database, Globe, ArrowRight, CheckCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenAuth: () => void;
  hasConnections: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenAuth, hasConnections }) => {
  if (hasConnections) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welkom bij SEO Tracker Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koppel uw SEO data bronnen om uitgebreide keyword tracking, 
            concurrentie analyse en prestatie monitoring te starten.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* DataForSEO Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">DataForSEO API</h3>
            <p className="text-gray-600 mb-6">
              Professionele SEO data inclusief zoekvolumes, keyword moeilijkheid, 
              SERP resultaten en concurrentie analyse.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Realtime zoekvolume data',
                'Keyword moeilijkheidsscores',
                'SERP positie tracking',
                'Concurrentie analyse',
                'Historische trends'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Search Console Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Google Search Console</h3>
            <p className="text-gray-600 mb-6">
              Officiële Google data over uw website prestaties in de zoekresultaten 
              met werkelijke klik- en impressiegegevens.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Werkelijke zoekprestaties',
                'Klik- en impressiedata',
                'Gemiddelde posities',
                'CTR statistieken',
                'Query performance'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Shield className="h-5 w-5" />
            Data Bronnen Koppelen
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Veilig • Uw credentials worden lokaal opgeslagen • Geen data wordt gedeeld
          </p>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Waarom SEO Tracker Pro?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Betrouwbare Data</h4>
              <p className="text-sm text-gray-600">
                Directe integratie met officiële APIs voor accurate en actuele SEO data.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Uitgebreide Analytics</h4>
              <p className="text-sm text-gray-600">
                Diepgaande inzichten in keyword prestaties, trends en concurrentie.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Veilig & Privé</h4>
              <p className="text-sm text-gray-600">
                Uw data blijft veilig met lokale opslag en geen externe data sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};