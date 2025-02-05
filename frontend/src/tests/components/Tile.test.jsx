import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Tile from "../../features/board/components/Tile";

describe("Tile", () => {
  it("renders the tile content", () => {
    render(<Tile id={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
