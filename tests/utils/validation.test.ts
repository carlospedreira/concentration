import { describe, it, expect } from "vitest";
import { validateBoardConfig } from "../../src/utils/validation";

describe("validateBoardConfig", () => {
  it("returns valid for a correct config", () => {
    const result = validateBoardConfig({ rows: 4, cols: 4 });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns valid for the smallest board (1x2)", () => {
    const result = validateBoardConfig({ rows: 1, cols: 2 });
    expect(result.valid).toBe(true);
  });

  it("returns valid for the largest board (10x10)", () => {
    const result = validateBoardConfig({ rows: 10, cols: 10 });
    expect(result.valid).toBe(true);
  });

  it("rejects odd total card count", () => {
    const result = validateBoardConfig({ rows: 3, cols: 3 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects rows below 1", () => {
    const result = validateBoardConfig({ rows: 0, cols: 4 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects cols below 1", () => {
    const result = validateBoardConfig({ rows: 4, cols: 0 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects rows above 10", () => {
    const result = validateBoardConfig({ rows: 11, cols: 4 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects cols above 10", () => {
    const result = validateBoardConfig({ rows: 4, cols: 11 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects negative values", () => {
    const result = validateBoardConfig({ rows: -1, cols: 4 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects total less than 2", () => {
    const result = validateBoardConfig({ rows: 1, cols: 1 });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
