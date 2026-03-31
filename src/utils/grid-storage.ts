import { GRID_PRESETS, DEFAULT_PRESET_INDEX } from "./grid-presets";

export const GRID_STORAGE_KEY = "concentration:gridSize";

export function loadPresetIndex(): number {
  try {
    const raw = localStorage.getItem(GRID_STORAGE_KEY);
    if (raw === null) return DEFAULT_PRESET_INDEX;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("presetIndex" in parsed)
    ) {
      return DEFAULT_PRESET_INDEX;
    }

    const { presetIndex } = parsed as { presetIndex: unknown };
    if (typeof presetIndex !== "number") return DEFAULT_PRESET_INDEX;
    if (presetIndex < 0 || presetIndex >= GRID_PRESETS.length) return DEFAULT_PRESET_INDEX;

    return presetIndex;
  } catch {
    return DEFAULT_PRESET_INDEX;
  }
}

export function savePresetIndex(index: number): void {
  localStorage.setItem(
    GRID_STORAGE_KEY,
    JSON.stringify({ presetIndex: index }),
  );
}
