import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { api } from '../services/api';
import { FolderKanban, Film, Trash2, Play, Clock, ArrowRight } from 'lucide-react';

interface ProjectsPageProps {
  onSelectProject: (p: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (e) {}
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this project?')) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
            <FolderKanban className="w-7 h-7 text-amber-400" />
            <span>All Video Projects</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and reopen your saved video projects, scenes, and generated assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${
                  proj.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : proj.status === 'generating'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {proj.status}
                </span>

                <button
                  onClick={(e) => handleDelete(proj.id, e)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3">{proj.prompt}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {proj.settings.duration}s • {proj.settings.genre}
              </span>
              <span className="font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Reopen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
