import { describe, it, expect } from "vitest";
import { generateColors } from "../../src/utils/colors";

describe("generateColors", () => {
  it("returns the requested number of colors", () => {
    expect(generateColors(6)).toHaveLength(6);
    expect(generateColors(32)).toHaveLength(32);
  });

  it("returns an empty array for non-positive counts", () => {
    expect(generateColors(0)).toHaveLength(0);
    expect(generateColors(-3)).toHaveLength(0);
  });

  it("produces distinct color values", () => {
    const values = generateColors(32).map((c) => c.value);
    expect(new Set(values).size).toBe(32);
  });

  it("gives every color a non-empty name", () => {
    for (const color of generateColors(16)) {
      expect(color.name).toBeTruthy();
      expect(color.value).toMatch(/^hsl\(/);
    }
  });

  it("is deterministic for a given count", () => {
    expect(generateColors(12)).toEqual(generateColors(12));
  });
});
