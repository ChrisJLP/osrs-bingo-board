import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Ensure cleanup runs after each test
afterEach(() => {
  cleanup();
});
