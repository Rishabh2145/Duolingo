"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  UserProfile,
  CoursePathResponse,
  LessonDetail,
  fetchUser,
  fetchCoursePath,
  fetchLesson,
  refillHearts,
} from "@/lib/api";
import { sound } from "@/lib/sound";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { MobileNav } from "@/components/MobileNav";
import { PathTree } from "@/components/PathTree";
import { LessonPlayer } from "@/components/LessonPlayer";
import { ProfileView } from "@/components/ProfileView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { QuestsView } from "@/components/QuestsView";
import { ShopView } from "@/components/ShopView";
import { SettingsModal } from "@/components/SettingsModal";
import { OutOfHeartsModal } from "@/components/OutOfHeartsModal";
import { DuoMascot } from "@/components/DuoMascot";

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [coursePath, setCoursePath] = useState<CoursePathResponse | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>("learn");
  const [activeLesson, setActiveLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);

  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Dark Mode from localStorage or system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("duo-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [u, cp] = await Promise.all([fetchUser(), fetchCoursePath()]);
      setUser(u);
      setCoursePath(cp);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Dark Mode toggle
  const handleToggleDarkMode = () => {
    sound.playClick();
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("duo-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("duo-theme", "light");
        }
      }
      return next;
    });
  };

  // Handle Sound toggle
  const handleToggleSound = () => {
    sound.playClick();
    setSoundEnabled((prev) => {
      const next = !prev;
      sound.soundEnabled = next;
      return next;
    });
  };

  // Start a lesson
  const handleStartLesson = async (lessonId: number) => {
    try {
      const l = await fetchLesson(lessonId);
      setActiveLesson(l);
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
    }
  };

  // Lesson Finished
  const handleLessonFinished = () => {
    loadData();
  };

  // Refill Hearts with Gems
  const handleRefillHeartsWithGems = async () => {
    try {
      await refillHearts("refill");
      loadData();
      setShowHeartsModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Practice to Earn Heart
  const handlePracticeHeart = async () => {
    try {
      await refillHearts("practice");
      loadData();
      setShowHeartsModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user || !coursePath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#131f24] gap-4">
        <DuoMascot mood="happy" size={100} className="animate-bounce-gentle" />
        <h2 className="text-2xl font-black text-[#58cc02] tracking-wide lowercase">
          duolingo
        </h2>
        <div className="w-48 h-3 bg-[#e5e5e5] dark:bg-[#253238] rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#58cc02] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#131f24] text-[#4b4b4b] dark:text-[#f1f5f9] transition-colors duration-200">
      {/* Left Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSettings={() => setShowSettingsModal(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Sticky Bar */}
        <TopBar
          streak={user.streak}
          gems={user.gems}
          hearts={user.hearts}
          maxHearts={user.max_hearts}
          flagEmoji={coursePath.language.flag}
          languageName={coursePath.language.name}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenHeartsModal={() => setShowHeartsModal(true)}
          onOpenStreakInfo={() => setCurrentTab("profile")}
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        {/* Tab Views */}
        <div className="flex-1 flex overflow-x-hidden">
          {currentTab === "learn" && (
            <>
              <PathTree
                coursePath={coursePath}
                onStartLesson={handleStartLesson}
                userHearts={user.hearts}
                onOpenHeartsModal={() => setShowHeartsModal(true)}
              />
              <RightSidebar
                todayXp={user.today_xp}
                dailyGoal={user.daily_xp_goal}
                onNavigateToLeaderboard={() => setCurrentTab("leaderboard")}
                onNavigateToQuests={() => setCurrentTab("quests")}
                onOpenSuperModal={() => setShowSuperModal(true)}
              />
            </>
          )}

          {currentTab === "leaderboard" && <LeaderboardView />}

          {currentTab === "quests" && (
            <QuestsView todayXp={user.today_xp} dailyGoal={user.daily_xp_goal} />
          )}

          {currentTab === "shop" && (
            <ShopView
              userGems={user.gems}
              userHearts={user.hearts}
              maxHearts={user.max_hearts}
              onRefreshUser={loadData}
              onOpenSuperModal={() => setShowSuperModal(true)}
            />
          )}

          {currentTab === "profile" && (
            <ProfileView user={user} onRefreshUser={loadData} />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Fullscreen Lesson Player Modal */}
      {activeLesson && (
        <LessonPlayer
          lesson={activeLesson}
          userGems={user.gems}
          initialHearts={user.hearts}
          onExit={() => {
            setActiveLesson(null);
            loadData();
          }}
          onLessonFinished={() => {
            handleLessonFinished();
          }}
        />
      )}

      {/* Out of Hearts / Refill Modal */}
      {showHeartsModal && (
        <OutOfHeartsModal
          userGems={user.gems}
          onRefillWithGems={handleRefillHeartsWithGems}
          onPractice={handlePracticeHeart}
          onQuitLesson={() => setShowHeartsModal(false)}
          onClose={() => setShowHeartsModal(false)}
          isStandalone={true}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentGoal={user.daily_xp_goal}
        onGoalChange={(g) => setUser({ ...user, daily_xp_goal: g })}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Super Duolingo Modal (Mocked) */}
      {showSuperModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowSuperModal(false)}
              className="absolute top-4 right-4 text-[#afafaf] hover:text-[#4b4b4b] p-2"
            >
              ✕
            </button>
            <DuoMascot mood="celebrating" size={110} className="mx-auto mb-4" />
            <h3 className="text-2xl font-black text-[#1cb0f6] tracking-wide mb-2 uppercase">
              Super Duolingo (Mocked)
            </h3>
            <p className="text-sm font-semibold text-[#777777] dark:text-[#a5b4bc] mb-6">
              Super unlocks unlimited hearts, legendary challenges, and zero ads! This premium feature is currently mocked for the assignment.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setShowSuperModal(false);
              }}
              className="w-full py-3.5 rounded-2xl duo-button-blue font-black text-xs uppercase tracking-wider"
            >
              Back to Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
