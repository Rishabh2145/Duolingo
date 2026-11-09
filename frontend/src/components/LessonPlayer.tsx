"use client";

import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import {
  LessonDetail,
  ExerciseItem,
  submitAnswer,
  completeLesson,
  refillHearts,
} from "@/lib/api";
import { sound } from "@/lib/sound";
import { MultipleChoiceExercise } from "./exercises/MultipleChoiceExercise";
import { TranslateExercise } from "./exercises/TranslateExercise";
import { MatchPairsExercise } from "./exercises/MatchPairsExercise";
import { FillInTheBlankExercise } from "./exercises/FillInTheBlankExercise";
import { TypeTheAnswerExercise } from "./exercises/TypeTheAnswerExercise";
import { FeedbackBar, FeedbackStatus } from "./FeedbackBar";
import { LessonCompleteModal } from "./LessonCompleteModal";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { QuitLessonModal } from "./QuitLessonModal";

interface LessonPlayerProps {
  lesson: LessonDetail;
  userGems: number;
  initialHearts: number;
  onExit: () => void;
  onLessonFinished: (result: {
    xpEarned: number;
    newTotalXp: number;
    streak: number;
  }) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  userGems,
  initialHearts,
  onExit,
  onLessonFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(initialHearts);
  const [heartsLost, setHeartsLost] = useState(0);

