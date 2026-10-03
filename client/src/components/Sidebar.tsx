import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  FolderKanban, 
  Clapperboard, 
  Sliders,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Video', icon: Video, badge: 'Main' },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'generated', label: 'Generated Videos', icon: Clapperboard },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 bg-studio-950/60 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation</p>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-violet-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Studio Info Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-studio-900 to-amber-950/30 border border-amber-500/20 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Prompt-to-Video AI</span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Type your story prompt. The AI automatically breaks down characters, camera angles, dialogue, audio & FFmpeg video.
        </p>
      </div>
    </aside>
  );
};
