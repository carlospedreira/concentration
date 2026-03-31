export interface GridPreset {
  readonly rows: number;
  readonly cols: number;
  readonly label: string;
  readonly cards: number;
}

export const GRID_PRESETS: readonly GridPreset[] = [
  { rows: 3, cols: 4, label: "3x4", cards: 12 },
  { rows: 4, cols: 4, label: "4x4", cards: 16 },
  { rows: 4, cols: 5, label: "4x5", cards: 20 },
  { rows: 4, cols: 6, label: "4x6", cards: 24 },
  { rows: 5, cols: 6, label: "5x6", cards: 30 },
  { rows: 6, cols: 6, label: "6x6", cards: 36 },
  { rows: 6, cols: 7, label: "6x7", cards: 42 },
  { rows: 7, cols: 8, label: "7x8", cards: 56 },
  { rows: 8, cols: 8, label: "8x8", cards: 64 },
] as const;

export const DEFAULT_PRESET_INDEX: number = 1;
