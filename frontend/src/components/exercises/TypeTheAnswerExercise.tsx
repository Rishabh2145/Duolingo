"use client";

import React, { useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface TypeTheAnswerExerciseProps {
  prompt: string;
  questionText?: string | null;
  audioText?: string | null;
  typedAnswer: string;
  onChangeAnswer: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const TypeTheAnswerExercise: React.FC<TypeTheAnswerExerciseProps> = ({
  prompt,
  questionText,
  audioText,
  typedAnswer,
  onChangeAnswer,
  onSubmit,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addChar = (ch: string) => {
    sound.playClick();
    onChangeAnswer(typedAnswer + ch);
    inputRef.current?.focus();
  };

  const accents = ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-4 text-center">
        {prompt}
      </h2>

      {/* Target prompt */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] p-5 rounded-2xl shadow-sm mb-6 w-full">
        {audioText && (
          <button
            onClick={() => sound.speakSpanish(audioText)}
            className="p-2.5 rounded-xl bg-[#1cb0f6] text-white hover:bg-[#38bdf8] transition-all"
            title="Listen"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <span className="font-extrabold text-2xl text-[#4b4b4b] dark:text-[#f1f5f9]">
          {questionText}
        </span>
      </div>

      {/* Input Field */}
      <div className="w-full mb-4">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={typedAnswer}
          onChange={(e) => onChangeAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typedAnswer.trim()) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your answer in Spanish..."
          className="w-full py-4 px-5 text-xl font-bold rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f] bg-white dark:bg-[#1a282f] text-[#4b4b4b] dark:text-[#f1f5f9] focus:outline-none focus:border-[#1cb0f6] focus:ring-4 focus:ring-[#1cb0f6]/20 transition-all shadow-inner"
        />
      </div>

      {/* Quick Spanish Accents Buttons */}
      <div className="flex flex-wrap gap-2 justify-center w-full">
        {accents.map((ch) => (
          <button
            key={ch}
            type="button"
            disabled={disabled}
            onClick={() => addChar(ch)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] border-b-4 hover:bg-[#f7f7f7] dark:hover:bg-[#25363f] font-black text-lg text-[#4b4b4b] dark:text-[#f1f5f9] active:translate-y-1 active:border-b-2"
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
};
