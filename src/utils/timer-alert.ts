import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform, Vibration } from 'react-native';

import type { ExpiryAlertMode } from '@/context/game-context';
import { DEFAULT_EXPIRY_ALERT_TEXT } from '@/context/game-context';

function playWebBuzzer() {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {
    // Ignore audio API errors.
  }
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function playStrongIosHapticBurst() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  await wait(120);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  await wait(120);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function playTimerExpiredAlert(mode: ExpiryAlertMode, alertText: string) {
  if (Platform.OS === 'web') {
    playWebBuzzer();
    return;
  }

  if (mode === 'speak') {
    const spokenText = alertText.trim() || DEFAULT_EXPIRY_ALERT_TEXT;

    Speech.stop();
    Speech.speak(spokenText, {
      language: 'en-US',
      pitch: 1,
      rate: 0.95,
    });
    return;
  }

  if (Platform.OS === 'ios') {
    void playStrongIosHapticBurst();
  } else {
    Vibration.vibrate([0, 400, 120, 400, 120, 500, 120, 700]);
  }
}
