import { describe, it, expect } from "vitest";
import { SYMBOLS } from "../../src/utils/symbols";

describe("SYMBOLS", () => {
  it("has at least 50 unique symbols", () => {
    expect(SYMBOLS.length).toBeGreaterThanOrEqual(50);
  });

  it("contains only non-empty strings", () => {
    for (const symbol of SYMBOLS) {
      expect(symbol.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no duplicates", () => {
    const unique = new Set(SYMBOLS);
    expect(unique.size).toBe(SYMBOLS.length);
  });
});
