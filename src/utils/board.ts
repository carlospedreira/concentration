import type { BoardConfig, Card } from "../types/game";
import { getDefaultImages } from "./emoji-characters";
import { SYMBOLS } from "./symbols";

export function generateBoard(
  config: BoardConfig,
  imageUrls?: readonly string[],
): readonly Card[] {
  const total = config.rows * config.cols;
  const pairCount = total / 2;

  const usableImages = imageUrls?.slice(0, pairCount) ?? [];
  const remainingPairs = pairCount - usableImages.length;

  // Fill remaining pairs with emoji images, then symbols as overflow
  const emojiChars = getDefaultImages(remainingPairs);
  const emojiPairs = Math.min(emojiChars.length, remainingPairs);
  const symbolCount = remainingPairs - emojiPairs;

  const cards: Array<{ symbol: string; imageUrl?: string }> = [];

  // Custom image pairs first — assign symbols sequentially for fallback
  for (let i = 0; i < usableImages.length; i++) {
    const symbol = SYMBOLS[i];
    cards.push({ symbol, imageUrl: usableImages[i] });
    cards.push({ symbol, imageUrl: usableImages[i] });
  }

  // Emoji image pairs
  for (let i = 0; i < emojiPairs; i++) {
    const char = emojiChars[i];
    cards.push({ symbol: char.name, imageUrl: char.imageUrl });
    cards.push({ symbol: char.name, imageUrl: char.imageUrl });
  }

  // Symbol pairs for remaining slots (overflow beyond emoji pool)
  for (let i = 0; i < symbolCount; i++) {
    const symbol = SYMBOLS[usableImages.length + i];
    cards.push({ symbol });
    cards.push({ symbol });
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card, index) => ({
    id: index,
    symbol: card.symbol,
    state: "faceDown" as const,
    ...(card.imageUrl ? { imageUrl: card.imageUrl } : {}),
  }));
}
