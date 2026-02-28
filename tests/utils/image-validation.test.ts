import { describe, it, expect } from "vitest";
import { validateImageFile } from "../../src/utils/image-validation";

function makeFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("validateImageFile", () => {
  describe("accepted MIME types", () => {
    it.each([
      ["image/jpeg", "photo.jpg"],
      ["image/png", "photo.png"],
      ["image/gif", "anim.gif"],
      ["image/webp", "photo.webp"],
    ])("accepts %s", (type, name) => {
      const file = makeFile(name, 1024, type);
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("rejected MIME types", () => {
    it.each([
      ["image/svg+xml", "icon.svg"],
      ["image/bmp", "photo.bmp"],
      ["application/pdf", "doc.pdf"],
      ["text/plain", "file.txt"],
      ["video/mp4", "video.mp4"],
      ["", "noext"],
    ])("rejects %s", (type, name) => {
      const file = makeFile(name, 1024, type);
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unsupported format");
    });
  });

  describe("size limit", () => {
    it("accepts file exactly at 5MB", () => {
      const file = makeFile("big.jpg", 5 * 1024 * 1024, "image/jpeg");
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("rejects file over 5MB", () => {
      const file = makeFile("huge.jpg", 5 * 1024 * 1024 + 1, "image/jpeg");
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("5MB");
    });

    it("accepts small file", () => {
      const file = makeFile("tiny.png", 100, "image/png");
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("rejects file with invalid type even if under size limit", () => {
      const file = makeFile("doc.pdf", 100, "application/pdf");
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
    });

    it("checks type before size (invalid type + over size)", () => {
      const file = makeFile("big.txt", 10 * 1024 * 1024, "text/plain");
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unsupported format");
    });

    it("accepts zero-byte file with valid type", () => {
      const file = makeFile("empty.jpg", 0, "image/jpeg");
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });
});
