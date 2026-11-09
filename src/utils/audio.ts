// Ambient pentatonic sound synthesizer using Web Audio API

class SoundFX {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
  private lastSoundTime: number = 0;

  constructor() {
    // Audio context will be created on first user interaction
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled && !this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext not supported', e);
      }
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  private initCtx() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  // Soft melodic blip for cell birth or click
  public playCellTone(pitchIndex: number = 0, isAlive: boolean = true) {
    if (!this.isEnabled || !this.initCtx() || !this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastSoundTime < 0.04) return; // rate limit to avoid cacophony
    this.lastSoundTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const scaleIdx = Math.abs(pitchIndex) % this.pentatonicScale.length;
      const freq = isAlive ? this.pentatonicScale[scaleIdx] : this.pentatonicScale[scaleIdx] * 0.75;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio errors safely ignored
    }
  }

  // Harmonic chime when stepping or cycling
  public playGenerationTick(aliveCount: number) {
    if (!this.isEnabled || !this.initCtx() || !this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastSoundTime < 0.08) return;
    this.lastSoundTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const noteIdx = aliveCount % this.pentatonicScale.length;
      const baseFreq = this.pentatonicScale[noteIdx];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio errors safely ignored
    }
  }

  // Clear or wipe sound effect
  public playClearSound() {
    if (!this.isEnabled || !this.initCtx() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFX();
