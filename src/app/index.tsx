import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useGame } from '@/context/game-context';
import { useTheme } from '@/hooks/use-theme';

function rollDice(dice: string[][]): string[] {
  return dice.map((die) => die[Math.floor(Math.random() * die.length)]);
}

function playBuzzer() {
  if (Platform.OS === 'web') {
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
    } catch {}
  } else {
    Vibration.vibrate([0, 200, 100, 200, 100, 300, 50, 500]);
  }
}

export default function BockleScreen() {
  const { dice, timerMinutes } = useGame();
  const theme = useTheme();

  const [rolledFaces, setRolledFaces] = useState<string[]>(() => rollDice(dice));
  const [remainingSeconds, setRemainingSeconds] = useState(timerMinutes * 60);
  const [gameStatus, setGameStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTicking = () => {
    stopTimer();
    setGameStatus('running');

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          stopTimer();
          setGameStatus('idle');
          playBuzzer();
          return 0;
        }

        return next;
      });
    }, 1000);
  };

  const handleStart = () => {
    setRolledFaces(rollDice(dice));
    const totalSeconds = timerMinutes * 60;
    setRemainingSeconds(totalSeconds);
    startTicking();
  };

  const handlePause = () => {
    stopTimer();
    setGameStatus('paused');
  };

  const handleResume = () => {
    startTicking();
  };

  const handleStop = () => {
    stopTimer();
    setGameStatus('idle');
    setRemainingSeconds(timerMinutes * 60);
  };

  const handleQuit = () => {
    stopTimer();
    setGameStatus('idle');
    setRemainingSeconds(timerMinutes * 60);
  };

  const displayTime = gameStatus === 'idle' ? timerMinutes * 60 : remainingSeconds;
  const displayedFaces = gameStatus === 'idle' ? Array.from({ length: 16 }, () => '?') : rolledFaces;

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const timerColor =
    displayTime <= 30 && gameStatus === 'running'
      ? '#FF3B30'
      : displayTime <= 60 && gameStatus === 'running'
        ? '#FF9500'
        : theme.text;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.safeArea]}>
        <ThemedText type="title" style={styles.title}>
          Bockle
        </ThemedText>
        <View style={styles.timerContainer}>
          <ThemedText style={[styles.timer, { color: timerColor }]}>{timeString}</ThemedText>
        </View>

        <View style={styles.grid}>
          {displayedFaces.map((face, index) => (
            <View key={index} style={styles.dieWrapper}>
              <ThemedView type="backgroundElement" style={styles.die}>
                <ThemedText style={styles.dieLetter}>{face}</ThemedText>
              </ThemedView>
            </View>
          ))}
        </View>

        {gameStatus === 'idle' && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: '#34C759', opacity: pressed ? 0.75 : 1 },
            ]}
            onPress={handleStart}
          >
            <ThemedText style={styles.buttonText}>Start</ThemedText>
          </Pressable>
        )}

        {gameStatus === 'running' && (
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.halfButton,
                { backgroundColor: '#FF9500', opacity: pressed ? 0.75 : 1 },
              ]}
              onPress={handlePause}
            >
              <ThemedText style={styles.buttonText}>Pause</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.halfButton,
                { backgroundColor: '#FF3B30', opacity: pressed ? 0.75 : 1 },
              ]}
              onPress={handleStop}
            >
              <ThemedText style={styles.buttonText}>Quit</ThemedText>
            </Pressable>
          </View>
        )}

        {gameStatus === 'paused' && (
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.halfButton,
                { backgroundColor: '#34C759', opacity: pressed ? 0.75 : 1 },
              ]}
              onPress={handleResume}
            >
              <ThemedText style={styles.buttonText}>Resume</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.halfButton,
                { backgroundColor: '#8E8E93', opacity: pressed ? 0.75 : 1 },
              ]}
              onPress={handleQuit}
            >
              <ThemedText style={styles.buttonText}>Quit</ThemedText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
  timerContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    minWidth: 220,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
  },

  timer: {
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  dieWrapper: {
    width: '25%',
    aspectRatio: 1,
    padding: 5,
  },
  die: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dieLetter: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.five,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonRow: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  halfButton: {
    flex: 1,
    minWidth: 0,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
