import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BingoBoard from "../../features/board/components/BingoBoard";

describe("BingoBoard", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the bingo board text", () => {
    render(<BingoBoard />);
    expect(screen.getByText("Bingo Board")).toBeInTheDocument();
  });

  it("renders a 5x5 grid by default", () => {
    render(<BingoBoard />);
    const cells = screen.getAllByTestId("bingo-cell");
    expect(cells).toHaveLength(25);
  });

  it("displays grid size controls", () => {
    render(<BingoBoard />);
    expect(
      screen.getByRole("spinbutton", { name: /rows/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /columns/i })
    ).toBeInTheDocument();
  });

  it("updates grid size when controls are changed", () => {
    render(<BingoBoard />);
    const rowsInput = screen.getByRole("spinbutton", { name: /rows/i });
    const columnsInput = screen.getByRole("spinbutton", { name: /columns/i });
    fireEvent.change(rowsInput, { target: { value: "2" } });
    fireEvent.change(columnsInput, { target: { value: "3" } });
    const cells = screen.getAllByTestId("bingo-cell");
    expect(cells).toHaveLength(6);
  });

  it("maintains grid layout after size change", () => {
    render(<BingoBoard />);
    const rowsInput = screen.getByRole("spinbutton", { name: /rows/i });
    const columnsInput = screen.getByRole("spinbutton", { name: /columns/i });
    fireEvent.change(rowsInput, { target: { value: "2" } });
    fireEvent.change(columnsInput, { target: { value: "3" } });
    const grid = screen.getByTestId("bingo-grid");
    expect(grid).toHaveStyle({
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
    });
  });

  it("renders draggable tiles", () => {
    render(<BingoBoard />);
    const cells = screen.getAllByTestId("bingo-cell");
    cells.forEach((cell) => {
      // dnd-kit adds inline styles (like transform) when dragging;
      // we check that each cell exists and is rendered.
      expect(cell).toBeInTheDocument();
    });
  });
});
