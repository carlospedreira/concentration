import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridSizeSelector } from "../../src/components/grid-size-selector";
import { GRID_PRESETS } from "../../src/utils/grid-presets";

describe("GridSizeSelector", () => {
  it("renders exactly 9 buttons", () => {
    render(
      <GridSizeSelector
        presets={GRID_PRESETS}
        selectedIndex={1}
        onChange={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
  });

  it("each button shows preset label and card count", () => {
    render(
      <GridSizeSelector
        presets={GRID_PRESETS}
        selectedIndex={1}
        onChange={vi.fn()}
      />,
    );
    for (const preset of GRID_PRESETS) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
      expect(screen.getByText(`${preset.cards} cards`)).toBeInTheDocument();
    }
  });

  it("selected button has aria-pressed true", () => {
    render(
      <GridSizeSelector
        presets={GRID_PRESETS}
        selectedIndex={3}
        onChange={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[3]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking a non-selected button calls onChange with its index", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <GridSizeSelector
        presets={GRID_PRESETS}
        selectedIndex={1}
        onChange={onChange}
      />,
    );
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[4]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("clicking the already-selected button does not call onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <GridSizeSelector
        presets={GRID_PRESETS}
        selectedIndex={2}
        onChange={onChange}
      />,
    );
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
