'use client';

import { nanoid } from 'nanoid';
import { SyntheticEvent, useState } from 'react';
import { GameState } from '../definitions.ts';
import GameInstance from './GameInstance.tsx';

export default function Game() {
  const initialGameState: GameState[] = [
    {
      id: nanoid(),
      letterGrid: [
        ['c', 'r', 'a', 't', 'e'],
        ['s', 'o', 'l', 'i', 'd'],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
    },
    {
      id: nanoid(),
      letterGrid: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
    },
  ];

  const [gameState, setGameState] = useState<GameState[]>(initialGameState);
  const [inputText, setInputText] = useState<string>('');
  const [inputErrors, setInputErrors] = useState<string[]>([]);

  const gameInstancesDisplay = gameState.map((gameInstanceState) => (
    <GameInstance gameState={gameState} key={gameInstanceState.id} id={gameInstanceState.id} />
  ));

  const errorsDisplay = inputErrors.map((error) => (
    <p className="text-red-500">
      {error}
    </p>
  ));

  // clean this up, is this extra func necessary?
  function addNewWord(oldLetterGrid: string[][], newWord: string[]): string[][] { 
    const firstEmptyIndex = oldLetterGrid.findIndex((word) => (
      word[0] === ''
    ));

    const newGrid = [...oldLetterGrid];
    newGrid[firstEmptyIndex] = newWord;

    return newGrid;
  }

  function submitWord(e: SyntheticEvent) {
    e.preventDefault();

    if (inputText.length < 5) {
      setInputErrors((oldErrors) => (
        oldErrors.indexOf('Not enough letters') === -1 ? [...oldErrors, 'Not enough letters'] : [...oldErrors]
      ));
      return;
    }

    const arrayifiedWord: string[] = Array.from(inputText);

    // clean this up, see if you can't do this functionally with slice
    setGameState((oldStateArray) => (
      oldStateArray.map((oldState) => (
        { ...oldState, letterGrid: addNewWord(oldState.letterGrid, arrayifiedWord) }
      ))
    ));
    setInputText('');
    setInputErrors([]);
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="flex gap-4">
        {gameInstancesDisplay}
      </div>
      <form>
        <input
          className="bg-slate-50 text-2xl font-bold uppercase rounded-2xl p-2 max-w-32 text-center"
          type="text"
          id="word-guess"
          name="wordGuess"
          onChange={(e) => ( // sanitize input for alphabet only
            e.target.value.match(/^[a-zA-Z]+$/) && setInputText(e.target.value)
          )}
          value={inputText}
          maxLength={5}
        />
        <button
          className="text-2xl size-12 bg-slate-100 rounded-2xl ml-2"
          type="submit"
          aria-label="Submit"
          onClick={submitWord}
        >
          →
        </button>
      </form>
      {errorsDisplay}
    </div>
  );
}