  // Exercise State
  const [selectedMultipleChoice, setSelectedMultipleChoice] = useState<string | null>(null);
  const [selectedTranslateWords, setSelectedTranslateWords] = useState<
    { id: string; word: string }[]
  >([]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");

  // Feedback State
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [correctAnswerDisplay, setCorrectAnswerDisplay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [lessonCompleteData, setLessonCompleteData] = useState<{
    xpEarned: number;
    totalXp: number;
    streak: number;
    accuracy: number;
    unlockedAchievements: string[];
  } | null>(null);

  const currentExercise: ExerciseItem | undefined = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;
  const progressPercent = Math.round((currentIndex / totalExercises) * 100);

  // Check button disabled condition
  const isCheckDisabled = () => {
    if (isSubmitting || feedbackStatus !== "idle") return true;
    if (!currentExercise) return true;

    switch (currentExercise.exercise_type) {
      case "multiple_choice":
        return !selectedMultipleChoice;
      case "translate":
        return selectedTranslateWords.length === 0;
      case "match_pairs":
        // Must match all pairs
        const totalPairs = (currentExercise.options as any[])?.length || 4;
        return Object.keys(matchedPairs).length < totalPairs;
      case "fill_in_the_blank":
        return !fillBlankAnswer;
      case "type_the_answer":
        return typedAnswer.trim().length === 0;
      default:
        return false;
    }
  };

  // Submit Answer
  const handleCheck = async () => {
    if (!currentExercise || isSubmitting) return;
    setIsSubmitting(true);

    let answerPayload: any = null;
    switch (currentExercise.exercise_type) {
      case "multiple_choice":
        answerPayload = selectedMultipleChoice;
        break;
      case "translate":
        answerPayload = selectedTranslateWords.map((w) => w.word);
        break;
      case "match_pairs":
        answerPayload = matchedPairs;
        break;
      case "fill_in_the_blank":
        answerPayload = fillBlankAnswer;
        break;
      case "type_the_answer":
        answerPayload = typedAnswer;
        break;
    }

    try {
      const res = await submitAnswer(currentExercise.id, answerPayload);

      if (res.is_correct) {
        sound.playCorrect();
        setFeedbackStatus("correct");
      } else {
        sound.playIncorrect();
        setFeedbackStatus("incorrect");
        setHearts(res.hearts_remaining);
        setHeartsLost((prev) => prev + 1);

        // Format correct answer text for feedback bar
        if (typeof res.correct_answer === "string") {
          setCorrectAnswerDisplay(res.correct_answer);
        } else if (Array.isArray(res.correct_answer)) {
          setCorrectAnswerDisplay(res.correct_answer.join(" "));
        } else if (currentExercise.exercise_type === "multiple_choice") {
          const matchOpt = (currentExercise.options as any[])?.find(
            (o) => o.id === res.correct_answer
          );
          setCorrectAnswerDisplay(matchOpt ? matchOpt.text : String(res.correct_answer));
        }

        // If out of hearts, open modal after a brief delay
        if (res.hearts_remaining <= 0) {
          setTimeout(() => {
            setShowOutOfHeartsModal(true);
          }, 800);
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Continue to Next Exercise or Complete Lesson
  const handleContinue = async () => {
    // Reset exercise state
    setSelectedMultipleChoice(null);
    setSelectedTranslateWords([]);
    setMatchedPairs({});
    setFillBlankAnswer(null);
    setTypedAnswer("");
    setFeedbackStatus("idle");
    setCorrectAnswerDisplay("");

    if (currentIndex + 1 < totalExercises) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all exercises!
      try {
        const accuracy = Math.max(
          0,
          Math.round(((totalExercises - heartsLost) / totalExercises) * 100)
        );
        const res = await completeLesson(lesson.id, accuracy, heartsLost);
        setLessonCompleteData({
          xpEarned: res.xp_earned,
          totalXp: res.new_total_xp,
          streak: res.streak,
          accuracy,
          unlockedAchievements: res.achievements_unlocked,
        });
        onLessonFinished({
          xpEarned: res.xp_earned,
          newTotalXp: res.new_total_xp,
          streak: res.streak,
        });
      } catch (err) {
        console.error("Lesson completion error:", err);
      }
    }
  };

  // Hearts refill / practice handlers
  const handleRefillHearts = async () => {
    try {
      await refillHearts("refill");
      setHearts(5);
      setShowOutOfHeartsModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePracticeHeart = async () => {
    try {
      await refillHearts("practice");
      setHearts((prev) => Math.min(5, prev + 1));
      setShowOutOfHeartsModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (lessonCompleteData) {
    return (
      <LessonCompleteModal
        xpEarned={lessonCompleteData.xpEarned}
        totalXp={lessonCompleteData.totalXp}
        streak={lessonCompleteData.streak}
        accuracy={lessonCompleteData.accuracy}
        unlockedAchievements={lessonCompleteData.unlockedAchievements}
        onFinish={onExit}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-[#131f24] flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full pt-8 pb-4 px-6 flex items-center justify-between gap-6 shrink-0">
        {/* Quit button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowQuitModal(true);
          }}
          className="text-[#afafaf] hover:text-[#4b4b4b] dark:hover:text-[#f1f5f9] p-2 rounded-xl transition-colors"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-4 bg-[#e5e5e5] dark:bg-[#253238] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#58cc02] rounded-full transition-all duration-400 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts counter */}
        <div className="flex items-center gap-1.5 font-black text-sm text-[#ff4b4b]">
          <Heart className="w-6 h-6 fill-[#ff4b4b] text-[#ff4b4b] animate-pulse" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Exercise View */}
      <main className="max-w-3xl mx-auto w-full px-6 py-6 flex-1 flex flex-col justify-center pb-32">
        {currentExercise && (
          <>
            {currentExercise.exercise_type === "multiple_choice" && (
              <MultipleChoiceExercise
                prompt={currentExercise.prompt}
                audioText={currentExercise.audio_text}
                options={currentExercise.options || []}
                selectedOption={selectedMultipleChoice}
                onSelectOption={setSelectedMultipleChoice}
                disabled={feedbackStatus !== "idle"}
              />
            )}

            {currentExercise.exercise_type === "translate" && (
              <TranslateExercise
                prompt={currentExercise.prompt}
                questionText={currentExercise.question_text}
                audioText={currentExercise.audio_text}
                wordBank={currentExercise.options || []}
                selectedWords={selectedTranslateWords}
                onSelectWord={(wordObj) =>
                  setSelectedTranslateWords((prev) => [...prev, wordObj])
                }
                onRemoveWord={(idx) =>
                  setSelectedTranslateWords((prev) => prev.filter((_, i) => i !== idx))
                }
                disabled={feedbackStatus !== "idle"}
              />
            )}

            {currentExercise.exercise_type === "match_pairs" && (
              <MatchPairsExercise
                prompt={currentExercise.prompt}
                pairs={currentExercise.options || []}
                matchedPairs={matchedPairs}
                onMatchPair={(src, tgt) =>
                  setMatchedPairs((prev) => ({ ...prev, [src]: tgt }))
                }
                disabled={feedbackStatus !== "idle"}
              />
            )}

            {currentExercise.exercise_type === "fill_in_the_blank" && (
              <FillInTheBlankExercise
                prompt={currentExercise.prompt}
                contextSentence={currentExercise.context_sentence}
                questionText={currentExercise.question_text}
                audioText={currentExercise.audio_text}
                options={currentExercise.options || []}
                selectedAnswer={fillBlankAnswer}
                onSelectAnswer={setFillBlankAnswer}
                disabled={feedbackStatus !== "idle"}
              />
            )}

            {currentExercise.exercise_type === "type_the_answer" && (
              <TypeTheAnswerExercise
                prompt={currentExercise.prompt}
                questionText={currentExercise.question_text}
                audioText={currentExercise.audio_text}
                typedAnswer={typedAnswer}
                onChangeAnswer={setTypedAnswer}
                onSubmit={handleCheck}
                disabled={feedbackStatus !== "idle"}
              />
            )}
          </>
        )}
      </main>

      {/* Signature Feedback Bar */}
      <FeedbackBar
        status={feedbackStatus}
        correctAnswerText={correctAnswerDisplay}
        isCheckDisabled={isCheckDisabled()}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      {/* Quit Modal */}
      {showQuitModal && (
        <QuitLessonModal
          onCancel={() => setShowQuitModal(false)}
          onConfirmQuit={onExit}
        />
      )}

      {/* Out of Hearts Modal */}
      {showOutOfHeartsModal && (
        <OutOfHeartsModal
          userGems={userGems}
          onRefillWithGems={handleRefillHearts}
          onPractice={handlePracticeHeart}
          onQuitLesson={onExit}
        />
      )}
    </div>
  );
};
