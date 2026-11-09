"use client";

import React from "react";
import { Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface FillInTheBlankExerciseProps {
  prompt: string;
  contextSentence?: string | null;
  questionText?: string | null;
  audioText?: string | null;
  options: string[];
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

export const FillInTheBlankExercise: React.FC<FillInTheBlankExerciseProps> = ({
  prompt,
  contextSentence,
  questionText,
  audioText,
  options,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}) => {
  const sentence = contextSentence || questionText || "Yo ___ agua.";
  const parts = sentence.split(/___|\[blank\]/);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-8 text-center">
        {prompt}
      </h2>

      {/* Sentence with blank slot */}
      <div className="flex flex-wrap items-center justify-center gap-3 bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] p-6 rounded-2xl shadow-sm mb-10 w-full">
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
          {parts[0]}
        </span>

        {/* The Blank Slot */}
        <span
          className={`inline-block min-w-24 px-4 py-1.5 border-b-4 font-black text-2xl text-center rounded-lg transition-all ${
            selectedAnswer
              ? "bg-[#ddf4ff] border-[#1cb0f6] text-[#1899d6]"
              : "border-[#afafaf] text-transparent select-none bg-[#f7f7f7] dark:bg-[#253238]"
          }`}
        >
          {selectedAnswer || "blank"}
        </span>

        {parts[1] && (
          <span className="font-extrabold text-2xl text-[#4b4b4b] dark:text-[#f1f5f9]">
            {parts[1]}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                sound.speakSpanish(opt);
                onSelectAnswer(opt);
              }}
              className={`px-6 py-3.5 rounded-2xl border-2 font-extrabold text-lg transition-all ${
                isSelected
                  ? "bg-[#ddf4ff] dark:bg-[#183647] border-[#1cb0f6] border-b-4 text-[#1899d6] shadow-md"
                  : "bg-white dark:bg-[#1f2d34] border-[#e5e5e5] dark:border-[#37464f] border-b-4 hover:bg-[#f7f7f7] dark:hover:bg-[#25363f] text-[#4b4b4b] dark:text-[#f1f5f9] active:translate-y-1 active:border-b-2"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
