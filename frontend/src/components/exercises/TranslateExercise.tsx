"use client";

import React from "react";
import { Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { DuoMascot } from "@/components/DuoMascot";

interface TranslateExerciseProps {
  prompt: string;
  questionText?: string | null;
  audioText?: string | null;
  wordBank: string[];
  selectedWords: { id: string; word: string }[];
  onSelectWord: (wordObj: { id: string; word: string }) => void;
  onRemoveWord: (index: number) => void;
  disabled?: boolean;
}

export const TranslateExercise: React.FC<TranslateExerciseProps> = ({
  prompt,
  questionText,
  audioText,
  wordBank,
  selectedWords,
  onSelectWord,
  onRemoveWord,
  disabled = false,
}) => {
  const bankItems = React.useMemo(() => {
    return wordBank.map((word, idx) => ({ id: `word-${idx}-${word}`, word }));
  }, [wordBank]);

  const selectedIds = new Set(selectedWords.map((w) => w.id));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-6 self-start">
        {prompt}
      </h2>

      {/* Mascot Speaking the Question Bubble */}
      <div className="flex items-center gap-4 mb-8 w-full">
        <DuoMascot mood="happy" size={80} className="shrink-0" />
        <div className="relative bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          {audioText && (
            <button
              onClick={() => sound.speakSpanish(audioText)}
              className="p-2.5 rounded-xl bg-[#1cb0f6] border-b-2 border-[#1899d6] text-white hover:bg-[#38bdf8] transition-all shrink-0 active:translate-y-[1px]"
              title="Listen pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
          <span className="font-extrabold text-xl text-[#4b4b4b] dark:text-[#f1f5f9]">
            {questionText}
          </span>
        </div>
      </div>

      {/* Answer Slots Line */}
      <div className="w-full min-h-20 p-3 border-b-2 border-t-2 border-[#e5e5e5] dark:border-[#37464f] flex flex-wrap gap-2.5 items-center mb-8">
        {selectedWords.length === 0 ? (
          <span className="text-sm font-bold text-[#afafaf] italic ml-2">
            Tap words from the bank below to build your sentence...
          </span>
        ) : (
          selectedWords.map((item, idx) => (
            <button
              key={`${item.id}-slot-${idx}`}
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                onRemoveWord(idx);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] border-b-4 font-black text-base text-[#4b4b4b] dark:text-[#f1f5f9] hover:bg-[#ffebee] hover:border-[#ffccd1] transition-all animate-in zoom-in-75 active:translate-y-[2px] active:border-b-2"
            >
              {item.word}
            </button>
          ))
        )}
      </div>

      {/* Word Bank Pool */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {bankItems.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <button
              key={item.id}
              disabled={disabled || isSelected}
              onClick={() => {
                sound.playClick();
                onSelectWord(item);
              }}
              className={`px-4 py-3 rounded-2xl font-black text-base transition-all ${
                isSelected
                  ? "bg-[#e5e5e5] dark:bg-[#253238] text-transparent border-2 border-transparent cursor-not-allowed opacity-25 select-none"
                  : "bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] border-b-4 hover:bg-[#f7f7f7] dark:hover:bg-[#25363f] text-[#4b4b4b] dark:text-[#f1f5f9] shadow-sm active:translate-y-[2px] active:border-b-2"
              }`}
            >
              {item.word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
