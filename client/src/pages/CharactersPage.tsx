import React, { useState, useEffect } from 'react';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterIdentity } from '../types';
import { api } from '../services/api';
import { Users, Plus, Sparkles, Wand2 } from 'lucide-react';

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterIdentity[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New character form state
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('25 years old');
  const [gender, setGender] = useState<string>('Male');
  const [appearance, setAppearance] = useState<string>('');
  const [clothing, setClothing] = useState<string>('');
  const [personality, setPersonality] = useState<string>('');
  const [voice, setVoice] = useState<string>('Male / Deep serious');
  const [description, setDescription] = useState<string>('');

  const loadCharacters = async () => {
    try {
      const data = await api.getCharacters();
      setCharacters(data);
    } catch (e) {}
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.saveCharacter({
        name,
        age,
        gender,
        appearance,
        clothing,
        personality,
        voice,
        description
      });
      setShowAddModal(false);
      resetForm();
      loadCharacters();
    } catch (err: any) {
      alert(err.message || 'Failed to create character');
    }
  };

  const resetForm = () => {
    setName('');
    setAppearance('');
    setClothing('');
    setPersonality('');
    setDescription('');
  };

  const handleUpdate = async (updated: CharacterIdentity) => {
    try {
      await api.saveCharacter(updated);
      loadCharacters();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCharacter(id);
      loadCharacters();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
            <Users className="w-7 h-7 text-amber-400" />
            <span>Fictional Character Library</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage reusable character identity packages to maintain visual and voice consistency across all video scenes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Character</span>
        </button>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onGenerateAvatar={(n, a, c) => api.generateAvatar(n, a, c)}
          />
        ))}
      </div>

      {/* Add Character Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-studio-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative space-y-6 bg-studio-900">
            <h3 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-amber-400" />
              <span>Create Fictional Character</span>
            </h3>

            <form onSubmit={handleCreateCharacter} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Character Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Gender / Type</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Creature">Creature / Animal</option>
                    <option value="Robot">Robot / Android</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Visual Appearance & Hair</label>
                <input
                  type="text"
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  placeholder="e.g. 25-year-old male detective, short black hair, blue eyes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Clothing & Accessories</label>
                <input
                  type="text"
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  placeholder="e.g. Black trench coat, dark gloves"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Voice & Accent</label>
                <input
                  type="text"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  placeholder="e.g. Deep serious noir narration voice"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief story background or role..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold"
                >
                  Save Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
