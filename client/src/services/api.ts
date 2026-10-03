import { Project, StoryPlan, CharacterIdentity, SystemSettings, ProjectSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Story Engine
  async generateStoryPlan(prompt: string, settings: ProjectSettings): Promise<StoryPlan> {
    const res = await fetch(`${API_BASE}/story/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, settings })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate story plan.');
    }
    return res.json();
  },

  async extractCharacters(prompt: string): Promise<CharacterIdentity[]> {
    const res = await fetch(`${API_BASE}/story/extract-characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Failed to extract characters.');
    return res.json();
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to load projects.');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project.');
    return res.json();
  },

  async createProject(prompt: string, settings: ProjectSettings, storyPlan?: StoryPlan): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, settings, storyPlan })
    });
    if (!res.ok) throw new Error('Failed to create project.');
    return res.json();
  },

  async updateProjectPlan(projectId: string, storyPlan: StoryPlan): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/plan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyPlan })
    });
    if (!res.ok) throw new Error('Failed to update story plan.');
    return res.json();
  },

  async startGeneration(projectId: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/generate`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to start generation job.');
    return res.json();
  },

  async deleteProject(projectId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project.');
  },

  // Scene Operations
  async updateScene(projectId: string, sceneNumber: number, sceneData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/scenes/${sceneNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sceneData)
    });
    if (!res.ok) throw new Error('Failed to update scene.');
    return res.json();
  },

  async regenerateScene(projectId: string, sceneNumber: number, type: 'video' | 'voice' | 'image' | 'all' = 'all'): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/scenes/${sceneNumber}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (!res.ok) throw new Error('Failed to regenerate scene.');
    return res.json();
  },

  // Characters
  async getCharacters(): Promise<CharacterIdentity[]> {
    const res = await fetch(`${API_BASE}/characters`);
    if (!res.ok) throw new Error('Failed to fetch characters.');
    return res.json();
  },

  async saveCharacter(character: Partial<CharacterIdentity>): Promise<CharacterIdentity> {
    const res = await fetch(`${API_BASE}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    if (!res.ok) throw new Error('Failed to save character.');
    return res.json();
  },

  async deleteCharacter(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/characters/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete character.');
  },

  async generateAvatar(name: string, appearance: string, clothing: string): Promise<string> {
    const res = await fetch(`${API_BASE}/characters/generate-avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, appearance, clothing })
    });
    if (!res.ok) throw new Error('Failed to generate avatar.');
    const data = await res.json();
    return data.referenceImage;
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings.');
    return res.json();
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings.');
    return res.json();
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/status`);
    if (!res.ok) throw new Error('Failed health check.');
    return res.json();
  }
};
