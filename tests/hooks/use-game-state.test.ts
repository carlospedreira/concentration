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

  it("startGame builds a board where each card carries a color", () => {
    const { result } = renderHook(() => useGameState());
    act(() => {
      result.current.startGame({ rows: 2, cols: 2 });
    });
    expect(result.current.state.phase).toBe("playing");
    expect(result.current.state.cards).toHaveLength(4);
    for (const card of result.current.state.cards) {
      expect(card.color).toBeTruthy();
    }
  });
});
