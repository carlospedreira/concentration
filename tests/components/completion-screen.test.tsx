import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompletionScreen } from "../../src/components/completion-screen";

describe("CompletionScreen", () => {
  it("displays total move count", () => {
    render(<CompletionScreen moveCount={12} onPlayAgain={vi.fn()} />);
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it("renders play again button", () => {
    render(<CompletionScreen moveCount={5} onPlayAgain={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /play again/i }),
    ).toBeInTheDocument();
  });

  it("wrapper div has items-center for centering", () => {
    render(<CompletionScreen moveCount={5} onPlayAgain={vi.fn()} />);
    const button = screen.getByRole("button", { name: /play again/i });
    const wrapper = button.closest("div.items-center");
    expect(wrapper).not.toBeNull();
  });

  it("calls onPlayAgain when button clicked", async () => {
    const onPlayAgain = vi.fn();
    const user = userEvent.setup();
    render(<CompletionScreen moveCount={5} onPlayAgain={onPlayAgain} />);

    await user.click(screen.getByRole("button", { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });
});
