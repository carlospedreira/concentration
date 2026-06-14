import { useState } from "react";
import type { BoardConfig } from "../types/game";
import { GRID_PRESETS, DEFAULT_PRESET_INDEX } from "../utils/grid-presets";
import { loadPresetIndex, savePresetIndex } from "../utils/grid-storage";
import { GridSizeSelector } from "./grid-size-selector";

interface SetupScreenProps {
  onStart: (config: BoardConfig) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(loadPresetIndex);

  const preset = GRID_PRESETS[selectedIndex] ?? GRID_PRESETS[DEFAULT_PRESET_INDEX];
  const pairCount = preset.cards / 2;

  const handleStart = (): void => {
    savePresetIndex(selectedIndex);
    onStart({ rows: preset.rows, cols: preset.cols });
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 sm:py-8 animate-screen-enter">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-brand-800 tracking-tight">
          Concentration
        </h1>
        <p className="mt-2 text-text-secondary text-sm sm:text-base">
          Match pairs of colors to win. How few moves can you do it in?
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full max-w-sm bg-surface-raised rounded-2xl p-6 shadow-card">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text-secondary">Board Size</span>
          <GridSizeSelector
            presets={GRID_PRESETS}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
          />
        </div>

        <p className="text-sm text-text-secondary text-center">
          {pairCount} color pairs to match.
        </p>

        <button
          onClick={handleStart}
          className="
            bg-brand-600 text-white font-bold py-3.5 rounded-button
            shadow-button transition-all duration-150
            hover:bg-brand-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgb(255_255_255/0.1)]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
            active:scale-[0.98] active:translate-y-0 active:shadow-none
          "
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
