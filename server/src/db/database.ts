import fs from 'fs';
import path from 'path';
import { Project, CharacterIdentity, SystemSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface Schema {
  projects: Record<string, Project>;
  characters: Record<string, CharacterIdentity>;
  settings: SystemSettings;
}

const DEFAULT_SETTINGS: SystemSettings = {
  llmProvider: 'auto',
  imageProvider: 'pollinations',
  videoProvider: 'canvas-ffmpeg',
  voiceProvider: 'web-tts',
  storageProvider: 'local',
  lowCostMode: false,
  defaultQuality: '720p',
};

class Database {
  private data: Schema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const uploadsDir = path.join(DATA_DIR, 'uploads');
    const outputsDir = path.join(DATA_DIR, 'outputs');
    const scenesDir = path.join(DATA_DIR, 'scenes');

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
    if (!fs.existsSync(scenesDir)) fs.mkdirSync(scenesDir, { recursive: true });
  }

  private loadData(): Schema {
    if (!fs.existsSync(DB_FILE)) {
      const initialData: Schema = {
        projects: {},
        characters: {},
        settings: DEFAULT_SETTINGS,
      };
      this.saveData(initialData);
      return initialData;
    }
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        projects: parsed.projects || {},
        characters: parsed.characters || {},
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      };
    } catch (err) {
      console.error('Failed to parse database file, starting fresh:', err);
      return {
        projects: {},
        characters: {},
        settings: DEFAULT_SETTINGS,
      };
    }
  }

  private saveData(data: Schema = this.data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Projects CRUD
  public getProjects(): Project[] {
    return Object.values(this.data.projects).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects[id];
  }

  public saveProject(project: Project): Project {
    project.updatedAt = new Date().toISOString();
    if (!project.createdAt) {
      project.createdAt = new Date().toISOString();
    }
    this.data.projects[project.id] = project;
    this.saveData();
    return project;
  }

  public deleteProject(id: string): boolean {
    if (this.data.projects[id]) {
      delete this.data.projects[id];
      this.saveData();
      return true;
    }
    return false;
  }

  // Characters CRUD
  public getCharacters(): CharacterIdentity[] {
    return Object.values(this.data.characters);
  }

  public getCharacterById(id: string): CharacterIdentity | undefined {
    return this.data.characters[id];
  }

  public saveCharacter(character: CharacterIdentity): CharacterIdentity {
    if (!character.id) {
      character.id = uuidv4();
    }
    this.data.characters[character.id] = character;
    this.saveData();
    return character;
  }

  public deleteCharacter(id: string): boolean {
    if (this.data.characters[id]) {
      delete this.data.characters[id];
      this.saveData();
      return true;
    }
    return false;
  }

  // Settings CRUD
  public getSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
    return this.data.settings;
  }
}

export const db = new Database();
