"use client";

import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import { sound } from "@/lib/sound";

export type FeedbackStatus = "idle" | "correct" | "incorrect";

interface FeedbackBarProps {
  status: FeedbackStatus;
  correctAnswerText?: string;
  isCheckDisabled: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  status,
  correctAnswerText,
  isCheckDisabled,
  onCheck,
  onContinue,
}) => {
  // Listen for Enter key to either check or continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (status === "idle" && !isCheckDisabled) {
          onCheck();
        } else if (status !== "idle") {
          onContinue();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, isCheckDisabled, onCheck, onContinue]);

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 py-6 px-6 sm:px-16 transition-colors duration-250 select-none ${
        status === "correct"
          ? "bg-[#d7ffb8] border-[#b8f28b] dark:bg-[#1a381e] dark:border-[#2a5930]"
          : status === "incorrect"
          ? "bg-[#ffdfe0] border-[#fbc2c4] dark:bg-[#3d191d] dark:border-[#63272d]"
          : "bg-white dark:bg-[#131f24] border-[#e5e5e5] dark:border-[#37464f]"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Feedback message & icon */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {status === "correct" && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#234d28] flex items-center justify-center shadow-md shrink-0">
                <Check className="w-9 h-9 text-[#58cc02] stroke-[3.5]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#58a700] dark:text-[#6ee7b7] tracking-wide">
                  Nicely done!
                </h3>
              </div>
            </div>
          )}

          {status === "incorrect" && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#592328] flex items-center justify-center shadow-md shrink-0">
                <X className="w-9 h-9 text-[#ff4b4b] stroke-[3.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#ea2b2b] dark:text-[#fca5a5] tracking-wide">
                  Correct solution:
                </h3>
                <p className="text-base font-extrabold text-[#ea2b2b]/95 dark:text-[#fca5a5]/95">
                  {correctAnswerText}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Action Button with authentic Duolingo 3D button feel */}
        <div className="w-full sm:w-48 shrink-0">
          {status === "idle" ? (
            <button
              onClick={() => {
                sound.playClick();
                onCheck();
              }}
              disabled={isCheckDisabled}
              className={`w-full py-4 px-6 rounded-2xl font-black tracking-wider text-sm uppercase transition-all shadow-sm ${
                isCheckDisabled
                  ? "bg-[#e5e5e5] dark:bg-[#253238] text-[#afafaf] border-b-4 border-[#cecece] dark:border-[#192327] cursor-not-allowed"
                  : "duo-button-green"
              }`}
            >
              Check
            </button>
          ) : status === "correct" ? (
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="w-full py-4 px-6 rounded-2xl duo-button-green font-black tracking-wider text-sm uppercase shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="w-full py-4 px-6 rounded-2xl duo-button-red font-black tracking-wider text-sm uppercase shadow-md"
            >
              Got It
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
