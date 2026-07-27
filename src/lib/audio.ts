// Improved Web Audio API utility with more realistic footstep synthesis
// TODO: Replace with real .mp3 footstep audio file from Pixabay/Freesound

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playUIClick() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(t);
  osc.stop(t + 0.1);
}

/**
 * Plays a realistic footstep using layered synthesis:
 * - A low thud (impact)
 * - A mid-frequency slap (shoe sole)
 * - Filtered noise burst (texture/grit)
 * 
 * This creates a much more convincing footstep than a simple oscillator.
 */
export function playFootstep(volume: number = 0.5) {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const t = ctx.currentTime;

  // Randomize pitch slightly for natural variation
  const pitchVariation = 0.85 + Math.random() * 0.3;

  // === Layer 1: Low Impact Thud ===
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  const thudFilter = ctx.createBiquadFilter();
  
  thud.type = 'sine';
  thud.frequency.setValueAtTime(80 * pitchVariation, t);
  thud.frequency.exponentialRampToValueAtTime(30, t + 0.08);
  
  thudFilter.type = 'lowpass';
  thudFilter.frequency.value = 200;
  
  thudGain.gain.setValueAtTime(0, t);
  thudGain.gain.linearRampToValueAtTime(volume * 0.6, t + 0.005);
  thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  
  thud.connect(thudFilter);
  thudFilter.connect(thudGain);
  thudGain.connect(ctx.destination);
  
  thud.start(t);
  thud.stop(t + 0.15);

  // === Layer 2: Mid Slap (shoe contact) ===
  const slap = ctx.createOscillator();
  const slapGain = ctx.createGain();
  
  slap.type = 'triangle';
  slap.frequency.setValueAtTime(300 * pitchVariation, t);
  slap.frequency.exponentialRampToValueAtTime(120, t + 0.04);
  
  slapGain.gain.setValueAtTime(0, t);
  slapGain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.003);
  slapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  
  slap.connect(slapGain);
  slapGain.connect(ctx.destination);
  
  slap.start(t);
  slap.stop(t + 0.08);

  // === Layer 3: Noise Burst (texture / grit) ===
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 800;
  noiseFilter.Q.value = 1.5;
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, t);
  noiseGain.gain.linearRampToValueAtTime(volume * 0.15, t + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(t);
}

export function playCushionSound(volume: number = 0.8) {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.linearRampToValueAtTime(100, t + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume * 0.5, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(t);
}

/**
 * Plays a door creak/unlock sound for staircase locked areas.
 */
export function playLockedSound() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.linearRampToValueAtTime(80, t + 0.15);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(t);
  osc.stop(t + 0.25);
}
