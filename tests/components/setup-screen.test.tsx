import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SetupScreen } from "../../src/components/setup-screen";

describe("SetupScreen", () => {
  it("renders rows and cols inputs", () => {
    render(<SetupScreen onStart={vi.fn()} />);
    expect(screen.getByLabelText(/rows/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/columns/i)).toBeInTheDocument();
  });

  it("calls onStart with config for valid input", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<SetupScreen onStart={onStart} />);

    const rowsInput = screen.getByLabelText(/rows/i);
    const colsInput = screen.getByLabelText(/columns/i);

    await user.clear(rowsInput);
    await user.type(rowsInput, "4");
    await user.clear(colsInput);
    await user.type(colsInput, "4");
    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledWith({ rows: 4, cols: 4 });
  });

  it("shows error for invalid config (odd total)", async () => {
    const user = userEvent.setup();
    render(<SetupScreen onStart={vi.fn()} />);

    const rowsInput = screen.getByLabelText(/rows/i);
    const colsInput = screen.getByLabelText(/columns/i);

    await user.clear(rowsInput);
    await user.type(rowsInput, "3");
    await user.clear(colsInput);
    await user.type(colsInput, "3");
    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
