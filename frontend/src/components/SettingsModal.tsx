"use client";

import React, { useState } from "react";
import { X, Volume2, VolumeX, Moon, Sun, Target, Check } from "lucide-react";
import { updateDailyGoal } from "@/lib/api";
import { sound } from "@/lib/sound";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onGoalChange: (goal: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onGoalChange,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleDarkMode,
}) => {
  const [selectedGoal, setSelectedGoal] = useState(currentGoal);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const goalOptions = [
    { value: 10, label: "Casual (10 XP / day)" },
    { value: 20, label: "Regular (20 XP / day)" },
    { value: 30, label: "Serious (30 XP / day)" },
    { value: 50, label: "Intense (50 XP / day)" },
  ];

  const handleSaveGoal = async (val: number) => {
    sound.playClick();
    setSelectedGoal(val);
    try {
      await updateDailyGoal(val);
      onGoalChange(val);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5] dark:border-[#37464f] mb-6">
          <h2 className="text-xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] tracking-wide">
            Settings & Preferences
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-[#afafaf] hover:text-[#4b4b4b] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[#e5e5e5] dark:border-[#37464f]">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-[#58cc02]" />
            ) : (
              <VolumeX className="w-6 h-6 text-[#afafaf]" />
            )}
            <div>
              <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                Sound Effects & Chimes
              </h4>
              <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc]">
                Play cheerful chime on correct and buzz on mistakes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              soundEnabled ? "bg-[#58cc02]" : "bg-[#e5e5e5] dark:bg-[#37464f]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[#e5e5e5] dark:border-[#37464f]">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Sun className="w-6 h-6 text-[#ffc800]" />
            ) : (
              <Moon className="w-6 h-6 text-[#ce82ff]" />
            )}
            <div>
              <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
                Appearance Theme
              </h4>
              <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc]">
                {darkMode ? "Dark mode active" : "Light mode active"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onToggleDarkMode();
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              darkMode ? "bg-[#ce82ff]" : "bg-[#e5e5e5] dark:bg-[#37464f]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Daily Goal Setting */}
        <div className="py-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#ff9600]" />
            <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9]">
              Daily XP Goal
            </h4>
            {savedSuccess && (
              <span className="text-[11px] font-bold text-[#16a34a] flex items-center gap-0.5 ml-auto">
                <Check className="w-3 h-3" /> Saved!
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSaveGoal(opt.value)}
                className={`w-full py-2.5 px-4 rounded-xl border-2 text-xs font-bold text-left transition-all flex items-center justify-between ${
                  selectedGoal === opt.value
                    ? "bg-[#ddf4ff] dark:bg-[#183647] border-[#1cb0f6] text-[#0284c7]"
                    : "border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#25363f]"
                }`}
              >
                <span>{opt.label}</span>
                {selectedGoal === opt.value && <Check className="w-4 h-4 text-[#0284c7]" />}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full mt-4 py-3 rounded-2xl duo-button-green font-black text-xs uppercase tracking-wider"
        >
          Done
        </button>
      </div>
    </div>
  );
};
