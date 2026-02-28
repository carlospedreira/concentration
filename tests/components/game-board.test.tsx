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
});
