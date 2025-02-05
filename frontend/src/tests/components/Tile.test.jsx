import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Tile from "../../features/board/components/Tile";

// Helper to render Tile inside a DndContext.
const renderTile = (props) => {
  return render(
    <DndContext>
      <Tile {...props} />
    </DndContext>
  );
};

describe("Tile (with editing)", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders initial tile content (its id)", () => {
    renderTile({ id: 1 });
    expect(screen.getAllByTestId("tile-content")[0].textContent).toBe("1");
  });

  it("opens the TileEditor when clicked and updates tile text upon selection", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            query: {
              categorymembers: [{ title: "The Corrupted Gauntlet" }],
            },
          }),
      })
    );

    renderTile({ id: 1 });

    // Initially, tile shows "1"
    expect(screen.getAllByTestId("tile-content")[0].textContent).toBe("1");

    // Click the tile (use the first bingo-cell element).
    fireEvent.click(screen.getAllByTestId("bingo-cell")[0]);

    // Wait for the TileEditor input to appear.
    const input = await screen.findByTestId("tile-editor-input");
    expect(input).toBeInTheDocument();

    // Simulate typing.
    fireEvent.change(input, { target: { value: "The Corrupted G" } });

    await waitFor(() => {
      const results = screen.queryAllByText(/The Corrupted Gauntlet/i);
      expect(results.length).toBeGreaterThan(0);
    });

    // Click on the search result.
    fireEvent.click(screen.getAllByText(/The Corrupted Gauntlet/i)[0]);

    // Verify that the tile's content now updates.
    await waitFor(() => {
      expect(screen.getAllByTestId("tile-content")[0].textContent).toBe(
        "The Corrupted Gauntlet"
      );
    });
  });
});
