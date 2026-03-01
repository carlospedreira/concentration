import { describe, it, expect } from "vitest";
import {
  EMOJI_CHARACTERS,
  getDefaultImages,
  type EmojiCharacter,
} from "../../src/utils/emoji-characters";

describe("EMOJI_CHARACTERS", () => {
  it("contains at least 36 characters", () => {
    expect(EMOJI_CHARACTERS.length).toBeGreaterThanOrEqual(36);
  });

  it("each character has an id, name, and imageUrl", () => {
    for (const char of EMOJI_CHARACTERS) {
      expect(char.id).toBeTruthy();
      expect(char.name).toBeTruthy();
      expect(char.imageUrl).toBeTruthy();
    }
  });

  it("all IDs are unique", () => {
    const ids = EMOJI_CHARACTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names are at most 10 characters", () => {
    for (const char of EMOJI_CHARACTERS) {
      expect(char.name.length).toBeLessThanOrEqual(10);
    }
  });
});

describe("getDefaultImages", () => {
  it("returns the requested number of characters", () => {
    const result = getDefaultImages(5);
    expect(result).toHaveLength(5);
  });

  it("returns unique characters (no duplicates)", () => {
    const result = getDefaultImages(10);
    const ids = result.map((c) => c.id);
    expect(new Set(ids).size).toBe(10);
  });

  it("returns characters with valid fields", () => {
    const result = getDefaultImages(3);
    for (const char of result) {
      expect(char.id).toBeTruthy();
      expect(char.name).toBeTruthy();
      expect(char.imageUrl).toBeTruthy();
    }
  });

  it("returns empty array for count of 0", () => {
    const result = getDefaultImages(0);
    expect(result).toHaveLength(0);
  });

  it("returns empty array for negative count", () => {
    const result = getDefaultImages(-1);
    expect(result).toHaveLength(0);
  });

  it("caps at pool size when count exceeds available characters", () => {
    const result = getDefaultImages(999);
    expect(result).toHaveLength(EMOJI_CHARACTERS.length);
  });

  it("returns the full pool when count equals pool size", () => {
    const result = getDefaultImages(EMOJI_CHARACTERS.length);
    expect(result).toHaveLength(EMOJI_CHARACTERS.length);
    // All IDs should be present
    const resultIds = new Set(result.map((c) => c.id));
    for (const char of EMOJI_CHARACTERS) {
      expect(resultIds.has(char.id)).toBe(true);
    }
  });

  it("produces different selections across calls (randomness)", () => {
    const results = Array.from({ length: 10 }, () =>
      getDefaultImages(5)
        .map((c) => c.id)
        .join(","),
    );
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });
});
