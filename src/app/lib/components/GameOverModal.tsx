'use client';

import Modal from 'react-modal';
import { GameOverModalProps } from '../definitions.ts';

export default function GameOverModal({ modalIsOpen, score, onClick }: GameOverModalProps) {
  return (
    <Modal
      isOpen={modalIsOpen}
      className="w-1/4 max-h-fit bg-slate-50 text-center fixed top-1/2 left-1/2 border-black border-2 rounded-lg p-4 -translate-y-1/2 -translate-x-1/2 outline-none"
    >
      <p className="text-xl font-bold text-black">
        Game Over
        <br />
        <br />
        {`Score: ${score}`}
      </p>
      <button
        className="bg-green-500 border-black border-2 rounded-lg px-4 py-2 mt-4 text-5xl font-bold text-white"
        aria-label="retry"
        type="button"
        onClick={onClick}
      >
        ↻
      </button>
    </Modal>
  );
}
