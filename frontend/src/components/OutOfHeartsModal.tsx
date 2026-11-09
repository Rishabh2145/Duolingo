"use client";

import React from "react";
import { Heart, Gem, Dumbbell, X } from "lucide-react";
import { DuoMascot } from "@/components/DuoMascot";
import { sound } from "@/lib/sound";

interface OutOfHeartsModalProps {
  userGems: number;
  onRefillWithGems: () => void;
  onPractice: () => void;
  onQuitLesson: () => void;
  onClose?: () => void;
  isStandalone?: boolean;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  userGems,
  onRefillWithGems,
  onPractice,
  onQuitLesson,
  onClose,
  isStandalone = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl max-w-md w-full p-6 sm:p-8 flex flex-col items-center shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#afafaf] hover:text-[#4b4b4b] dark:hover:text-white p-2 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Sad Duo Mascot */}
        <div className="mb-4">
          <DuoMascot mood="shocked" size={100} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#ff4b4b] tracking-wide mb-2 text-center">
          You ran out of hearts!
        </h2>
        <p className="text-sm font-semibold text-[#777777] dark:text-[#a5b4bc] text-center mb-6">
          Hearts protect you from mistakes. Refill your hearts or practice to earn more!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full mb-4">
          {/* Refill for 350 gems */}
          <button
            onClick={() => {
              sound.playClick();
              onRefillWithGems();
            }}
            disabled={userGems < 350}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 shadow transition-all ${
              userGems >= 350
                ? "duo-button-blue"
                : "bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed border-b-4 border-[#afafaf]"
            }`}
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Refill Hearts</span>
            <span className="flex items-center gap-1 ml-2 bg-white/20 px-2 py-0.5 rounded-lg text-xs">
              <Gem className="w-4 h-4 fill-white" /> 350
            </span>
          </button>

          {/* Free Practice */}
          <button
            onClick={() => {
              sound.playClick();
              onPractice();
            }}
            className="w-full py-3.5 px-4 rounded-2xl duo-button-green font-black text-sm uppercase flex items-center justify-center gap-2 shadow"
          >
            <Dumbbell className="w-5 h-5 text-white" />
            <span>Practice To Earn Heart (+1 ❤️)</span>
          </button>
        </div>

        {/* Quit Lesson */}
        {!isStandalone && (
          <button
            onClick={() => {
              sound.playClick();
              onQuitLesson();
            }}
            className="text-xs font-black tracking-wider text-[#afafaf] hover:text-[#ff4b4b] uppercase py-2"
          >
            Quit Lesson
          </button>
        )}
      </div>
    </div>
  );
};
