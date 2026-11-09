"use client";

import React from "react";
import { BookOpen, Shield, Target, Store, User } from "lucide-react";
import { NavTab } from "./Sidebar";
import { sound } from "@/lib/sound";

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const items: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    { tab: "learn", label: "Learn", icon: <BookOpen className="w-6 h-6" /> },
    { tab: "leaderboard", label: "Ranks", icon: <Shield className="w-6 h-6" /> },
    { tab: "quests", label: "Quests", icon: <Target className="w-6 h-6" /> },
    { tab: "shop", label: "Shop", icon: <Store className="w-6 h-6" /> },
    { tab: "profile", label: "Profile", icon: <User className="w-6 h-6" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#131f24] border-t-2 border-[#e5e5e5] dark:border-[#37464f] px-2 py-2 flex justify-around items-center">
      {items.map((item) => {
        const isActive = currentTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => {
              sound.playClick();
              onSelectTab(item.tab);
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isActive
                ? "text-[#1cb0f6] bg-[#ddf4ff] dark:bg-[#183647]"
                : "text-[#afafaf] hover:text-[#4b4b4b] dark:hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-black uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
