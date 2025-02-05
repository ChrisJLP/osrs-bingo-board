import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TileEditor from "../../../features/board/components/TileEditor";

describe("TileEditor", () => {
  it("renders an input field", () => {
    render(<TileEditor onSelectEntry={() => {}} onCancel={() => {}} />);
    const input = screen.getByTestId("tile-editor-input");
    expect(input).toBeInTheDocument();
  });

  it("displays filtered search results based on user input", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            query: {
              categorymembers: [
                { title: "Enhanced Crystal Weapon Seed" },
                { title: "The Corrupted Gauntlet" },
                { title: "Corrupted Hunllef" },
              ],
            },
          }),
      })
    );

    render(<TileEditor onSelectEntry={() => {}} onCancel={() => {}} />);
    const input = screen.getByTestId("tile-editor-input");
    fireEvent.change(input, { target: { value: "corrupted" } });

    await waitFor(() => {
      expect(screen.getByText("The Corrupted Gauntlet")).toBeInTheDocument();
      expect(screen.getByText("Corrupted Hunllef")).toBeInTheDocument();
    });
  });

  it("calls onSelectEntry with the chosen entry when clicked", async () => {
    const onSelectEntryMock = vi.fn();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            query: {
              categorymembers: [{ title: "Enhanced Crystal Weapon Seed" }],
            },
          }),
      })
    );

    render(
      <TileEditor onSelectEntry={onSelectEntryMock} onCancel={() => {}} />
    );
    const input = screen.getByTestId("tile-editor-input");
    fireEvent.change(input, { target: { value: "Enhanced crystal w" } });

    await waitFor(() => {
      expect(
        screen.getByText("Enhanced Crystal Weapon Seed")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Enhanced Crystal Weapon Seed"));
    expect(onSelectEntryMock).toHaveBeenCalledWith(
      "Enhanced Crystal Weapon Seed"
    );
  });
});
