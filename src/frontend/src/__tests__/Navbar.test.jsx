import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as authService from "../services/authService";

jest.mock("../services/authService");

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("should display Home and Login buttons when not logged in", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("should display all navigation buttons when logged in", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Recipes/i)).toBeInTheDocument();
    expect(screen.getByText(/Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Fridge/i)).toBeInTheDocument();
    expect(screen.getByText(/Grocery/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("should display MealMajor title", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("MealMajor")).toBeInTheDocument();
  });

  test("should call logout function when Logout button is clicked", () => {
    localStorage.setItem("token", "test-token");
    authService.logout.mockImplementation(() => {
      localStorage.removeItem("token");
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(authService.logout).toHaveBeenCalled();
  });

  test("should have correct links for navigation when logged out", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getAllByText(/Home/i)[0].closest("a");
    const loginLink = screen.getByText(/Login/i).closest("a");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(loginLink).toHaveAttribute("href", "/auth");
  });

  test("should have correct links for navigation when logged in", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Recipes/i).closest("a")).toHaveAttribute(
      "href",
      "/recipes"
    );
    expect(screen.getByText(/Planner/i).closest("a")).toHaveAttribute(
      "href",
      "/planner"
    );
    expect(screen.getByText(/Fridge/i).closest("a")).toHaveAttribute(
      "href",
      "/fridge"
    );
  });
});
