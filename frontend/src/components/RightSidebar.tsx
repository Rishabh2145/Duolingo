"use client";

import React from "react";
import { Zap, Target, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { DuoMascot } from "./DuoMascot";

interface RightSidebarProps {
  todayXp: number;
  dailyGoal: number;
  onNavigateToLeaderboard: () => void;
  onNavigateToQuests: () => void;
  onOpenSuperModal: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  todayXp,
  dailyGoal,
  onNavigateToLeaderboard,
  onNavigateToQuests,
  onOpenSuperModal,
}) => {
  const goalProgress = Math.min(100, Math.round((todayXp / dailyGoal) * 100));

  return (
    <aside className="w-88 p-6 hidden xl:flex flex-col gap-6 shrink-0 border-l-2 border-[#e5e5e5] dark:border-[#37464f] min-h-screen">
      {/* Super Duolingo Card */}
      <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl p-5 bg-gradient-to-br from-[#1cb0f6]/10 via-[#ce82ff]/10 to-transparent relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#1cb0f6] fill-[#1cb0f6]" />
            <h3 className="font-black text-base text-[#1cb0f6] tracking-wide">
              SUPER DUOLINGO
            </h3>
          </div>
          <DuoMascot mood="celebrating" size={42} />
        </div>
        <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc] mb-4">
          Unlimited hearts, zero ads, and personalized mistake reviews!
        </p>
        <button
          onClick={() => {
            sound.playClick();
            onOpenSuperModal();
          }}
          className="w-full py-3 px-4 rounded-2xl duo-button-blue font-black text-xs tracking-wider uppercase shadow"
        >
          Try Super For Free
        </button>
      </div>

      {/* Daily Quests Card */}
      <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl p-5 bg-white dark:bg-[#1f2d34]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#ff9600]" />
            <h3 className="font-black text-sm uppercase tracking-wider text-[#4b4b4b] dark:text-[#f1f5f9]">
              Daily Quests
            </h3>
          </div>
          <button
            onClick={onNavigateToQuests}
            className="text-xs font-black text-[#1cb0f6] hover:underline uppercase"
          >
            VIEW ALL
          </button>
        </div>

        {/* Quest 1: XP Goal */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-center text-xs font-black text-[#777777] dark:text-[#a5b4bc]">
            <span>Earn {dailyGoal} XP today</span>
            <span className="text-[#ff9600]">
              {todayXp} / {dailyGoal} XP
            </span>
          </div>
          <div className="w-full h-3 bg-[#e5e5e5] dark:bg-[#253238] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff9600] rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        {/* Quest 2: Complete 1 Lesson */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f7f7f7] dark:bg-[#1a282f] text-xs font-black text-[#4b4b4b] dark:text-[#cbd5e1]">
          <span>Complete 1 lesson today</span>
          {todayXp > 0 ? (
            <CheckCircle2 className="w-4 h-4 text-[#58cc02]" />
          ) : (
            <span className="text-[#afafaf]">0/1</span>
          )}
        </div>
      </div>

      {/* Leaderboard Preview Card */}
      <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl p-5 bg-white dark:bg-[#1f2d34]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffc800]" />
            <h3 className="font-black text-sm uppercase tracking-wider text-[#4b4b4b] dark:text-[#f1f5f9]">
              Silver League
            </h3>
          </div>
          <button
            onClick={onNavigateToLeaderboard}
            className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-1 uppercase"
          >
            SEE LEAGUE <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center text-[#ffc800] text-sm">🥇</span>
              <span className="text-[#4b4b4b] dark:text-[#f1f5f9]">Sofia Chen</span>
            </div>
            <span className="text-[#777777] dark:text-[#a5b4bc]">520 XP</span>
          </div>
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center text-[#94a3b8] text-sm">🥈</span>
              <span className="text-[#4b4b4b] dark:text-[#f1f5f9]">Diego Ramos</span>
            </div>
            <span className="text-[#777777] dark:text-[#a5b4bc]">485 XP</span>
          </div>
          <div className="flex items-center justify-between text-xs font-black bg-[#ddf4ff] dark:bg-[#183647] p-2.5 rounded-2xl text-[#1899d6]">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-black">4</span>
              <span>Alex Rivera (You)</span>
            </div>
            <span>345 XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
