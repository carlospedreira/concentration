import { describe, it, expect } from "vitest";
import { generateBoard } from "../../src/utils/board";

describe("generateBoard", () => {
  it("returns the correct number of cards", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    expect(cards).toHaveLength(16);
  });

  it("every symbol appears exactly twice", () => {
    const cards = generateBoard({ rows: 4, cols: 4 });
    const counts = new Map<string, number>();
    for (const card of cards) {
      counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBe(2);
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
      generateBoard({ rows: 4, cols: 4 }).map((c) => c.symbol).join(",")
    );
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it("works for the smallest board (1x2)", () => {
    const cards = generateBoard({ rows: 1, cols: 2 });
    expect(cards).toHaveLength(2);
    expect(cards[0].symbol).toBe(cards[1].symbol);
  });

  describe("with imageUrls", () => {
    it("creates all-image board when imageUrls matches pair count", () => {
      const imageUrls = ["blob:img1", "blob:img2"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(4);
      // Each image URL should appear exactly twice (as a pair)
      const urlCounts = new Map<string, number>();
      for (const card of cards) {
        if (card.imageUrl) {
          urlCounts.set(card.imageUrl, (urlCounts.get(card.imageUrl) ?? 0) + 1);
        }
      }
      for (const count of urlCounts.values()) {
        expect(count).toBe(2);
      }
    });

    it("creates mixed image+symbol board when fewer images than pairs", () => {
      const imageUrls = ["blob:img1"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      expect(imageCards).toHaveLength(2);
      expect(symbolOnlyCards).toHaveLength(2);
    });

    it("defaults to symbols-only when imageUrls is empty", () => {
      const cards = generateBoard({ rows: 2, cols: 2 }, []);
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(0);
    });

    it("defaults to symbols-only when imageUrls is undefined", () => {
      const cards = generateBoard({ rows: 2, cols: 2 });
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(0);
    });

    it("all cards still have a symbol (used as fallback)", () => {
      const imageUrls = ["blob:img1", "blob:img2"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      for (const card of cards) {
        expect(card.symbol).toBeTruthy();
      }
    });

    it("3 images on 4x4 board produces 3 image pairs + 5 symbol pairs", () => {
      const imageUrls = ["blob:img1", "blob:img2", "blob:img3"];
      const cards = generateBoard({ rows: 4, cols: 4 }, imageUrls);
      expect(cards).toHaveLength(16);
      const imageCards = cards.filter((c) => c.imageUrl);
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      expect(imageCards).toHaveLength(6); // 3 pairs × 2
      expect(symbolOnlyCards).toHaveLength(10); // 5 pairs × 2
      // Verify each image URL appears exactly twice
      const urlCounts = new Map<string, number>();
      for (const card of imageCards) {
        urlCounts.set(card.imageUrl!, (urlCounts.get(card.imageUrl!) ?? 0) + 1);
      }
      expect(urlCounts.size).toBe(3);
      for (const count of urlCounts.values()) {
        expect(count).toBe(2);
      }
    });

    it("uses only first N images when more images than pairs", () => {
      const imageUrls = ["blob:img1", "blob:img2", "blob:img3"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(4); // 2 pairs = 4 cards
      const urls = new Set(imageCards.map((c) => c.imageUrl));
      expect(urls).toContain("blob:img1");
      expect(urls).toContain("blob:img2");
      expect(urls).not.toContain("blob:img3");
    });
  });
});
