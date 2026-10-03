import React, { useState } from 'react';
import { StoryPlan, SceneData, CharacterIdentity } from '../types';
import { 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Edit3, 
  Users, 
  Film, 
  Music, 
  Mic, 
  MapPin, 
  Camera, 
  Volume2, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StoryPlanPreviewProps {
  plan: StoryPlan;
  onUpdatePlan: (updatedPlan: StoryPlan) => void;
  onApproveAndGenerate: () => void;
  onRegeneratePlan: () => void;
  isSubmitting: boolean;
}

export const StoryPlanPreview: React.FC<StoryPlanPreviewProps> = ({
  plan,
  onUpdatePlan,
  onApproveAndGenerate,
  onRegeneratePlan,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPlan, setEditedPlan] = useState<StoryPlan>(plan);
  const [expandedScene, setExpandedScene] = useState<number | null>(1);

  const handleSceneChange = (index: number, field: keyof SceneData, value: any) => {
    const updatedScenes = [...editedPlan.scenes];
    updatedScenes[index] = { ...updatedScenes[index], [field]: value };
    const newPlan = { ...editedPlan, scenes: updatedScenes };
    setEditedPlan(newPlan);
    onUpdatePlan(newPlan);
  };

  const handleDialogueChange = (index: number, text: string) => {
    const updatedScenes = [...editedPlan.scenes];
    const currentDiag = updatedScenes[index].dialogue || { character: updatedScenes[index].characters[0] || 'Hero', text: '' };
    updatedScenes[index] = {
      ...updatedScenes[index],
      dialogue: { ...currentDiag, text }
    };
    const newPlan = { ...editedPlan, scenes: updatedScenes };
    setEditedPlan(newPlan);
    onUpdatePlan(newPlan);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & Title Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-studio-900 to-amber-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Story Plan Ready for Approval</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                {plan.genre}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                {plan.duration}s • {plan.aspectRatio}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
              {plan.title}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl line-clamp-2">
              Original Prompt: "{plan.rawPrompt}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onRegeneratePlan}
              disabled={isSubmitting}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-bold transition-all"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>Regenerate Plan</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                isEditing 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Done Editing' : 'Edit Plan'}</span>
            </button>

            <button
              onClick={onApproveAndGenerate}
              disabled={isSubmitting}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Approve & Generate Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Style Summary Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <Film className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-500 block font-semibold">Visual Style</span>
              <span className="font-bold">{plan.visualStyle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <Mic className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <span className="text-slate-500 block font-semibold">Voice Direction</span>
              <span className="font-bold">{plan.voiceStyle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <Music className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-500 block font-semibold">Soundtrack</span>
              <span className="font-bold">{plan.musicStyle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Characters Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-['Outfit']">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Extracted Character Profiles ({plan.characters.length})</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.characters.map((char: CharacterIdentity) => (
            <div key={char.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-start gap-4 hover:border-amber-500/30 transition-all">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                {char.referenceImage ? (
                  <img src={char.referenceImage} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-white">{char.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {char.gender || 'Character'}
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-medium mt-0.5">{char.appearance}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{char.description}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                  <span><strong>Voice:</strong> {char.voice}</span>
                  {char.clothing && <span><strong>Outfit:</strong> {char.clothing}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scene Breakdown List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit']">
            <Film className="w-5 h-5 text-amber-400" />
            <span>Scene-by-Scene Breakdown ({plan.scenes.length} Scenes)</span>
          </h3>
          <span className="text-xs text-slate-400">Total Duration: {plan.duration}s</span>
        </div>

        <div className="space-y-3">
          {editedPlan.scenes.map((scene: SceneData, idx: number) => {
            const isExpanded = expandedScene === scene.sceneNumber;
            return (
              <div 
                key={scene.sceneNumber} 
                className={`glass-panel rounded-2xl border transition-all ${
                  isExpanded ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                }`}
              >
                {/* Scene Row Bar */}
                <div 
                  onClick={() => setExpandedScene(isExpanded ? null : scene.sceneNumber)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-violet-500/20 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/30">
                      #{scene.sceneNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">Scene {scene.sceneNumber}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                          {scene.startTime}s - {scene.endTime}s ({scene.duration}s)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{scene.action}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {scene.location}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                  </div>
                </div>

                {/* Expanded Details / Editor */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                    
                    {/* Action Description */}
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Action Description</label>
                      {isEditing ? (
                        <textarea
                          value={scene.action}
                          onChange={(e) => handleSceneChange(idx, 'action', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      ) : (
                        <p className="p-3 rounded-xl bg-slate-950/80 text-slate-300 border border-slate-800">{scene.action}</p>
                      )}
                    </div>

                    {/* Dialogue Input */}
                    <div>
                      <label className="block font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5" />
                        <span>Character Dialogue ({scene.dialogue?.character || 'Character'})</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={scene.dialogue?.text || ''}
                          onChange={(e) => handleDialogueChange(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      ) : (
                        <p className="p-3 rounded-xl bg-slate-950/80 text-amber-200 border border-slate-800 italic">
                          "{scene.dialogue?.text || 'No spoken dialogue in this scene.'}"
                        </p>
                      )}
                    </div>

                    {/* Camera & Lighting Directives */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-500 font-bold block mb-0.5 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-violet-400" /> Camera Motion
                        </span>
                        <span className="text-slate-200 font-medium">{scene.cameraMovement}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-500 font-bold block mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Lighting
                        </span>
                        <span className="text-slate-200 font-medium">{scene.lighting}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-500 font-bold block mb-0.5 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-emerald-400" /> Sound Effects
                        </span>
                        <span className="text-slate-200 font-medium">{scene.audioPrompt}</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
