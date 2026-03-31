import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompletionScreen } from "../../src/components/completion-screen";

function renderCompletion(overrides = {}) {
  const props = {
    moveCount: 5,
    onPlayAgain: vi.fn(),
    onChangeSize: vi.fn(),
    ...overrides,
  };
  return { ...render(<CompletionScreen {...props} />), props };
}

describe("CompletionScreen", () => {
  it("displays total move count", () => {
    renderCompletion({ moveCount: 12 });
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it("renders play again button", () => {
    renderCompletion();
    expect(
      screen.getByRole("button", { name: /play again/i }),
    ).toBeInTheDocument();
  });

  it("wrapper div has items-center for centering", () => {
    renderCompletion();
    const button = screen.getByRole("button", { name: /play again/i });
    const wrapper = button.closest("div.items-center");
    expect(wrapper).not.toBeNull();
  });

  it("calls onPlayAgain when Play Again button clicked", async () => {
    const onPlayAgain = vi.fn();
    const user = userEvent.setup();
    renderCompletion({ onPlayAgain });

    await user.click(screen.getByRole("button", { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });

  it("renders Change Size button", () => {
    renderCompletion();
    expect(
      screen.getByRole("button", { name: /change size/i }),
    ).toBeInTheDocument();
  });

  it("calls onChangeSize when Change Size button clicked", async () => {
    const onChangeSize = vi.fn();
    const user = userEvent.setup();
    renderCompletion({ onChangeSize });

    await user.click(screen.getByRole("button", { name: /change size/i }));
    expect(onChangeSize).toHaveBeenCalledOnce();
  });
});
