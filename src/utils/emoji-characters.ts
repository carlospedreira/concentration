export interface EmojiCharacter {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
}

const emojiImages = import.meta.glob<{ default: string }>(
  "../assets/emoji/*.webp",
  { eager: true },
);

function buildCharacters(): readonly EmojiCharacter[] {
  const entries: EmojiCharacter[] = [];
  for (const [path, module] of Object.entries(emojiImages)) {
    const filename = path.split("/").pop()?.replace(".webp", "") ?? "";
    const name = filename
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    // Truncate to 10 chars for card face fallback
    const displayName = name.length > 10 ? name.slice(0, 10) : name;
    entries.push({
      id: filename,
      name: displayName,
      imageUrl: module.default,
    });
  }
  return entries;
}

export const EMOJI_CHARACTERS: readonly EmojiCharacter[] = buildCharacters();

export function getDefaultImages(count: number): readonly EmojiCharacter[] {
  if (count <= 0) return [];
  const pool = [...EMOJI_CHARACTERS];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
