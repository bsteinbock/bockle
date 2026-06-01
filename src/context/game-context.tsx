import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ExpiryAlertMode = 'speak' | 'vibrate';
export type ExpiryAlertVolume = 0.3 | 0.6 | 1.0;
export const DEFAULT_EXPIRY_ALERT_TEXT = "Time's up";
export const DEFAULT_EXPIRY_ALERT_VOLUME: ExpiryAlertVolume = 0.6;
const DEFAULT_TIMER_MINUTES = 3;

export const DEFAULT_DICE: string[][] = [
  ['A', 'E', 'A', 'N', 'E', 'G'],
  ['A', 'H', 'S', 'P', 'C', 'O'],
  ['A', 'S', 'P', 'F', 'F', 'K'],
  ['O', 'B', 'J', 'O', 'A', 'B'],
  ['I', 'O', 'T', 'M', 'U', 'C'],
  ['R', 'Y', 'V', 'D', 'E', 'L'],
  ['L', 'R', 'E', 'I', 'X', 'D'],
  ['E', 'I', 'U', 'N', 'E', 'S'],
  ['W', 'N', 'G', 'E', 'E', 'H'],
  ['L', 'N', 'H', 'N', 'R', 'Z'],
  ['T', 'S', 'T', 'I', 'Y', 'D'],
  ['O', 'W', 'T', 'O', 'A', 'T'],
  ['E', 'R', 'T', 'T', 'Y', 'L'],
  ['T', 'O', 'E', 'S', 'S', 'I'],
  ['T', 'E', 'R', 'W', 'H', 'V'],
  ['N', 'U', 'I', 'H', 'M', 'Qu'],
];

type GameContextType = {
  timerMinutes: number;
  setTimerMinutes: (minutes: number) => void;
  dice: string[][];
  setDice: (dice: string[][]) => void;
  hasCustomSavedDice: boolean;
  expiryAlertMode: ExpiryAlertMode;
  setExpiryAlertMode: (mode: ExpiryAlertMode) => void;
  expiryAlertText: string;
  setExpiryAlertText: (text: string) => void;
  expiryAlertVolume: ExpiryAlertVolume;
  setExpiryAlertVolume: (volume: ExpiryAlertVolume) => void;
};

const DICE_STORAGE_KEY = 'bockle:dice-config';
const EXPIRY_ALERT_MODE_STORAGE_KEY = 'bockle:expiry-alert-mode';
const EXPIRY_ALERT_TEXT_STORAGE_KEY = 'bockle:expiry-alert-text';
const EXPIRY_ALERT_VOLUME_STORAGE_KEY = 'bockle:expiry-alert-volume';
const TIMER_MINUTES_STORAGE_KEY = 'bockle:timer-minutes';

function normalizeExpiryAlertVolume(value: unknown): ExpiryAlertVolume {
  if (value === 0.3 || value === 0.6 || value === 1.0) return value;
  return DEFAULT_EXPIRY_ALERT_VOLUME;
}

function normalizeTimerMinutes(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_TIMER_MINUTES;
  const rounded = Math.round(value);
  return Math.min(5, Math.max(1, rounded));
}

function normalizeExpiryAlertText(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_EXPIRY_ALERT_TEXT;

  return value.slice(0, 80);
}

function cloneDefaultDice() {
  return DEFAULT_DICE.map((die) => [...die]);
}

function normalizeDieFace(face: unknown): string {
  if (typeof face !== 'string') return '';

  const lettersOnly = face.replace(/[^A-Za-z]/g, '').slice(0, 2);

  if (lettersOnly.length === 0) return '';
  if (lettersOnly.length === 1) return lettersOnly.toUpperCase();

  return `${lettersOnly[0].toUpperCase()}${lettersOnly[1].toLowerCase()}`;
}

function normalizeDice(input: unknown): string[][] | null {
  if (!Array.isArray(input) || input.length !== 16) return null;

  const normalized = input.map((die) => {
    if (!Array.isArray(die) || die.length !== 6) return null;
    return die.map((face) => normalizeDieFace(face));
  });

  if (normalized.some((die) => die === null)) return null;
  return normalized as string[][];
}

function areDiceEqual(a: string[][], b: string[][]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;

    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }

  return true;
}

