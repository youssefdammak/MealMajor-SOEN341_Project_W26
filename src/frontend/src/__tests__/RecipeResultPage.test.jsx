import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeResultPage from "../pages/RecipeResultPage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

/**
 * AT 5.1: Search Recipes by Name or Ingredient
 * Verify that a user can search for recipes by name or ingredient and view matching results.
 */
describe("AT 5.1: Search Recipes by Name or Ingredient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === "userId") return "test-user-123";
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  /**
   * AT 5.1 Step 1-3: Search by recipe name and display results
   */
  test("AT 5.1 Steps 1-3: should search recipes by name and display matching results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta Carbonara",
        ingredients: ["Pasta", "Eggs", "Bacon"],
        prepTime: "30 minutes",
        steps: ["Boil pasta", "Fry bacon"],
        cost: 12.5,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Caesar Salad",
        ingredients: ["Lettuce", "Croutons", "Parmesan"],
        prepTime: "15 minutes",
        steps: ["Chop lettuce", "Mix ingredients"],
        cost: 8.0,
        difficulty: "easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Spaghetti Bolognese",
        ingredients: ["Spaghetti", "Ground beef", "Tomato sauce"],
        prepTime: "45 minutes",
        steps: ["Brown meat", "Add sauce"],
        cost: 15.75,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Verify all recipes are initially displayed
    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();

    // Get the search input and search for Pasta
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Pasta");

    // Verify only matching recipes are displayed
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(screen.queryByText("Caesar Salad")).not.toBeInTheDocument();
      expect(screen.queryByText("Spaghetti Bolognese")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Search by ingredient
   */
  test("AT 5.1: should search recipes by ingredient and display matching results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta Carbonara",
        ingredients: ["Pasta", "Eggs", "Bacon"],
        prepTime: "30 minutes",
        steps: ["Boil pasta", "Fry bacon"],
        cost: 12.5,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Caesar Salad",
        ingredients: ["Lettuce", "Croutons", "Parmesan", "Eggs"],
        prepTime: "15 minutes",
        steps: ["Chop lettuce", "Mix ingredients"],
        cost: 8.0,
        difficulty: "easy",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Spaghetti Bolognese",
        ingredients: ["Spaghetti", "Ground beef", "Tomato sauce"],
        prepTime: "45 minutes",
        steps: ["Brown meat", "Add sauce"],
        cost: 15.75,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    });

    // Search for recipes with Eggs ingredient
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Eggs");

    // Verify recipes with Eggs ingredient are displayed
    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
      expect(screen.queryByText("Spaghetti Bolognese")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result 1: The system returns a list of recipes matching the search term
   */
  test("Expected Result 1: should return recipes matching the search term", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Chicken Stir Fry",
        ingredients: ["Chicken", "Bell Peppers", "Soy Sauce"],
        prepTime: "20 minutes",
        steps: ["Cut chicken", "Stir fry"],
        cost: 10.0,
        difficulty: "easy",
        dietaryTags: ["High-Protein"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Vegetable Stir Fry",
        ingredients: ["Broccoli", "Carrots", "Bell Peppers"],
        prepTime: "20 minutes",
        steps: ["Cut vegetables", "Stir fry"],
        cost: 7.5,
        difficulty: "easy",
        dietaryTags: ["Vegan"],
      },
      {
        _id: "3",
        userId: "test-user-123",
        name: "Fish Tacos",
        ingredients: ["Fish", "Tortillas", "Cabbage"],
        prepTime: "30 minutes",
        steps: ["Cook fish", "Assemble tacos"],
        cost: 14.0,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
    });

    // Search for "Stir Fry"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Stir Fry");

    // Verify matching recipes are returned
    await waitFor(() => {
      expect(screen.getByText("Chicken Stir Fry")).toBeInTheDocument();
      expect(screen.getByText("Vegetable Stir Fry")).toBeInTheDocument();
      expect(screen.queryByText("Fish Tacos")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result 2: Search results are displayed clearly in the recipe list
   */
  test("Expected Result 2: should display search results clearly in the recipe list", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Chocolate Cake",
        ingredients: ["Flour", "Cocoa", "Eggs", "Sugar"],
        prepTime: "60 minutes",
        steps: ["Mix ingredients", "Bake"],
        cost: 9.99,
        difficulty: "medium",
        dietaryTags: [],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Vanilla Cake",
        ingredients: ["Flour", "Vanilla", "Eggs", "Sugar"],
        prepTime: "50 minutes",
        steps: ["Mix ingredients", "Bake"],
        cost: 8.99,
        difficulty: "medium",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // Search for "Chocolate"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Chocolate");

    // Verify results are displayed in the recipe list/grid
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.queryByText("Vanilla Cake")).not.toBeInTheDocument();
    });

    // Verify the recipe card is visible in the results
    const recipeCards = screen.getAllByText("Chocolate Cake");
    expect(recipeCards.length).toBeGreaterThan(0);
  });

  /**
   * Expected Result 3: Each result shows relevant recipe information (e.g., name)
   */
  test("Expected Result 3: should display relevant recipe information in search results", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Grilled Salmon",
        ingredients: ["Salmon", "Lemon", "Olive Oil"],
        prepTime: "25 minutes",
        steps: ["Season fish", "Grill"],
        cost: 18.5,
        difficulty: "medium",
        dietaryTags: ["High-Protein", "Gluten-Free"],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Grilled Salmon")).toBeInTheDocument();
    });

    // Search for "Salmon"
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Salmon");

    // Verify recipe information is displayed
    await waitFor(() => {
      expect(screen.getByText("Grilled Salmon")).toBeInTheDocument();
      expect(screen.getByText(/25 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/18.5/)).toBeInTheDocument();
      expect(screen.getByText(/medium/)).toBeInTheDocument();
      expect(screen.getByText(/High-Protein/)).toBeInTheDocument();
      expect(screen.getByText(/Gluten-Free/)).toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: No results found
   */
  test("AT 5.1: should display message when no recipes match the search", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pasta",
        ingredients: ["Pasta", "Tomato"],
        prepTime: "30 minutes",
        steps: ["Boil pasta"],
        cost: 5.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Pasta")).toBeInTheDocument();
    });

    // Search for something that doesn't match
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "NonExistentRecipe");

    // Verify no results message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/no recipes found/i)
      ).toBeInTheDocument();
      expect(screen.queryByText("Pasta")).not.toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Clear search to show all recipes
   */
  test("AT 5.1: should show all recipes when search is cleared", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Pizza",
        ingredients: ["Dough", "Tomato", "Cheese"],
        prepTime: "40 minutes",
        steps: ["Make dough", "Add toppings", "Bake"],
        cost: 12.0,
        difficulty: "medium",
        dietaryTags: ["Vegetarian"],
      },
      {
        _id: "2",
        userId: "test-user-123",
        name: "Burger",
        ingredients: ["Beef", "Bun", "Lettuce"],
        prepTime: "15 minutes",
        steps: ["Cook beef", "Assemble"],
        cost: 10.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    // Search for Pizza
    const searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "Pizza");

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.queryByText("Burger")).not.toBeInTheDocument();
    });

    // Clear the search
    await user.clear(searchInput);

    // Verify all recipes are shown again
    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });

  /**
   * AT 5.1: Case-insensitive search
   */
  test("AT 5.1: should perform case-insensitive search", async () => {
    const user = userEvent.setup();

    const mockRecipes = [
      {
        _id: "1",
        userId: "test-user-123",
        name: "Beef Tacos",
        ingredients: ["Beef", "Tortillas"],
        prepTime: "20 minutes",
        steps: ["Cook beef"],
        cost: 11.0,
        difficulty: "easy",
        dietaryTags: [],
      },
    ];

    recipeService.getRecipes.mockResolvedValue(mockRecipes);

    render(<RecipeResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });

    // Search with lowercase
    let searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "beef");

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });

    // Clear and search with uppercase
    await user.clear(searchInput);
    searchInput = screen.getByPlaceholderText(/search by name or ingredient/i);
    await user.type(searchInput, "BEEF");

    await waitFor(() => {
      expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
    });
  });
});
