import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SetupScreen } from "../../src/components/setup-screen";
import type { UploadedImage } from "../../src/types/game";
import { GRID_STORAGE_KEY } from "../../src/utils/grid-storage";

function makeImage(id: string, name: string): UploadedImage {
  const file = new File(["data"], name, { type: "image/jpeg" });
  return { id, file, url: `blob:http://localhost/${id}`, name };
}

function renderSetup(overrides = {}) {
  const props = {
    images: [] as UploadedImage[],
    onAddImages: vi.fn(),
    onRemoveImage: vi.fn(),
    onReorderImage: vi.fn(),
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
    // Count all preset buttons (they have aria-pressed attribute)
    const presetButtons = screen.getAllByRole("button", { pressed: true })
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

    expect(onStart).toHaveBeenCalledWith({ rows: 5, cols: 6 }, []);
  });

  it("calls onStart with default 4x4 when no preset is changed", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    renderSetup({ onStart });

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledWith({ rows: 4, cols: 4 }, []);
  });

  describe("pair count messaging", () => {
    it("shows partial image message when fewer images than pairs", () => {
      // Default 4x4 = 8 pairs, 3 images
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg"), makeImage("3", "c.jpg")];
      renderSetup({ images });
      expect(screen.getByText(/3 of 8 pairs will use your images/)).toBeInTheDocument();
    });

    it("shows all-image message when images equal pair count", () => {
      // 4x4 = 8 pairs, need 8 images
      const images = Array.from({ length: 8 }, (_, i) =>
        makeImage(String(i), `img${i}.jpg`),
      );
      renderSetup({ images });
      expect(screen.getByText(/All 8 pairs will use your images/)).toBeInTheDocument();
    });

    it("shows no pair count message when zero images", () => {
      renderSetup({ images: [] });
      expect(screen.queryByText(/pairs will use/)).not.toBeInTheDocument();
      expect(screen.queryByText(/images will be used/)).not.toBeInTheDocument();
    });

    it("shows excess image message when more images than pairs", () => {
      // Default 4x4 = 8 pairs, 10 images
      const images = Array.from({ length: 10 }, (_, i) =>
        makeImage(String(i), `img${i}.jpg`),
      );
      renderSetup({ images });
      expect(screen.getByText(/Only 8 of 10 images will be used/)).toBeInTheDocument();
    });

    it("pair count updates when selecting a different preset", async () => {
      const user = userEvent.setup();
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg"), makeImage("3", "c.jpg")];
      renderSetup({ images });
      expect(screen.getByText(/3 of 8 pairs will use your images/)).toBeInTheDocument();

      // Select 3x4 = 6 pairs
      await user.click(screen.getByText("3x4"));
      expect(screen.getByText(/3 of 6 pairs will use your images/)).toBeInTheDocument();
    });
  });

  describe("image persistence across resets", () => {
    it("images are passed through and displayed after remount", () => {
      const images = [makeImage("1", "photo1.jpg"), makeImage("2", "photo2.jpg")];
      const { unmount } = renderSetup({ images });
      expect(screen.getAllByRole("img")).toHaveLength(2);

      unmount();
      renderSetup({ images });
      expect(screen.getAllByRole("img")).toHaveLength(2);
      expect(screen.getByText("photo1.jpg")).toBeInTheDocument();
      expect(screen.getByText("photo2.jpg")).toBeInTheDocument();
    });
  });

  it("form container retains max-w-sm class for narrow layout", () => {
    renderSetup();
    const formCard = screen.getByRole("button", { name: /start/i }).closest("div.max-w-sm");
    expect(formCard).not.toBeNull();
  });

  describe("grid size persistence", () => {
    it("initializes with stored preset from localStorage", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ presetIndex: 4 }));
      renderSetup();
      // 5x6 should be selected (aria-pressed=true)
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
