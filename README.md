# 🎬 AI Story Video Studio

A complete, production-grade AI video-generation web application that creates short AI-generated story videos of fictional characters based on user text prompts.

Default target video length: **50–60 seconds** (configurable to 30s, 45s, 60s, or custom).

---

## 🌟 Key Features

1. **Free Prompt & Advanced Story Breakdown Engine**:
   - Write any story idea (e.g., *"Create a funny 60-second video about a lazy Egyptian cat who gets a job at a restaurant..."*).
   - Automatically extracts: Story title, Characters, Locations, Scene breakdown, Timed scene durations, Dialogue, Camera directions, Lighting directives, Visual prompts, Audio prompts, Background music style.

2. **Fictional Character Consistency Engine**:
   - Stores character identity packages (Name, Age, Appearance, Hair, Clothing, Personality, Voice tone, Reference Image).
   - Reuses character profiles across scenes to maintain character appearance consistency.

3. **Plan Preview & Approval Workflow**:
   - Generates a full **Story Plan Preview** before spending expensive generation API credits.
   - Allows users to **Edit Plan**, **Regenerate Plan**, or **Approve & Generate Video**.

4. **Scene-by-Scene Visual Timeline Editor**:
   - Interactive timeline (0s .. 60s).
   - Single-scene editor (modify prompt, dialogue, duration, camera, lighting, audio).
   - **Regenerate Single Scene** (Regenerate Scene video, voice, image, or all without restarting the whole project).

5. **AI Provider Abstraction System**:
   - Secure server-side API key handling (`LLM_API_KEY`, `IMAGE_API_KEY`, `VIDEO_API_KEY`, `VOICE_API_KEY`).
   - Supports Gemini API, ElevenLabs TTS, Pollinations AI, and Runway/Luma video providers.
   - **Built-in High-Quality Fallback Engine**: Works 100% out-of-the-box even without paid API keys using Pollinations AI, built-in dialogue TTS wave synth, and Canvas-FFmpeg procedural video synthesizer!

6. **FFmpeg Video Editing Pipeline**:
   - Stitches individual scene clips.
   - Applies smooth camera Ken Burns pan/zoom motion.
   - Layers dialogue TTS audio, sound effects, and ambient background music.
   - Burned & soft subtitle overlays.
   - Exports final MP4 video.

---

## 🚀 Quick Start Guide

### 1. Installation

Clone the repository and install all root, server, and client dependencies:

```bash
# Install root, server, and client dependencies
npm run install:all
```

### 2. Environment Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Set optional secret keys in `.env` or via the in-app **Settings** UI:

```env
PORT=5000
NODE_ENV=development

# Optional External AI API Keys
LLM_API_KEY=your_gemini_or_openai_key
IMAGE_API_KEY=your_stability_key
VIDEO_API_KEY=your_runway_or_luma_key
VOICE_API_KEY=your_elevenlabs_key

# Storage Provider ('local' | 's3')
STORAGE_PROVIDER=local
```

### 3. Run Development Server

Start both backend API server (Port 5000) and React frontend (Port 3000) concurrently:

```bash
npm run dev
```

Open your browser to `http://localhost:3000`.

---

## ⚙️ AI Provider Setup & Architecture

### A. Story Engine (LLM Provider)
- **Default**: Built-in smart heuristic engine that analyzes prompts, extracts characters, creates 7 timed scene acts, and writes camera/dialogue directives.
- **External Key**: Provide `LLM_API_KEY` (Gemini API / OpenAI) in Settings to enable Gemini 1.5 Flash structured story breakdown.

### B. Image Provider (Avatars & Storyboards)
- **Default**: Pollinations AI (free high-res image generation with dynamic SVG fallback).
- **External Key**: Set `IMAGE_API_KEY` for Stability AI or custom DALL-E integration.

### C. Voice Generation (TTS)
- **Default**: Built-in audio wave synthesizer that generates modulated dialogue audio files for scene timing sync.
- **External Key**: Set `VOICE_API_KEY` for ElevenLabs multilingual TTS voices.

### D. Video Generation & FFmpeg Pipeline
- **Default**: `CanvasFFmpegVideoProvider` converts visual storyboard frames into animated MP4 clips with Ken Burns camera movement, stitching clips, layering dialogue, SFX, background music, and exporting the final MP4 file via `ffmpeg-static`.
- **External Key**: Pluggable provider interface (`VideoProvider`) allows adding Runway Gen-2/Gen-3, Luma Dream Machine, or Pika APIs.

---

## 📁 Database & File Storage

- **Database**: Zero-friction JSON/SQLite file store with full CRUD operations (`server/data/database.json`).
- **Media Files**: Generated video clips, audio tracks, and avatars are stored in `server/data/outputs/` and served via `/media/*`.
- **S3 Integration**: Change `STORAGE_PROVIDER=s3` in `.env` to upload outputs to AWS S3 / R2 object storage.

---

## 🛠️ Production Build & Deployment

### Build Application
To compile both client React static files and backend TypeScript code:

```bash
npm run build
```

### Run Production Server
```bash
npm start
```

---

## 📜 License
MIT License. Built for **AI Story Video Studio**.
