import { Router } from 'express';
import { llmProvider } from '../services/llmProvider';
import { db } from '../db/database';

export const storyRouter = Router();

// Generate story plan from user prompt & options
storyRouter.post('/plan', async (req, res) => {
  try {
    const { prompt, settings } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'A valid text prompt is required.' });
      return;
    }

    const sysSettings = db.getSettings();
    const plan = await llmProvider.generateStoryPlan(prompt, settings || {}, sysSettings.llmApiKey);
    res.json(plan);
  } catch (err: any) {
    console.error('[storyRouter] Error generating story plan:', err);
    res.status(500).json({ error: err.message || 'Failed to generate story plan.' });
  }
});

// Extract character profiles from prompt
storyRouter.post('/extract-characters', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const sysSettings = db.getSettings();
    const plan = await llmProvider.generateStoryPlan(prompt, { duration: 60, genre: 'Auto-Detect', visualStyle: 'Cinematic', aspectRatio: '9:16', quality: '720p', lowCostMode: false }, sysSettings.llmApiKey);
    res.json(plan.characters);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
