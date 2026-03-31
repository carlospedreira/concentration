import { useState } from "react";
import type { BoardConfig, UploadedImage } from "../types/game";
import { validateBoardConfig } from "../utils/validation";
import { loadGridSize } from "../utils/grid-storage";
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
  const saved = loadGridSize();
  const [rows, setRows] = useState(saved.rows);
  const [cols, setCols] = useState(saved.cols);
  const [error, setError] = useState<string | null>(null);

  const pairCount = (rows * cols) / 2;

  const handleStart = () => {
    const config = { rows, cols };
    const result = validateBoardConfig(config);
    if (!result.valid) {
      setError(result.error!);
      return;
    }
    setError(null);
    const imageUrls = images.map((img) => img.url);
    onStart(config, imageUrls);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-8 animate-screen-enter">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-brand-800 tracking-tight">
          Concentration
        </h1>
        <p className="mt-2 text-text-secondary text-sm sm:text-base">
          Match pairs to win. How few moves can you do it in?
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full max-w-sm bg-surface-raised rounded-2xl p-6 shadow-card">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="rows" className="text-sm font-semibold text-text-secondary">
              Rows
            </label>
            <input
              id="rows"
              type="number"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="
                border-2 border-brand-100 rounded-input px-3 py-2.5 text-center text-lg
                font-semibold text-text-primary bg-surface-raised
                outline-none transition-all duration-150
                hover:border-brand-200
                focus:border-brand-400 focus:ring-4 focus:ring-brand-100
              "
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="cols" className="text-sm font-semibold text-text-secondary">
              Columns
            </label>
            <input
              id="cols"
              type="number"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="
                border-2 border-brand-100 rounded-input px-3 py-2.5 text-center text-lg
                font-semibold text-text-primary bg-surface-raised
                outline-none transition-all duration-150
                hover:border-brand-200
                focus:border-brand-400 focus:ring-4 focus:ring-brand-100
              "
            />
          </div>
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

        {error && (
          <p role="alert" className="text-red-600 text-sm text-center">
            {error}
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
