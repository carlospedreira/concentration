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

  it("keeps the solid colors perceptually distinct", () => {
    // Convert each solid color to OKLab and require a minimum pairwise
    // distance, so no two base colors are easy to confuse on the board.
    const solids = generateSwatches(MAX_SWATCHES)
      .filter((s) => s.colors.length === 1)
      .map((s) => oklab(s.colors[0]));

    let min = Infinity;
    for (let i = 0; i < solids.length; i++) {
      for (let j = i + 1; j < solids.length; j++) {
        min = Math.min(min, deltaE(solids[i], solids[j]));
      }
    }
    expect(min).toBeGreaterThan(0.18);
  });
});

type Lab = readonly [number, number, number];

function oklab(hsl: string): Lab {
  const m = hsl.match(/hsl\((\d+) (\d+)% (\d+)%\)/);
  if (!m) throw new Error(`unexpected color format: ${hsl}`);
  const [r, g, b] = hslToRgb(+m[1], +m[2], +m[3]).map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s,
  ];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function deltaE(a: Lab, b: Lab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
