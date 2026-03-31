import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGameState } from "../../src/hooks/use-game-state";
import { GRID_STORAGE_KEY } from "../../src/utils/grid-storage";

/** Find indices of a matching pair in the cards array */
function findMatchingPair(cards: readonly { symbol: string }[]): [number, number] {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i].symbol === cards[j].symbol) return [i, j];
    }
  }
  throw new Error("No matching pair found");
}

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
    // Emoji images fill all pairs when no custom images provided
    const imageCards = result.current.state.cards.filter((c) => c.imageUrl);
    expect(imageCards).toHaveLength(4);
  });

  it("saves grid size to localStorage when game completes", async () => {
    const config = { rows: 2, cols: 4 };
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame(config);
    });

    // Match all pairs to complete the game
    const cards = result.current.state.cards;
    const symbols = [...new Set(cards.map((c) => c.symbol))];

    for (const sym of symbols) {
      const indices = cards
        .map((c, i) => (c.symbol === sym ? i : -1))
        .filter((i) => i !== -1);

      act(() => {
        result.current.selectCard(indices[0]);
      });
      act(() => {
        result.current.selectCard(indices[1]);
      });

      // Wait for CHECK_MATCH to process (useEffect)
      await waitFor(() => {
        expect(result.current.state.phase).not.toBe("checking");
      });
    }

    expect(result.current.state.phase).toBe("complete");

    const stored = localStorage.getItem(GRID_STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(config);
  });

  it("does NOT save grid size to localStorage on mid-game reset", async () => {
    const config = { rows: 2, cols: 4 };
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame(config);
    });

    // Select one card then reset
    act(() => {
      result.current.selectCard(0);
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.state.phase).toBe("setup");
    expect(localStorage.getItem(GRID_STORAGE_KEY)).toBeNull();
  });
});
