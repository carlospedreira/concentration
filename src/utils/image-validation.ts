import type { ValidationResult } from "../types/game";

const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: "Unsupported format. Please upload JPEG, PNG, GIF, or WebP images.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Image exceeds 5MB limit. Please choose a smaller file.",
    };
  }

  return { valid: true };
}
