"use client";

import React, { useState } from "react";
import {
  Book,
  Check,
  Lock,
  Star,
  Coffee,
  MessageCircle,
  Trophy,
  Crown,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";
import { CoursePathResponse, SkillSummary, UnitSummary } from "@/lib/api";
import { sound } from "@/lib/sound";
import { GuidebookModal } from "./GuidebookModal";

interface PathTreeProps {
  coursePath: CoursePathResponse;
  onStartLesson: (lessonId: number) => void;
  userHearts: number;
  onOpenHeartsModal: () => void;
}

export const PathTree: React.FC<PathTreeProps> = ({
  coursePath,
  onStartLesson,
  userHearts,
  onOpenHeartsModal,
}) => {
  const [activePopupSkill, setActivePopupSkill] = useState<SkillSummary | null>(null);
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<UnitSummary | null>(null);

  // Map icon strings to Lucide components
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case "chat":
        return <MessageCircle className="w-8 h-8 text-white fill-current" />;
      case "coffee":
        return <Coffee className="w-8 h-8 text-white stroke-[2.5]" />;
      case "star":
        return <Star className="w-8 h-8 text-white fill-current" />;
      case "trophy":
        return <Trophy className="w-8 h-8 text-white stroke-[2.5]" />;
      case "apple":
        return <Sparkles className="w-8 h-8 text-white fill-current" />;
      case "book":
      default:
        return <Book className="w-8 h-8 text-white fill-current" />;
    }
  };

  // Horizontal offsets for the classic Duolingo winding serpentine path
  const getOffsetClass = (index: number) => {
    const pattern = [
      "translate-x-0",
      "translate-x-12 sm:translate-x-16",
      "translate-x-16 sm:translate-x-24",
      "translate-x-12 sm:translate-x-16",
      "translate-x-0",
      "-translate-x-12 sm:-translate-x-16",
      "-translate-x-16 sm:-translate-x-24",
      "-translate-x-12 sm:-translate-x-16",
    ];
    return pattern[index % pattern.length];
  };

  const handleNodeClick = (skill: SkillSummary) => {
    sound.playClick();
    setActivePopupSkill(activePopupSkill?.id === skill.id ? null : skill);
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-8 relative">
      {/* Click-outside backdrop for closing active popups */}
      {activePopupSkill && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setActivePopupSkill(null)}
        />
      )}

      {coursePath.units.map((unit: UnitSummary) => (
        <div key={unit.id} className="mb-16">
          {/* Unit Header Card */}
          <div
            className="rounded-2xl p-5 mb-10 text-white shadow-md relative overflow-hidden"
            style={{ backgroundColor: unit.color }}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-black uppercase tracking-widest opacity-85 block mb-1">
                  SECTION 1, {unit.title}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-wide mb-1">
                  {unit.description}
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveGuidebookUnit(unit);
                }}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Guidebook</span>
              </button>
            </div>
          </div>

          {/* Path Nodes */}
          <div className="flex flex-col items-center gap-12 relative">
            {unit.skills.map((skill: SkillSummary, skillIdx: number) => {
              const isCurrent = skill.state === "current";
              const isCompleted = skill.state === "completed";
              const isLocked = skill.state === "locked";
              const isPopupOpen = activePopupSkill?.id === skill.id;
              const offsetClass = getOffsetClass(skillIdx);

              // Circular progress stroke for active / partially completed skill
              const radius = 48;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset =
                circumference - (skill.progress_percentage / 100) * circumference;

              return (
                <div
                  key={skill.id}
                  className={`relative flex flex-col items-center transition-transform duration-200 ${offsetClass} ${
                    isPopupOpen ? "z-40" : "z-10"
                  }`}
                >
                  {/* Floating START speech bubble above the current active node */}
                  {isCurrent && (
                    <div className="absolute -top-14 z-20 flex flex-col items-center animate-bounce-gentle">
                      <div className="duo-popover-solid border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-2xl px-3.5 py-1.5 shadow-lg text-xs font-black tracking-widest text-[#58cc02] uppercase flex items-center gap-1">
                        <span>START</span>
                      </div>
                      <div className="bubble-pointer-down" />
                    </div>
                  )}

                  {/* SVG Progress Ring surrounding the button */}
                  <div className="relative flex items-center justify-center">
                    <svg
                      className="absolute -inset-2.5 w-26 h-26 pointer-events-none transform -rotate-90"
                      viewBox="0 0 106 106"
                    >
                      {/* Background circle */}
                      <circle
                        cx="53"
                        cy="53"
                        r={radius}
                        stroke="#e5e5e5"
                        strokeWidth="8"
                        fill="transparent"
                        className="opacity-40"
                      />
                      {/* Animated Progress Ring */}
                      {!isLocked && (
                        <circle
                          cx="53"
                          cy="53"
                          r={radius}
                          stroke={isCompleted ? "#ffc800" : "#58cc02"}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      )}
                    </svg>

                    {/* Skill Circular Button with 3D Bevel */}
                    <button
                      onClick={() => handleNodeClick(skill)}
                      className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#ffc800] border-b-[6px] border-[#d97706] active:translate-y-[3px] active:border-b-[3px] shadow-lg"
                          : isCurrent
                          ? "bg-[#58cc02] border-b-[6px] border-[#46a302] active:translate-y-[3px] active:border-b-[3px] shadow-lg animate-pulse-ring"
                          : "bg-[#e5e5e5] dark:bg-[#253238] border-b-[6px] border-[#afafaf] dark:border-[#192327] cursor-not-allowed opacity-75"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-10 h-10 text-white stroke-[3.5]" />
                      ) : isLocked ? (
                        <Lock className="w-8 h-8 text-[#afafaf] dark:text-[#64748b]" />
                      ) : (
                        getSkillIcon(skill.icon)
                      )}
                    </button>

                    {/* Crown badge for completed skills */}
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 z-20 bg-[#ffc800] border-2 border-white dark:border-[#131f24] rounded-full p-1 shadow-md">
                        <Crown className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Skill Title underneath */}
                  <span
                    className={`mt-2.5 text-sm font-black tracking-wide ${
                      isLocked
                        ? "text-[#afafaf] dark:text-[#64748b]"
                        : "text-[#4b4b4b] dark:text-[#f1f5f9]"
                    }`}
                  >
                    {skill.title}
                  </span>

                  {/* Popover Card for Node interaction - 100% Solid & Elevated */}
                  {isPopupOpen && (
                    <div
                      className="absolute top-26 z-50 w-76 duo-popover-solid border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl p-5 shadow-2xl"
                      style={{
                        backgroundColor: "var(--popover-bg)",
                        opacity: 1,
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-black text-lg text-[#4b4b4b] dark:text-[#f1f5f9]">
                          {skill.title}
                        </h4>
                        <span
                          className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                            isCompleted
                              ? "bg-[#fff5cc] text-[#d97706]"
                              : isCurrent
                              ? "bg-[#ddf4ff] text-[#1cb0f6]"
                              : "bg-[#f1f5f9] text-[#64748b]"
                          }`}
                        >
                          {skill.completed_lessons} / {skill.total_lessons} LESSONS
                        </span>
                      </div>

                      {isLocked ? (
                        <p className="text-sm font-bold text-[#777777] dark:text-[#a5b4bc] mb-4">
                          🔒 Complete all preceding skills to unlock this milestone!
                        </p>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc] mb-4">
                            {isCompleted
                              ? "You've mastered this skill! Practice anytime to strengthen memory."
                              : "Learn new vocabulary and level up your fluency!"}
                          </p>

                          {/* Lessons in this skill */}
                          <div className="space-y-2.5 mb-4">
                            {skill.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  sound.playClick();
                                  if (userHearts <= 0) {
                                    onOpenHeartsModal();
                                    return;
                                  }
                                  setActivePopupSkill(null);
                                  onStartLesson(lesson.id);
                                }}
                                className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-between transition-all shadow-sm ${
                                  lesson.completed
                                    ? "bg-[#f0fdf4] border-2 border-[#86efac] text-[#16a34a] hover:bg-[#dcfce7]"
                                    : "duo-button-green"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {lesson.completed && <Check className="w-4 h-4" />}
                                  {lesson.title}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3.5 h-3.5 fill-current" /> +{lesson.xp_reward} XP
                                </span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <button
                        onClick={() => setActivePopupSkill(null)}
                        className="w-full py-1.5 text-xs font-black text-[#afafaf] hover:text-[#777777] dark:hover:text-[#cbd5e1] uppercase tracking-wider"
                      >
                        CLOSE
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Guidebook Modal */}
      {activeGuidebookUnit && (
        <GuidebookModal
          unit={activeGuidebookUnit}
          onClose={() => setActiveGuidebookUnit(null)}
        />
      )}
    </div>
  );
};
