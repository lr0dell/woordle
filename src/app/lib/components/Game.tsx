'use client';

import { nanoid } from 'nanoid';
import { SyntheticEvent, useEffect, useState } from 'react';
import wordBank from '../sgb-words.ts';
import {
  GameState, defaultLetter, Letter, defaultAlphabet,
} from '../definitions.ts';
import GameInstance from './GameInstance.tsx';
import GameOverModal from './GameOverModal.tsx';

export default function Game() {
  function generateWord(): string { // returns random word from 2000 most popular words in list
    return wordBank.words[Math.floor(Math.random() * 2000)];
  }

  const initialGameState: GameState[] = [
    {
      id: nanoid(),
      wordToGuess: 'shirt',
      letterGrid: new Array(9).fill(Array(5).fill({ ...defaultLetter })),
      unusedLetters: [...defaultAlphabet],
      isWon: false,
    },
  ];

  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState[]>(initialGameState);
  const [inputText, setInputText] = useState<string>('');
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [gameTurnCounter, setGameTurnCounter] = useState<number>(0);

  /*
  generate random words for all game instances on page load
  this has to be done to avoid a conflict between prerendered component and client
  */
  useEffect(
    () => {
      setGameState((oldGameStateArray) => (
        oldGameStateArray.map((oldGameState) => (
          { ...oldGameState, wordToGuess: generateWord() }
        ))
      ));
    },
    [],
  );

  // add new game instance every 3rd turn
  useEffect(
    () => {
      if (gameTurnCounter % 3 === 0 && gameTurnCounter !== 0) {
        setGameState((oldGameStateArray) => (
          oldGameStateArray.concat([
            {
              id: nanoid(),
              wordToGuess: generateWord(),
              letterGrid: new Array(9).fill(Array(5).fill({ ...defaultLetter })),
              unusedLetters: [...defaultAlphabet],
              isWon: false,
            },
          ])
        ));
      }
    },
    [gameTurnCounter],
  );

  useEffect(
    () => {
      // if a board is filled and is not won, game over
      if (gameState.some((state) => (state.letterGrid[8][0].value !== '' && !state.isWon))) {
        setGameOverModalOpen(true);
      }
    },
    [gameState],
  );

  const gameInstancesDisplay = gameState.map((gameInstanceState) => (
    <GameInstance gameState={gameState} key={gameInstanceState.id} id={gameInstanceState.id} />
  ));

  const errorsDisplay = inputErrors.map((error) => (
    <p className="text-red-500">
      {error}
    </p>
  ));

  // colors guessed word based on proximity to hidden word
  function validateWord(guessedWord: Letter[], correctWord: String): Letter[] {
    const coloredWord: Letter[] = [...guessedWord];

    for (let i = 0; i < coloredWord.length; i += 1) {
      coloredWord[i].color = 'bg-slate-500'; // weird bandaid fix, prevents double validation
      if (coloredWord[i].value === correctWord.at(i)) { // letter is in correct position
        coloredWord[i].color = 'bg-green-500';
      } else if (correctWord.includes(coloredWord[i].value)) { // letter is in wrong position
        coloredWord[i].color = 'bg-yellow-500';
      }
    }

    return coloredWord;
  }

  // clean this up, is this extra func necessary?
  function addNewWord(
    oldLetterGrid: Letter[][],
    newWord: Letter[],
    wordToGuess: string,
  ): Letter[][] {
    const firstEmptyIndex = oldLetterGrid.findIndex((word) => (
      word[0].value === ''
    ));

    const newGrid: Letter[][] = [...oldLetterGrid];
    newGrid[firstEmptyIndex] = validateWord(newWord, wordToGuess);
    return newGrid;
  }

  function submitWord(e: SyntheticEvent) {
    e.preventDefault();

    // check for input errors
    if (inputText.length < 5) {
      setInputErrors((oldErrors) => (
        oldErrors.indexOf('Not enough letters') === -1 ? [...oldErrors, 'Not enough letters'] : [...oldErrors]
      ));
      return;
    }

    if (!wordBank.words.includes(inputText)) {
      setInputErrors((oldErrors) => (
        oldErrors.indexOf('Not in word list') === -1 ? [...oldErrors, 'Not in word list'] : [...oldErrors]
      ));
      return;
    }
    // convert word to array of Letters to add to grid
    const arrayifiedWord: Letter[] = Array.from(inputText).map((valueString) => (
      { value: valueString, color: 'bg-slate-500' }
    ));

    // prune finished games from old state array
    setGameState((oldStateArray) => (
      oldStateArray.filter((oldState) => (
        !oldState.isWon
      ))
    ));

    // add new guessed word to old state array and check to see if game instance has been won
    setGameState((oldStateArray) => (
      oldStateArray.map((oldState) => (
        {
          ...oldState,
          letterGrid: JSON.parse(JSON.stringify(
            addNewWord(
              oldState.letterGrid,
              [...arrayifiedWord],
              oldState.wordToGuess,
            ),
          )),
          isWon: (
            inputText === oldState.wordToGuess ? true : oldState.isWon
          ),
        }
      ))
    ));

    // clear inputs
    setInputText('');
    setInputErrors([]);

    setGameTurnCounter((oldTurn) => oldTurn + 1);
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <GameOverModal
        modalIsOpen={gameOverModalOpen}
        score={gameTurnCounter}
      />
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
            (e.target.value.match(/^[a-zA-Z]+$/) || e.target.value === '') && setInputText(e.target.value.toLowerCase())
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
