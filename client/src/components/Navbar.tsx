import React from 'react';
import { Film, Sparkles, Key, Zap } from 'lucide-react';
import { SystemSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SystemSettings | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, settings }) => {
  const hasKeys = settings?.hasLlmApiKey || settings?.hasImageApiKey || settings?.hasVideoApiKey;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-studio-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('create')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-violet-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-['Outfit']">
                AI Story Video Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Cinematic Character Story Engine</p>
          </div>
        </div>

        {/* Quick Actions & Status Badges */}
        <div className="flex items-center gap-3">
          
          {/* Provider Mode Pill */}
          <div 
            onClick={() => setActiveTab('settings')}
            className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              hasKeys 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasKeys ? 'API Keys Active' : 'Free Auto Mode'}</span>
          </div>

          {/* Quick Create Video Button */}
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Create Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
