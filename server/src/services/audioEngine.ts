import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const OUTPUTS_DIR = path.join(__dirname, '../../data/outputs');

export class AudioEngine {
  /**
   * Generates sound effect audio matching the prompt (footsteps, thunder, doors, explosions, etc.)
   */
  public async generateSoundEffect(sfxDescription: string): Promise<string> {
    const filename = `sfx_${uuidv4()}.wav`;
    const filePath = path.join(OUTPUTS_DIR, filename);

    this.createSynthesizedSFX(filePath, sfxDescription);
    return `/media/outputs/${filename}`;
  }

  /**
   * Generates ambient background music matching genre/scenario
   */
  public async generateBackgroundMusic(genre: string, durationSeconds: number): Promise<string> {
    const filename = `bgm_${uuidv4()}.wav`;
    const filePath = path.join(OUTPUTS_DIR, filename);

    this.createSynthesizedBGM(filePath, genre, durationSeconds);
    return `/media/outputs/${filename}`;
  }

  private createSynthesizedSFX(filePath: string, desc: string) {
    const sampleRate = 22050;
    const duration = 2.5;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(44 + numSamples * 2);

    this.writeWavHeader(buffer, sampleRate, numSamples);

    const descLower = desc.toLowerCase();
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      if (descLower.includes('thunder') || descLower.includes('explosion')) {
        // Low rumble noise + exponential decay
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 1.5);
        sample = noise * 16000;
      } else if (descLower.includes('footstep') || descLower.includes('step')) {
        // Periodic short thuds
        const pulse = Math.sin(t * Math.PI * 3) > 0.9 ? (Math.random() * 2 - 1) * Math.exp(-(t % 0.3) * 10) : 0;
        sample = pulse * 14000;
      } else if (descLower.includes('door') || descLower.includes('creak')) {
        // High squeak sweeping pitch
        const freq = 600 + Math.sin(t * 8) * 200;
        sample = Math.sin(2 * Math.PI * freq * t) * 8000;
      } else if (descLower.includes('rain') || descLower.includes('wind')) {
        // Soft white noise
        sample = (Math.random() * 2 - 1) * 4000;
      } else {
        // Chime default
        const freq = 440 + Math.sin(t * 5) * 50;
        sample = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2) * 10000;
      }

      buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
    }

    fs.writeFileSync(filePath, buffer);
  }

  private createSynthesizedBGM(filePath: string, genre: string, duration: number) {
    const sampleRate = 22050;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = Buffer.alloc(44 + numSamples * 2);

    this.writeWavHeader(buffer, sampleRate, numSamples);

    const genreLower = genre.toLowerCase();
    
    // Choose chord progression based on genre
    const baseFreqs = genreLower.includes('comedy') 
      ? [261.63, 329.63, 392.00, 523.25] // C Major arpeggio
      : genreLower.includes('action') || genreLower.includes('horror')
      ? [110.00, 116.54, 130.81, 146.83] // Dark minor low bass
      : [220.00, 261.63, 329.63, 440.00]; // Emotional A minor

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Arpeggio index
      const noteIdx = Math.floor((t * 4) % baseFreqs.length);
      const freq = baseFreqs[noteIdx];

      // Harmonic synth tone
      const tone1 = Math.sin(2 * Math.PI * freq * t);
      const tone2 = Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.4;
      const bass = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.6;

      const masterVolume = 0.25; // pleasant ambient level
      const sample = (tone1 + tone2 + bass) * 6000 * masterVolume;

      buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
    }

    fs.writeFileSync(filePath, buffer);
  }

  private writeWavHeader(buffer: Buffer, sampleRate: number, numSamples: number) {
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);  // PCM
    buffer.writeUInt16LE(1, 22);  // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);
  }
}

export const audioEngine = new AudioEngine();
