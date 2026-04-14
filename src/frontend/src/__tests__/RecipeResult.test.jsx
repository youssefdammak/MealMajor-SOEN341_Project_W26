import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeResult from "../components/RecipeResult";

describe("RecipeResult", () => {
  test("should display message when no recipes are found", () => {
    render(<RecipeResult recipes={[]} />);

    expect(
      screen.getByText(/No recipes found :.*Try another search/i)
    ).toBeInTheDocument();
  });

  test("should display recipe cards when recipes are provided", () => {
    const recipes = [
      {
        id: 1,
        name: "Pasta Carbonara",
        prepTime: "20 minutes",
        cost: 5.5,
        difficulty: "easy",
      },
      {
        id: 2,
        name: "Margherita Pizza",
        prepTime: "30 minutes",
        cost: 8.0,
        difficulty: "medium",
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
  });

  test("should display recipe details in cards", () => {
    const recipes = [
      {
        id: 1,
        name: "Carbonara",
        prepTime: "20 minutes",
        cost: 5.5,
        difficulty: "easy",
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    expect(screen.getByText(/Prep Time/i)).toBeInTheDocument();
    expect(screen.getByText("20 minutes")).toBeInTheDocument();
    expect(screen.getByText(/Cost/i)).toBeInTheDocument();
    expect(screen.getByText("$5.5")).toBeInTheDocument();
    expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
  });

  test("should open recipe details modal when recipe card is clicked", () => {
    const recipes = [
      {
        id: 1,
        name: "Tacos",
        prepTime: "15 minutes",
        cost: 6.0,
        difficulty: "easy",
        ingredients: ["tortillas", "meat", "salsa"],
        dietaryTags: ["spicy"],
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Tacos").closest(".recipe-card");
    fireEvent.click(recipeCard);

    expect(screen.getAllByText("Tacos").length).toBeGreaterThan(1);
  });

  test("should close modal when X button is clicked", () => {
    const recipes = [
      {
        id: 1,
        name: "Burrito",
        prepTime: "10 minutes",
        cost: 7.0,
        difficulty: "easy",
        ingredients: ["flour tortilla", "beans", "rice"],
        dietaryTags: [],
      },
    ];

    const { container } = render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Burrito").closest(".recipe-card");
    fireEvent.click(recipeCard);

    const closeButton = screen.getByRole("button", { name: "x" });
    fireEvent.click(closeButton);

    expect(
      container.querySelector(".recipe-card-display")
    ).not.toBeInTheDocument();
  });

  test("should close modal when clicking outside recipe details", () => {
    const recipes = [
      {
        id: 1,
        name: "Sushi",
        prepTime: "30 minutes",
        cost: 12.0,
        difficulty: "hard",
        ingredients: ["rice", "nori", "fish"],
        dietaryTags: ["raw"],
      },
    ];

    const { container } = render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Sushi").closest(".recipe-card");
    fireEvent.click(recipeCard);

    const overlay = container.querySelector(".recipe-card-display");
    fireEvent.click(overlay);

    expect(
      container.querySelector(".recipe-card-display")
    ).not.toBeInTheDocument();
  });

  test("should display ingredients list in modal", () => {
    const recipes = [
      {
        id: 1,
        name: "Soup",
        prepTime: "45 minutes",
        cost: 4.0,
        difficulty: "medium",
        ingredients: ["water", "vegetables", "salt"],
        dietaryTags: ["vegetarian"],
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Soup").closest(".recipe-card");
    fireEvent.click(recipeCard);

    expect(screen.getByText(/Ingredients/i)).toBeInTheDocument();
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("vegetables")).toBeInTheDocument();
    expect(screen.getByText("salt")).toBeInTheDocument();
  });

  test("should handle recipes without ingredient arrays properly", () => {
    const recipes = [
      {
        id: 1,
        name: "Simple Dish",
        prepTime: "10 minutes",
        cost: 2.0,
        difficulty: "easy",
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Simple Dish").closest(".recipe-card");
    fireEvent.click(recipeCard);

    expect(screen.getAllByText(/None/i).length).toBeGreaterThan(0);
  });

  test("should handle preparationTime and prepTime fields from different APIs", () => {
    const recipes = [
      {
        id: 1,
        name: "Dish A",
        preparationTime: "25 minutes",
        cost: 5.0,
        difficulty: "easy",
      },
      {
        id: 2,
        name: "Dish B",
        prepTime: "30 minutes",
        cost: 6.0,
        difficulty: "easy",
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    expect(screen.getByText("25 minutes")).toBeInTheDocument();
    expect(screen.getByText("30 minutes")).toBeInTheDocument();
  });

  test("should display dietary tags in modal", () => {
    const recipes = [
      {
        id: 1,
        name: "Vegan Burger",
        prepTime: "15 minutes",
        cost: 8.0,
        difficulty: "easy",
        ingredients: ["patty", "bun", "vegetables"],
        dietaryTags: ["vegan", "gluten-free"],
      },
    ];

    render(<RecipeResult recipes={recipes} />);

    const recipeCard = screen.getByText("Vegan Burger").closest(".recipe-card");
    fireEvent.click(recipeCard);

    expect(screen.getByText(/vegan, gluten-free/)).toBeInTheDocument();
  });
});
