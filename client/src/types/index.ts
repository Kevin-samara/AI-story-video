export type AspectRatio = '16:9' | '9:16' | '1:1';
export type VideoQuality = '480p' | '720p' | '1080p';

export type Genre = 
  | 'Drama'
  | 'Comedy'
  | 'Action'
  | 'Horror'
  | 'Romance'
  | 'Mystery'
  | 'Thriller'
  | 'Adventure'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Documentary'
  | 'Auto-Detect'
  | 'Custom';

export type VisualStyle = 
  | 'Cinematic'
  | 'Realistic'
  | '3D Animation'
  | 'Cartoon'
  | 'Anime'
  | 'Pixar-like 3D'
  | 'Comic'
  | 'Fantasy'
  | 'Cyberpunk'
  | 'Auto-Detect'
  | 'Custom';

export interface CharacterIdentity {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  appearance: string;
  hair?: string;
  face?: string;
  clothing?: string;
  bodyType?: string;
  personality?: string;
  voice: string;
  accent?: string;
  description: string;
  referenceImage?: string;
}

export interface SceneData {
  sceneNumber: number;
  duration: number;
  startTime: number;
  endTime: number;
  location: string;
  characters: string[];
  action: string;
  dialogue?: {
    character: string;
    text: string;
    audioUrl?: string;
  };
  cameraMovement: string;
  cameraAngle: string;
  lighting: string;
  atmosphere: string;
  visualPrompt: string;
  audioPrompt: string;
  transition: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  videoUrl?: string;
  imageUrl?: string;
  soundEffectUrl?: string;
  errorMessage?: string;
}

export interface StoryPlan {
  title: string;
  genre: string;
  duration: number;
  aspectRatio: AspectRatio;
  visualStyle: string;
  voiceStyle: string;
  musicStyle: string;
  characters: CharacterIdentity[];
  locations: string[];
  scenes: SceneData[];
  rawPrompt: string;
}

export interface ProjectSettings {
  duration: number;
  genre: Genre | string;
  visualStyle: VisualStyle | string;
  aspectRatio: AspectRatio;
  quality: VideoQuality;
  lowCostMode: boolean;
}

export interface Project {
  id: string;
  title: string;
  prompt: string;
  settings: ProjectSettings;
  status: 'draft' | 'plan_ready' | 'generating' | 'completed' | 'failed';
  progressStep: string;
  currentSceneIndex: number;
  totalScenes: number;
  storyPlan?: StoryPlan;
  finalVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface SystemSettings {
  llmProvider: 'auto' | 'gemini' | 'openai' | 'mock';
  imageProvider: 'pollinations' | 'stability' | 'mock';
  videoProvider: 'canvas-ffmpeg' | 'runway' | 'luma' | 'pika' | 'mock';
  voiceProvider: 'web-tts' | 'elevenlabs' | 'openai-tts' | 'mock';
  storageProvider: 'local' | 's3';
  llmApiKey?: string;
  imageApiKey?: string;
  videoApiKey?: string;
  voiceApiKey?: string;
  hasLlmApiKey?: boolean;
  hasImageApiKey?: boolean;
  hasVideoApiKey?: boolean;
  hasVoiceApiKey?: boolean;
  lowCostMode: boolean;
  defaultQuality: VideoQuality;
}
