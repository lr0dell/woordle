'use client';

import { useState } from 'react';
import { GameState } from '../definitions.ts';
import LetterBox from './LetterBox.tsx';

export default function GameInstance() {
  const initialGameState: GameState = {
    letterGrid: [
      ['a', 'p', 'p', 'l', 'e'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
  };

  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const letterGridDisplay = gameState.letterGrid.map((letterRow) => (
    <div className="flex gap-1">
      {
        letterRow.map((letter) => (
          <LetterBox value={letter} />
        ))
      }
    </div>
  ));

  return (
    <div className="flex flex-col gap-1 rounded-lg p-4 bg-slate-100">
      { letterGridDisplay }
    </div>
  );
}
