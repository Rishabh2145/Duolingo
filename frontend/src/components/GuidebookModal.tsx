"use client";

import React from "react";
import { X, BookOpen, Volume2, Sparkles, Lightbulb } from "lucide-react";
import { sound } from "@/lib/sound";
import { UnitSummary } from "@/lib/api";

interface GuidebookModalProps {
  unit: UnitSummary;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  unit,
  onClose,
}) => {
  // Guidebook content tailored to units
  const keyPhrases = [
    {
      es: "Hola, mucho gusto",
      en: "Hello, nice to meet you",
      audio: "Hola, mucho gusto",
    },
    {
      es: "Un café con leche, por favor",
      en: "A coffee with milk, please",
      audio: "Un café con leche, por favor",
    },
    {
      es: "La mujer come una manzana",
      en: "The woman eats an apple",
      audio: "La mujer come una manzana",
    },
    {
      es: "Yo bebo agua todos los días",
      en: "I drink water every day",
      audio: "Yo bebo agua todos los días",
    },
    {
      es: "Buenos días, ¿cómo estás?",
      en: "Good morning, how are you?",
      audio: "Buenos días, ¿cómo estás?",
    },
    {
      es: "Muchas gracias, hasta mañana",
      en: "Thank you very much, see you tomorrow",
      audio: "Muchas gracias, hasta mañana",
    },
  ];

  const grammarTips = [
    {
      title: "Gender Agreement in Spanish",
      explanation:
        "In Spanish, all nouns have grammatical gender. Feminine nouns usually end in '-a' and use 'la' (la manzana, la mujer). Masculine nouns usually end in '-o' and use 'el' (el niño, el libro).",
      examples: [
        { es: "el hombre", en: "the man" },
        { es: "la niña", en: "the girl" },
      ],
    },
    {
      title: "Basic Verb Endings (Present Tense)",
      explanation:
        "Spanish verbs change their endings based on who is performing the action. Notice how 'beber' (to drink) changes:",
      examples: [
        { es: "yo bebo", en: "I drink" },
        { es: "tú bebes", en: "you drink" },
        { es: "él / ella bebe", en: "he / she drinks" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white dark:bg-[#1f2d34] border-2 border-[#e5e5e5] dark:border-[#37464f] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col">
        {/* Header Banner */}
        <div
          className="rounded-2xl p-5 mb-6 text-white relative shadow-md"
          style={{ backgroundColor: unit.color }}
        >
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 p-1.5 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="text-xs font-black uppercase tracking-widest opacity-85 block mb-1">
            UNIT GUIDEBOOK
          </span>
          <h2 className="text-2xl font-black mb-1">{unit.title}</h2>
          <p className="text-xs font-semibold opacity-95">{unit.description}</p>
        </div>

        {/* Section 1: Key Phrases */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#ff9600]" />
            <h3 className="font-black text-lg text-[#4b4b4b] dark:text-[#f1f5f9]">
              Key Phrases & Pronunciation
            </h3>
          </div>
          <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc] mb-4">
            Tap the speaker to hear native Spanish pronunciation.
          </p>

          <div className="space-y-2.5">
            {keyPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8fafc] dark:bg-[#1a282f] border-2 border-[#e2e8f0] dark:border-[#37464f] hover:border-[#1cb0f6] transition-all"
              >
                <div>
                  <h4 className="font-extrabold text-base text-[#4b4b4b] dark:text-[#f1f5f9]">
                    {phrase.es}
                  </h4>
                  <p className="text-xs font-bold text-[#777777] dark:text-[#a5b4bc]">
                    {phrase.en}
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    sound.speakSpanish(phrase.audio);
                  }}
                  className="p-2.5 rounded-xl bg-[#1cb0f6] border-b-2 border-[#1899d6] text-white hover:bg-[#38bdf8] transition-all active:translate-y-[1px] shrink-0"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Grammar & Tips */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#ffc800]" />
            <h3 className="font-black text-lg text-[#4b4b4b] dark:text-[#f1f5f9]">
              Grammar Tips
            </h3>
          </div>

          <div className="space-y-4">
            {grammarTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f] bg-white dark:bg-[#1a282f]"
              >
                <h4 className="font-black text-sm text-[#4b4b4b] dark:text-[#f1f5f9] mb-1.5">
                  {tip.title}
                </h4>
                <p className="text-xs font-semibold text-[#777777] dark:text-[#a5b4bc] mb-3 leading-relaxed">
                  {tip.explanation}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tip.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="px-3 py-1.5 rounded-xl bg-[#ddf4ff] dark:bg-[#183647] text-[#0284c7] dark:text-[#38bdf8] text-xs font-extrabold flex items-center gap-2"
                    >
                      <span>{ex.es}</span>
                      <span className="opacity-70 font-medium">({ex.en})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Got it action button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl duo-button-green font-black text-xs uppercase tracking-wider shadow mt-auto"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
