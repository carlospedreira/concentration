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
});
