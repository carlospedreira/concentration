import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardComponent } from "../../src/components/card";

const RED = "hsl(0 78% 64%)";

function renderCard(props: Partial<React.ComponentProps<typeof CardComponent>> = {}) {
  return render(
    <CardComponent
      id={0}
      color={RED}
      colorName="Light Red"
      state="faceDown"
      onSelect={vi.fn()}
      {...props}
    />,
  );
}

describe("CardComponent", () => {
  it("renders face-down state", () => {
    renderCard({ id: 0, state: "faceDown" });
    const cardEl = screen.getByTestId("card-0");
    expect(cardEl).toHaveAttribute("data-state", "faceDown");
    expect(cardEl).toHaveAttribute("aria-label", "Face-down card");
  });

  it("reveals the color fill when face-up", () => {
    renderCard({ id: 1, state: "faceUp" });
    const front = screen.getByTestId("face-1");
    expect(front).toHaveStyle({ backgroundColor: RED });
    expect(screen.getByTestId("card-1")).toHaveAttribute("aria-label", "Light Red card");
  });

  it("renders matched state with the color fill", () => {
    renderCard({ id: 2, state: "matched" });
    const cardEl = screen.getByTestId("card-2");
    expect(cardEl).toHaveAttribute("data-state", "matched");
    const front = screen.getByTestId("face-2");
    expect(front).toHaveStyle({ backgroundColor: RED });
    expect(front.className).toContain("card-shimmer");
  });

  it("click on face-down card calls onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderCard({ id: 3, state: "faceDown", onSelect });
    await user.click(screen.getByTestId("card-3"));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it("click on matched card does not call onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderCard({ id: 4, state: "matched", onSelect });
    await user.click(screen.getByTestId("card-4"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("click on face-up card does not call onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderCard({ id: 5, state: "faceUp", onSelect });
    await user.click(screen.getByTestId("card-5"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
