'use client';

import Modal from 'react-modal';
import { InfoModalProps, constants } from '../definitions.ts';

export default function InfoModal({ modalIsOpen, setModalIsOpen }: InfoModalProps) {
  return (
    <Modal
      isOpen={modalIsOpen}
      className="w-1/2 max-h-fit bg-slate-50 text-center fixed top-1/2 left-1/2 border-black border-2 rounded-lg p-4 -translate-y-1/2 -translate-x-1/2 outline-none text-black"
    >
      <h1 className="font-bold text-3xl text-black mb-2">
        How To Play
      </h1>
      <ul className="text-black list-disc w-fit mx-auto text-left mb-8">
        <li>{`You have ${constants.NUM_GUESSES} tries to guess the hidden ${constants.WORD_LENGTH}-letter word.`}</li>
        <li>{`Every ${constants.NEW_GAME_RATE} guesses, a new hidden word appears.`}</li>
        <li>Every new guess applies to every hidden word on screen.</li>
      </ul>
      <ul className="text-black list-disc w-fit mx-auto text-left">
        <li>
          <span className="text-green-500 font-bold">Green: </span>
          Letter appears in the word and is in the correct position
        </li>
        <li>
          <span className="text-yellow-500 font-bold">Yellow: </span>
          Letter appears in the word, but is NOT in the correct position
        </li>
        <li>
          <span className="text-slate-500 font-bold">Grey: </span>
          Letter does not appear in the word
        </li>
      </ul>
      <button
        className="bg-green-500 border-black border-2 rounded-lg px-4 py-2 mt-4 text-xl font-bold text-white"
        aria-label="close"
        type="button"
        onClick={() => setModalIsOpen(false)}
      >
        OK
      </button>
    </Modal>
  );
}
