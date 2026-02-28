import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameState } from "../../src/hooks/use-game-state";

describe("useGameState", () => {
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
});
