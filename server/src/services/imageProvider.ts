import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const OUTPUTS_DIR = path.join(__dirname, '../../data/outputs');

export class ImageProvider {
  /**
   * Generates an image file from a prompt and returns the local URL / path
   */
  public async generateImage(prompt: string, width = 1080, height = 1920, apiKey?: string): Promise<string> {
    const filename = `img_${uuidv4()}.jpg`;
    const localFilePath = path.join(OUTPUTS_DIR, filename);

    try {
      // Clean and format prompt for Pollinations AI
      const cleanPrompt = encodeURIComponent(`${prompt}, high detail, 8k resolution, cinematic lighting, masterwork`);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${Math.floor(Math.random()*100000)}&nologo=true`;

      console.log(`[ImageProvider] Fetching image from Pollinations: ${pollinationsUrl.substring(0, 80)}...`);

      const res = await fetch(pollinationsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(localFilePath, Buffer.from(buffer));
        return `/media/outputs/${filename}`;
      } else {
        console.warn(`[ImageProvider] Pollinations status ${res.status}, generating fallback visual frame.`);
      }
    } catch (err) {
      console.warn('[ImageProvider] Image fetch error, creating dynamic canvas graphic fallback:', err);
    }

    // Fallback: Create dynamic local graphic using SVG/Node image
    this.createCanvasFallbackImage(localFilePath, prompt, width, height);
    return `/media/outputs/${filename}`;
  }

  private createCanvasFallbackImage(filePath: string, prompt: string, width: number, height: number) {
    // Generate a sleek SVG poster and save it as JPG or SVG representation
    const colors = ['#1e1b4b', '#0f172a', '#311042', '#064e3b', '#450a0a', '#172554'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const accentColor = '#f59e0b';

    const shortTitle = prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${randomColor}" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="overlay" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="rgba(2, 6, 23, 0.9)" />
          <stop offset="50%" stop-color="rgba(2, 6, 23, 0.3)" />
          <stop offset="100%" stop-color="rgba(2, 6, 23, 0.7)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <circle cx="${width/2}" cy="${height/3}" r="${width/3}" fill="${accentColor}" opacity="0.15" />
      <rect width="100%" height="100%" fill="url(#overlay)" />
      
      <!-- Frame Border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="${accentColor}" stroke-width="2" stroke-opacity="0.3" rx="12"/>

      <!-- Graphic Icon / Title -->
      <g transform="translate(${width/2}, ${height/3})">
        <polygon points="0,-40 35,30 -35,30" fill="${accentColor}" opacity="0.8"/>
      </g>
      
      <text x="${width/2}" y="${height * 0.65}" text-anchor="middle" font-family="sans-serif" font-size="${Math.floor(width/22)}" font-weight="bold" fill="#ffffff" width="${width - 80}">
        ${shortTitle}
      </text>
      
      <text x="${width/2}" y="${height * 0.72}" text-anchor="middle" font-family="sans-serif" font-size="${Math.floor(width/32)}" fill="#94a3b8">
        AI STORY VIDEO STUDIO
      </text>
    </svg>`;

    fs.writeFileSync(filePath, svg, 'utf-8');
  }
}

export const imageProvider = new ImageProvider();
