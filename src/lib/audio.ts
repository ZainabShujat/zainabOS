// Simple Web Audio API utility for UI sound effects without needing external files

let audioCtx: AudioContext | null = null;

export function playUIClick() {
  if (typeof window === 'undefined') return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Resume context if suspended (browser auto-play policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // A clean, soft "thock" sound (short decay, low frequency)
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.1);
}

export function playFootstep(volume: number = 0.5) {
  if (typeof window === 'undefined') return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const t = audioCtx.currentTime;
  
  // Create a low frequency thud for the footstep
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle'; // Gives a slightly duller/warmer thud than sine
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

  // Apply volume setting, keeping it subtle
  const maxGain = 0.2 * volume;
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(maxGain, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  
  // Add a very subtle noise element for texture (optional, but a lowpass filter helps)
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.2);
}

export function playCushionSound(volume: number = 0.8) {
  if (typeof window === 'undefined') return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const t = audioCtx.currentTime;
  
  // Create noise for fabric rustle/cushion compress
  const bufferSize = audioCtx.sampleRate * 0.4; // 0.4 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    // Generate white noise but soften it
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  // Lowpass filter to make it sound like thick fabric/cushion
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.linearRampToValueAtTime(100, t + 0.3);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume * 0.5, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(t);
}
