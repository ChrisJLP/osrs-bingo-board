// frontend/src/tests/components/TileEditor.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TileEditor from "../../features/board/components/TileEditor";

describe("TileEditor", () => {
  let onSaveMock, onCancelMock;
  beforeEach(() => {
    onSaveMock = vi.fn();
    onCancelMock = vi.fn();
  });

  it("renders popup with Wiki Search, Custom Entry, CompletionCriteria, Save and Cancel buttons", () => {
    render(
      <TileEditor
        initialData={{ content: "", target: 0, unit: "drops", progress: 0 }}
        onSave={onSaveMock}
        onCancel={onCancelMock}
      />
    );
    expect(screen.getByText(/Wiki Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom Entry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(
      <TileEditor
        initialData={{ content: "Old", target: 10, unit: "drops", progress: 0 }}
        onSave={onSaveMock}
        onCancel={onCancelMock}
      />
    );
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCancelMock).toHaveBeenCalled();
  });

  it("saves changes and closes popup when Save button is clicked", () => {
    render(
      <TileEditor
        initialData={{ content: "Old", target: 10, unit: "drops", progress: 0 }}
        onSave={onSaveMock}
        onCancel={onCancelMock}
      />
    );
    // switch to custom mode and change text
    fireEvent.click(screen.getByText(/Custom Entry/i));
    const customInput = screen.getByPlaceholderText(/Enter custom text/i);
    fireEvent.change(customInput, { target: { value: "New Content" } });
    // update criteria
    const targetInput = screen.getByLabelText(/Target/i);
    fireEvent.change(targetInput, { target: { value: "5" } });
    const progressInput = screen.getByLabelText(/Progress/i);
    fireEvent.change(progressInput, { target: { value: "5" } });
    fireEvent.click(screen.getByText(/Save/i));
    expect(onSaveMock).toHaveBeenCalledWith({
      content: "New Content",
      target: 5,
      unit: "drops",
      progress: 5,
    });
  });

  it("shows unsaved changes warning when clicking outside", async () => {
    render(
      <TileEditor
        initialData={{ content: "Old", target: 10, unit: "drops", progress: 0 }}
        onSave={onSaveMock}
        onCancel={onCancelMock}
      />
    );
    fireEvent.click(screen.getByText(/Custom Entry/i));
    const customInput = screen.getByPlaceholderText(/Enter custom text/i);
    fireEvent.change(customInput, { target: { value: "Changed" } });
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Unsaved Changes/i)).toBeInTheDocument();
    });
    // "Go back" should close warning and keep popup open
    fireEvent.click(screen.getByText(/Go back/i));
    await waitFor(() => {
      expect(screen.queryByText(/Unsaved Changes/i)).not.toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Enter custom text/i)
      ).toBeInTheDocument();
    });
    // Trigger warning again then discard changes
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.getByText(/Unsaved Changes/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Discard changes/i));
    expect(onCancelMock).toHaveBeenCalled();
  });
});
