import { Router } from 'express';
import { db } from '../db/database';
import { imageProvider } from '../services/imageProvider';
import { v4 as uuidv4 } from 'uuid';

export const characterRouter = Router();

// Get characters library
characterRouter.get('/', (req, res) => {
  res.json(db.getCharacters());
});

// Save or create character
characterRouter.post('/', async (req, res) => {
  try {
    const charData = req.body;
    if (!charData.name) {
      res.status(400).json({ error: 'Character name is required.' });
      return;
    }

    if (!charData.id) charData.id = uuidv4();

    // Generate reference avatar image if missing
    if (!charData.referenceImage) {
      const sysSettings = db.getSettings();
      const prompt = `Character portrait avatar of ${charData.name}, ${charData.appearance || ''}, ${charData.clothing || ''}, high detail 8k`;
      charData.referenceImage = await imageProvider.generateImage(prompt, 512, 512, sysSettings.imageApiKey);
    }

    const saved = db.saveCharacter(charData);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update character
characterRouter.put('/:id', (req, res) => {
  try {
    const existing = db.getCharacterById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Character not found.' });
      return;
    }

    const updated = db.saveCharacter({
      ...existing,
      ...req.body,
      id: req.params.id
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete character
characterRouter.delete('/:id', (req, res) => {
  const success = db.deleteCharacter(req.params.id);
  if (success) {
    res.json({ message: 'Character deleted.' });
  } else {
    res.status(404).json({ error: 'Character not found.' });
  }
});

// Generate character reference avatar
characterRouter.post('/generate-avatar', async (req, res) => {
  try {
    const { name, appearance, clothing, visualStyle } = req.body;
    const sysSettings = db.getSettings();
    const prompt = `Character avatar, ${name || 'Hero'}, ${appearance || 'stylish'}, ${clothing || 'modern coat'}, ${visualStyle || 'cinematic'} style, portrait`;
    const avatarUrl = await imageProvider.generateImage(prompt, 512, 512, sysSettings.imageApiKey);
    res.json({ referenceImage: avatarUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
