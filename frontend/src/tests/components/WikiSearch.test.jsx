// frontend/src/tests/components/WikiSearch.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WikiSearch from "../../features/board/components/WikiSearch";

describe("WikiSearch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders a search input", () => {
    render(<WikiSearch onSelect={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Search OSRS Wiki/i)
    ).toBeInTheDocument();
  });

  it("fetches and displays filtered results", async () => {
    const fakeData = {
      query: {
        categorymembers: [
          { title: "Test Entry One" },
          { title: "Test Entry Two" },
        ],
      },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData),
      })
    );
    render(<WikiSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Search OSRS Wiki/i);
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(screen.getByText(/Test Entry One/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Entry Two/i)).toBeInTheDocument();
    });
  });

  it("calls onSelect when an entry is clicked", async () => {
    const fakeData = {
      query: {
        categorymembers: [
          { title: "Test Entry One" },
          { title: "Test Entry Two" },
        ],
      },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData),
      })
    );
    const onSelectMock = vi.fn();
    render(<WikiSearch onSelect={onSelectMock} />);
    const input = screen.getByPlaceholderText(/Search OSRS Wiki/i);
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(screen.getByText(/Test Entry One/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Test Entry One/i));
    expect(onSelectMock).toHaveBeenCalledWith("Test Entry One");
  });
});
