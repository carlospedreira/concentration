import { describe, it, expect, beforeEach } from "vitest";
import {
  loadPresetIndex,
  savePresetIndex,
  GRID_STORAGE_KEY,
} from "../../src/utils/grid-storage";

describe("grid-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadPresetIndex", () => {
    it("returns default index (1) when localStorage is empty", () => {
      expect(loadPresetIndex()).toBe(1);
    });

    it("returns stored index when valid", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: 5 }));
      expect(loadPresetIndex()).toBe(5);
    });

    it("returns default when stored data is old { rows, cols } format", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: 4, cols: 4 }));
      expect(loadPresetIndex()).toBe(1);
    });

    it("returns default when stored JSON is malformed", () => {
      localStorage.setItem(GRID_STORAGE_KEY, "not-json{{{");
      expect(loadPresetIndex()).toBe(1);
    });

    it("returns default when presetIndex is out of bounds (too high)", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: 99 }));
      expect(loadPresetIndex()).toBe(1);
    });

    it("returns default when presetIndex is negative", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: -1 }));
      expect(loadPresetIndex()).toBe(1);
    });

    it("returns default when presetIndex is not a number", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: "abc" }));
      expect(loadPresetIndex()).toBe(1);
    });
  });

  describe("savePresetIndex", () => {
    it("writes { presetIndex } JSON to localStorage", () => {
      savePresetIndex(5);
      const stored = localStorage.getItem(GRID_STORAGE_KEY);
      expect(stored).toBe(JSON.stringify({ presetIndex: 5 }));
    });

    it("uses localStorage not sessionStorage", () => {
      savePresetIndex(3);
      expect(localStorage.getItem(GRID_STORAGE_KEY)).not.toBeNull();
      expect(sessionStorage.getItem(GRID_STORAGE_KEY)).toBeNull();
    });
  });

  describe("round-trip", () => {
    it("savePresetIndex then loadPresetIndex returns same index", () => {
      savePresetIndex(7);
      expect(loadPresetIndex()).toBe(7);
    });
  });
});
