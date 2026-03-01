import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardComponent } from "../../src/components/card";

describe("CardComponent", () => {
  it("renders face-down state with hidden symbol", () => {
    render(
      <CardComponent
        id={0}
        symbol="★"
        state="faceDown"
        onSelect={vi.fn()}
      />,
    );
    const card = screen.getByTestId("card-0");
    expect(card).toHaveAttribute("data-state", "faceDown");
    expect(screen.queryByText("★")).not.toBeInTheDocument();
  });

  it("renders face-up state with visible symbol", () => {
    render(
      <CardComponent
        id={1}
        symbol="★"
        state="faceUp"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("★")).toBeVisible();
  });

  it("renders matched state", () => {
    render(
      <CardComponent
        id={2}
        symbol="★"
        state="matched"
        onSelect={vi.fn()}
      />,
    );
    const card = screen.getByTestId("card-2");
    expect(card).toHaveAttribute("data-state", "matched");
    expect(screen.getByText("★")).toBeVisible();
  });

  it("click on face-down card calls onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <CardComponent
        id={3}
        symbol="★"
        state="faceDown"
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByTestId("card-3"));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it("click on matched card does not call onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <CardComponent
        id={4}
        symbol="★"
        state="matched"
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByTestId("card-4"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("click on face-up card does not call onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <CardComponent
        id={5}
        symbol="★"
        state="faceUp"
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByTestId("card-5"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  describe("image rendering", () => {
    it("renders img with object-fit cover when imageUrl is present and faceUp", () => {
      render(
        <CardComponent
          id={10}
          symbol="★"
          state="faceUp"
          imageUrl="blob:http://localhost/abc"
          onSelect={vi.fn()}
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "blob:http://localhost/abc");
      expect(img.className).toContain("object-cover");
    });

    it("renders symbol span when imageUrl is absent and faceUp", () => {
      render(
        <CardComponent
          id={11}
          symbol="★"
          state="faceUp"
          onSelect={vi.fn()}
        />,
      );
      expect(screen.getByText("★")).toBeVisible();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("does not show image when card is faceDown", () => {
      render(
        <CardComponent
          id={12}
          symbol="★"
          state="faceDown"
          imageUrl="blob:http://localhost/abc"
          onSelect={vi.fn()}
        />,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders img when matched with imageUrl", () => {
      render(
        <CardComponent
          id={13}
          symbol="★"
          state="matched"
          imageUrl="blob:http://localhost/abc"
          onSelect={vi.fn()}
        />,
      );
      expect(screen.getByRole("img")).toHaveAttribute("src", "blob:http://localhost/abc");
    });

    it("shows symbol text when image fires error event", async () => {
      const { container } = render(
        <CardComponent
          id={14}
          symbol="Mickey"
          state="faceUp"
          imageUrl="bad-url.webp"
          onSelect={vi.fn()}
        />,
      );
      const img = screen.getByRole("img");
      // Simulate image load error
      await import("@testing-library/react").then(({ fireEvent }) => {
        fireEvent.error(img);
      });
      // After error, image should be hidden and symbol should be visible
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByText("Mickey")).toBeVisible();
    });
  });
});
