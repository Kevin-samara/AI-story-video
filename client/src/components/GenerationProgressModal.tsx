import React from 'react';
import { Project } from '../types';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Film, 
  Users, 
  Mic, 
  Music, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface GenerationProgressModalProps {
  project: Project;
  onRetry: () => void;
  onClose: () => void;
}

export const GenerationProgressModal: React.FC<GenerationProgressModalProps> = ({
  project,
  onRetry,
  onClose
}) => {
  const isFailed = project.status === 'failed';
  const isCompleted = project.status === 'completed';

  const plan = project.storyPlan;
  const scenes = plan?.scenes || [];
  const completedScenesCount = scenes.filter(s => s.status === 'completed').length;
  const totalScenesCount = scenes.length || project.totalScenes || 7;

  const progressPercent = isCompleted 
    ? 100 
    : isFailed 
    ? Math.floor((completedScenesCount / totalScenesCount) * 85)
    : Math.floor((completedScenesCount / totalScenesCount) * 85) + 10;

  const stepsList = [
    { label: 'Creating story plan & scene breakdown', done: true },
    { label: 'Generating consistent character identity profiles & avatars', done: Boolean(plan?.characters.some(c => c.referenceImage)) || completedScenesCount > 0 },
    { label: `Generating video clips for scenes (${completedScenesCount}/${totalScenesCount})`, done: completedScenesCount === totalScenesCount },
    { label: 'Synthesizing voice dialogue TTS audio', done: isCompleted },
    { label: 'Composing sound effects & background music', done: isCompleted },
    { label: 'Rendering final MP4 video with FFmpeg', done: isCompleted },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-studio-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative space-y-6 bg-studio-900/95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCompleted 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : isFailed 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isFailed ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <Loader2 className="w-6 h-6 animate-spin" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-['Outfit']">
                {isCompleted ? 'Video Generation Ready!' : isFailed ? 'Generation Encountered an Error' : 'AI Studio Video Engine'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{project.title}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{project.progressStep || 'Processing...'}</span>
            </span>
            <span className="text-slate-400 font-mono">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              style={{ width: `${progressPercent}%` }} 
              className={`h-full rounded-full transition-all duration-500 ${
                isFailed ? 'bg-rose-500' : isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-violet-500'
              }`}
            />
          </div>
        </div>

        {/* Step Checklist */}
        <div className="space-y-2.5 pt-2">
          {stepsList.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className={`font-medium ${step.done ? 'text-slate-200' : 'text-slate-500'}`}>
                {step.label}
              </span>
              <div>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isFailed && idx === completedScenesCount ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Loader2 className="w-3.5 h-3.5 text-slate-600 animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Handling Box */}
        {isFailed && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{project.errorMessage || 'Generation failed on current scene.'}</span>
            </div>
            <p className="text-xs text-slate-300">
              Don't worry — completed scenes remain saved. You can retry generation or edit individual scene prompts.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            </div>
          </div>
        )}

        {/* Close / View Video Action */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-all"
          >
            {isCompleted ? 'View Final Video' : 'Close & Run in Background'}
          </button>
        </div>

      </div>
    </div>
  );
};
