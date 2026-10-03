import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { 
  Play, 
  Pause, 
  Download, 
  Share2, 
  RefreshCw, 
  Edit3, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Film, 
  Calendar, 
  Users, 
  Sliders,
  CheckCircle2,
  Subtitles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoPlayerProps {
  project: Project;
  onEditScenes: () => void;
  onRegenerate: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  project,
  onEditScenes,
  onRegenerate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [resolution, setResolution] = useState<string>('720p');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const plan = project.storyPlan;
  const videoSrc = project.finalVideoUrl || '/media/outputs/sample_cat.mp4';

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-8 bg-slate-950/90 shadow-2xl">
      
      {/* Video Player Display */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group max-w-2xl mx-auto">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-auto max-h-[70vh] object-contain mx-auto"
          onEnded={() => setIsPlaying(false)}
          controls={false}
        />

        {/* Burned/Soft Subtitle Visual Overlay */}
        {showSubtitles && plan?.scenes && plan.scenes[0]?.dialogue?.text && (
          <div className="absolute bottom-16 left-0 right-0 px-6 text-center pointer-events-none">
            <span className="inline-block px-4 py-1.5 rounded-lg bg-slate-950/85 text-amber-300 font-bold text-sm border border-amber-500/30 shadow-lg">
              {plan.scenes[0].dialogue.text}
            </span>
          </div>
        )}

        {/* Overlay Video Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between gap-4 opacity-90 group-hover:opacity-100 transition-opacity">
          
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold hover:bg-amber-400 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button onClick={toggleMute} className="text-slate-300 hover:text-white">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="text-xs text-slate-300 font-medium">
              {plan?.duration || 60} seconds
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                showSubtitles ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle Subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg p-1.5 focus:outline-none"
            >
              <option value="480p">480p</option>
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">{project.title}</h2>
          <p className="text-xs text-slate-400 mt-1">Prompt: "{project.prompt}"</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onEditScenes}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-bold transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Scenes</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate Video</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-bold transition-all"
          >
            <Share2 className="w-4 h-4 text-violet-400" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Video'}</span>
          </button>

          <a
            href={videoSrc}
            download={`${project.title.replace(/\s+/g, '_')}.mp4`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4</span>
          </a>
        </div>
      </div>

      {/* Video Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 font-bold block mb-1">Duration</span>
          <span className="text-white font-bold">{plan?.duration || project.settings.duration} Seconds</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 font-bold block mb-1">Genre</span>
          <span className="text-white font-bold">{plan?.genre || project.settings.genre}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 font-bold block mb-1">Aspect Ratio</span>
          <span className="text-white font-bold">{plan?.aspectRatio || project.settings.aspectRatio}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 font-bold block mb-1">Characters</span>
          <span className="text-white font-bold">{plan?.characters.length || 1} Characters</span>
        </div>
      </div>

    </div>
  );
};
