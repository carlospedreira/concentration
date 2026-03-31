import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameState } from "../../src/hooks/use-game-state";

describe("useGameState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial setup state", () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.state.phase).toBe("setup");
    expect(result.current.state.cards).toHaveLength(0);
  });

  it("startGame transitions to playing", () => {
    const { result } = renderHook(() => useGameState());
    act(() => {
      result.current.startGame({ rows: 4, cols: 4 });
    });
    expect(result.current.state.phase).toBe("playing");
    expect(result.current.state.cards).toHaveLength(16);
  });

  it("startGame accepts optional imageUrls and forwards to dispatch", () => {
    const { result } = renderHook(() => useGameState());
    const imageUrls = ["blob:img1", "blob:img2"];
    act(() => {
      result.current.startGame({ rows: 2, cols: 2 }, imageUrls);
    });
    expect(result.current.state.phase).toBe("playing");
    const imageCards = result.current.state.cards.filter((c) => c.imageUrl);
    expect(imageCards).toHaveLength(4);
  });

  it("startGame without imageUrls uses emoji defaults", () => {
    const { result } = renderHook(() => useGameState());
    act(() => {
      result.current.startGame({ rows: 2, cols: 2 });
    });
    const imageCards = result.current.state.cards.filter((c) => c.imageUrl);
    expect(imageCards).toHaveLength(4);
  });
});
