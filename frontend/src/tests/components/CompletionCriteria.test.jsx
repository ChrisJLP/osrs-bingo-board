// frontend/src/tests/components/CompletionCriteria.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CompletionCriteria from "../../features/board/components/CompletionCriteria";

describe("CompletionCriteria", () => {
  it("renders target input, unit dropdown, and progress input", () => {
    render(
      <CompletionCriteria
        value={{ target: 0, unit: "drops", progress: 0 }}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/Target/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Progress/i)).toBeInTheDocument();
  });

  it("limits progress input to target", () => {
    let value = { target: 5, unit: "drops", progress: 0 };
    const onChangeMock = vi.fn((newVal) => {
      value = newVal;
    });
    render(<CompletionCriteria value={value} onChange={onChangeMock} />);
    const progressInput = screen.getByLabelText(/Progress/i);
    fireEvent.change(progressInput, { target: { value: "6" } });
    // input value should be capped at 5
    expect(progressInput.value).toBe("5");
  });

  it("calls onChange with updated values", () => {
    let value = { target: 0, unit: "drops", progress: 0 };
    const onChangeMock = vi.fn((newVal) => {
      value = newVal;
    });
    render(<CompletionCriteria value={value} onChange={onChangeMock} />);
    const targetInput = screen.getByLabelText(/Target/i);
    const unitSelect = screen.getByLabelText(/Unit/i);
    const progressInput = screen.getByLabelText(/Progress/i);
    fireEvent.change(targetInput, { target: { value: "10" } });
    fireEvent.change(unitSelect, { target: { value: "xp" } });
    fireEvent.change(progressInput, { target: { value: "3" } });
    expect(value).toEqual({ target: 10, unit: "xp", progress: 3 });
  });
});
