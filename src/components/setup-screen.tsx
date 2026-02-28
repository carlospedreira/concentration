import { useState } from "react";
import type { BoardConfig } from "../types/game";
import { validateBoardConfig } from "../utils/validation";

interface SetupScreenProps {
  onStart: (config: BoardConfig) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    const config = { rows, cols };
    const result = validateBoardConfig(config);
    if (!result.valid) {
      setError(result.error!);
      return;
    }
    setError(null);
    onStart(config);
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
