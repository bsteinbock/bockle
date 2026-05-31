import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
};

const DICE_STORAGE_KEY = 'bockle:dice-config';

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
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [timerMinutes, setTimerMinutes] = useState(3);
  const [dice, setDice] = useState<string[][]>(cloneDefaultDice());
  const [hasCustomSavedDice, setHasCustomSavedDice] = useState(false);
  const [hasHydratedDice, setHasHydratedDice] = useState(false);

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
              setHasCustomSavedDice(!areDiceEqual(normalizedDice, DEFAULT_DICE));
            }
          } else {
            await AsyncStorage.removeItem(DICE_STORAGE_KEY);
          }
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
    setHasCustomSavedDice(isCustomDice);

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

  return (
    <GameContext.Provider value={{ timerMinutes, setTimerMinutes, dice, setDice, hasCustomSavedDice }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
