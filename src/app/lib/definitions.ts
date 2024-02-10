// decribes the state of a particular game
export type GameState = {
  id: string;
  letterGrid: string[][];
}

// decribes the props passed to a GameInstance
export type GameInstanceProps = {
  gameState: GameState[];
  key: string;
  id: string;
}