const GameContext = createContext<GameContextType>({
  timerMinutes: 3,
  setTimerMinutes: () => {},
  dice: DEFAULT_DICE,
  setDice: () => {},
  hasCustomSavedDice: false,
  expiryAlertMode: 'speak',
  setExpiryAlertMode: () => {},
  expiryAlertText: DEFAULT_EXPIRY_ALERT_TEXT,
  setExpiryAlertText: () => {},
  expiryAlertVolume: DEFAULT_EXPIRY_ALERT_VOLUME,
  setExpiryAlertVolume: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_TIMER_MINUTES);
  const [dice, setDice] = useState<string[][]>(cloneDefaultDice());
  const [expiryAlertMode, setExpiryAlertMode] = useState<ExpiryAlertMode>('speak');
  const [expiryAlertText, setExpiryAlertText] = useState(DEFAULT_EXPIRY_ALERT_TEXT);
  const [expiryAlertVolume, setExpiryAlertVolume] = useState<ExpiryAlertVolume>(DEFAULT_EXPIRY_ALERT_VOLUME);
  const [hasHydratedDice, setHasHydratedDice] = useState(false);

  const hasCustomSavedDice = !areDiceEqual(normalizeDice(dice) ?? cloneDefaultDice(), DEFAULT_DICE);

  const updateExpiryAlertText = (text: string) => {
    setExpiryAlertText(normalizeExpiryAlertText(text));
  };

  const updateExpiryAlertVolume = (volume: ExpiryAlertVolume) => {
    setExpiryAlertVolume(normalizeExpiryAlertVolume(volume));
  };

  const updateTimerMinutes = (minutes: number) => {
    setTimerMinutes(normalizeTimerMinutes(minutes));
  };

  useEffect(() => {
    let isMounted = true;

    async function hydrateDice() {
      try {
        const savedDice = await AsyncStorage.getItem(DICE_STORAGE_KEY);

        if (savedDice) {
          const parsedDice = JSON.parse(savedDice);
          const normalizedDice = normalizeDice(parsedDice);

          if (normalizedDice) {
            if (isMounted) {
              setDice(normalizedDice);
            }
          } else {
            await AsyncStorage.removeItem(DICE_STORAGE_KEY);
          }
        }

        const savedAlertMode = await AsyncStorage.getItem(EXPIRY_ALERT_MODE_STORAGE_KEY);
        if (savedAlertMode === 'speak' || savedAlertMode === 'vibrate') {
          if (isMounted) setExpiryAlertMode(savedAlertMode);
        } else if (savedAlertMode !== null) {
          await AsyncStorage.removeItem(EXPIRY_ALERT_MODE_STORAGE_KEY);
        }

        const savedAlertText = await AsyncStorage.getItem(EXPIRY_ALERT_TEXT_STORAGE_KEY);
        if (savedAlertText !== null) {
          if (isMounted) setExpiryAlertText(normalizeExpiryAlertText(savedAlertText));
        }

        const savedAlertVolume = await AsyncStorage.getItem(EXPIRY_ALERT_VOLUME_STORAGE_KEY);
        if (savedAlertVolume !== null) {
          const parsedAlertVolume = Number(savedAlertVolume);
          if (isMounted) setExpiryAlertVolume(normalizeExpiryAlertVolume(parsedAlertVolume));
        }

        const savedTimerMinutes = await AsyncStorage.getItem(TIMER_MINUTES_STORAGE_KEY);
        if (savedTimerMinutes !== null) {
          const parsedTimerMinutes = Number(savedTimerMinutes);
          if (isMounted) setTimerMinutes(normalizeTimerMinutes(parsedTimerMinutes));
        }
      } catch {
        // Ignore read/parse errors and use defaults.
      } finally {
        if (isMounted) setHasHydratedDice(true);
      }
    }

    hydrateDice();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedDice) return;

    const normalizedDice = normalizeDice(dice) ?? cloneDefaultDice();
    const isCustomDice = !areDiceEqual(normalizedDice, DEFAULT_DICE);

    async function persistDice() {
      try {
        if (isCustomDice) {
          await AsyncStorage.setItem(DICE_STORAGE_KEY, JSON.stringify(normalizedDice));
        } else {
          await AsyncStorage.removeItem(DICE_STORAGE_KEY);
        }
      } catch {
        // Ignore write errors to keep UI responsive.
      }
    }

    persistDice();
  }, [dice, hasHydratedDice]);

  useEffect(() => {
    if (!hasHydratedDice) return;

    async function persistAlertMode() {
      try {
        await AsyncStorage.setItem(EXPIRY_ALERT_MODE_STORAGE_KEY, expiryAlertMode);
      } catch {
        // Ignore write errors to keep UI responsive.
      }
    }

    persistAlertMode();
  }, [expiryAlertMode, hasHydratedDice]);

  useEffect(() => {
    if (!hasHydratedDice) return;

    const normalizedText = normalizeExpiryAlertText(expiryAlertText);

    async function persistAlertText() {
      try {
        await AsyncStorage.setItem(EXPIRY_ALERT_TEXT_STORAGE_KEY, normalizedText);
      } catch {
        // Ignore write errors to keep UI responsive.
      }
    }

    persistAlertText();
  }, [expiryAlertText, hasHydratedDice]);

  useEffect(() => {
    if (!hasHydratedDice) return;

    const normalizedVolume = normalizeExpiryAlertVolume(expiryAlertVolume);

    async function persistAlertVolume() {
      try {
        await AsyncStorage.setItem(EXPIRY_ALERT_VOLUME_STORAGE_KEY, String(normalizedVolume));
      } catch {
        // Ignore write errors to keep UI responsive.
      }
    }

    persistAlertVolume();
  }, [expiryAlertVolume, hasHydratedDice]);

  useEffect(() => {
    if (!hasHydratedDice) return;

    const normalizedTimerMinutes = normalizeTimerMinutes(timerMinutes);

    async function persistTimerMinutes() {
      try {
        await AsyncStorage.setItem(TIMER_MINUTES_STORAGE_KEY, String(normalizedTimerMinutes));
      } catch {
        // Ignore write errors to keep UI responsive.
      }
    }

    persistTimerMinutes();
  }, [timerMinutes, hasHydratedDice]);

  return (
    <GameContext.Provider
      value={{
        timerMinutes,
        setTimerMinutes: updateTimerMinutes,
        dice,
        setDice,
        hasCustomSavedDice,
        expiryAlertMode,
        setExpiryAlertMode,
        expiryAlertText,
        setExpiryAlertText: updateExpiryAlertText,
        expiryAlertVolume,
        setExpiryAlertVolume: updateExpiryAlertVolume,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
