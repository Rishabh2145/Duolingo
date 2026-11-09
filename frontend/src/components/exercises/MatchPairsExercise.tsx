"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { sound } from "@/lib/sound";

interface PairItem {
  id: string;
  source: string;
  target: string;
}

interface Tile {
  id: string;
  pairId: string;
  text: string;
  type: "source" | "target";
}

interface MatchPairsExerciseProps {
  prompt: string;
  pairs: PairItem[];
  matchedPairs: Record<string, string>;
  onMatchPair: (source: string, target: string) => void;
  disabled?: boolean;
}

export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({
  prompt,
  pairs,
  matchedPairs,
  onMatchPair,
  disabled = false,
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [errorPair, setErrorPair] = useState<string[]>([]);

  useEffect(() => {
    const list: Tile[] = [];
    pairs.forEach((p) => {
      list.push({ id: `src-${p.id}`, pairId: p.id, text: p.source, type: "source" });
      list.push({ id: `tgt-${p.id}`, pairId: p.id, text: p.target, type: "target" });
    });
    // Shuffle deterministic pseudo-random
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
  }, [pairs]);

  const handleTileClick = (tile: Tile) => {
    if (disabled || matchedPairs[tile.text] || Object.values(matchedPairs).includes(tile.text)) {
      return;
    }
    sound.playClick();

    if (!selectedTile) {
      setSelectedTile(tile);
      if (tile.type === "source") {
        sound.speakSpanish(tile.text);
      }
      return;
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    // Check match
    if (selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
      sound.playCorrect();
      const srcText = selectedTile.type === "source" ? selectedTile.text : tile.text;
      const tgtText = selectedTile.type === "target" ? selectedTile.text : tile.text;
      onMatchPair(srcText, tgtText);
      setSelectedTile(null);
    } else {
      sound.playIncorrect();
      setErrorPair([selectedTile.id, tile.id]);
      setTimeout(() => {
        setErrorPair([]);
        setSelectedTile(null);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] dark:text-[#f1f5f9] mb-8 text-center">
        {prompt}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {tiles.map((tile) => {
          const isMatched =
            Boolean(matchedPairs[tile.text]) || Object.values(matchedPairs).includes(tile.text);
          const isSelected = selectedTile?.id === tile.id;
          const isError = errorPair.includes(tile.id);

          return (
            <button
              key={tile.id}
              disabled={disabled || isMatched}
              onClick={() => handleTileClick(tile)}
              className={`py-5 px-4 rounded-2xl border-2 font-black text-base transition-all flex items-center justify-center relative select-none ${
                isMatched
                  ? "bg-[#f0fdf4] dark:bg-[#132d20] border-[#86efac] text-[#16a34a] opacity-50 cursor-default"
                  : isError
                  ? "bg-[#fef2f2] border-[#ef4444] text-[#ef4444] animate-shake"
                  : isSelected
                  ? "bg-[#ddf4ff] dark:bg-[#183647] border-[#1cb0f6] border-b-4 text-[#1899d6] shadow-md"
                  : "bg-white dark:bg-[#1f2d34] border-[#e5e5e5] dark:border-[#37464f] border-b-4 hover:bg-[#f7f7f7] dark:hover:bg-[#25363f] text-[#4b4b4b] dark:text-[#f1f5f9] active:translate-y-[2px] active:border-b-2"
              }`}
            >
              <span>{tile.text}</span>
              {isMatched && <Check className="w-5 h-5 text-[#16a34a] absolute right-3.5 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
