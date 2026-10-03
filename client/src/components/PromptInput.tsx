import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, Wand2, Zap, Clock, Tv, Palette, Maximize } from 'lucide-react';
import { ProjectSettings, AspectRatio, Genre, VisualStyle, VideoQuality } from '../types';

interface PromptInputProps {
  onGeneratePlan: (prompt: string, settings: ProjectSettings) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  {
    title: "Lazy Egyptian Cat",
    text: "Create a funny 60-second video about a lazy Egyptian cat who gets a job at a restaurant, gets into trouble with the chef, and eventually becomes the restaurant owner."
  },
  {
    title: "Stranded on Mars",
    text: "A dramatic story about two astronauts stranded on Mars who discover something mysterious underground in an ancient subterranean cavern."
  },
  {
    title: "Neo-Cairo 2090 Chase",
    text: "Create a 60-second cinematic action video about a futuristic Egyptian city in 2090. A 25-year-old male detective in a black coat is chased by rogue combat drones through a neon market."
  },
  {
    title: "Cyber Football Cat",
    text: "Make a hilarious 60-second animated story about a street cat trying out to become a professional football player in a packed stadium."
  }
];

export const PromptInput: React.FC<PromptInputProps> = ({ onGeneratePlan, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Settings State
  const [duration, setDuration] = useState<number>(60);
  const [genre, setGenre] = useState<Genre | string>('Auto-Detect');
  const [visualStyle, setVisualStyle] = useState<VisualStyle | string>('Auto-Detect');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [quality, setQuality] = useState<VideoQuality>('720p');
  const [lowCostMode, setLowCostMode] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGeneratePlan(prompt, {
      duration,
      genre,
      visualStyle,
      aspectRatio,
      quality,
      lowCostMode
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-amber-400" />
            <span>Describe Your Video</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Write your story idea in free text. The AI will extract characters, scenes, dialogue & camera shots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            showAdvanced 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{showAdvanced ? 'Hide Advanced Options' : 'Advanced Controls'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Prompt Input Box */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create... e.g. A funny 60-second video about a lazy Egyptian cat who gets a job at a restaurant, gets into trouble with the chef, and eventually becomes the restaurant owner."
            rows={5}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-y min-h-[140px]"
            required
          />
          
          <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-medium">
            {prompt.length} characters
          </div>
        </div>

        {/* Preset Sample Prompts */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Quick Prompts</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample.text)}
                className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 text-xs transition-all group"
              >
                <div className="font-bold text-amber-400 group-hover:text-amber-300 mb-1">{sample.title}</div>
                <div className="text-slate-400 line-clamp-2 leading-relaxed">{sample.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Video Settings Drawer */}
        {showAdvanced && (
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-amber-500/10">
            
            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Target Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      duration === d
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario / Genre */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-violet-400" />
                <span>Genre / Scenario</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {['Auto-Detect', 'Drama', 'Comedy', 'Action', 'Horror', 'Romance', 'Mystery', 'Thriller', 'Adventure', 'Fantasy', 'Sci-Fi', 'Documentary'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Visual Style */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Visual Style</span>
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {['Auto-Detect', 'Cinematic', 'Realistic', '3D Animation', 'Cartoon', 'Anime', 'Pixar-like 3D', 'Comic', 'Fantasy', 'Cyberpunk'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-blue-400" />
                <span>Aspect Ratio</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { ratio: '9:16', label: '9:16 (Shorts)' },
                  { ratio: '16:9', label: '16:9 (HD)' },
                  { ratio: '1:1', label: '1:1 (Square)' }
                ].map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => setAspectRatio(item.ratio as AspectRatio)}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                      aspectRatio === item.ratio
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.ratio}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Generate Story Plan Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Free Prompt Mode: AI auto-extracts characters, dialogue & scene timing</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Prompt & Generating Story Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>Generate Story Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
