"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Zap, Flame, Target, Trophy } from "lucide-react";
import { DuoMascot } from "@/components/DuoMascot";
import { sound } from "@/lib/sound";

interface LessonCompleteModalProps {
  xpEarned: number;
  totalXp: number;
  streak: number;
  accuracy: number;
  unlockedAchievements?: string[];
  onFinish: () => void;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  xpEarned,
  totalXp,
  streak,
  accuracy,
  unlockedAchievements = [],
  onFinish,
}) => {
  useEffect(() => {
    // Play sound fanfare
    sound.playFanfare();

    // Trigger confetti cannon
    const end = Date.now() + 1500;
    const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#131f24] flex flex-col justify-between p-6 sm:p-12 animate-in fade-in zoom-in-95">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {/* Duo Mascot in celebratory mood */}
        <div className="mb-6 animate-bounce-gentle">
          <DuoMascot mood="celebrating" size={130} />
        </div>

        {/* Celebration Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#ffc800] tracking-wide mb-2 text-center uppercase">
          Lesson Complete!
        </h1>
        <p className="text-base font-bold text-[#777777] dark:text-[#a5b4bc] mb-8 text-center">
          You are making incredible progress every single day!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {/* XP Card */}
          <div className="border-2 border-[#ffc800] rounded-2xl p-4 flex flex-col items-center bg-[#fffdf0] dark:bg-[#2a2618] shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-[#d97706] mb-1">
              TOTAL XP
            </span>
            <div className="flex items-center gap-1.5 my-1">
              <Zap className="w-6 h-6 text-[#ffc800] fill-[#ffc800]" />
              <span className="text-2xl font-black text-[#d97706]">+{xpEarned}</span>
            </div>
            <span className="text-xs font-bold text-[#a16207]">{totalXp} total</span>
          </div>

          {/* Accuracy Card */}
          <div className="border-2 border-[#58cc02] rounded-2xl p-4 flex flex-col items-center bg-[#f0fdf4] dark:bg-[#152e1c] shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-[#16a34a] mb-1">
              ACCURACY
            </span>
            <div className="flex items-center gap-1.5 my-1">
              <Target className="w-6 h-6 text-[#58cc02]" />
              <span className="text-2xl font-black text-[#16a34a]">{accuracy}%</span>
            </div>
            <span className="text-xs font-bold text-[#15803d]">Super sharp</span>
          </div>

          {/* Streak Card */}
          <div className="border-2 border-[#ff9600] rounded-2xl p-4 flex flex-col items-center bg-[#fff8eb] dark:bg-[#2e2313] shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-[#ea580c] mb-1">
              STREAK
            </span>
            <div className="flex items-center gap-1.5 my-1">
              <Flame className="w-6 h-6 text-[#ff9600] fill-[#ff9600]" />
              <span className="text-2xl font-black text-[#ea580c]">{streak}</span>
            </div>
            <span className="text-xs font-bold text-[#c2410c]">Days in a row</span>
          </div>
        </div>

        {/* Unlocked Badges announcement if any */}
        {unlockedAchievements.length > 0 && (
          <div className="w-full bg-[#fdf4ff] dark:bg-[#341a39] border-2 border-[#ce82ff] rounded-2xl p-4 mb-6 flex items-center gap-4">
            <Trophy className="w-8 h-8 text-[#ce82ff]" />
            <div>
              <span className="text-xs font-black uppercase text-[#ce82ff]">
                Achievement Unlocked!
              </span>
              <p className="font-extrabold text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                {unlockedAchievements.join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Continue Button */}
      <div className="max-w-xl mx-auto w-full">
        <button
          onClick={() => {
            sound.playClick();
            onFinish();
          }}
          className="w-full py-4 rounded-2xl duo-button-green font-black tracking-wider text-base uppercase shadow-lg active:translate-y-1 active:border-b-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
