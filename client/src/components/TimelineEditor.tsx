import React, { useState } from 'react';
import { Project, SceneData } from '../types';
import { 
  Play, 
  RefreshCw, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Clock, 
  Camera, 
  Sparkles, 
  Volume2, 
  MapPin, 
  Edit3, 
  CheckCircle2,
  X
} from 'lucide-react';

interface TimelineEditorProps {
  project: Project;
  onUpdateScene: (sceneNumber: number, updatedData: Partial<SceneData>) => void;
  onRegenerateScene: (sceneNumber: number, type: 'video' | 'voice' | 'image' | 'all') => void;
  isRegenerating: boolean;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  project,
  onUpdateScene,
  onRegenerateScene,
  isRegenerating
}) => {
  const plan = project.storyPlan;
  if (!plan) return null;

  const [selectedSceneNumber, setSelectedSceneNumber] = useState<number>(1);
  const [activeTabType, setActiveTabType] = useState<'details' | 'edit'>('details');

  const selectedScene = plan.scenes.find(s => s.sceneNumber === selectedSceneNumber) || plan.scenes[0];

  const totalDuration = plan.duration || 60;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit']">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Interactive Visual Timeline Editor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any scene block to edit directives or regenerate individual video clips & voices.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
          Total Duration: {totalDuration}s
        </div>
      </div>

      {/* Visual Timeline Horizontal Bar */}
      <div className="space-y-2">
        {/* Time Markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
          <span>0s</span>
          <span>{Math.round(totalDuration * 0.25)}s</span>
          <span>{Math.round(totalDuration * 0.5)}s</span>
          <span>{Math.round(totalDuration * 0.75)}s</span>
          <span>{totalDuration}s</span>
        </div>

        {/* Scene Blocks Track */}
        <div className="w-full h-14 bg-slate-950 rounded-2xl p-1.5 flex gap-1.5 border border-slate-800 overflow-x-auto select-none">
          {plan.scenes.map((scene) => {
            const widthPct = Math.max(8, (scene.duration / totalDuration) * 100);
            const isSelected = scene.sceneNumber === selectedSceneNumber;

            return (
              <button
                key={scene.sceneNumber}
                onClick={() => setSelectedSceneNumber(scene.sceneNumber)}
                style={{ width: `${widthPct}%` }}
                className={`h-full rounded-xl px-2 flex flex-col justify-center transition-all relative group overflow-hidden ${
                  isSelected 
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border-2 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10' 
                    : scene.status === 'completed'
                    ? 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                    : 'bg-slate-950/80 border border-slate-900 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>Scene {scene.sceneNumber}</span>
                  <span className="text-[10px] text-slate-400 opacity-80">{scene.duration}s</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate opacity-70 group-hover:opacity-100 text-left">
                  {scene.action}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scene Detailed Card / Inspector */}
      {selectedScene && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 bg-slate-950/80 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-base flex items-center justify-center">
                #{selectedScene.sceneNumber}
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Scene {selectedScene.sceneNumber} Inspector</h4>
                <p className="text-xs text-slate-400">Timing: {selectedScene.startTime}s - {selectedScene.endTime}s ({selectedScene.duration}s)</p>
              </div>
            </div>

            {/* Regeneration Button Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onRegenerateScene(selectedScene.sceneNumber, 'image')}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Regen Image</span>
              </button>

              <button
                onClick={() => onRegenerateScene(selectedScene.sceneNumber, 'voice')}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Mic className="w-3.5 h-3.5 text-violet-400" />
                <span>Regen Voice</span>
              </button>

              <button
                onClick={() => onRegenerateScene(selectedScene.sceneNumber, 'video')}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Regen Video Clip</span>
              </button>

              <button
                onClick={() => onRegenerateScene(selectedScene.sceneNumber, 'all')}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Scene</span>
              </button>
            </div>
          </div>

          {/* Scene Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Visual Prompt Directive</label>
                <textarea
                  value={selectedScene.visualPrompt}
                  onChange={(e) => onUpdateScene(selectedScene.sceneNumber, { visualPrompt: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Character Dialogue</span>
                </label>
                <input
                  type="text"
                  value={selectedScene.dialogue?.text || ''}
                  onChange={(e) => onUpdateScene(selectedScene.sceneNumber, { dialogue: { character: selectedScene.characters[0] || 'Hero', text: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Action Description</label>
                <textarea
                  value={selectedScene.action}
                  onChange={(e) => onUpdateScene(selectedScene.sceneNumber, { action: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Camera Movement</label>
                  <input
                    type="text"
                    value={selectedScene.cameraMovement}
                    onChange={(e) => onUpdateScene(selectedScene.sceneNumber, { cameraMovement: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Lighting</label>
                  <input
                    type="text"
                    value={selectedScene.lighting}
                    onChange={(e) => onUpdateScene(selectedScene.sceneNumber, { lighting: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Preview Thumbnail & Scene Video Clip */}
          {selectedScene.videoUrl && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scene Clip Rendered Successfully</span>
              </span>
              <a
                href={selectedScene.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View Scene Clip</span>
                <Video className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
