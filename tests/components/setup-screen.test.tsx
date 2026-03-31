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

  it("renders rows and cols inputs", () => {
    renderSetup();
    expect(screen.getByLabelText(/rows/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/columns/i)).toBeInTheDocument();
  });

  it("calls onStart with config and imageUrls for valid input", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    renderSetup({ onStart });

    const rowsInput = screen.getByLabelText(/rows/i);
    const colsInput = screen.getByLabelText(/columns/i);

    await user.clear(rowsInput);
    await user.type(rowsInput, "4");
    await user.clear(colsInput);
    await user.type(colsInput, "4");
    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledWith({ rows: 4, cols: 4 }, []);
  });

  it("shows error for invalid config (odd total)", async () => {
    const user = userEvent.setup();
    renderSetup();

    const rowsInput = screen.getByLabelText(/rows/i);
    const colsInput = screen.getByLabelText(/columns/i);

    await user.clear(rowsInput);
    await user.type(rowsInput, "3");
    await user.clear(colsInput);
    await user.type(colsInput, "3");
    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
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
  });

  describe("board size change recalculates pair count", () => {
    it("pair count message updates when rows change", async () => {
      const user = userEvent.setup();
      // 3 images, default 4x4 = 8 pairs → "3 of 8 pairs"
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg"), makeImage("3", "c.jpg")];
      renderSetup({ images });
      expect(screen.getByText(/3 of 8 pairs will use your images/)).toBeInTheDocument();

      // Change to 2x2 = 2 pairs → excess: "Only 2 of 3 images will be used"
      const rowsInput = screen.getByLabelText(/rows/i);
      const colsInput = screen.getByLabelText(/columns/i);
      await user.clear(rowsInput);
      await user.type(rowsInput, "2");
      await user.clear(colsInput);
      await user.type(colsInput, "2");
      expect(screen.getByText(/Only 2 of 3 images will be used/)).toBeInTheDocument();
    });
  });

  describe("image persistence across resets", () => {
    it("images are passed through and displayed after remount", () => {
      // Simulates: images survive game reset because they're in parent state
      const images = [makeImage("1", "photo1.jpg"), makeImage("2", "photo2.jpg")];
      const { unmount } = renderSetup({ images });
      expect(screen.getAllByRole("img")).toHaveLength(2);

      // Remount with same images (simulating game reset returning to setup)
      unmount();
      renderSetup({ images });
      expect(screen.getAllByRole("img")).toHaveLength(2);
      expect(screen.getByText("photo1.jpg")).toBeInTheDocument();
      expect(screen.getByText("photo2.jpg")).toBeInTheDocument();
    });
  });

  describe("grid size persistence", () => {
    it("initializes with stored grid size from localStorage", () => {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: 3, cols: 4 }));
      renderSetup();

      const rowsInput = screen.getByLabelText(/rows/i) as HTMLInputElement;
      const colsInput = screen.getByLabelText(/columns/i) as HTMLInputElement;
      expect(rowsInput.value).toBe("3");
      expect(colsInput.value).toBe("4");
    });

    it("initializes with default 4x4 when localStorage is empty", () => {
      renderSetup();

      const rowsInput = screen.getByLabelText(/rows/i) as HTMLInputElement;
      const colsInput = screen.getByLabelText(/columns/i) as HTMLInputElement;
      expect(rowsInput.value).toBe("4");
      expect(colsInput.value).toBe("4");
    });
  });
});
