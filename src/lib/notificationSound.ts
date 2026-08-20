// Web Audio API Synthesizer Chime for Instant Zero-Lag Message Notifications
// Does not require downloading any external audio files - works offline & instantaneously.

class SoundManager {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Play a clean, premium two-tone notification chime
   */
  public playMessageChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Tone 1 (High bell)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2 (Higher harmony chime)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.08); // E6
      gain2.gain.setValueAtTime(0.15, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch {
      // Audio playback silently skipped if browser forbids before gesture
    }
  }

  /**
   * Trigger Desktop Notification API
   */
  public showDesktopNotification(title: string, body: string, icon = '/icon.png', url?: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'shahya-chat-msg',
        });
        if (url) {
          notif.onclick = () => {
            window.focus();
            window.location.href = url;
          };
        }
      } catch {}
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().catch(() => {});
    }
  }
}

export const soundManager = new SoundManager();
