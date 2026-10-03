import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Film, 
  Users, 
  Video, 
  Play, 
  ArrowRight, 
  Zap, 
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Project, CharacterIdentity } from '../types';
import { api } from '../services/api';

interface DashboardPageProps {
  onNavigateToCreate: () => void;
  onSelectProject: (p: Project) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToCreate,
  onSelectProject
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [characters, setCharacters] = useState<CharacterIdentity[]>([]);
  const [quickPrompt, setQuickPrompt] = useState<string>('');

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
    api.getCharacters().then(setCharacters).catch(() => {});
  }, []);

  const completedVideos = projects.filter(p => p.status === 'completed');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-studio-900 to-amber-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Story Video Studio 1.0</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Turn Any Story Prompt into a Full-Length AI Video
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Generate 60-second cinematic story videos with consistent fictional characters, automatic scene breakdowns, TTS dialogue voices, sound effects, and FFmpeg composition.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Video className="w-5 h-5 fill-slate-950" />
              <span>Create New AI Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block mb-1">Total Projects</span>
            <span className="text-2xl font-extrabold text-white">{projects.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block mb-1">Generated Videos</span>
            <span className="text-2xl font-extrabold text-white">{completedVideos.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block mb-1">Character Identities</span>
            <span className="text-2xl font-extrabold text-white">{characters.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block mb-1">AI Engine Status</span>
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">Online & Ready</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-['Outfit']">Recent Video Projects</h2>
          <button onClick={onNavigateToCreate} className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
            <span>Start New Video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div 
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                  proj.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : proj.status === 'generating'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {proj.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {proj.settings.duration}s • {proj.settings.aspectRatio}
                </span>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">{proj.prompt}</p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(proj.createdAt).toLocaleDateString()}
                </span>
                <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Open Project &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
