import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, RefreshCw, Bell, User } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { KeywordTable } from './components/KeywordTable';
import { RankDistributionChart } from './components/RankDistributionChart';
import { VisibilityChart } from './components/VisibilityChart';
import { CompetitorAnalysis } from './components/CompetitorAnalysis';
import { AddKeywordModal } from './components/AddKeywordModal';
import { SearchConsoleSetup } from './components/SearchConsoleSetup';
import { ImportKeywordsModal } from './components/ImportKeywordsModal';
import { CSVImportModal } from './components/CSVImportModal';
import { DataForSeoSetup } from './components/DataForSeoSetup';
import { DataForSeoImport } from './components/DataForSeoImport';
import { RankingsPage } from './components/RankingsPage';
import { mockKeywords, mockCompetitors, mockRankDistribution } from './data/mockData';
import { Keyword, DashboardStats } from './types';
import { searchConsoleService } from './services/searchConsole';
import { dataForSeoService } from './services/dataForSeo';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Eye, 
  Activity,
  Award,
  Database,
  Globe
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [isDataForSeoSetupOpen, setIsDataForSeoSetupOpen] = useState(false);
  const [isDataForSeoImportOpen, setIsDataForSeoImportOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGSCConnected, setIsGSCConnected] = useState(false);
  const [isDataForSeoConnected, setIsDataForSeoConnected] = useState(false);

  React.useEffect(() => {
    setIsGSCConnected(searchConsoleService.isAuthenticated());
    setIsDataForSeoConnected(dataForSeoService.isAuthenticated());
  }, []);

  const stats: DashboardStats = useMemo(() => {
    const totalKeywords = keywords.length;
    const rankedKeywords = keywords.filter(k => k.currentRank);
    const averageRank = rankedKeywords.length > 0 
      ? rankedKeywords.reduce((sum, k) => sum + (k.currentRank || 0), 0) / rankedKeywords.length
      : 0;
    
    const improvingKeywords = keywords.filter(k => 
      k.currentRank && k.previousRank && k.currentRank < k.previousRank
    ).length;
    
    const decliningKeywords = keywords.filter(k => 
      k.currentRank && k.previousRank && k.currentRank > k.previousRank
    ).length;

    const topThreeKeywords = keywords.filter(k => k.currentRank && k.currentRank <= 3).length;
    const topTenKeywords = keywords.filter(k => k.currentRank && k.currentRank <= 10).length;

    const visibilityScore = keywords.reduce((sum, k) => {
      const latestVisibility = k.history[k.history.length - 1]?.visibility || 0;
      return sum + latestVisibility;
    }, 0) / keywords.length;

    const estimatedTraffic = keywords.reduce((sum, k) => {
      if (k.currentRank && k.currentRank <= 20) {
        const ctr = k.currentRank <= 3 ? 0.3 : k.currentRank <= 10 ? 0.1 : 0.05;
        return sum + (k.searchVolume * ctr);
      }
      return sum;
    }, 0);

    return {
      totalKeywords,
      averageRank: Math.round(averageRank),
      improvingKeywords,
      decliningKeywords,
      topThreeKeywords,
      topTenKeywords,
      visibilityScore: Math.round(visibilityScore),
      estimatedTraffic: Math.round(estimatedTraffic)
    };
  }, [keywords]);

  const filteredKeywords = keywords.filter(keyword =>
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKeyword = (newKeywordData: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>) => {
    const newKeyword: Keyword = {
      ...newKeywordData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      history: newKeywordData.currentRank ? [{
        date: new Date().toISOString().split('T')[0],
        rank: newKeywordData.currentRank,
        serp: 'desktop',
        visibility: newKeywordData.currentRank <= 3 ? 33.3 : 
                   newKeywordData.currentRank <= 10 ? 10.0 : 
                   newKeywordData.currentRank <= 20 ? 5.0 : 2.0
      }] : []
    };

    if (editingKeyword) {
      setKeywords(keywords.map(k => 
        k.id === editingKeyword.id 
          ? { ...newKeyword, id: editingKeyword.id, dateAdded: editingKeyword.dateAdded, history: editingKeyword.history }
          : k
      ));
      setEditingKeyword(null);
    } else {
      setKeywords([...keywords, newKeyword]);
    }
  };

  const handleImportKeywords = (importedKeywords: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>[]) => {
    const newKeywords = importedKeywords.map(keywordData => {
      const newKeyword: Keyword = {
        ...keywordData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        dateAdded: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        history: keywordData.currentRank ? [{
          date: new Date().toISOString().split('T')[0],
          rank: keywordData.currentRank,
          serp: 'desktop',
          visibility: keywordData.currentRank <= 3 ? 33.3 : 
                     keywordData.currentRank <= 10 ? 10.0 : 
                     keywordData.currentRank <= 20 ? 5.0 : 2.0
        }] : []
      };
      return newKeyword;
    });

    setKeywords(prev => [...prev, ...newKeywords]);
  };

  const handleGSCConnected = () => {
    setIsGSCConnected(true);
    setIsSetupOpen(false);
  };

  const handleDataForSeoConnected = () => {
    setIsDataForSeoConnected(true);
    setIsDataForSeoSetupOpen(false);
  };

  const handleEditKeyword = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    console.log('Refreshing keyword rankings...');
  };

  const handleExport = () => {
    const csvContent = keywords.map(k => 
      `"${k.keyword}","${k.currentRank || ''}","${k.previousRank || ''}","${k.searchVolume}","${k.competition}","${k.cpc}","${k.url}","${k.difficulty}","${k.intent}"`
    ).join('\n');
    
    const blob = new Blob([`Keyword,Current Rank,Previous Rank,Search Volume,Competition,CPC,URL,Difficulty,Intent\n${csvContent}`], 
      { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-keyword-rankings.csv';
    a.click();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Totaal Zoekwoorden"
                value={stats.totalKeywords}
                icon={Target}
                color="blue"
                subtitle="Gevolgde zoekwoorden"
              />
              <StatsCard
                title="Gemiddelde Ranking"
                value={stats.averageRank > 0 ? stats.averageRank : '-'}
                icon={BarChart3}
                color="indigo"
                subtitle="Over alle zoekwoorden"
              />
              <StatsCard
                title="Zichtbaarheid Score"
                value={`${stats.visibilityScore}%`}
                change={{ value: 5.2, type: 'positive', period: 'vorige week' }}
                icon={Eye}
                color="purple"
                subtitle="Zoek zichtbaarheid"
              />
              <StatsCard
                title="Geschat Verkeer"
                value={stats.estimatedTraffic.toLocaleString()}
                change={{ value: 1250, type: 'positive', period: 'vorige maand' }}
                icon={Activity}
                color="green"
                subtitle="Maandelijkse organische bezoeken"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Top 3 Rankings"
                value={stats.topThreeKeywords}
                change={{ value: stats.topThreeKeywords, type: 'positive' }}
                icon={Award}
                color="green"
                subtitle="Zoekwoorden in top 3"
              />
              <StatsCard
                title="Top 10 Rankings"
                value={stats.topTenKeywords}
                icon={TrendingUp}
                color="blue"
                subtitle="Zoekwoorden in top 10"
              />
              <StatsCard
                title="Verbeterend"
                value={stats.improvingKeywords}
                change={{ value: stats.improvingKeywords, type: 'positive' }}
                icon={TrendingUp}
                color="green"
                subtitle="Ranking verbeteringen"
              />
              <StatsCard
                title="Dalend"
                value={stats.decliningKeywords}
                change={{ value: stats.decliningKeywords, type: 'negative' }}
                icon={TrendingDown}
                color="red"
                subtitle="Ranking dalingen"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RankDistributionChart data={mockRankDistribution} />
              <CompetitorAnalysis competitors={mockCompetitors} />
            </div>

            <VisibilityChart keywords={keywords} />
          </div>
        );

      case 'keywords':
        return (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek zoekwoorden of URL's..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSetupOpen(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isGSCConnected 
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isGSCConnected ? 'Search Console verbonden' : 'Koppel Search Console'}
                >
                  <Globe className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsDataForSeoSetupOpen(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDataForSeoConnected 
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isDataForSeoConnected ? 'DataForSEO verbonden' : 'Koppel DataForSEO'}
                >
                  <Database className="h-5 w-5" />
                </button>
                {isGSCConnected && (
                  <button
                    onClick={() => setIsImportOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Importeer van Search Console
                  </button>
                )}
                {isDataForSeoConnected && (
                  <button
                    onClick={() => setIsDataForSeoImportOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Database className="h-4 w-4" />
                    DataForSEO Research
                  </button>
                )}
                <button
                  onClick={() => setIsCSVImportOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Importeer CSV
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Ververs rankings"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Exporteer
                </button>
                <button
                  onClick={() => {
                    setEditingKeyword(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Voeg Zoekwoord Toe
                </button>
              </div>
            </div>

            <KeywordTable 
              keywords={filteredKeywords} 
              onEditKeyword={handleEditKeyword}
            />

            {/* No results message */}
            {filteredKeywords.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Geen zoekwoorden gevonden</h3>
                <p className="text-gray-500">
                  Probeer uw zoektermen aan te passen of voeg een nieuw zoekwoord toe.
                </p>
              </div>
            )}

            {/* Empty state */}
            {keywords.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen zoekwoorden gevolgd</h3>
                <p className="text-gray-500 mb-6">
                  Begin met het volgen van uw SEO prestaties door uw eerste zoekwoord toe te voegen.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Voeg Uw Eerste Zoekwoord Toe
                </button>
              </div>
            )}
          </div>
        );

      case 'rankings':
        return <RankingsPage keywords={keywords} />;

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
            </h3>
            <p className="text-gray-500">
              Deze functie is momenteel in ontwikkeling.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'overview' ? 'Dashboard Overzicht' : 
                   activeTab === 'keywords' ? 'Zoekwoorden Beheer' :
                   activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'overview' ? 'Monitor uw SEO prestaties en rankings' :
                   activeTab === 'keywords' ? 'Volg en beheer uw zoekwoord rankings' :
                   `Beheer uw ${activeTab} instellingen en gegevens`}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      <AddKeywordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKeyword(null);
        }}
        onSave={handleAddKeyword}
        editingKeyword={editingKeyword}
      />

      <SearchConsoleSetup
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onConnected={handleGSCConnected}
      />

      <ImportKeywordsModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportKeywords}
      />

      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImport={handleImportKeywords}
      />

      <DataForSeoSetup
        isOpen={isDataForSeoSetupOpen}
        onClose={() => setIsDataForSeoSetupOpen(false)}
        onConnected={handleDataForSeoConnected}
      />

      <DataForSeoImport
        isOpen={isDataForSeoImportOpen}
        onClose={() => setIsDataForSeoImportOpen(false)}
        onImport={handleImportKeywords}
      />
    </div>
  );
}

export default App;