import Game from './lib/components/Game.tsx';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 sticky min-w-fit">
      <Game />
    </main>
  );
}
