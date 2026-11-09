"use client";

import React from "react";
import { DuoMascot } from "@/components/DuoMascot";
import { sound } from "@/lib/sound";

interface QuitLessonModalProps {
  onCancel: () => void;
  onConfirmQuit: () => void;
}

export const QuitLessonModal: React.FC<QuitLessonModalProps> = ({
  onCancel,
  onConfirmQuit,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl max-w-sm w-full p-6 flex flex-col items-center shadow-2xl">
        <div className="mb-4">
          <DuoMascot mood="thinking" size={90} />
        </div>

        <h3 className="text-2xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] tracking-wide mb-2 text-center">
          Wait, don&apos;t go!
        </h3>
        <p className="text-sm font-semibold text-[#777777] dark:text-[#a5b4bc] text-center mb-6">
          You&apos;re so close to completing this lesson. If you quit now, you will lose your progress.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              sound.playClick();
              onCancel();
            }}
            className="w-full py-3.5 px-4 rounded-2xl duo-button-blue font-black text-sm uppercase shadow"
          >
            Keep Learning
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onConfirmQuit();
            }}
            className="w-full py-3 px-4 rounded-2xl font-black text-xs text-[#ff4b4b] hover:bg-[#fff0f1] dark:hover:bg-[#331c20] transition-colors uppercase"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};
