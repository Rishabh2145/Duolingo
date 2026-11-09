"use client";

import React, { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface OptionItem {
  id: string;
  text: string;
  emoji?: string;
}

interface MultipleChoiceExerciseProps {
  prompt: string;
  audioText?: string | null;
  options: OptionItem[];
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  prompt,
  audioText,
  options,
  selectedOption,
  onSelectOption,
  disabled = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        sound.playClick();
        onSelectOption(options[num - 1].id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, options, onSelectOption]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-4 text-center">
        {prompt}
      </h2>

      {/* Audio speaker if available */}
      {audioText && (
        <button
          onClick={() => sound.speakSpanish(audioText)}
          className="mb-8 p-3 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] hover:bg-[#38bdf8] active:translate-y-1 active:border-b-0 text-white flex items-center gap-2 shadow-md transition-all font-black text-sm uppercase tracking-wider"
        >
          <Volume2 className="w-5 h-5" />
          <span>Play Audio</span>
        </button>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                if (audioText && opt.text) {
                  sound.speakSpanish(opt.text);
                }
                onSelectOption(opt.id);
              }}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all relative ${
                isSelected
                  ? "bg-[#ddf4ff] dark:bg-[#183647] border-[#1cb0f6] border-b-4 shadow-md text-[#1899d6]"
                  : "bg-white dark:bg-[#1f2d34] border-[#e5e5e5] dark:border-[#37464f] border-b-4 hover:bg-[#f7f7f7] dark:hover:bg-[#25363f] text-[#4b4b4b] dark:text-[#f1f5f9] active:translate-y-[2px] active:border-b-2"
              }`}
            >
              {/* Keyboard indicator */}
              <span className="absolute top-3 left-3 text-[11px] font-black text-[#afafaf] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-lg px-2 py-0.5">
                {idx + 1}
              </span>

              {opt.emoji && <span className="text-6xl my-2 drop-shadow-sm">{opt.emoji}</span>}
              <span className="font-black text-lg text-center tracking-wide">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
