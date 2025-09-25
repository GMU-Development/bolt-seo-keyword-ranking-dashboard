import React from 'react';
import { TrendingUp, TrendingDown, Users, Globe, Eye } from 'lucide-react';
import { CompetitorData } from '../types';

interface CompetitorAnalysisProps {
  competitors: CompetitorData[];
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Concurrent Analyse</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Bekijk Alle Concurrenten
        </button>
      </div>

      <div className="space-y-4">
        {competitors.map((competitor, index) => (
          <div
            key={competitor.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{competitor.domain}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{competitor.keywords} zoekwoorden</span>
                  <span>Gem. ranking: {competitor.averageRank}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {competitor.visibility}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">Visibility</div>
                <div className="text-xs text-gray-500">Zichtbaarheid</div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {competitor.estimatedTraffic.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Geschat Verkeer</div>
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Concurrentie Inzichten</h4>
            <p className="text-sm text-blue-700">
              Uw gemiddelde zichtbaarheid is 72,5%, wat concurrerend is met de toppresteerders in uw niche. 
              Focus op het verbeteren van rankings voor zoekwoorden met hoog volume om marktaandeel te vergroten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};