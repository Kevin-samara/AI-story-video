import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { api } from '../services/api';
import { Clapperboard, Download, Play, Share2 } from 'lucide-react';

interface GeneratedVideosPageProps {
  onSelectProject: (p: Project) => void;
}

export const GeneratedVideosPage: React.FC<GeneratedVideosPageProps> = ({ onSelectProject }) => {
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.getProjects().then(list => {
      setCompletedProjects(list.filter(p => p.status === 'completed'));
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
          <Clapperboard className="w-7 h-7 text-amber-400" />
          <span>Completed AI Videos</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Stream, preview, download, or edit your final rendered story videos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedProjects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-4 group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">{proj.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.prompt}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{proj.settings.duration}s • {proj.settings.aspectRatio}</span>
              <a
                href={proj.finalVideoUrl || '/media/outputs/sample_cat.mp4'}
                download
                onClick={(e) => e.stopPropagation()}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
