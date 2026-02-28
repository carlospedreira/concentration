import { useState } from "react";
import type { BoardConfig, UploadedImage } from "../types/game";
import { validateBoardConfig } from "../utils/validation";
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
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
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
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-indigo-800">Concentration</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <label htmlFor="rows" className="text-sm font-medium text-gray-700">
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={10}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-center text-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cols" className="text-sm font-medium text-gray-700">
            Columns
          </label>
          <input
            id="cols"
            type="number"
            min={1}
            max={10}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-center text-lg"
          />
        </div>

        <ImageUploadPanel
          images={images}
          onAdd={onAddImages}
          onRemove={onRemoveImage}
          onReorder={onReorderImage}
        />

        {images.length > 0 && images.length < pairCount && (
          <p className="text-sm text-gray-600 text-center">
            {images.length} of {pairCount} pairs will use your images; {pairCount - images.length} will use default symbols.
          </p>
        )}

        {images.length > 0 && images.length === pairCount && (
          <p className="text-sm text-gray-600 text-center">
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
          className="bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
