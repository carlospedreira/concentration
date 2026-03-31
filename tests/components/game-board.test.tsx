import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameBoard } from "../../src/components/game-board";
import type { Card } from "../../src/types/game";

function makeCards(count: number): Card[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: String.fromCharCode(65 + (i % (count / 2))),
    state: "faceDown" as const,
  }));
}

function getGridContainer(): HTMLElement {
  // The grid container is the div with gridTemplateColumns style
  const cards = screen.getAllByTestId(/^card-/);
  return cards[0].parentElement!;
}

describe("GameBoard", () => {
  it("renders correct number of cards", () => {
    const cards = makeCards(16);
    render(
      <GameBoard
        cards={cards}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const cardElements = screen.getAllByTestId(/^card-/);
    expect(cardElements).toHaveLength(16);
  });

  it("renders all cards face-down", () => {
    const cards = makeCards(8);
    render(
      <GameBoard
        cards={cards}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const cardElements = screen.getAllByTestId(/^card-/);
    for (const el of cardElements) {
      expect(el).toHaveAttribute("data-state", "faceDown");
    }
  });

  it("applies dynamic maxWidth that scales with column count", () => {
    const { unmount } = render(
      <GameBoard
        cards={makeCards(100)}
        cols={10}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid10 = getGridContainer();
    const maxWidth10 = parseInt(grid10.style.maxWidth, 10);
    expect(maxWidth10).toBeGreaterThan(672); // wider than old max-w-2xl
    unmount();

    render(
      <GameBoard
        cards={makeCards(16)}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid4 = getGridContainer();
    const maxWidth4 = parseInt(grid4.style.maxWidth, 10);
    expect(maxWidth4).toBeLessThanOrEqual(672);
  });

  it("does not use the fixed max-w-2xl class", () => {
    render(
      <GameBoard
        cards={makeCards(16)}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid = getGridContainer();
    expect(grid.className).not.toContain("max-w-2xl");
  });

  it("has w-full and mx-auto classes for centering", () => {
    render(
      <GameBoard
        cards={makeCards(16)}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid = getGridContainer();
    expect(grid.className).toContain("w-full");
    expect(grid.className).toContain("mx-auto");
  });

  it("maxWidth scales proportionally with column count", () => {
    const { unmount } = render(
      <GameBoard
        cards={makeCards(32)}
        cols={8}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid8 = getGridContainer();
    const maxWidth8 = parseInt(grid8.style.maxWidth, 10);
    unmount();

    render(
      <GameBoard
        cards={makeCards(16)}
        cols={4}
        onSelectCard={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    const grid4 = getGridContainer();
    const maxWidth4 = parseInt(grid4.style.maxWidth, 10);
    expect(maxWidth8).toBeGreaterThan(maxWidth4);
  });
});
