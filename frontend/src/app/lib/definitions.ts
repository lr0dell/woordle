import { Dispatch, SetStateAction } from 'react';

// "freeze" is used to set all fields of this object as read-only
export const constants = Object.freeze({
  WORD_LENGTH: 5,
  NUM_GUESSES: 7,
  NEW_GAME_RATE: 3,
});

export const defaultAlphabet: string[] = [
  'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y',
  'z',
];

export type LetterColor = 'bg-slate-50' | 'bg-slate-500' | 'bg-yellow-500' | 'bg-green-500'

// describes the value and status of a particular letter on a gameboard
export type Letter = {
  value: string;
  color: LetterColor;
}

export const defaultLetter: Letter = {
  value: '',
  color: 'bg-slate-50',
};

// describes the state of a particular game
export type GameState = {
  id: string;
  wordToGuess: string;
  letterGrid: Letter[][];
  unusedLetters: string[];
  isWon: boolean;
}

// describes the props passed to a GameInstance
export type GameInstanceProps = {
  gameStates: GameState[];
  key: string;
  id: string;
}

// describes the props passed to a GameOverModal
export type GameOverModalProps = {
  modalIsOpen: boolean,
  score: number,
  btnOnClick: () => void,
}

// describes the props passed to an InfoModal
export type InfoModalProps = {
  modalIsOpen: boolean,
  setModalIsOpen: Dispatch<SetStateAction<boolean>>,
}
