import React, { useState } from 'react';
import { CharacterIdentity } from '../types';
import { Users, Edit3, Trash2, Sparkles, Mic, Shirt, Smile, Image as ImageIcon } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterIdentity;
  onUpdate: (updated: CharacterIdentity) => void;
  onDelete: (id: string) => void;
  onGenerateAvatar: (name: string, appearance: string, clothing: string) => Promise<string>;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onUpdate,
  onDelete,
  onGenerateAvatar
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedChar, setEditedChar] = useState<CharacterIdentity>(character);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<boolean>(false);

  const handleSave = () => {
    onUpdate(editedChar);
    setIsEditing(false);
  };

  const handleGenAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const url = await onGenerateAvatar(editedChar.name, editedChar.appearance, editedChar.clothing || '');
      const updated = { ...editedChar, referenceImage: url };
      setEditedChar(updated);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden relative shrink-0 group">
            {editedChar.referenceImage ? (
              <img src={editedChar.referenceImage} alt={editedChar.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Users className="w-8 h-8" />
              </div>
            )}
            <button
              onClick={handleGenAvatar}
              disabled={isGeneratingAvatar}
              title="Regenerate Avatar"
              className="absolute inset-0 bg-slate-950/80 text-amber-400 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold transition-opacity"
            >
              {isGeneratingAvatar ? <Sparkles className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <h4 className="font-extrabold text-lg text-white font-['Outfit']">{character.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              {character.gender && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {character.gender}
                </span>
              )}
              {character.age && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {character.age}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(character.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Details or Editor */}
      {isEditing ? (
        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Name</label>
            <input
              type="text"
              value={editedChar.name}
              onChange={(e) => setEditedChar({ ...editedChar, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold mb-1">Appearance & Hair</label>
            <textarea
              value={editedChar.appearance}
              onChange={(e) => setEditedChar({ ...editedChar, appearance: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold mb-1">Voice Tone</label>
            <input
              type="text"
              value={editedChar.voice}
              onChange={(e) => setEditedChar({ ...editedChar, voice: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
          >
            Save Character Profile
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-xs text-slate-300">
          <p className="text-amber-300 font-semibold">{character.appearance}</p>
          <p className="text-slate-400 line-clamp-2">{character.description}</p>
          
          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="truncate">{character.voice}</span>
            </div>
            {character.clothing && (
              <div className="flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{character.clothing}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
