"use client";

import React from "react";
import { Flame, Gem, Heart, Moon, Sun, Settings } from "lucide-react";
import { sound } from "@/lib/sound";

interface TopBarProps {
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  flagEmoji?: string;
  languageName?: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenHeartsModal: () => void;
  onOpenStreakInfo: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  streak,
  gems,
  hearts,
  maxHearts,
  flagEmoji = "🇪🇸",
  languageName = "Spanish",
  darkMode,
  onToggleDarkMode,
  onOpenHeartsModal,
  onOpenStreakInfo,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#131f24]/95 backdrop-blur border-b-2 border-[#e5e5e5] dark:border-[#37464f] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-colors">
      {/* Course Flag Selector */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] cursor-pointer border-2 border-transparent hover:border-[#e5e5e5] dark:hover:border-[#37464f] transition-all">
        <span className="text-2xl drop-shadow-sm">{flagEmoji}</span>
        <span className="font-extrabold text-sm tracking-wide text-[#4b4b4b] dark:text-[#f1f5f9] hidden sm:inline">
          {languageName}
        </span>
      </div>

      {/* Gamification Counters & Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Streak Flame */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenStreakInfo();
          }}
          className="flex items-center gap-1.5 group px-2 py-1 rounded-xl hover:bg-[#fff5e5] dark:hover:bg-[#342718] transition-colors"
          title="Daily Streak - Click for Streak Simulator"
        >
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff9600] fill-[#ff9600] group-hover:scale-110 transition-transform animate-pulse" />
          <span className="font-black text-xs sm:text-sm text-[#ff9600]">{streak}</span>
        </button>

        {/* Gems */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-[#eef8ff] dark:hover:bg-[#162a38] transition-colors cursor-default"
          title="Gems"
        >
          <Gem className="w-5 h-5 sm:w-6 sm:h-6 text-[#1cb0f6] fill-[#1cb0f6]" />
          <span className="font-black text-xs sm:text-sm text-[#1cb0f6]">{gems}</span>
        </div>

        {/* Hearts with Refill Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenHeartsModal();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 transition-all ${
            hearts === 0
              ? "bg-[#ffdede] border-[#ff4b4b] animate-bounce"
              : "border-transparent hover:border-[#ffccd1] hover:bg-[#fff0f1] dark:hover:bg-[#331c20]"
          }`}
          title="Hearts - Click to refill or practice"
        >
          <Heart
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              hearts > 0 ? "text-[#ff4b4b] fill-[#ff4b4b]" : "text-[#afafaf] fill-[#afafaf]"
            }`}
          />
          <span className={`font-black text-xs sm:text-sm ${hearts > 0 ? "text-[#ff4b4b]" : "text-[#afafaf]"}`}>
            {hearts}/{maxHearts}
          </span>
          {hearts < maxHearts && (
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center text-[10px] font-black">
              +
            </span>
          )}
        </button>

        

        {/* Settings button on mobile */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          title="Settings"
          className="p-1.5 sm:p-2 rounded-xl border-2 border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] text-[#777777] dark:text-[#a5b4bc] transition-all md:hidden"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
