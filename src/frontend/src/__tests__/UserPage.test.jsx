import React from "react";
import { render, screen } from "@testing-library/react";
import UserPage from "../pages/UserPage";

jest.mock("../components/PreferencesForm", () => {
  return function MockComponent() {
    return <div>Mock Preferences Form</div>;
  };
});

describe("UserPage", () => {
  test("should render user page", () => {
    render(<UserPage />);

    expect(screen.getByText(/Mock Preferences Form/i)).toBeInTheDocument();
  });

  test("should have User-Page class", () => {
    const { container } = render(<UserPage />);

    expect(container.querySelector(".User-Page")).toBeInTheDocument();
  });

  test("should render PreferencesForm component", () => {
    render(<UserPage />);

    expect(screen.getByText(/Mock Preferences Form/i)).toBeInTheDocument();
  });
});
