// frontend/src/tests/components/Tile.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Tile from "../../features/board/components/Tile";

describe("Tile rendering", () => {
  it("renders with full green tint when complete", () => {
    render(
      <Tile
        id={1}
        data={{ content: "Test", target: 5, unit: "drops", progress: 5 }}
      />
    );
    const tile = screen.getByTestId("bingo-cell");
    expect(tile).toHaveClass("completed");
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it("renders partial green tint and percentage when not complete", () => {
    render(
      <Tile
        id={1}
        data={{ content: "Test", target: 10, unit: "drops", progress: 3 }}
      />
    );
    const tile = screen.getByTestId("bingo-cell");
    expect(tile).not.toHaveClass("completed");
    expect(screen.getByText(/30%/i)).toBeInTheDocument();
    const overlay = screen.getByTestId("progress-overlay");
    expect(overlay).toHaveStyle("height: 30%");
  });
});
