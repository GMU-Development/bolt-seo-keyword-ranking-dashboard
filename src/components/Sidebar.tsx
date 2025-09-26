import React from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  Globe, 
  Settings, 
  FileText,
  Search,
  Award,
  Activity,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuth?: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overzicht', icon: BarChart3 },
  { id: 'keywords', label: 'Zoekwoorden', icon: Target },
  { id: 'rankings', label: 'Rankings', icon: TrendingUp },
  { id: 'competitors', label: 'Concurrenten', icon: Users },
  { id: 'backlinks', label: 'Backlinks', icon: Globe },
  { id: 'research', label: 'Onderzoek', icon: Search },
  { id: 'reports', label: 'Rapporten', icon: FileText },
  { id: 'audit', label: 'Site Audit', icon: Award },
  { id: 'settings', label: 'Instellingen', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenAuth }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SEO Tracker</h1>
            <p className="text-xs text-gray-500">Professionele Editie</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Project Selector */}
      <div className="p-4 border-t border-gray-100">
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="w-full mb-4 flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Shield className="h-4 w-4" />
            Data Bronnen Koppelen
          </button>
        )}
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Huidig Project
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">example.com</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">156 zoekwoorden gevolgd</div>
        </div>
      </div>
    </div>
  );
};