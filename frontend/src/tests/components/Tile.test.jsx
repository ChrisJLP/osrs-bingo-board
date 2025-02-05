import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { describe, it, expect, vi } from "vitest";
import Tile from "../../features/board/components/Tile";

// Helper to render Tile inside a DndContext
const renderTile = (props) => {
  return render(
    <DndContext>
      <Tile {...props} />
    </DndContext>
  );
};

describe("Tile (with editing)", () => {
  it("renders initial tile content (its id)", () => {
    renderTile({ id: 1 });
    expect(screen.getByTestId("tile-content").textContent).toBe("1");
  });

  it("opens the TileEditor when clicked and updates tile text upon selection", async () => {
    // Mock fetch for TileEditor search results.
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
    expect(screen.getByTestId("tile-content").textContent).toBe("1");

    // Simulate clicking on the tile.
    fireEvent.click(screen.getByTestId("bingo-cell"));

    // The TileEditor should appear.
    const input = await screen.findByTestId("tile-editor-input");
    expect(input).toBeInTheDocument();

    // Simulate typing.
    fireEvent.change(input, { target: { value: "The Corrupted G" } });
    await waitFor(() => {
      expect(screen.getByText("The Corrupted Gauntlet")).toBeInTheDocument();
    });

    // Click on the search result.
    fireEvent.click(screen.getByText("The Corrupted Gauntlet"));

    // The tile's content should now update.
    await waitFor(() => {
      expect(screen.getByTestId("tile-content").textContent).toBe(
        "The Corrupted Gauntlet"
      );
    });
  });
});
