import { db } from '../db/database';
import { llmProvider } from '../services/llmProvider';
import { imageProvider } from '../services/imageProvider';
import { voiceProvider } from '../services/voiceProvider';
import { audioEngine } from '../services/audioEngine';
import { videoProvider } from '../services/videoProvider';
import { videoComposer, CompositeSceneItem } from '../services/videoComposer';
import { Project, SceneData } from '../types';

class VideoGeneratorQueue {
  private activeJobs: Set<string> = new Set();

  public isJobActive(projectId: string): boolean {
    return this.activeJobs.has(projectId);
  }

  public async startGenerationJob(projectId: string): Promise<void> {
    if (this.activeJobs.has(projectId)) {
      console.log(`[VideoGeneratorQueue] Job for project ${projectId} is already running.`);
      return;
    }

    this.activeJobs.add(projectId);
    
    // Execute asynchronously in background without awaiting in calling route
    this.runGenerationPipeline(projectId).finally(() => {
      this.activeJobs.delete(projectId);
    });
  }

  private async runGenerationPipeline(projectId: string): Promise<void> {
    const project = db.getProjectById(projectId);
    if (!project || !project.storyPlan) {
      console.error(`[VideoGeneratorQueue] Cannot start job: Project ${projectId} not found or missing story plan.`);
      return;
    }

    const settings = db.getSettings();
    const plan = project.storyPlan;

    try {
      // Step 1: Update status to generating
      project.status = 'generating';
      project.progressStep = 'Creating characters...';
      db.saveProject(project);

      // Step 2: Generate character avatars & ensure identities exist in DB
      for (const char of plan.characters) {
        if (!char.referenceImage) {
          try {
            const avatarUrl = await imageProvider.generateImage(
              `Character avatar profile, ${char.name}, ${char.appearance}, ${char.clothing}, ${plan.visualStyle} style`,
              512,
              512,
              settings.imageApiKey
            );
            char.referenceImage = avatarUrl;
            db.saveCharacter(char);
          } catch (e) {
            console.warn(`[VideoGeneratorQueue] Avatar generation warning for character ${char.name}:`, e);
          }
        }
      }

      // Save updated plan with character reference images
      project.storyPlan = plan;
      db.saveProject(project);

      // Step 3: Preparing scenes...
      project.progressStep = 'Preparing scenes...';
      project.totalScenes = plan.scenes.length;
      db.saveProject(project);

      const compositeScenes: CompositeSceneItem[] = [];

      // Step 4: Generate individual scenes (visuals + video clip + voice dialogue + sound effect)
      for (let i = 0; i < plan.scenes.length; i++) {
        const scene = plan.scenes[i];
        project.currentSceneIndex = i + 1;
        project.progressStep = `Generating Scene ${i + 1} of ${plan.scenes.length}...`;
        db.saveProject(project);

        scene.status = 'generating';
        db.saveProject(project);

        try {
          // Generate visual image keyframe if needed
          if (!scene.imageUrl) {
            const charRef = plan.characters.find(c => scene.characters.includes(c.name))?.referenceImage;
            const imgPrompt = `${plan.visualStyle} style, ${scene.location}, ${scene.action}, ${scene.lighting}`;
            scene.imageUrl = await imageProvider.generateImage(
              imgPrompt, 
              plan.aspectRatio === '16:9' ? 1920 : 1080,
              plan.aspectRatio === '16:9' ? 1080 : 1920,
              settings.imageApiKey
            );
          }

          // Generate video clip for scene
          if (!scene.videoUrl) {
            scene.videoUrl = await videoProvider.generateSceneClip(
              scene.visualPrompt,
              scene.duration,
              plan.aspectRatio,
              scene.imageUrl,
              settings.videoApiKey
            );
          }

          // Generate dialogue voice audio if present
          if (scene.dialogue && scene.dialogue.text && !scene.dialogue.audioUrl) {
            const charVoice = plan.characters.find(c => c.name === scene.dialogue?.character)?.voice || 'Male';
            scene.dialogue.audioUrl = await voiceProvider.generateDialogueAudio(
              scene.dialogue.text,
              charVoice,
              'en',
              settings.voiceApiKey
            );
          }

          // Generate sound effect if present
          if (scene.audioPrompt && !scene.soundEffectUrl) {
            scene.soundEffectUrl = await audioEngine.generateSoundEffect(scene.audioPrompt);
          }

          scene.status = 'completed';
          db.saveProject(project);

          compositeScenes.push({
            videoUrl: scene.videoUrl,
            audioUrl: scene.dialogue?.audioUrl,
            sfxUrl: scene.soundEffectUrl,
            dialogueText: scene.dialogue?.text,
            characterName: scene.dialogue?.character,
            duration: scene.duration
          });

        } catch (sceneErr: any) {
          console.error(`[VideoGeneratorQueue] Failed generating scene ${scene.sceneNumber}:`, sceneErr);
          scene.status = 'failed';
          scene.errorMessage = sceneErr.message || 'Scene generation error';
          db.saveProject(project);
        }
      }

      // Step 5: Generate Background Music
      project.progressStep = 'Generating background music...';
      db.saveProject(project);

      const totalDuration = plan.scenes.reduce((sum, s) => sum + s.duration, 0);
      const bgmUrl = await audioEngine.generateBackgroundMusic(plan.genre, totalDuration);

      // Step 6: Assemble final edited video with FFmpeg
      project.progressStep = 'Rendering final video with audio & transitions...';
      db.saveProject(project);

      const finalVideoUrl = await videoComposer.assembleFinalVideo(
        compositeScenes,
        bgmUrl,
        plan.aspectRatio
      );

      // Step 7: Mark project as completed!
      project.status = 'completed';
      project.progressStep = 'Video generation completed successfully!';
      project.finalVideoUrl = finalVideoUrl;
      db.saveProject(project);

      console.log(`[VideoGeneratorQueue] Project ${projectId} completed! Final URL: ${finalVideoUrl}`);

    } catch (err: any) {
      console.error(`[VideoGeneratorQueue] Pipeline error for project ${projectId}:`, err);
      project.status = 'failed';
      project.errorMessage = err.message || 'Generation job failed';
      project.progressStep = 'Generation failed.';
      db.saveProject(project);
    }
  }

