import { describe, it, expect } from "vitest";
import {
  GRID_PRESETS,
  DEFAULT_PRESET_INDEX,
} from "../../src/utils/grid-presets";

describe("grid-presets", () => {
  it("has exactly 4 presets", () => {
    expect(GRID_PRESETS).toHaveLength(4);
  });

  it("no preset exceeds the available color count (12 pairs)", () => {
    for (const preset of GRID_PRESETS) {
      expect(preset.cards / 2).toBeLessThanOrEqual(12);
    }
  });

  it("all presets have even total cards", () => {
    for (const preset of GRID_PRESETS) {
      expect(preset.cards % 2).toBe(0);
    }
  });

  it("all presets have rows between 2-10 and cols between 2-10", () => {
    for (const preset of GRID_PRESETS) {
      expect(preset.rows).toBeGreaterThanOrEqual(2);
      expect(preset.rows).toBeLessThanOrEqual(10);
      expect(preset.cols).toBeGreaterThanOrEqual(2);
      expect(preset.cols).toBeLessThanOrEqual(10);
    }
  });

  it("each label matches RxC format", () => {
    for (const preset of GRID_PRESETS) {
      expect(preset.label).toBe(`${preset.rows}x${preset.cols}`);
    }
  });

  it("each cards field equals rows * cols", () => {
    for (const preset of GRID_PRESETS) {
      expect(preset.cards).toBe(preset.rows * preset.cols);
    }
  });

  it("DEFAULT_PRESET_INDEX is 1", () => {
    expect(DEFAULT_PRESET_INDEX).toBe(1);
  });

  it("preset at DEFAULT_PRESET_INDEX is 4x4", () => {
    const defaultPreset = GRID_PRESETS[DEFAULT_PRESET_INDEX];
    expect(defaultPreset.rows).toBe(4);
    expect(defaultPreset.cols).toBe(4);
  });
});
