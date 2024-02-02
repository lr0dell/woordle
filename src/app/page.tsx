import GameInstance from './lib/components/GameInstance.tsx';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GameInstance />
    </main>
  );
}
