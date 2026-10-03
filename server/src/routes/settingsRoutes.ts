import { Router } from 'express';
import { db } from '../db/database';

export const settingsRouter = Router();

// Get settings with safe masked API keys
settingsRouter.get('/', (req, res) => {
  const current = db.getSettings();
  
  // Return masked keys for security so frontend doesn't expose secrets
  const safeSettings = {
    ...current,
    llmApiKey: current.llmApiKey ? '••••••••' + current.llmApiKey.slice(-4) : '',
    imageApiKey: current.imageApiKey ? '••••••••' + current.imageApiKey.slice(-4) : '',
    videoApiKey: current.videoApiKey ? '••••••••' + current.videoApiKey.slice(-4) : '',
    voiceApiKey: current.voiceApiKey ? '••••••••' + current.voiceApiKey.slice(-4) : '',
    hasLlmApiKey: Boolean(current.llmApiKey),
    hasImageApiKey: Boolean(current.imageApiKey),
    hasVideoApiKey: Boolean(current.videoApiKey),
    hasVoiceApiKey: Boolean(current.voiceApiKey)
  };

  res.json(safeSettings);
});

// Update settings & API keys
settingsRouter.put('/', (req, res) => {
  try {
    const { 
      llmProvider, 
      imageProvider, 
      videoProvider, 
      voiceProvider, 
      storageProvider,
      llmApiKey, 
      imageApiKey, 
      videoApiKey, 
      voiceApiKey, 
      lowCostMode, 
      defaultQuality 
    } = req.body;

    const current = db.getSettings();

    const updated = db.updateSettings({
      ...(llmProvider && { llmProvider }),
      ...(imageProvider && { imageProvider }),
      ...(videoProvider && { videoProvider }),
      ...(voiceProvider && { voiceProvider }),
      ...(storageProvider && { storageProvider }),
      ...(llmApiKey && !llmApiKey.startsWith('••••') && { llmApiKey }),
      ...(imageApiKey && !imageApiKey.startsWith('••••') && { imageApiKey }),
      ...(videoApiKey && !videoApiKey.startsWith('••••') && { videoApiKey }),
      ...(voiceApiKey && !voiceApiKey.startsWith('••••') && { voiceApiKey }),
      ...(typeof lowCostMode === 'boolean' ? { lowCostMode } : {}),
      ...(defaultQuality && { defaultQuality })
    });

    res.json({
      ...updated,
      llmApiKey: updated.llmApiKey ? '••••••••' + updated.llmApiKey.slice(-4) : '',
      imageApiKey: updated.imageApiKey ? '••••••••' + updated.imageApiKey.slice(-4) : '',
      videoApiKey: updated.videoApiKey ? '••••••••' + updated.videoApiKey.slice(-4) : '',
      voiceApiKey: updated.voiceApiKey ? '••••••••' + updated.voiceApiKey.slice(-4) : '',
      hasLlmApiKey: Boolean(updated.llmApiKey),
      hasImageApiKey: Boolean(updated.imageApiKey),
      hasVideoApiKey: Boolean(updated.videoApiKey),
      hasVoiceApiKey: Boolean(updated.voiceApiKey)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// System provider status health check
settingsRouter.get('/status', (req, res) => {
  const current = db.getSettings();
  res.json({
    status: 'online',
    version: '1.0.0',
    engine: 'Canvas-FFmpeg Studio Engine',
    providers: {
      llm: current.llmApiKey ? 'Gemini / OpenAI Active' : 'Smart Heuristic Engine Active',
      image: current.imageApiKey ? 'Stability / Custom API Active' : 'Pollinations AI Active (Free High-Res)',
      video: current.videoApiKey ? 'External Video API Active' : 'Canvas-FFmpeg Motion Synthesizer Active',
      voice: current.voiceApiKey ? 'ElevenLabs TTS Active' : 'Built-in Audio Wave Synth Active'
    }
  });
});