  /**
   * Regenerates a single specific scene without restarting the entire project
   */
  public async regenerateSingleScene(
    projectId: string, 
    sceneNumber: number, 
    type: 'video' | 'voice' | 'image' | 'all' = 'all'
  ): Promise<Project> {
    const project = db.getProjectById(projectId);
    if (!project || !project.storyPlan) throw new Error('Project not found');

    const scene = project.storyPlan.scenes.find(s => s.sceneNumber === sceneNumber);
    if (!scene) throw new Error(`Scene ${sceneNumber} not found`);

    const settings = db.getSettings();
    const plan = project.storyPlan;

    scene.status = 'generating';
    db.saveProject(project);

    try {
      if (type === 'image' || type === 'all') {
        const imgPrompt = `${plan.visualStyle} style, ${scene.location}, ${scene.action}, ${scene.lighting}`;
        scene.imageUrl = await imageProvider.generateImage(
          imgPrompt, 
          plan.aspectRatio === '16:9' ? 1920 : 1080,
          plan.aspectRatio === '16:9' ? 1080 : 1920,
          settings.imageApiKey
        );
      }

      if (type === 'voice' || type === 'all') {
        if (scene.dialogue && scene.dialogue.text) {
          const charVoice = plan.characters.find(c => c.name === scene.dialogue?.character)?.voice || 'Male';
          scene.dialogue.audioUrl = await voiceProvider.generateDialogueAudio(
            scene.dialogue.text,
            charVoice,
            'en',
            settings.voiceApiKey
          );
        }
      }

      if (type === 'video' || type === 'all') {
        scene.videoUrl = await videoProvider.generateSceneClip(
          scene.visualPrompt,
          scene.duration,
          plan.aspectRatio,
          scene.imageUrl,
          settings.videoApiKey
        );
      }

      scene.status = 'completed';
      db.saveProject(project);

      // Re-trigger fast background re-stitching of final video
      this.resembleProjectVideo(project);

      return project;
    } catch (err: any) {
      scene.status = 'failed';
      scene.errorMessage = err.message || 'Scene regeneration failed';
      db.saveProject(project);
      throw err;
    }
  }

  private async resembleProjectVideo(project: Project) {
    if (!project.storyPlan) return;
    try {
      const compositeScenes: CompositeSceneItem[] = project.storyPlan.scenes
        .filter(s => s.status === 'completed' && s.videoUrl)
        .map(s => ({
          videoUrl: s.videoUrl!,
          audioUrl: s.dialogue?.audioUrl,
          sfxUrl: s.soundEffectUrl,
          dialogueText: s.dialogue?.text,
          characterName: s.dialogue?.character,
          duration: s.duration
        }));

      const totalDuration = project.storyPlan.scenes.reduce((sum, s) => sum + s.duration, 0);
      const bgmUrl = await audioEngine.generateBackgroundMusic(project.storyPlan.genre, totalDuration);

      project.finalVideoUrl = await videoComposer.assembleFinalVideo(
        compositeScenes,
        bgmUrl,
        project.storyPlan.aspectRatio
      );
      db.saveProject(project);
    } catch (e) {
      console.warn('[VideoGeneratorQueue] Re-stitching video warning:', e);
    }
  }
}

export const videoGeneratorQueue = new VideoGeneratorQueue();
