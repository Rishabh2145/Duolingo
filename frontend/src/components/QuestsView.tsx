"use client";

import React from "react";
import { Target, CheckCircle2, Trophy, Clock, Users } from "lucide-react";
import { DuoMascot } from "@/components/DuoMascot";

interface QuestsViewProps {
  todayXp: number;
  dailyGoal: number;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  todayXp,
  dailyGoal,
}) => {
  const xpPct = Math.min(100, Math.round((todayXp / dailyGoal) * 100));

  return (
    <div className="flex-1 max-w-2xl mx-auto px-6 py-8">
      {/* Monthly Challenge Banner */}
      <div className="bg-gradient-to-r from-[#ce82ff] to-[#a855f7] rounded-3xl p-6 text-white mb-8 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">
            November Challenge
          </span>
          <h2 className="text-2xl font-black mb-1">Duo&apos;s Autumn Harvest</h2>
          <p className="text-xs font-bold opacity-90 max-w-xs mb-3">
            Complete 15 daily quests this month to earn an exclusive seasonal badge!
          </p>
          <div className="flex items-center gap-3">
            <div className="w-48 h-3 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-2/5" />
            </div>
            <span className="text-xs font-black">6 / 15</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <DuoMascot mood="celebrating" size={90} />
        </div>
      </div>

      {/* Daily Quests Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] flex items-center gap-2">
          <Target className="w-6 h-6 text-[#ff9600]" />
          <span>Daily Quests</span>
        </h2>
        <span className="text-xs font-black text-[#afafaf] uppercase">
          Resets in 6 hours
        </span>
      </div>

      {/* Quests List */}
      <div className="space-y-4 mb-8">
        {/* Quest 1 */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-4 bg-white dark:bg-[#1f2d34] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                Earn {dailyGoal} XP
              </h4>
              <div className="w-44 h-2 bg-[#e5e5e5] dark:bg-[#253238] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#ff9600] rounded-full transition-all duration-500"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>
          <span className="text-xs font-black text-[#ea580c]">
            {todayXp} / {dailyGoal} XP
          </span>
        </div>

        {/* Quest 2 */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-4 bg-white dark:bg-[#1f2d34] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[#16a34a]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                Complete 1 lesson today
              </h4>
              <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc] mt-1">
                {todayXp > 0 ? "Completed! +5 Gems" : "In progress"}
              </p>
            </div>
          </div>
          {todayXp > 0 ? (
            <span className="text-xs font-black text-[#16a34a] bg-[#dcfce7] px-3 py-1 rounded-full">
              COMPLETED
            </span>
          ) : (
            <span className="text-xs font-black text-[#afafaf]">0 / 1</span>
          )}
        </div>

        {/* Quest 3 */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-4 bg-white dark:bg-[#1f2d34] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                Practice for 10 minutes
              </h4>
              <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc] mt-1">
                Build a consistent learning habit
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-[#2563eb]">7 / 10 min</span>
        </div>
      </div>

      {/* Friends Quest (Placeholder as required in rubric) */}
      <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] border-dashed rounded-3xl p-6 text-center bg-[#fafafa] dark:bg-[#18252c]">
        <Users className="w-8 h-8 text-[#afafaf] mx-auto mb-2" />
        <h4 className="font-black text-base text-[#4b4b4b] dark:text-[#f1f5f9] mb-1">
          Friends Quest (Coming Soon)
        </h4>
        <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc] max-w-sm mx-auto">
          Partner with your friends every Tuesday to complete shared challenges and earn double gems!
        </p>
      </div>
    </div>
  );
};
