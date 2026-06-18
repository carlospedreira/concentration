export interface GridPreset {
  readonly rows: number;
  readonly cols: number;
  readonly label: string;
  readonly cards: number;
}

// Board sizes are capped at 12 pairs (24 cards) because each pair needs a
// distinct color and there are 12 distinct colors (see colors.ts).
export const GRID_PRESETS: readonly GridPreset[] = [
  { rows: 3, cols: 4, label: "3x4", cards: 12 },
  { rows: 4, cols: 4, label: "4x4", cards: 16 },
  { rows: 4, cols: 5, label: "4x5", cards: 20 },
  { rows: 4, cols: 6, label: "4x6", cards: 24 },
] as const;

export const DEFAULT_PRESET_INDEX: number = 1;
