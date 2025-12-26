import type { Metadata } from 'next';
import GameSelector from '@/app/components/GameSelector';

export const metadata: Metadata = {
  title: 'Game Arena - Gamified EdTech',
  description: 'Master CBSE Class 5 Math through interactive, engaging games',
};

export default function Home() {
  return (
    <main>
      <GameSelector />
    </main>
  );
}
