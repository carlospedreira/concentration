import { describe, it, expect } from "vitest";
import { generateBoard } from "../../src/utils/board";

describe("generateBoard", () => {
  it("returns the correct number of cards", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    expect(cards).toHaveLength(16);
  });

  it("every color appears exactly twice", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const counts = new Map<string, number>();
    for (const card of cards) {
      counts.set(card.color, (counts.get(card.color) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it("uses one distinct color per pair", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const distinctColors = new Set(cards.map((c) => c.color));
    expect(distinctColors.size).toBe(8); // 16 cards / 2
  });

  it("every card has a non-empty color name", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    for (const card of cards) {
      expect(card.colorName).toBeTruthy();
    }
  });

  it("a color and its name stay paired together", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const nameByColor = new Map<string, string>();
    for (const card of cards) {
      const existing = nameByColor.get(card.color);
      if (existing === undefined) {
        nameByColor.set(card.color, card.colorName);
      } else {
        expect(card.colorName).toBe(existing);
      }
    }
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
      generateBoard({ rows: 4, cols: 4 }).map((c) => c.color).join(","),
    );
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("works for the smallest board (1x2)", () => {
    const cards = generateBoard({ rows: 1, cols: 2 });
    expect(cards).toHaveLength(2);
    expect(cards[0].color).toBe(cards[1].color);
  });

  it("keeps colors distinct on the largest preset (8x8 = 32 pairs)", () => {
    const cards = generateBoard({ rows: 8, cols: 8 });
    expect(cards).toHaveLength(64);
    const distinctColors = new Set(cards.map((c) => c.color));
    expect(distinctColors.size).toBe(32);
  });
});
