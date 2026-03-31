import { useState } from "react";
import type { UploadedImage, BoardConfig } from "../types/game";
import { GRID_PRESETS, DEFAULT_PRESET_INDEX } from "../utils/grid-presets";
import { loadPresetIndex, savePresetIndex } from "../utils/grid-storage";
import { GridSizeSelector } from "./grid-size-selector";
import { ImageUploadPanel } from "./image-upload-panel";

interface SetupScreenProps {
  images: readonly UploadedImage[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onReorderImage: (id: string, direction: "up" | "down") => void;
  onStart: (config: BoardConfig, imageUrls: readonly string[]) => void;
}

export function SetupScreen({
  images,
  onAddImages,
  onRemoveImage,
  onReorderImage,
  onStart,
}: SetupScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(loadPresetIndex);

  const preset = GRID_PRESETS[selectedIndex] ?? GRID_PRESETS[DEFAULT_PRESET_INDEX];
  const pairCount = preset.cards / 2;

  const handleStart = (): void => {
    savePresetIndex(selectedIndex);
    const config: BoardConfig = { rows: preset.rows, cols: preset.cols };
    const imageUrls = images.map((img) => img.url);
    onStart(config, imageUrls);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 sm:py-8 animate-screen-enter">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-brand-800 tracking-tight">
          Concentration
        </h1>
        <p className="mt-2 text-text-secondary text-sm sm:text-base">
          Match pairs to win. How few moves can you do it in?
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

        <ImageUploadPanel
          images={images}
          onAdd={onAddImages}
          onRemove={onRemoveImage}
          onReorder={onReorderImage}
        />

        {images.length > 0 && images.length < pairCount && (
          <p className="text-sm text-text-secondary text-center">
            {images.length} of {pairCount} pairs will use your images; {pairCount - images.length} will use default symbols.
          </p>
        )}

        {images.length > 0 && images.length === pairCount && (
          <p className="text-sm text-text-secondary text-center">
            All {pairCount} pairs will use your images.
          </p>
        )}

        {images.length > pairCount && (
          <p className="text-sm text-amber-600 text-center">
            Only {pairCount} of {images.length} images will be used.
          </p>
        )}

        <button
          onClick={handleStart}
          className="
            bg-brand-600 text-white font-bold py-3.5 rounded-button
            shadow-button transition-all duration-150
            hover:bg-brand-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgb(0_0_0/0.2)]
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
