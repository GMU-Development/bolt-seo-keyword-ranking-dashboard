import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Keyword } from '../types';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keyword: Omit<Keyword, 'id' | 'dateAdded' | 'lastUpdated' | 'history'>) => void;
  editingKeyword?: Keyword | null;
}

export const AddKeywordModal: React.FC<AddKeywordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingKeyword 
}) => {
  const [formData, setFormData] = useState({
    keyword: editingKeyword?.keyword || '',
    currentRank: editingKeyword?.currentRank || null,
    previousRank: editingKeyword?.previousRank || null,
    searchVolume: editingKeyword?.searchVolume || 0,
    competition: editingKeyword?.competition || 'Medium' as const,
    cpc: editingKeyword?.cpc || 0,
    url: editingKeyword?.url || '',
    tags: editingKeyword?.tags || [],
    difficulty: editingKeyword?.difficulty || 50,
    intent: editingKeyword?.intent || 'Informational' as const,
    location: editingKeyword?.location || 'United States',
    device: editingKeyword?.device || 'Desktop' as const
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({
      keyword: '',
      currentRank: null,
      previousRank: null,
      searchVolume: 0,
      competition: 'Medium',
      cpc: 0,
      url: '',
      tags: [],
      difficulty: 50,
      intent: 'Informatief',
      location: 'United States',
      device: 'Desktop'
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingKeyword ? 'Bewerk Zoekwoord' : 'Nieuw Zoekwoord Toevoegen'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basis Informatie</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoekwoord *
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Voer doelzoekwoord in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landingspagina URL
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/pagina-url of volledige URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Voeg een tag toe en druk op Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Toevoegen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ranking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ranking Informatie</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huidige Ranking
                </label>
                <input
                  type="number"
                  value={formData.currentRank || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    currentRank: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bijv. 15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorige Ranking
                </label>
                <input
                  type="number"
                  value={formData.previousRank || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    previousRank: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bijv. 20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locatie
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Nederland">Nederland</option>
                  <option value="België">België</option>
                  <option value="Duitsland">Duitsland</option>
                  <option value="Frankrijk">Frankrijk</option>
                  <option value="Verenigd Koninkrijk">Verenigd Koninkrijk</option>
                  <option value="Verenigde Staten">Verenigde Staten</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apparaat
                </label>
                <select
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value as 'Desktop' | 'Mobiel' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Desktop">Desktop</option>
                  <option value="Mobiel">Mobiel</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO Statistieken</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoekvolume
                </label>
                <input
                  type="number"
                  value={formData.searchVolume}
                  onChange={(e) => setFormData({ ...formData, searchVolume: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Maandelijks zoekvolume"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoekwoord Moeilijkheid (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concurrentie Niveau
                </label>
                <select
                  value={formData.competition}
                  onChange={(e) => setFormData({ ...formData, competition: e.target.value as 'Laag' | 'Gemiddeld' | 'Hoog' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Laag">Laag</option>
                  <option value="Gemiddeld">Gemiddeld</option>
                  <option value="Hoog">Hoog</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoek Intentie
                </label>
                <select
                  value={formData.intent}
                  onChange={(e) => setFormData({ ...formData, intent: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Informatief">Informatief</option>
                  <option value="Commercieel">Commercieel</option>
                  <option value="Transactioneel">Transactioneel</option>
                  <option value="Navigatie">Navigatie</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPC (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cpc}
                onChange={(e) => setFormData({ ...formData, cpc: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kosten per klik"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingKeyword ? 'Bijwerken' : 'Toevoegen'} Zoekwoord
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};