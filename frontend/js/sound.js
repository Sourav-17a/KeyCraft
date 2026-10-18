// KeyCraft - Web Audio Synthesizer (Laptop Key Clicks & Audio Feedback)
(function (global) {
  'use strict';

  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playKeySound(isError, soundProfile, isEnabled) {
    if (!isEnabled) return;
    try {
      const ctx = initAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isError) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.065);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.075);
      } else {
        const prof = soundProfile || 'scissor';
        if (prof === 'tactile') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420 + Math.random() * 40, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (prof === 'creamy') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(210 + Math.random() * 20, now);
          osc.frequency.exponentialRampToValueAtTime(65, now + 0.045);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (prof === 'typewriter') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(680 + Math.random() * 60, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
        } else {
          // Default: Subtle scissor-switch laptop key thock
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320 + Math.random() * 35, now);
          osc.frequency.exponentialRampToValueAtTime(95, now + 0.028);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.032);
        }
      }
    } catch (e) {
      // Audio playback blocked or unsupported
    }
  }

  global.KeyCraftSound = {
    initAudioContext,
    playKeySound
  };
})(typeof window !== 'undefined' ? window : this);
