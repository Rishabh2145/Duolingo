"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Shield, ArrowUp, ArrowDown } from "lucide-react";
import { LeaderboardData, fetchLeaderboard } from "@/lib/api";

export const LeaderboardView: React.FC = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    fetchLeaderboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#58cc02]" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto px-6 py-8">
      {/* League Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#e0f2fe] dark:bg-[#132c3d] border-4 border-[#38bdf8] flex items-center justify-center mb-3 shadow-md">
          <Shield className="w-10 h-10 text-[#0284c7] fill-[#38bdf8]" />
        </div>
        <h1 className="text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] tracking-wide mb-1">
          {data.league_name}
        </h1>
        <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc] uppercase tracking-wider">
          Top 3 advance to Gold League • {data.days_left} days left
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl overflow-hidden bg-white dark:bg-[#1f2d34] shadow-sm">
        {data.users.map((user, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const isDemotion = rank > data.users.length - 3;

          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 border-b border-[#e5e5e5] dark:border-[#37464f] last:border-b-0 transition-colors ${
                user.is_current_user
                  ? "bg-[#ddf4ff] dark:bg-[#163548] font-black text-[#0284c7]"
                  : "hover:bg-[#f8fafc] dark:hover:bg-[#25363f]"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank number or medal */}
                <div className="w-7 text-center font-black text-base">
                  {rank === 1 ? (
                    <span className="text-[#ffc800]">🥇</span>
                  ) : rank === 2 ? (
                    <span className="text-[#94a3b8]">🥈</span>
                  ) : rank === 3 ? (
                    <span className="text-[#d97706]">🥉</span>
                  ) : (
                    <span className="text-[#777777] dark:text-[#94a3b8]">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-[#1f2d34] shadow-sm"
                />

                {/* Name & Promotion Indicator */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black text-sm ${
                        user.is_current_user
                          ? "text-[#0369a1] dark:text-[#38bdf8]"
                          : "text-[#4b4b4b] dark:text-[#f1f5f9]"
                      }`}
                    >
                      {user.name}
                    </span>
                    {user.is_current_user && (
                      <span className="text-[10px] bg-[#0284c7] text-white px-2 py-0.5 rounded-full font-black uppercase">
                        You
                      </span>
                    )}
                  </div>
                  {isTop3 && (
                    <span className="text-[11px] font-bold text-[#16a34a] flex items-center gap-0.5">
                      <ArrowUp className="w-3 h-3" /> Promotion Zone
                    </span>
                  )}
                  {isDemotion && (
                    <span className="text-[11px] font-bold text-[#ef4444] flex items-center gap-0.5">
                      <ArrowDown className="w-3 h-3" /> Demotion Zone
                    </span>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="font-black text-sm text-[#777777] dark:text-[#a5b4bc]">
                <span>{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
