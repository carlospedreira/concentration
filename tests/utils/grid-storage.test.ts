import { describe, it, expect, beforeEach } from "vitest";
import {
  loadGridSize,
  saveGridSize,
  GRID_STORAGE_KEY,
} from "../../src/utils/grid-storage";

describe("grid-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadGridSize", () => {
    it("returns default { rows: 4, cols: 4 } when localStorage is empty", () => {
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });

    it("returns stored config when valid data exists", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: 3, cols: 4 }));
      expect(loadGridSize()).toEqual({ rows: 3, cols: 4 });
    });

    it("returns default when stored JSON is malformed", () => {
      localStorage.setItem(GRID_STORAGE_KEY, "not-json{{{");
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });

    it("returns default when stored values are out of range", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: 0, cols: 4 }));
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });

    it("returns default when rows * cols is odd", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: 3, cols: 3 }));
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });

    it("returns default when stored object is missing rows", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ cols: 4 }));
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });

    it("returns default when stored values are not numbers", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: "a", cols: "b" }));
      expect(loadGridSize()).toEqual({ rows: 4, cols: 4 });
    });
  });

  describe("saveGridSize", () => {
    it("writes valid JSON string to localStorage under the correct key", () => {
      saveGridSize({ rows: 3, cols: 4 });
      const stored = localStorage.getItem(GRID_STORAGE_KEY);
      expect(stored).toBe(JSON.stringify({ rows: 3, cols: 4 }));
    });

    it("uses localStorage (not sessionStorage) for cross-session persistence", () => {
      saveGridSize({ rows: 6, cols: 6 });
      expect(localStorage.getItem(GRID_STORAGE_KEY)).not.toBeNull();
      expect(sessionStorage.getItem(GRID_STORAGE_KEY)).toBeNull();
    });
  });

  describe("round-trip", () => {
    it("saveGridSize then loadGridSize returns same values", () => {
      saveGridSize({ rows: 5, cols: 6 });
      expect(loadGridSize()).toEqual({ rows: 5, cols: 6 });
    });
  });
});
