import { describe, it, expect } from "vitest";
import { generateBoard } from "../../src/utils/board";

describe("generateBoard", () => {
  it("returns the correct number of cards", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    expect(cards).toHaveLength(16);
  });

  it("every swatch appears exactly twice", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const counts = new Map<string, number>();
    for (const card of cards) {
      counts.set(card.colorKey, (counts.get(card.colorKey) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it("uses one distinct swatch per pair", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const distinct = new Set(cards.map((c) => c.colorKey));
    expect(distinct.size).toBe(8); // 16 cards / 2
  });

  it("every card has colors and a non-empty name", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    for (const card of cards) {
      expect(card.colors.length).toBeGreaterThanOrEqual(1);
      expect(card.colorName).toBeTruthy();
    }
  });

  it("a swatch keeps the same colors and name on both of its cards", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const byKey = new Map<string, { colors: readonly string[]; name: string }>();
    for (const card of cards) {
      const existing = byKey.get(card.colorKey);
      if (existing === undefined) {
        byKey.set(card.colorKey, { colors: card.colors, name: card.colorName });
      } else {
        expect(card.colors).toEqual(existing.colors);
        expect(card.colorName).toBe(existing.name);
      }
    }
  });

  it("uses only solid-color swatches on small boards", () => {
    const cards = generateBoard({ rows: 3, cols: 4 }); // 6 pairs
    for (const card of cards) {
      expect(card.colors).toHaveLength(1);
    }
  });

  it("introduces two-tone swatches on the largest preset (8x8 = 32 pairs)", () => {
    const cards = generateBoard({ rows: 8, cols: 8 });
    expect(cards).toHaveLength(64);
    const distinct = new Set(cards.map((c) => c.colorKey));
    expect(distinct.size).toBe(32);
    const twoTone = cards.filter((c) => c.colors.length === 2);
    expect(twoTone.length).toBeGreaterThan(0);
  });

  it("all cards start faceDown", () => {
    const cards = generateBoard({ rows: 2, cols: 4 });
    for (const card of cards) {
      expect(card.state).toBe("faceDown");
    }
  });

  it("IDs are sequential 0..n-1", () => {
    const cards = generateBoard({ rows: 3, cols: 4 });
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].id).toBe(i);
    }
  });

  it("shuffle produces different orderings", () => {
    const results = Array.from({ length: 10 }, () =>
      generateBoard({ rows: 4, cols: 4 }).map((c) => c.colorKey).join(","),
    );
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("works for the smallest board (1x2)", () => {
    const cards = generateBoard({ rows: 1, cols: 2 });
    expect(cards).toHaveLength(2);
    expect(cards[0].colorKey).toBe(cards[1].colorKey);
  });
});
