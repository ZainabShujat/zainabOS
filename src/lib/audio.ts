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
