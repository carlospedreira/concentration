import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MoveCounter } from "../../src/components/move-counter";

describe("MoveCounter", () => {
  it("displays 'Moves: 0' initially", () => {
    render(<MoveCounter moveCount={0} />);
    expect(screen.getByText("Moves: 0")).toBeInTheDocument();
  });

  it("updates display when moveCount prop changes", () => {
    const { rerender } = render(<MoveCounter moveCount={0} />);
    expect(screen.getByText("Moves: 0")).toBeInTheDocument();

    rerender(<MoveCounter moveCount={5} />);
    expect(screen.getByText("Moves: 5")).toBeInTheDocument();
  });
});
