import { Router } from 'express';
import { db } from '../db/database';
import { videoGeneratorQueue } from '../jobs/videoGeneratorQueue';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../types';

export const projectRouter = Router();

// Get all projects
projectRouter.get('/', (req, res) => {
  const projects = db.getProjects();
  res.json(projects);
});

// Get project by ID
projectRouter.get('/:id', (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json(project);
});

// Create new project
projectRouter.post('/', (req, res) => {
  try {
    const { prompt, settings, storyPlan } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const projectId = uuidv4();
    const newProject: Project = {
      id: projectId,
      title: storyPlan?.title || `Video Project ${new Date().toLocaleDateString()}`,
      prompt,
      settings: settings || {
        duration: 60,
        genre: 'Auto-Detect',
        visualStyle: 'Cinematic',
        aspectRatio: '9:16',
        quality: '720p',
        lowCostMode: false
      },
      status: storyPlan ? 'plan_ready' : 'draft',
      progressStep: 'Plan Created',
      currentSceneIndex: 0,
      totalScenes: storyPlan?.scenes?.length || 0,
      storyPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveProject(newProject);
    res.status(201).json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update story plan before generation
projectRouter.put('/:id/plan', (req, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const { storyPlan } = req.body;
    if (!storyPlan) {
      res.status(400).json({ error: 'storyPlan payload is required.' });
      return;
    }

    project.storyPlan = storyPlan;
    project.totalScenes = storyPlan.scenes?.length || 0;
    project.title = storyPlan.title || project.title;
    project.status = 'plan_ready';
    db.saveProject(project);

    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start background generation job
projectRouter.post('/:id/generate', async (req, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    if (!project.storyPlan) {
      res.status(400).json({ error: 'Story plan must be generated and approved before starting generation.' });
      return;
    }

    // Trigger async job
    videoGeneratorQueue.startGenerationJob(project.id);
    
    // Return updated status immediately
    project.status = 'generating';
    project.progressStep = 'Starting generation worker...';
    db.saveProject(project);

    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
projectRouter.delete('/:id', (req, res) => {
  const success = db.deleteProject(req.params.id);
  if (success) {
    res.json({ message: 'Project deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Project not found.' });
  }
});
