import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TileEditor from "../../features/board/components/TileEditor";

describe("TileEditor", () => {
  beforeEach(() => {
    cleanup();
    // Set up the fetch mock to return predictable data.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            query: {
              categorymembers: [
                { title: "Voidwaker Gem" },
                { title: "The Gauntlet" },
                { title: "Corrupted Gauntlet" },
              ],
            },
          }),
      })
    );
  });

  it("renders an input field", async () => {
    render(<TileEditor onSelectEntry={() => {}} onCancel={() => {}} />);
    // Use getAllByTestId because the modal may create multiple nodes.
    const inputs = screen.getAllByTestId("tile-editor-input");
    expect(inputs[0]).toBeInTheDocument();
  });

  it("displays filtered search results based on user input", async () => {
    render(<TileEditor onSelectEntry={() => {}} onCancel={() => {}} />);
    const input = screen.getAllByTestId("tile-editor-input")[0];

    // Wait until fetch has been called and the entries are loaded.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Simulate typing "gaunt" (which should match both "The Gauntlet" and "Corrupted Gauntlet").
    fireEvent.change(input, { target: { value: "gaunt" } });

    // Wait for the filtered results to appear.
    await waitFor(() => {
      const gauntletResults = screen.queryAllByText(/Gauntlet/i);
      expect(gauntletResults.length).toBeGreaterThan(1);
    });
  });

  it("calls onSelectEntry with the chosen entry when clicked", async () => {
    const onSelectEntryMock = vi.fn();
    render(
      <TileEditor onSelectEntry={onSelectEntryMock} onCancel={() => {}} />
    );
    const input = screen.getAllByTestId("tile-editor-input")[0];

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Simulate typing "Voidwaker G" to trigger the filter for "Voidwaker Gem".
    fireEvent.change(input, { target: { value: "Voidwaker G" } });

    await waitFor(() => {
      const results = screen.queryAllByText(/Voidwaker Gem/i);
      expect(results.length).toBeGreaterThan(0);
    });

    // Click on the first instance of the result.
    fireEvent.click(screen.getAllByText(/Voidwaker Gem/i)[0]);

    await waitFor(() => {
      expect(onSelectEntryMock).toHaveBeenCalledWith("Voidwaker Gem");
    });
  });
});
