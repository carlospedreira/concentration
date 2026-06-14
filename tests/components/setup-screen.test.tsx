import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SetupScreen } from "../../src/components/setup-screen";
import { GRID_STORAGE_KEY } from "../../src/utils/grid-storage";

function renderSetup(overrides = {}) {
  const props = {
    onStart: vi.fn(),
    ...overrides,
  };
  return { ...render(<SetupScreen {...props} />), props };
}

describe("SetupScreen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("does not render number inputs for rows or columns", () => {
    renderSetup();
    expect(screen.queryByRole("spinbutton")).toBeNull();
  });

  it("renders 9 grid size option buttons", () => {
    renderSetup();
    expect(screen.getByText("3x4")).toBeInTheDocument();
    expect(screen.getByText("4x4")).toBeInTheDocument();
    expect(screen.getByText("8x8")).toBeInTheDocument();
    const presetButtons = screen
      .getAllByRole("button", { pressed: true })
      .concat(screen.getAllByRole("button", { pressed: false }))
      .filter((btn) => btn.hasAttribute("aria-pressed"));
    expect(presetButtons).toHaveLength(9);
  });

  it("calls onStart with correct config from selected preset", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    renderSetup({ onStart });

    // Select 5x6 (index 4, 30 cards)
    await user.click(screen.getByText("5x6"));
    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledWith({ rows: 5, cols: 6 });
  });

  it("calls onStart with default 4x4 when no preset is changed", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    renderSetup({ onStart });

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledWith({ rows: 4, cols: 4 });
  });

  describe("pair count messaging", () => {
    it("shows the number of color pairs for the default preset", () => {
      renderSetup();
      // 4x4 = 8 pairs
      expect(screen.getByText(/8 color pairs to match/)).toBeInTheDocument();
    });

    it("updates the pair count when selecting a different preset", async () => {
      const user = userEvent.setup();
      renderSetup();
      // Select 3x4 = 6 pairs
      await user.click(screen.getByText("3x4"));
      expect(screen.getByText(/6 color pairs to match/)).toBeInTheDocument();
    });
  });

  it("form container retains max-w-sm class for narrow layout", () => {
    renderSetup();
    const formCard = screen
      .getByRole("button", { name: /start/i })
      .closest("div.max-w-sm");
    expect(formCard).not.toBeNull();
  });

  describe("grid size persistence", () => {
    it("initializes with stored preset from localStorage", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: 4 }));
      renderSetup();
      const button5x6 = screen.getByText("5x6").closest("button");
      expect(button5x6).toHaveAttribute("aria-pressed", "true");
    });

    it("initializes with default 4x4 when localStorage is empty", () => {
      renderSetup();
      const button4x4 = screen.getByText("4x4").closest("button");
      expect(button4x4).toHaveAttribute("aria-pressed", "true");
    });

    it("saves preset index to localStorage when Start is clicked", async () => {
      const user = userEvent.setup();
      renderSetup();

      await user.click(screen.getByText("6x6"));
      await user.click(screen.getByRole("button", { name: /start/i }));

      const stored = localStorage.getItem(GRID_STORAGE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual({ presetIndex: 5 });
    });
  });
});
