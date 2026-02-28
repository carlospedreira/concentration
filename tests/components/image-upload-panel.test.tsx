import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUploadPanel } from "../../src/components/image-upload-panel";
import type { UploadedImage } from "../../src/types/game";

function makeImage(id: string, name: string): UploadedImage {
  const file = new File(["data"], name, { type: "image/jpeg" });
  return { id, file, url: `blob:http://localhost/${id}`, name };
}

describe("ImageUploadPanel", () => {
  it("renders file input for image upload", () => {
    render(
      <ImageUploadPanel
        images={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const input = screen.getByLabelText(/upload/i);
    expect(input).toBeInTheDocument();
  });

  it("file input triggers onAdd callback with valid files", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <ImageUploadPanel
        images={[]}
        onAdd={onAdd}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    await user.upload(input, file);
    expect(onAdd).toHaveBeenCalledWith([file]);
  });

  it("displays preview thumbnails for uploaded images", () => {
    const images = [makeImage("1", "photo1.jpg"), makeImage("2", "photo2.jpg")];
    render(
      <ImageUploadPanel
        images={images}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const thumbnails = screen.getAllByRole("img");
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[0]).toHaveAttribute("src", "blob:http://localhost/1");
    expect(thumbnails[1]).toHaveAttribute("src", "blob:http://localhost/2");
  });

  it("displays filenames for uploaded images", () => {
    const images = [makeImage("1", "photo1.jpg")];
    render(
      <ImageUploadPanel
        images={images}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    expect(screen.getByText("photo1.jpg")).toBeInTheDocument();
  });

  it("remove button calls onRemove with image id", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    const images = [makeImage("1", "photo1.jpg")];
    render(
      <ImageUploadPanel
        images={images}
        onAdd={vi.fn()}
        onRemove={onRemove}
        onReorder={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("shows validation error for invalid file type", () => {
    render(
      <ImageUploadPanel
        images={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
    const file = new File(["data"], "doc.pdf", { type: "application/pdf" });
    // Use fireEvent to bypass accept attribute filtering
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows validation error for oversized file", async () => {
    const user = userEvent.setup();
    render(
      <ImageUploadPanel
        images={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onReorder={vi.fn()}
      />,
    );
    const input = screen.getByLabelText(/upload/i) as HTMLInputElement;
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    await user.upload(input, bigFile);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  describe("reorder controls", () => {
    it("move-up calls onReorder with 'up' direction", async () => {
      const onReorder = vi.fn();
      const user = userEvent.setup();
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg")];
      render(
        <ImageUploadPanel
          images={images}
          onAdd={vi.fn()}
          onRemove={vi.fn()}
          onReorder={onReorder}
        />,
      );
      // Second image has move-up button
      await user.click(screen.getByRole("button", { name: /move b\.jpg up/i }));
      expect(onReorder).toHaveBeenCalledWith("2", "up");
    });

    it("move-down calls onReorder with 'down' direction", async () => {
      const onReorder = vi.fn();
      const user = userEvent.setup();
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg")];
      render(
        <ImageUploadPanel
          images={images}
          onAdd={vi.fn()}
          onRemove={vi.fn()}
          onReorder={onReorder}
        />,
      );
      // First image has move-down button
      await user.click(screen.getByRole("button", { name: /move a\.jpg down/i }));
      expect(onReorder).toHaveBeenCalledWith("1", "down");
    });

    it("first item has no move-up button", () => {
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg")];
      render(
        <ImageUploadPanel
          images={images}
          onAdd={vi.fn()}
          onRemove={vi.fn()}
          onReorder={vi.fn()}
        />,
      );
      expect(screen.queryByRole("button", { name: /move a\.jpg up/i })).not.toBeInTheDocument();
    });

    it("last item has no move-down button", () => {
      const images = [makeImage("1", "a.jpg"), makeImage("2", "b.jpg")];
      render(
        <ImageUploadPanel
          images={images}
          onAdd={vi.fn()}
          onRemove={vi.fn()}
          onReorder={vi.fn()}
        />,
      );
      expect(screen.queryByRole("button", { name: /move b\.jpg down/i })).not.toBeInTheDocument();
    });
  });
});
