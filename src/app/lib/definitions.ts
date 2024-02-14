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
}

// describes the props passed to a GameInstance
export type GameInstanceProps = {
  gameState: GameState[];
  key: string;
  id: string;
}
