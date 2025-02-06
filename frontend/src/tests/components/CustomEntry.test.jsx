// frontend/src/tests/components/CustomEntry.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomEntry from "../../features/board/components/CustomEntry";

describe("CustomEntry", () => {
  it("renders an input for custom text", () => {
    render(<CustomEntry value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Enter custom text/i)
    ).toBeInTheDocument();
  });

  it("calls onChange when text is entered", () => {
    const onChangeMock = vi.fn();
    render(<CustomEntry value="" onChange={onChangeMock} />);
    const input = screen.getByPlaceholderText(/Enter custom text/i);
    fireEvent.change(input, { target: { value: "Mining" } });
    expect(onChangeMock).toHaveBeenCalledWith("Mining");
  });
});
