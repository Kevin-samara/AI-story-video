import React, { useState, useEffect } from 'react';
import { SystemSettings, VideoQuality } from '../types';
import { api } from '../services/api';
import { Sliders, Key, ShieldCheck, Zap, Server, CheckCircle2, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [llmApiKey, setLlmApiKey] = useState<string>('');
  const [imageApiKey, setImageApiKey] = useState<string>('');
  const [videoApiKey, setVideoApiKey] = useState<string>('');
  const [voiceApiKey, setVoiceApiKey] = useState<string>('');
  const [lowCostMode, setLowCostMode] = useState<boolean>(false);
  const [defaultQuality, setDefaultQuality] = useState<VideoQuality>('720p');

  const loadData = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
      setLlmApiKey(s.llmApiKey || '');
      setImageApiKey(s.imageApiKey || '');
      setVideoApiKey(s.videoApiKey || '');
      setVoiceApiKey(s.voiceApiKey || '');
      setLowCostMode(s.lowCostMode);
      setDefaultQuality(s.defaultQuality);

      const h = await api.getHealth();
      setHealth(h);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateSettings({
        llmApiKey,
        imageApiKey,
        videoApiKey,
        voiceApiKey,
        lowCostMode,
        defaultQuality
      });
      setSettings(updated);
      alert('Settings & API Keys updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-3">
          <Sliders className="w-7 h-7 text-amber-400" />
          <span>AI Studio Settings & Provider API Keys</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure API keys securely for Gemini, ElevenLabs, Runway, and image providers. All API keys are processed strictly backend-side.
        </p>
      </div>

      {/* Provider Health Status Cards */}
      {health && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs font-bold">LLM Story Engine</span>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{health.providers.llm}</span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs font-bold">Image Generator</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{health.providers.image}</span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs font-bold">Video Clip Engine</span>
            <div className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{health.providers.video}</span>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-xs font-bold">TTS Voice Engine</span>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{health.providers.voice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        
        <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <span>API Key Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Gemini / LLM API Key (LLM_API_KEY)</label>
            <input
              type="password"
              value={llmApiKey}
              onChange={(e) => setLlmApiKey(e.target.value)}
              placeholder="Enter Gemini/OpenAI key or leave empty for free auto engine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Image Provider API Key (IMAGE_API_KEY)</label>
            <input
              type="password"
              value={imageApiKey}
              onChange={(e) => setImageApiKey(e.target.value)}
              placeholder="Leave blank for Pollinations AI (Free High-Res)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Video Provider API Key (VIDEO_API_KEY)</label>
            <input
              type="password"
              value={videoApiKey}
              onChange={(e) => setVideoApiKey(e.target.value)}
              placeholder="Runway / Luma key or leave blank for Canvas-FFmpeg Engine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Voice ElevenLabs API Key (VOICE_API_KEY)</label>
            <input
              type="password"
              value={voiceApiKey}
              onChange={(e) => setVoiceApiKey(e.target.value)}
              placeholder="ElevenLabs key or leave blank for Built-in Audio Synth"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4 text-xs">
          <h4 className="font-bold text-white text-sm">Rendering Defaults & Cost Controls</h4>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-white block">Low Cost Testing Mode</span>
              <span className="text-slate-400 text-xs">Generates faster lower-resolution preview clips to conserve resources.</span>
            </div>
            <input
              type="checkbox"
              checked={lowCostMode}
              onChange={(e) => setLowCostMode(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Default Render Resolution</label>
            <select
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value as VideoQuality)}
              className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            >
              <option value="480p">480p (Fast preview)</option>
              <option value="720p">720p HD (Balanced default)</option>
              <option value="1080p">1080p Full HD (Production Quality)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
