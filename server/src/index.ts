import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { storyRouter } from './routes/storyRoutes';
import { projectRouter } from './routes/projectRoutes';
import { sceneRouter } from './routes/sceneRoutes';
import { characterRouter } from './routes/characterRoutes';
import { settingsRouter } from './routes/settingsRoutes';
import { db } from './db/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static media server for generated videos, scenes, audio, and avatar images
const dataDir = path.join(__dirname, '../data');
app.use('/media', express.static(dataDir));

// API Routes
app.use('/api/story', storyRouter);
app.use('/api/projects', projectRouter);
app.use('/api', sceneRouter);
app.use('/api/characters', characterRouter);
app.use('/api/settings', settingsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AI Story Video Studio Backend API',
    time: new Date().toISOString()
  });
});

// Seed default sample project if DB is empty
const existingProjects = db.getProjects();
if (existingProjects.length === 0) {
  console.log('[Server] Seeding initial sample project for AI Story Video Studio...');
  db.saveProject({
    id: 'sample-project-cat',
    title: 'Cleo: The Executive Chef Cat',
    prompt: 'Create a funny 60-second video about a lazy Egyptian cat who gets a job at a restaurant, gets into trouble with the chef, and eventually becomes the restaurant owner.',
    settings: {
      duration: 60,
      genre: 'Comedy',
      visualStyle: 'Pixar-like 3D',
      aspectRatio: '9:16',
      quality: '720p',
      lowCostMode: false
    },
    status: 'completed',
    progressStep: 'Video generation completed successfully!',
    currentSceneIndex: 7,
    totalScenes: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🎬 AI Story Video Studio Backend Server Ready!`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`=================================================`);
});
