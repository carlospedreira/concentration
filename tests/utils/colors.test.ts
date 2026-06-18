import { describe, it, expect } from "vitest";
import { generateColors, MAX_COLORS } from "../../src/utils/colors";

describe("generateColors", () => {
  it("returns the requested number of colors", () => {
    expect(generateColors(6)).toHaveLength(6);
    expect(generateColors(MAX_COLORS)).toHaveLength(MAX_COLORS);
  });

  it("returns an empty array for non-positive counts", () => {
    expect(generateColors(0)).toHaveLength(0);
    expect(generateColors(-3)).toHaveLength(0);
  });

  it("produces distinct color values", () => {
    const values = generateColors(MAX_COLORS).map((c) => c.value);
    expect(new Set(values).size).toBe(MAX_COLORS);
  });

  it("gives every color a non-empty name", () => {
    for (const color of generateColors(MAX_COLORS)) {
      expect(color.name).toBeTruthy();
      expect(color.value).toMatch(/^hsl\(/);
    }
  });

  it("supports at least the largest board (4x6 = 12 pairs)", () => {
    expect(MAX_COLORS).toBeGreaterThanOrEqual(12);
  });

  it("is deterministic for a given count", () => {
    expect(generateColors(10)).toEqual(generateColors(10));
  });

  it("keeps the colors perceptually distinct", () => {
    // Convert each color to OKLab and require a minimum pairwise distance, so
    // no two colors are easy to confuse on the board.
    const labs = generateColors(MAX_COLORS).map((c) => oklab(c.value));

    let min = Infinity;
    for (let i = 0; i < labs.length; i++) {
      for (let j = i + 1; j < labs.length; j++) {
        min = Math.min(min, deltaE(labs[i], labs[j]));
      }
    }
    expect(min).toBeGreaterThan(0.12);
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
