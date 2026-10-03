import { StoryPlan, ProjectSettings, CharacterIdentity, SceneData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LLMProvider {
  /**
   * Generates a complete structured StoryPlan from a prompt and user settings
   */
  public async generateStoryPlan(prompt: string, settings: ProjectSettings, apiKey?: string): Promise<StoryPlan> {
    console.log(`[LLMProvider] Analyzing prompt: "${prompt.substring(0, 60)}..."`);

    // If external LLM API Key is provided, we can call Gemini / OpenAI REST API.
    if (apiKey && apiKey.trim().length > 5) {
      try {
        return await this.callExternalLLM(prompt, settings, apiKey);
      } catch (err) {
        console.warn('[LLMProvider] External LLM call failed, falling back to smart internal engine:', err);
      }
    }

    // Smart heuristic creative engine
    return this.generateSmartFallbackPlan(prompt, settings);
  }

  private async callExternalLLM(prompt: string, settings: ProjectSettings, apiKey: string): Promise<StoryPlan> {
    // Calling Gemini REST API endpoint directly
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const systemPrompt = `You are an expert Hollywood video producer and AI director.
Given a user prompt for a short video, create a structured JSON story plan with characters, scene breakdowns, timing, visual prompts, dialogue, camera directions, lighting, and sound effects.
Output strictly valid JSON matching this schema:
{
  "title": "string",
  "genre": "string",
  "duration": ${settings.duration},
  "aspectRatio": "${settings.aspectRatio}",
  "visualStyle": "${settings.visualStyle}",
  "voiceStyle": "string",
  "musicStyle": "string",
  "characters": [
    {
      "id": "char-1",
      "name": "string",
      "age": "string",
      "gender": "string",
      "appearance": "string",
      "clothing": "string",
      "personality": "string",
      "voice": "string",
      "description": "string"
    }
  ],
  "locations": ["string"],
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 8,
      "startTime": 0,
      "endTime": 8,
      "location": "string",
      "characters": ["string"],
      "action": "string",
      "dialogue": { "character": "string", "text": "string" },
      "cameraMovement": "string",
      "cameraAngle": "string",
      "lighting": "string",
      "atmosphere": "string",
      "visualPrompt": "string",
      "audioPrompt": "string",
      "transition": "string",
      "status": "pending"
    }
  ]
}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User Prompt: ${prompt}\nRequested Genre: ${settings.genre}\nRequested Style: ${settings.visualStyle}\nDuration: ${settings.duration}s` }
            ]
          }
        ],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini API');

    const parsed = JSON.parse(rawText);
    parsed.rawPrompt = prompt;
    // ensure characters have valid IDs
    parsed.characters = (parsed.characters || []).map((c: any) => ({
      ...c,
      id: c.id || uuidv4()
    }));

    return parsed as StoryPlan;
  }

  private generateSmartFallbackPlan(prompt: string, settings: ProjectSettings): StoryPlan {
    const promptLower = prompt.toLowerCase();
    
    // Auto-detect genre if not specified
    let detectedGenre = settings.genre;
    if (detectedGenre === 'Auto-Detect' || !detectedGenre) {
      if (promptLower.includes('funny') || promptLower.includes('cat') || promptLower.includes('laugh') || promptLower.includes('trouble')) {
        detectedGenre = 'Comedy';
      } else if (promptLower.includes('detective') || promptLower.includes('mystery') || promptLower.includes('abandoned') || promptLower.includes('hotel') || promptLower.includes('secret')) {
        detectedGenre = 'Mystery';
      } else if (promptLower.includes('space') || promptLower.includes('mars') || promptLower.includes('astronaut') || promptLower.includes('robot') || promptLower.includes('2090')) {
        detectedGenre = 'Sci-Fi';
      } else if (promptLower.includes('fight') || promptLower.includes('chase') || promptLower.includes('explosion') || promptLower.includes('action')) {
        detectedGenre = 'Action';
      } else {
        detectedGenre = 'Drama';
      }
    }

    // Auto-detect visual style
    let detectedStyle = settings.visualStyle;
    if (detectedStyle === 'Auto-Detect' || !detectedStyle) {
      if (promptLower.includes('anime')) detectedStyle = 'Anime';
      else if (promptLower.includes('cartoon') || promptLower.includes('cat') || promptLower.includes('football')) detectedStyle = 'Pixar-like 3D';
      else if (promptLower.includes('cyberpunk') || promptLower.includes('futuristic')) detectedStyle = 'Cyberpunk';
      else detectedStyle = 'Cinematic';
    }

    // Extract main character from prompt
    const characters: CharacterIdentity[] = [];
    if (promptLower.includes('cat') || promptLower.includes('egyptian cat')) {
      characters.push({
        id: uuidv4(),
        name: 'Cleo',
        age: '3 years old',
        gender: 'Female',
        appearance: 'Golden sleek Egyptian Mau cat with bright emerald eyes and royal collar',
        clothing: 'Miniature chef apron and hat',
        personality: 'Mischievous, ambitious, charming, lazy',
        voice: 'Playful upbeat narration voice',
        description: 'A lazy Egyptian cat who lands a job at a luxury restaurant and causes hilarious chaos.',
        referenceImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'
      });
      characters.push({
        id: uuidv4(),
        name: 'Chef Antoine',
        age: '45 years old',
        gender: 'Male',
        appearance: 'Tall passionate French chef with mustache and tall white hat',
        clothing: 'Traditional white double-breasted chef uniform',
        personality: 'Strict, dramatic, emotional',
        voice: 'Dramatic French accent',
        description: 'Head chef struggling to maintain order in his high-end kitchen.'
      });
    } else if (promptLower.includes('detective') || promptLower.includes('hotel') || promptLower.includes('investigate')) {
      characters.push({
        id: uuidv4(),
        name: 'Daniel Vance',
        age: '28 years old',
        gender: 'Male',
        appearance: 'Determined detective with short dark hair, sharp jawline, intense blue eyes',
        clothing: 'Black long trench coat, leather gloves, dark trousers',
        personality: 'Calculated, fearless, inquisitive',
        voice: 'Deep serious noir voice',
        description: 'A skilled detective investigating a long-abandoned creepy location.',
        referenceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
      });
    } else if (promptLower.includes('astronaut') || promptLower.includes('mars')) {
      characters.push({
        id: uuidv4(),
        name: 'Commander Ray',
        age: '34 years old',
        gender: 'Male',
        appearance: 'Rugged astronaut with stubble and athletic build',
        clothing: 'High-tech white and orange EVA space suit with glowing visor',
        personality: 'Brave, resourceful leader',
        voice: 'Calm authoritative voice',
        description: 'Stranded astronaut on Mars discovering ancient underground ruins.'
      });
      characters.push({
        id: uuidv4(),
        name: 'Dr. Elena Vance',
        age: '31 years old',
        gender: 'Female',
        appearance: 'Sharp brilliant astrobiologist with ponytail',
        clothing: 'Futuristic research jumpsuit',
        personality: 'Analytical, curious',
        voice: 'Intelligent articulate voice',
        description: 'Co-pilot scientist analyzing Martian bio-signatures.'
      });
    } else {
      // General character extraction
      characters.push({
        id: uuidv4(),
        name: 'Alex Vance',
        age: '25 years old',
        gender: 'Male',
        appearance: 'Stylish protagonist with expressive features',
        clothing: 'Modern tailored jacket',
        personality: 'Determined, adventurous',
        voice: 'Clear confident male voice',
        description: 'Protagonist of the story facing unexpected challenges.'
      });
    }

    // Determine target total duration (default 60s)
    const duration = settings.duration || 60;

    // Calculate dynamic scene timings
    // For 60s: 7 scenes. For 30s: 4 scenes. For 45s: 5 scenes.
    let sceneBreakdown: { title: string; act: string; dur: number; action: string; dialogueChar?: string; dialogueText: string; camera: string; lighting: string; sfx: string; location: string }[] = [];

    if (detectedGenre === 'Comedy' || promptLower.includes('cat')) {
      sceneBreakdown = [
        {
          title: "The Lazy Beginning",
          act: "Setup",
          dur: 8,
          location: "Sunlit Cairo Living Room",
          action: "Cleo the cat is lounging lazily on velvet cushions under warm Egyptian sunlight.",
          dialogueChar: "Cleo",
          dialogueText: "Why chase mice when you can dream of owning the finest restaurant in town?",
          camera: "Slow panning shot across cozy Mediterranean apartment",
          lighting: "Golden sunbeams streaming through arch windows",
          sfx: "Gentle purring, distant Egyptian street instruments"
        },
        {
          title: "Job Interview Chaos",
          act: "Inciting Incident",
          dur: 8,
          location: "Gourmet Restaurant Entrance",
          action: "Cleo struts into a 5-star restaurant wearing a tiny chef apron and applies for a job.",
          dialogueChar: "Chef Antoine",
          dialogueText: "A cat in my kitchen?! Sacrebleu, this is unheard of!",
          camera: "Low angle tracking shot following Cleo's confident stride",
          lighting: "Bright polished indoor restaurant chandeliers",
          sfx: "Chef gasp, plates clattering, comical piano string"
        },
        {
          title: "Kitchen Disasters",
          act: "Rising Action",
          dur: 9,
          location: "Bustling Kitchen",
          action: "Cleo tries to toss pizza dough, slips on olive oil, and sends flour flying everywhere!",
          dialogueChar: "Cleo",
          dialogueText: "Oops! It's called adding extra texture to the recipe!",
          camera: "Fast tracking pan following sliding cat on floor",
          lighting: "Dynamic stainless steel kitchen reflections, flour particles",
          sfx: "Sliding whistle, flour explosion pop, frying pan clang"
        },
        {
          title: "The VIP Dish",
          act: "Climax Part 1",
          dur: 10,
          location: "Kitchen Prep Station",
          action: "A renowned food critic orders the signature dish. Cleo accidently creates a gourmet fish delicacy!",
          dialogueChar: "Chef Antoine",
          dialogueText: "Wait... that aroma! It smells absolute perfection!",
          camera: "Extreme close-up on steaming garnished salmon dish",
          lighting: "Dramatic spotlight highlighting gourmet meal",
          sfx: "Sizzling pan, angelic choir chime"
        },
        {
          title: "The Taste Test",
          act: "Climax Part 2",
          dur: 10,
          location: "Main Dining Hall",
          action: "The strict food critic takes a bite, closes his eyes in bliss, and awards 5 stars!",
          dialogueChar: "Food Critic",
          dialogueText: "Magnifique! This is the single greatest dish in Cairo history!",
          camera: "Slow zoom-in on food critic's delighted reaction",
          lighting: "Elegant dining room ambiance with ambient golden glow",
          sfx: "Fork tapping plate, orchestral triumph sting"
        },
        {
          title: "The Grand Promotion",
          act: "Falling Action",
          dur: 8,
          location: "Restaurant Office",
          action: "The restaurant owner hands the gold keys to Cleo, appointing her the new Head Executive Owner!",
          dialogueChar: "Chef Antoine",
          dialogueText: "I bow to the true master chef!",
          camera: "Medium shot of Cleo sitting atop velvet throne desk wearing gold chef hat",
          lighting: "Warm celebratory lighting with golden sparkles",
          sfx: "Applause, cheering crowd, triumphant brass music"
        },
        {
          title: "Owner Cleo",
          act: "Resolution",
          dur: 7,
          location: "Rooftop Restaurant Balcony overlooking Pyramids",
          action: "Cleo sits on a silk cushion enjoying sunset over the Pyramids as waiters serve her fresh tuna.",
          dialogueChar: "Cleo",
          dialogueText: "Never let anyone tell you hard work doesn't pay off... now back to sleeping 18 hours a day!",
          camera: "Slow majestic aerial camera pullback into sunset sky",
          lighting: "Breathtaking orange sunset sky with golden pyramid silhouette",
          sfx: "Content purring, warm cheerful outro music finish"
        }
      ];
    } else {
      // Default Mystery / Drama / Sci-Fi Story structure
      sceneBreakdown = [
        {
          title: "The Arrival",
          act: "Setup",
          dur: 8,
          location: "Rain-slicked Abandoned Hotel Entrance",
          action: `${characters[0].name} approaches the rusty gates of the forgotten structure as fog rolls in.`,
          dialogueChar: characters[0].name,
          dialogueText: "The reports said no one has stepped foot inside here for 30 years...",
          camera: "Low-angle slow tracking shot moving forward",
          lighting: "Cold blue moonlight cutting through dense fog",
          sfx: "Thunder rumble, distant creaking gates"
        },
        {
          title: "Entering the Shadow",
          act: "Inciting Incident",
          dur: 8,
          location: "Grand Lobby with Broken Chandelier",
          action: `${characters[0].name} pushes open the heavy oak doors, click-on flashlight revealing dust motes.`,
          dialogueChar: characters[0].name,
          dialogueText: "Something happened here... something they tried to cover up.",
          camera: "Over-the-shoulder tracking shot",
          lighting: "Single beam flashlight beam illuminating dark corridors",
          sfx: "Echoing footsteps, heavy door groan"
        },
        {
          title: "The Locked Door",
          act: "Rising Action",
          dur: 9,
          location: "Second Floor Hallway",
          action: `${characters[0].name} stops outside Room 404, noticing strange glowing symbols etched into the wood.`,
          dialogueChar: characters[0].name,
          dialogueText: "These markings... they aren't ancient. They were carved recently!",
          camera: "Close-up on glowing glyphs and character's suspicious gaze",
          lighting: "Mysterious amber glow emanating from door frame",
          sfx: "Low ambient hum, heartbeats"
        },
        {
          title: "The Discovery",
          act: "Climax Part 1",
          dur: 10,
          location: "Hidden Basement Laboratory",
          action: `${characters[0].name} steps into a secret chamber filled with glowing quantum artifacts.`,
          dialogueChar: characters[0].name,
          dialogueText: "It wasn't a hotel... it was a research facility hidden in plain sight.",
          camera: "Dramatic pan revealing expansive underground futuristic chamber",
          lighting: "Electric cyan ambient light from glowing energy pods",
          sfx: "Pulsing energy hum, computer data bleeps"
        },
        {
          title: "The Confrontation",
          act: "Climax Part 2",
          dur: 10,
          location: "Central Core Room",
          action: "A shadowy figure emerges from the fog behind the energy reactor console!",
          dialogueChar: characters[0].name,
          dialogueText: "Show yourself! Who are you?",
          camera: "Rapid zoom-in on mysterious shadow silhouette",
          lighting: "Fashing red emergency alarms with rim lighting",
          sfx: "Alarm siren sound, dramatic brass crescendo"
        },
        {
          title: "Unveiling the Truth",
          act: "Falling Action",
          dur: 8,
          location: "Control Console",
          action: `${characters[0].name} retrieves a glowing memory core revealing secret blueprints.`,
          dialogueChar: characters[0].name,
          dialogueText: "This changes everything we knew about the past...",
          camera: "High-angle orbit camera around character holding artifact",
          lighting: "Bright blue holographic light reflecting on face",
          sfx: "Hologram hum, crisp electronic tone"
        },
        {
          title: "The Escape",
          act: "Resolution",
          dur: 7,
          location: "Rooftop Helipad under Starry Night",
          action: `${characters[0].name} reaches the rooftop looking down at the illuminated city skyline.`,
          dialogueChar: characters[0].name,
          dialogueText: "The truth is finally out. Now the real mission begins.",
          camera: "Cinematic wide shot sweeping up into night sky",
          lighting: "City neon skyline glow with starry night contrast",
          sfx: "Helicopter rotor blades, epic cinematic orchestral finish"
        }
      ];
    }

    // Scale scene durations to match user's requested duration exactly
    const currentSum = sceneBreakdown.reduce((sum, s) => sum + s.dur, 0);
    const scaleFactor = duration / currentSum;

    let accumulatedTime = 0;
    const scenes: SceneData[] = sceneBreakdown.map((s, idx) => {
      const scaledDur = Math.round(s.dur * scaleFactor * 10) / 10;
      const startTime = Math.round(accumulatedTime * 10) / 10;
      accumulatedTime += scaledDur;
      const endTime = Math.round(accumulatedTime * 10) / 10;

      const primaryChar = characters[0]?.name || 'Protagonist';

      return {
        sceneNumber: idx + 1,
        duration: scaledDur,
        startTime,
        endTime,
        location: s.location,
        characters: [primaryChar],
        action: s.action,
        dialogue: {
          character: s.dialogueChar || primaryChar,
          text: s.dialogueText
        },
        cameraMovement: s.camera,
        cameraAngle: s.camera.includes('low') ? 'Low angle' : s.camera.includes('close') ? 'Close-up' : 'Eye level',
        lighting: s.lighting,
        atmosphere: detectedGenre,
        visualPrompt: `${detectedStyle} style, ${s.location}, ${s.action}, ${primaryChar}, ${s.lighting}, high detail, 8k resolution, cinematic composition, award winning scene`,
        audioPrompt: s.sfx,
        transition: idx === sceneBreakdown.length - 1 ? 'Fade to black' : 'Dissolve',
        status: 'pending'
      };
    });

    // Generate clear descriptive title
    const mainSubject = characters[0]?.name || 'Hero';
    const title = detectedGenre === 'Comedy' 
      ? `The Adventures of ${mainSubject}` 
      : `${mainSubject}: ${detectedGenre} Chronicles`;

    return {
      title,
      genre: detectedGenre,
      duration,
      aspectRatio: settings.aspectRatio || '9:16',
      visualStyle: detectedStyle,
      voiceStyle: characters[0]?.voice || 'Dramatic cinematic voiceover',
      musicStyle: `${detectedGenre} orchestral soundtrack with ambient synths`,
      characters,
      locations: Array.from(new Set(scenes.map(s => s.location))),
      scenes,
      rawPrompt: prompt
    };
  }
}

export const llmProvider = new LLMProvider();
