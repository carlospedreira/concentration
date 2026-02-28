import type { BoardConfig, ValidationResult } from "../types/game";

export function validateBoardConfig(config: BoardConfig): ValidationResult {
  const { rows, cols } = config;

  if (rows < 1 || rows > 10) {
    return { valid: false, error: "Rows must be between 1 and 10" };
  }

  if (cols < 1 || cols > 10) {
    return { valid: false, error: "Columns must be between 1 and 10" };
  }

  const total = rows * cols;

  if (total < 2) {
    return { valid: false, error: "Board must have at least 2 cards" };
  }

  if (total % 2 !== 0) {
    return { valid: false, error: "Total cards must be even for pairs" };
  }

  return { valid: true };
}
