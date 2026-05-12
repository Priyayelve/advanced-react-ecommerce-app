import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test("renders ecommerce title", () => {
  render(<App />);
  
  const titleElement = screen.getByText(/Advanced React E-Commerce App/i);
  
  expect(titleElement).toBeTruthy();
});
test("renders app component", () => {
  render(<App />);
  
  const appElement = screen.getByText(/Advanced React E-Commerce App/i);
  
  expect(appElement).toBeTruthy();
});