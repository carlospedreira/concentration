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
    const distinct = new Set(cards.map((c) => c.color));
    expect(distinct.size).toBe(8); // 16 cards / 2
  });

  it("every card has a color and a non-empty name", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    for (const card of cards) {
      expect(card.color).toBeTruthy();
      expect(card.colorName).toBeTruthy();
    }
  });

  it("a color keeps the same name on both of its cards", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const byColor = new Map<string, string>();
    for (const card of cards) {
      const existing = byColor.get(card.color);
      if (existing === undefined) {
        byColor.set(card.color, card.colorName);
      } else {
        expect(card.colorName).toBe(existing);
      }
    }
  });

  it("fills the largest supported board (4x6 = 12 pairs) with distinct colors", () => {
    const cards = generateBoard({ rows: 4, cols: 6 });
    expect(cards).toHaveLength(24);
    const distinct = new Set(cards.map((c) => c.color));
    expect(distinct.size).toBe(12);
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
});
