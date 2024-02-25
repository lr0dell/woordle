'use client';

import { nanoid } from 'nanoid';

import { GameInstanceProps } from '../definitions.ts';
import LetterBox from './LetterBox.tsx';

export default function GameInstance({ gameStates, id }: GameInstanceProps) {
  const currentGame = gameStates.find((state) => state.id === id) || gameStates[0];

  const letterGridDisplay = currentGame.letterGrid.map((letterRow) => (
    <div className="flex gap-1" key={nanoid()}>
      {
        letterRow.map((letter) => (
          <LetterBox value={letter.value} color={(letter.color as string)} key={nanoid()} />
        ))
      }
    </div>
  ));

  return (
    <div className={`flex flex-col gap-1 rounded-lg p-4 ${currentGame.isWon ? 'bg-green-100' : 'bg-slate-100'}`}>
      { letterGridDisplay }
    </div>
  );
}
