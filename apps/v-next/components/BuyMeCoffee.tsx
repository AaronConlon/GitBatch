'use client';

import confetti from 'canvas-confetti';
import { Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuyMeCoffee() {
  return (
    <button
      onClick={() => {
        toast('Emotional support is already enough, thank you.', {
          icon: '❤️'
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }}
      className="cursor-pointer px-2 py-1.5 rounded-md border border-solid border-sky-200 text-sky-600 flex items-center justify-center gap-2 group bg-gradient-to-tr from-sky-300 to-green-100"
    >
      Buy me a coffee
      <Coffee className="group-hover:skew-y-[15deg] transition-all transform" />
    </button>
  );
}
