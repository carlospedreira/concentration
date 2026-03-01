import { describe, it, expect, vi } from "vitest";
import { generateBoard } from "../../src/utils/board";
import { EMOJI_CHARACTERS } from "../../src/utils/emoji-characters";

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

    it("fills remaining pairs with emoji images when fewer custom images than pairs", () => {
      const imageUrls = ["blob:img1"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      // 1 custom pair + 1 emoji pair = all 4 cards have images
      expect(imageCards).toHaveLength(4);
      // Custom URL should appear exactly twice
      const customCards = cards.filter((c) => c.imageUrl === "blob:img1");
      expect(customCards).toHaveLength(2);
    });

    it("fills with emoji images when imageUrls is empty", () => {
      const cards = generateBoard({ rows: 2, cols: 2 }, []);
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(4);
    });

    it("fills with emoji images when imageUrls is undefined", () => {
      const cards = generateBoard({ rows: 2, cols: 2 });
      expect(cards).toHaveLength(4);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(4);
    });

    it("all cards still have a symbol (used as fallback)", () => {
      const imageUrls = ["blob:img1", "blob:img2"];
      const cards = generateBoard({ rows: 2, cols: 2 }, imageUrls);
      for (const card of cards) {
        expect(card.symbol).toBeTruthy();
      }
    });

    it("3 images on 4x4 board produces 3 custom pairs + 5 emoji pairs", () => {
      const imageUrls = ["blob:img1", "blob:img2", "blob:img3"];
      const cards = generateBoard({ rows: 4, cols: 4 }, imageUrls);
      expect(cards).toHaveLength(16);
      // All cards should have images (3 custom + 5 emoji)
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(16);
      // Verify custom URLs appear exactly twice each
      const customCards = cards.filter((c) =>
        c.imageUrl?.startsWith("blob:"),
      );
      expect(customCards).toHaveLength(6); // 3 custom pairs × 2
      const urlCounts = new Map<string, number>();
      for (const card of customCards) {
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

  describe("with emoji defaults (no custom images)", () => {
    it("produces emoji image pairs for a 4x4 board", () => {
      const cards = generateBoard({ rows: 4, cols: 4 });
      expect(cards).toHaveLength(16);
      const imageCards = cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(16);
      // Each image URL should appear exactly twice
      const urlCounts = new Map<string, number>();
      for (const card of cards) {
        if (card.imageUrl) {
          urlCounts.set(card.imageUrl, (urlCounts.get(card.imageUrl) ?? 0) + 1);
        }
      }
      expect(urlCounts.size).toBe(8); // 8 pairs
      for (const count of urlCounts.values()) {
        expect(count).toBe(2);
      }
    });

    it("uses character name as symbol fallback for emoji cards", () => {
      const cards = generateBoard({ rows: 2, cols: 2 });
      for (const card of cards) {
        expect(card.symbol).toBeTruthy();
        // emoji card symbols should not be geometric symbols
        expect(card.imageUrl).toBeTruthy();
      }
    });

    it("boards up to 36 pairs use only emoji images (no symbols-only cards)", () => {
      // 6x6 = 36 cards = 18 pairs, well within emoji pool
      const cards = generateBoard({ rows: 6, cols: 6 });
      expect(cards).toHaveLength(36);
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      expect(symbolOnlyCards).toHaveLength(0);
    });

    it("falls back to symbols when board exceeds emoji pool", () => {
      // 10x10 = 100 cards = 50 pairs, exceeds 40 emoji characters
      const cards = generateBoard({ rows: 10, cols: 10 });
      expect(cards).toHaveLength(100);
      const imageCards = cards.filter((c) => c.imageUrl);
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      // 40 emoji pairs as images + 10 symbol-only pairs
      expect(imageCards).toHaveLength(EMOJI_CHARACTERS.length * 2);
      expect(symbolOnlyCards).toHaveLength(100 - EMOJI_CHARACTERS.length * 2);
    });
  });

  describe("mixed mode (custom + emoji + symbols)", () => {
    it("custom images take priority over emoji characters", () => {
      const imageUrls = ["blob:custom1", "blob:custom2"];
      const cards = generateBoard({ rows: 4, cols: 4 }, imageUrls);
      // 2 custom pairs + 6 emoji pairs = 8 pairs total
      const customCards = cards.filter((c) => c.imageUrl?.startsWith("blob:"));
      expect(customCards).toHaveLength(4); // 2 pairs × 2
    });

    it("emoji fills between custom images and symbols", () => {
      const imageUrls = ["blob:custom1"];
      // 4x4 = 8 pairs. 1 custom + 7 emoji = all 16 cards with images
      const cards = generateBoard({ rows: 4, cols: 4 }, imageUrls);
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      expect(symbolOnlyCards).toHaveLength(0);
    });

    it("symbols only appear when custom + emoji are insufficient", () => {
      // Need a board with more pairs than custom + emoji pool
      // 10x10 = 50 pairs. With 5 custom images + 40 emoji = 45, leaving 5 symbol pairs
      const imageUrls = Array.from({ length: 5 }, (_, i) => `blob:custom${i}`);
      const cards = generateBoard({ rows: 10, cols: 10 }, imageUrls);
      expect(cards).toHaveLength(100);
      const customCards = cards.filter((c) => c.imageUrl?.startsWith("blob:"));
      const symbolOnlyCards = cards.filter((c) => !c.imageUrl);
      expect(customCards).toHaveLength(10); // 5 custom pairs × 2
      // 50 pairs - 5 custom - 40 emoji = 5 symbol-only pairs
      expect(symbolOnlyCards).toHaveLength(10); // 5 symbol pairs × 2
    });

    it("each pair type has matching symbols", () => {
      const imageUrls = ["blob:custom1"];
      const cards = generateBoard({ rows: 2, cols: 4 }, imageUrls);
      // Group by symbol — each symbol should appear exactly twice
      const counts = new Map<string, number>();
      for (const card of cards) {
        counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1);
      }
      for (const count of counts.values()) {
        expect(count).toBe(2);
      }
    });
  });
});
