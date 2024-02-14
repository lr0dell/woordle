'use client';

import { GameInstanceProps } from '../definitions.ts';
import LetterBox from './LetterBox.tsx';

// eslint-disable-next-line no-unused-vars
export default function GameInstance({ gameState, key, id }: GameInstanceProps) {
  const currentGame = gameState.find((state) => state.id === id) || gameState[0];

  const letterGridDisplay = currentGame.letterGrid.map((letterRow) => (
    <div className="flex gap-1">
      {
        letterRow.map((letter) => (
          <LetterBox value={letter.value} color={(letter.color as string)} />
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
