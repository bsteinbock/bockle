import React, { createContext, useContext, useState } from 'react';

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
};

const GameContext = createContext<GameContextType>({
  timerMinutes: 3,
  setTimerMinutes: () => {},
  dice: DEFAULT_DICE,
  setDice: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [timerMinutes, setTimerMinutes] = useState(3);
  const [dice, setDice] = useState<string[][]>(DEFAULT_DICE);

  return (
    <GameContext.Provider value={{ timerMinutes, setTimerMinutes, dice, setDice }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
