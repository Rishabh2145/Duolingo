"use client";

import React, { useState } from "react";
import { Heart, Snowflake, Zap, Gem, Dumbbell, Check } from "lucide-react";
import { refillHearts } from "@/lib/api";
import { sound } from "@/lib/sound";

interface ShopViewProps {
  userGems: number;
  userHearts: number;
  maxHearts: number;
  onRefreshUser: () => void;
  onOpenSuperModal: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  userGems,
  userHearts,
  maxHearts,
  onRefreshUser,
  onOpenSuperModal,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRefill = async () => {
    sound.playClick();
    if (userGems < 350) return;
    setLoadingAction("refill");
    try {
      const res = await refillHearts("refill");
      setSuccessMsg(res.message);
      onRefreshUser();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePractice = async () => {
    sound.playClick();
    setLoadingAction("practice");
    try {
      const res = await refillHearts("practice");
      setSuccessMsg(res.message);
      onRefreshUser();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-6 py-8">
      {/* Gems Banner */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-[#f0f9ff] dark:bg-[#132c3d] border-2 border-[#bae6fd] mb-8 shadow-sm">
        <div>
          <span className="text-xs font-black uppercase text-[#0284c7]">Your Balance</span>
          <h2 className="text-3xl font-black text-[#0369a1] dark:text-[#38bdf8] flex items-center gap-2">
            <Gem className="w-8 h-8 fill-current" /> {userGems} Gems
          </h2>
        </div>
        <button
          onClick={onOpenSuperModal}
          className="py-2.5 px-4 rounded-xl duo-button-blue text-xs font-black uppercase tracking-wider shadow"
        >
          Get Super
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#dcfce7] border-2 border-[#86efac] text-xs font-black text-[#15803d] flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Hearts Section */}
      <h3 className="text-xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-4">
        Hearts & Health
      </h3>
      <div className="space-y-4 mb-10">
        {/* Refill Hearts */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-5 bg-white dark:bg-[#1f2d34] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fff0f1] flex items-center justify-center text-[#ff4b4b] shrink-0">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h4 className="font-black text-base text-[#4b4b4b] dark:text-[#f1f5f9]">
                Refill Hearts
              </h4>
              <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc]">
                Get full hearts so you can keep practicing with confidence.
              </p>
              <span className="text-xs font-bold text-[#ff4b4b] mt-1 inline-block">
                Current: {userHearts}/{maxHearts} hearts
              </span>
            </div>
          </div>

          <button
            onClick={handleRefill}
            disabled={userHearts >= maxHearts || userGems < 350 || loadingAction === "refill"}
            className={`py-3 px-5 rounded-2xl font-black text-xs uppercase shrink-0 transition-all ${
              userHearts >= maxHearts
                ? "bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed border-b-4 border-[#afafaf]"
                : userGems < 350
                ? "bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed border-b-4 border-[#afafaf]"
                : "duo-button-blue shadow"
            }`}
          >
            {userHearts >= maxHearts ? (
              "Full"
            ) : (
              <span className="flex items-center gap-1.5">
                <Gem className="w-4 h-4 fill-white" /> 350
              </span>
            )}
          </button>
        </div>

        {/* Free Practice */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-5 bg-white dark:bg-[#1f2d34] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] flex items-center justify-center text-[#58cc02] shrink-0">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-base text-[#4b4b4b] dark:text-[#f1f5f9]">
                Practice to Earn Heart
              </h4>
              <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc]">
                Regain 1 heart for free by reviewing previous vocabulary.
              </p>
            </div>
          </div>

          <button
            onClick={handlePractice}
            disabled={userHearts >= maxHearts || loadingAction === "practice"}
            className={`py-3 px-5 rounded-2xl font-black text-xs uppercase shrink-0 transition-all ${
              userHearts >= maxHearts
                ? "bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed border-b-4 border-[#afafaf]"
                : "duo-button-green shadow"
            }`}
          >
            {userHearts >= maxHearts ? "Full" : "Free (+1 ❤️)"}
          </button>
        </div>
      </div>

      {/* Power-ups Section */}
      <h3 className="text-xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-4">
        Power-ups
      </h3>
      <div className="space-y-4">
        {/* Streak Freeze */}
        <div className="border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl p-5 bg-white dark:bg-[#1f2d34] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0">
              <Snowflake className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-base text-[#4b4b4b] dark:text-[#f1f5f9]">
                Streak Freeze
              </h4>
              <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc]">
                Streak Freeze protects your streak if you miss a day of practice.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              alert("Streak freeze equipped! Your streak is safely shielded.");
            }}
            className="py-3 px-5 rounded-2xl duo-button-blue font-black text-xs uppercase shrink-0 shadow flex items-center gap-1.5"
          >
            <Gem className="w-4 h-4 fill-white" /> 200
          </button>
        </div>
      </div>
    </div>
  );
};
