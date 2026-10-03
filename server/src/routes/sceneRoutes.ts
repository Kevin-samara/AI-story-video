import { Router } from 'express';
import { db } from '../db/database';
import { videoGeneratorQueue } from '../jobs/videoGeneratorQueue';

export const sceneRouter = Router();

// Update scene data
sceneRouter.put('/projects/:id/scenes/:sceneNumber', (req, res) => {
  try {
    const { id, sceneNumber } = req.params;
    const project = db.getProjectById(id);
    if (!project || !project.storyPlan) {
      res.status(404).json({ error: 'Project or plan not found.' });
      return;
    }

    const sNum = parseInt(sceneNumber, 10);
    const sceneIndex = project.storyPlan.scenes.findIndex(s => s.sceneNumber === sNum);
    if (sceneIndex === -1) {
      res.status(404).json({ error: `Scene ${sceneNumber} not found.` });
      return;
    }

    const updatedSceneData = req.body;
    project.storyPlan.scenes[sceneIndex] = {
      ...project.storyPlan.scenes[sceneIndex],
      ...updatedSceneData
    };

    db.saveProject(project);
    res.json(project.storyPlan.scenes[sceneIndex]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Regenerate single scene asset (video, voice, image, or all)
sceneRouter.post('/projects/:id/scenes/:sceneNumber/regenerate', async (req, res) => {
  try {
    const { id, sceneNumber } = req.params;
    const { type } = req.body; // 'video' | 'voice' | 'image' | 'all'
    const sNum = parseInt(sceneNumber, 10);

    const updatedProject = await videoGeneratorQueue.regenerateSingleScene(id, sNum, type || 'all');
    res.json(updatedProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Scene regeneration failed' });
  }
});
