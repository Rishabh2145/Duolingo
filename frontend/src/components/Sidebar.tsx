"use client";

import React from "react";
import {
  BookOpen,
  Shield,
  Target,
  Store,
  User,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { DuoMascot } from "./DuoMascot";

export type NavTab = "learn" | "leaderboard" | "quests" | "shop" | "profile";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleDarkMode,
}) => {
  const navItems: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: "learn",
      label: "LEARN",
      icon: <BookOpen className="w-7 h-7" />,
    },
    {
      tab: "leaderboard",
      label: "LEADERBOARDS",
      icon: <Shield className="w-7 h-7" />,
    },
    {
      tab: "quests",
      label: "QUESTS",
      icon: <Target className="w-7 h-7" />,
    },
    {
      tab: "shop",
      label: "SHOP",
      icon: <Store className="w-7 h-7" />,
    },
    {
      tab: "profile",
      label: "PROFILE",
      icon: <User className="w-7 h-7" />,
    },
  ];

  return (
    <aside className="w-64 border-r-2 border-[#e5e5e5] dark:border-[#37464f] p-4 flex flex-col justify-between h-screen sticky top-0 bg-white dark:bg-[#131f24] shrink-0">
      <div>
        {/* Duolingo Brand Title with Duo Owl Face */}
        <div
          className="flex items-center gap-2.5 px-3 py-4 mb-4 cursor-pointer select-none"
          onClick={() => {
            sound.playClick();
            onSelectTab("learn");
          }}
        >
          <DuoMascot mood="happy" size={38} />
          <span className="text-3xl font-black tracking-tight text-[#58cc02] lowercase font-sans">
            duolingo
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.tab);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black tracking-wider text-xs transition-all text-left uppercase ${
                  isActive
                    ? "bg-[#ddf4ff] dark:bg-[#183647] text-[#1cb0f6] border-2 border-[#84d8ff] dark:border-[#1cb0f6]"
                    : "text-[#777777] dark:text-[#a5b4bc] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] border-2 border-transparent"
                }`}
              >
                <span className={isActive ? "text-[#1cb0f6]" : "text-[#afafaf] dark:text-[#64748b]"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls / Settings */}
      <div className="flex flex-col gap-2 pt-4 border-t-2 border-[#e5e5e5] dark:border-[#37464f]">
        <div className="flex items-center justify-between px-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            className="p-2.5 rounded-xl border-2 border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] text-[#777777] dark:text-[#a5b4bc] transition-all"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#58cc02]" /> : <VolumeX className="w-5 h-5 text-[#afafaf]" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Theme"
            className="p-2.5 rounded-xl border-2 border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] text-[#777777] dark:text-[#a5b4bc] transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#ffc800]" /> : <Moon className="w-5 h-5 text-[#ce82ff]" />}
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            title="Settings & Simulator"
            className="p-2.5 rounded-xl border-2 border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2d34] text-[#777777] dark:text-[#a5b4bc] transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
