export interface ColorOption {
  /** CSS color shown when the card is revealed; also the match key. */
  readonly value: string;
  /** Accessible label describing the color. */
  readonly name: string;
}

// A curated set of distinct, named colors. Each is its own color category
// (no two blues, no two pinks) so cards stay easy to tell apart, and every one
// is bright enough to read on the dark board. The set size caps the board: with
// 12 colors the largest supported board is 4x6 (12 pairs).
const COLORS: readonly ColorOption[] = [
  { value: "hsl(0 88% 52%)", name: "Red" },
  { value: "hsl(30 90% 58%)", name: "Orange" },
  { value: "hsl(60 88% 52%)", name: "Yellow" },
  { value: "hsl(125 78% 50%)", name: "Green" },
  { value: "hsl(170 78% 68%)", name: "Teal" },
  { value: "hsl(210 80% 68%)", name: "Sky" },
  { value: "hsl(240 88% 60%)", name: "Blue" },
  { value: "hsl(300 88% 52%)", name: "Magenta" },
  { value: "hsl(332 90% 76%)", name: "Pink" },
  { value: "hsl(26 62% 40%)", name: "Brown" },
  { value: "hsl(0 0% 56%)", name: "Gray" },
  { value: "hsl(0 0% 92%)", name: "White" },
];

/** The largest number of distinct colors (and therefore pairs) available. */
export const MAX_COLORS = COLORS.length;

/**
 * Return `count` distinct colors. Deterministic: the same board size always
 * draws the same colors, while board shuffling provides game-to-game variety.
 */
export function generateColors(count: number): readonly ColorOption[] {
  if (count <= 0) return [];
  return COLORS.slice(0, count);
}
