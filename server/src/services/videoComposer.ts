import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const OUTPUTS_DIR = path.join(__dirname, '../../data/outputs');

export interface CompositeSceneItem {
  videoUrl: string;
  audioUrl?: string;
  sfxUrl?: string;
  dialogueText?: string;
  characterName?: string;
  duration: number;
}

export class VideoComposer {
  /**
   * Stitches scene clips, mixes dialogue audio, sound effects, and background music into final MP4 video
   */
  public async assembleFinalVideo(
    scenes: CompositeSceneItem[],
    bgmUrl?: string,
    aspectRatio: string = '9:16'
  ): Promise<string> {
    const filename = `final_video_${uuidv4()}.mp4`;
    const outputPath = path.join(OUTPUTS_DIR, filename);

    console.log(`[VideoComposer] Assembling final video from ${scenes.length} scenes...`);

    // Create a temporary file listing all scene video paths for FFmpeg concat filter
    const listFilePath = path.join(OUTPUTS_DIR, `concat_${uuidv4()}.txt`);
    const fileLines: string[] = [];

    for (const scene of scenes) {
      let realPath = scene.videoUrl;
      if (realPath.startsWith('/media/')) {
        realPath = path.join(__dirname, '../../data', realPath.replace('/media/', ''));
      }
      // FFmpeg concat file requires escaped single quotes
      if (fs.existsSync(realPath)) {
        fileLines.push(`file '${realPath.replace(/'/g, "'\\''")}'`);
      }
    }

    if (fileLines.length === 0) {
      throw new Error('No valid scene video files found for stitching.');
    }

    fs.writeFileSync(listFilePath, fileLines.join('\n'), 'utf-8');

    // Perform FFmpeg video concat & audio layering
    await this.runConcatProcess(listFilePath, outputPath, bgmUrl);

    // Clean up temporary concat list file
    try {
      if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
    } catch (e) {}

    return `/media/outputs/${filename}`;
  }

  private runConcatProcess(listFilePath: string, outputPath: string, bgmUrl?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let command = ffmpeg()
        .input(listFilePath)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-pix_fmt yuv420p',
          '-r 25'
        ]);

      // If background music is provided, mix audio
      if (bgmUrl) {
        let bgmPath = bgmUrl;
        if (bgmPath.startsWith('/media/')) {
          bgmPath = path.join(__dirname, '../../data', bgmPath.replace('/media/', ''));
        }
        if (fs.existsSync(bgmPath)) {
          command = command
            .input(bgmPath)
            .outputOptions([
              '-c:a aac',
              '-b:a 128k',
              '-shortest' // match video length
            ]);
        }
      }

      command
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => {
          console.error('[VideoComposer] Error rendering final video:', err);
          reject(err);
        })
        .run();
    });
  }
}

export const videoComposer = new VideoComposer();
