import { describe, it, expect } from "vitest";
import { generateSwatches, MAX_SWATCHES } from "../../src/utils/colors";

describe("generateSwatches", () => {
  it("returns the requested number of swatches", () => {
    expect(generateSwatches(6)).toHaveLength(6);
    expect(generateSwatches(32)).toHaveLength(32);
  });

  it("returns an empty array for non-positive counts", () => {
    expect(generateSwatches(0)).toHaveLength(0);
    expect(generateSwatches(-3)).toHaveLength(0);
  });

  it("produces distinct match keys", () => {
    const keys = generateSwatches(32).map((s) => s.key);
    expect(new Set(keys).size).toBe(32);
  });

  it("uses solid colors before two-tone combinations", () => {
    // Small boards should be all single-color swatches.
    const small = generateSwatches(8);
    for (const swatch of small) {
      expect(swatch.colors).toHaveLength(1);
    }
  });

  it("extends with two-tone swatches once solids run out", () => {
    const many = generateSwatches(32);
    const twoTone = many.filter((s) => s.colors.length === 2);
    expect(twoTone.length).toBeGreaterThan(0);
    // Every swatch is either solid (1) or a pair (2).
    for (const swatch of many) {
      expect([1, 2]).toContain(swatch.colors.length);
      expect(swatch.name).toBeTruthy();
      expect(swatch.colors.every((c) => c.startsWith("hsl("))).toBe(true);
    }
  });

  it("can produce enough swatches for the largest preset (8x8 = 32 pairs)", () => {
    expect(MAX_SWATCHES).toBeGreaterThanOrEqual(32);
  });

  it("is deterministic for a given count", () => {
    expect(generateSwatches(20)).toEqual(generateSwatches(20));
  });
});
