import type { BoardConfig } from "../types/game";
import { validateBoardConfig } from "./validation";

export const GRID_STORAGE_KEY = "concentration:gridSize";

const DEFAULT_GRID_SIZE: BoardConfig = { rows: 4, cols: 4 };

export function loadGridSize(): BoardConfig {
  try {
    const raw = localStorage.getItem(GRID_STORAGE_KEY);
    if (raw === null) return DEFAULT_GRID_SIZE;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("rows" in parsed) ||
      !("cols" in parsed)
    ) {
      return DEFAULT_GRID_SIZE;
    }

    const { rows, cols } = parsed as { rows: unknown; cols: unknown };
    if (typeof rows !== "number" || typeof cols !== "number") {
      return DEFAULT_GRID_SIZE;
    }

    const config: BoardConfig = { rows, cols };
    const result = validateBoardConfig(config);
    if (!result.valid) return DEFAULT_GRID_SIZE;

    return config;
  } catch {
    return DEFAULT_GRID_SIZE;
  }
}

export function saveGridSize(config: BoardConfig): void {
  localStorage.setItem(
    GRID_STORAGE_KEY,
    JSON.stringify({ rows: config.rows, cols: config.cols }),
  );
}
