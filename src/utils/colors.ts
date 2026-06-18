export interface ColorOption {
  /** CSS color value — doubles as the card face fill and the match key. */
  readonly value: string;
  /** Human-readable label, used for accessible descriptions. */
  readonly name: string;
}

// 12 hue buckets (30° each) for naming generated colors.
const HUE_NAMES: readonly string[] = [
  "Red",
  "Orange",
  "Yellow",
  "Lime",
  "Green",
  "Spring",
  "Cyan",
  "Azure",
  "Blue",
  "Violet",
  "Magenta",
  "Rose",
];

// Two tonal bands. Alternating them while hues step around the wheel keeps
// neighbouring colors distinguishable even on dense boards (up to 32 pairs).
// High saturation and a wide lightness gap give the fills strong contrast,
// both against the dark board and between one another.
const TONES = [
  { label: "Light", saturation: 95, lightness: 70 },
  { label: "Deep", saturation: 90, lightness: 40 },
] as const;

function hueName(hue: number): string {
  return HUE_NAMES[Math.round(hue / 30) % HUE_NAMES.length];
}

/**
 * Generate `count` visually distinct colors, evenly spread around the color
 * wheel. Output is deterministic for a given count: the same board size always
 * draws from the same palette, while board shuffling provides game-to-game
 * variety.
 */
export function generateColors(count: number): readonly ColorOption[] {
  if (count <= 0) return [];

  const colors: ColorOption[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 * i) / count);
    const tone = TONES[i % TONES.length];
    colors.push({
      value: `hsl(${hue} ${tone.saturation}% ${tone.lightness}%)`,
      name: `${tone.label} ${hueName(hue)}`,
    });
  }
  return colors;
}
