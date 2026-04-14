import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

describe("LandingPage", () => {
  test("should render welcome message", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to MealMajor!/i)).toBeInTheDocument();
  });

  test("should display tagline about tailored meal plans", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Create a meal plan that's tailor made for you!/i)
    ).toBeInTheDocument();
  });

  test("should display free meal management service message", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/meal management servive/i)).toBeInTheDocument();
    expect(screen.getByText(/FREE/i)).toBeInTheDocument();
  });

  test("should have Start Today button", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const startButton = screen.getByRole("button", { name: /Start Today/i });
    expect(startButton).toBeInTheDocument();
  });

  test("should link Start Today button to auth page", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const startButtonLink = screen.getByRole("link");
    expect(startButtonLink).toHaveAttribute("href", "/auth");
  });

  test("should have Landing-Page class", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(container.querySelector(".Landing-Page")).toBeInTheDocument();
  });

  test("should display all main heading elements", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const h2Elements = container.querySelectorAll("h2");
    const h4Elements = container.querySelectorAll("h4");

    expect(h2Elements.length).toBeGreaterThan(0);
    expect(h4Elements.length).toBeGreaterThan(0);
  });

  test("should have centered text styling", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const centerElements = container.querySelectorAll("[style*='center']");
    expect(centerElements.length).toBeGreaterThan(0);
  });
});
