'use client';

import { nanoid } from 'nanoid';
import {
  ChangeEvent, SyntheticEvent,
  useCallback, useEffect, useState,
} from 'react';

import wordBank from '../sgb-words.ts';
import {
  GameState, defaultLetter, Letter, defaultAlphabet, constants,
} from '../definitions.ts';
import GameInstance from './GameInstance.tsx';
import GameOverModal from './GameOverModal.tsx';
import InfoModal from './InfoModal.tsx';

export default function Game() {
  const initialGameState: GameState[] = [
    {
      id: nanoid(),
      wordToGuess: 'shirt',
      letterGrid: new Array(constants.NUM_GUESSES)
        .fill(Array(constants.WORD_LENGTH)
          .fill({ ...defaultLetter })),
      unusedLetters: [...defaultAlphabet],
      isWon: false,
    },
  ];

  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [gameStates, setGameStates] = useState<GameState[]>([...initialGameState]);
  const [inputText, setInputText] = useState<string>('');
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [gameTurnCounter, setGameTurnCounter] = useState<number>(0);

  // returns random word from 2000 most popular words in list
  function generateWord(): string {
    return wordBank.words[Math.floor(Math.random() * 2000)];
  }

  /*
  generate random words for all game instances on page load
  this has to be done to avoid a conflict between prerendered component and client
  */
  useEffect(
    () => {
      setGameStates((oldGameStates) => (
        oldGameStates.map((oldGameState) => (
          { ...oldGameState, wordToGuess: generateWord() }
        ))
      ));
    },
    [],
  );

  // add new game instance every (NEW_GAME_RATE)th turn
  useEffect(
    () => {
      if (gameTurnCounter % constants.NEW_GAME_RATE === 0 && gameTurnCounter !== 0) {
        setGameStates((oldGameStates) => (
          oldGameStates.concat([
            {
              id: nanoid(),
              wordToGuess: generateWord(),
              letterGrid: new Array(constants.NUM_GUESSES)
                .fill(Array(constants.WORD_LENGTH)
                  .fill({ ...defaultLetter })),
              unusedLetters: [...defaultAlphabet],
              isWon: false,
            },
          ])
        ));
      }
    },
    [gameTurnCounter],
  );

  /*
  this effect monitors changes to game state array
  if user solves wordles too fast, immediately populate state array with 1 word
  if a board is filled and not won, the game is over
  */
  useEffect(
    () => {
      if (!gameStates.some((state) => (!state.isWon))) {
        setGameStates([
          {
            id: nanoid(),
            wordToGuess: generateWord(),
            letterGrid: new Array(constants.NUM_GUESSES)
              .fill(Array(constants.WORD_LENGTH)
                .fill({ ...defaultLetter })),
            unusedLetters: [...defaultAlphabet],
            isWon: false,
          },
        ]);
      }

      if (gameStates.some((state) => (state.letterGrid[constants.NUM_GUESSES - 1][0].value !== '' && !state.isWon))) {
        setGameOverModalOpen(true);
      }
    },
    [gameStates],
  );

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

  // updates letter grid with new row on word guess
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

  // called when a word is guessed
  function submitWord(e: SyntheticEvent) {
    e.preventDefault();

    // check for input errors
    if (inputText.length < constants.WORD_LENGTH) {
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
    setGameStates((oldStates) => (
      oldStates.filter((oldState) => (
        !oldState.isWon
      ))
    ));

    // add new guessed word to old state array and check to see if game instance has been won
    setGameStates((oldStates) => (
      oldStates.map((oldState) => (
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

  // allow button in GameOverModal to reset game
  const newGame = useCallback(
    () => {
      setGameStates([
        {
          id: nanoid(),
          wordToGuess: generateWord(),
          letterGrid: new Array(constants.NUM_GUESSES)
            .fill(Array(constants.WORD_LENGTH)
              .fill({ ...defaultLetter })),
          unusedLetters: [...defaultAlphabet],
          isWon: false,
        },
      ]);
      setGameTurnCounter(0);
      setGameOverModalOpen(false);
    },
    [],
  );

  const gameInstancesDisplay = gameStates.map((state) => (
    <GameInstance gameStates={gameStates} key={state.id} id={state.id} />
  ));

  const errorsDisplay = inputErrors.map((error) => (
    <p className="text-red-500">
      {error}
    </p>
  ));

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <GameOverModal
        modalIsOpen={gameOverModalOpen}
        score={gameTurnCounter}
        btnOnClick={newGame}
      />
      <InfoModal
        modalIsOpen={infoModalOpen}
        setModalIsOpen={setInfoModalOpen}
      />
      <div className="flex gap-4 relative">
        <button
          className="text-2xl size-12 bg-slate-100 rounded-2xl font-black absolute -top-16 -right-0 rounded-full"
          type="button"
          aria-label="help"
          onClick={() => setInfoModalOpen(true)}
        >
          ?
        </button>
        {gameInstancesDisplay}
      </div>
      <form>
        <input
          className="bg-slate-50 text-2xl font-bold uppercase rounded-2xl p-2 max-w-32 text-center text-black
          placeholder:normal-case placeholder:text-base placeholder:font-normal"
          type="text"
          id="word-guess"
          name="wordGuess"
          onChange={(e: ChangeEvent<HTMLInputElement>) => ( // sanitize input for alphabet only
            (e.target.value.match(/^[a-zA-Z]+$/) || e.target.value === '') && setInputText(e.target.value.toLowerCase())
          )}
          value={inputText}
          maxLength={constants.WORD_LENGTH}
          placeholder="Enter guess..."
        />
        <button
          className="font-black text-2xl size-12 bg-slate-100 rounded-2xl ml-2 text-black"
          type="submit"
          aria-label="Submit"
          onClick={submitWord}
        >
          ↵
        </button>
      </form>
      {errorsDisplay}
    </div>
  );
}
