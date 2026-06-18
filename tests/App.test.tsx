import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

/**
 * End-to-end smoke test: the headless environment has no browser, so this
 * exercises the real App + hook + reducer + components together to prove that
 * color cards render and that matching a color pair works.
 */
describe("App (color matching end-to-end)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function colorOf(id: number): string {
    return (screen.getByTestId(`face-${id}`) as HTMLElement).style.backgroundColor;
  }

  it("shows the setup screen with color-based copy", () => {
    render(<App />);
    expect(screen.getByText("Concentration")).toBeInTheDocument();
    expect(screen.getByText(/Match pairs of colors/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start game/i })).toBeInTheDocument();
  });

  it("renders a board of color cards and matches an identically-colored pair", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start game/i }));

    // 4x4 default = 16 cards, each with an inline color fill.
    const cards = screen.getAllByTestId(/^card-\d+$/);
    expect(cards).toHaveLength(16);

    // Find two cards that share the same color (a matching pair).
    const byColor = new Map<string, number[]>();
    for (let id = 0; id < 16; id++) {
      const color = colorOf(id);
      expect(color).toBeTruthy();
      byColor.set(color, [...(byColor.get(color) ?? []), id]);
    }
    const pair = [...byColor.values()].find((ids) => ids.length === 2);
    expect(pair).toBeDefined();
    const [a, b] = pair!;

    await user.click(screen.getByTestId(`card-${a}`));
    await user.click(screen.getByTestId(`card-${b}`));

    // The matching effect chain (checking -> CHECK_MATCH) marks both matched.
    await waitFor(() => {
      expect(screen.getByTestId(`card-${a}`)).toHaveAttribute("data-state", "matched");
      expect(screen.getByTestId(`card-${b}`)).toHaveAttribute("data-state", "matched");
    });

    expect(screen.getByText(/moves/i)).toBeInTheDocument();
  });

  it("flips a non-matching pair back to face-down", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /start game/i }));

    // Pick two cards of different colors.
    const colorA = colorOf(0);
    let other = -1;
    for (let id = 1; id < 16; id++) {
      if (colorOf(id) !== colorA) {
        other = id;
        break;
      }
    }
    expect(other).toBeGreaterThan(0);

    await user.click(screen.getByTestId("card-0"));
    await user.click(screen.getByTestId(`card-${other}`));

    // Non-match reveals briefly (1s timeout) then flips both back to faceDown.
    await waitFor(
      () => {
        expect(screen.getByTestId("card-0")).toHaveAttribute("data-state", "faceDown");
        expect(screen.getByTestId(`card-${other}`)).toHaveAttribute("data-state", "faceDown");
      },
      { timeout: 2000 },
    );
  });
});
