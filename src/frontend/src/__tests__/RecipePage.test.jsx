import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipePage from "../pages/RecipePage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

describe("AT 4.1: Create and Display Recipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Properly mock localStorage before each test
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
   * AT 4.1 Step 1-3: Navigate to Recipes section and click Add Recipe button
   */
  test("AT 4.1 Steps 1-3: should display Recipes page with Add Recipe button", async () => {
    recipeService.getRecipes.mockResolvedValue([]);

    render(<RecipePage />);

    // Verify page title is displayed
    expect(screen.getByText("My Recipes")).toBeInTheDocument();

    // Verify Add Recipe button is visible
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });
  });

  /**
   * AT 4.1 Step 4: Fill in all required fields (name, ingredients, prep time, steps, cost, difficulty, dietary tags)
   */
  test("AT 4.1 Step 4: should display form with all required fields", async () => {
    const user = userEvent.setup();
    recipeService.getRecipes.mockResolvedValue([]);

    render(<RecipePage />);

    // Wait for Add Recipe button
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });

    // Click to open form
    const addButton = screen.getByRole("button", { name: /\+ Add New Recipe/i });
    await user.click(addButton);

    // Verify all form fields are present by checking for labels
    await waitFor(() => {
      expect(screen.getByText(/^Name \*/)).toBeInTheDocument();
      expect(screen.getByText(/^Ingredients$/)).toBeInTheDocument();
      expect(screen.getByText(/^Preparation Time$/)).toBeInTheDocument();
      expect(screen.getByText(/^Preparation Steps$/)).toBeInTheDocument();
      expect(screen.getByText(/^Cost \(\$\)$/)).toBeInTheDocument();
      expect(screen.getByText(/^Difficulty$/)).toBeInTheDocument();
      expect(screen.getByText(/^Dietary Tags$/)).toBeInTheDocument();
    });

    // Verify input fields are present
    expect(screen.getByPlaceholderText("e.g. 30 minutes")).toBeInTheDocument();
  });

  /**
   * AT 4.1 Step 5: Submit the form
   * Expected Result 1: The recipe is successfully created
   */
  test("AT 4.1 Step 5 & Expected Result 1: should create recipe when form is submitted", async () => {
    const user = userEvent.setup();

    const createdRecipe = {
      _id: "recipe-123",
      userId: "test-user-123",
      name: "Pasta Carbonara",
      ingredients: ["Pasta", "Eggs", "Bacon"],
      prepTime: "30 minutes",
      steps: ["Boil pasta", "Fry bacon", "Mix ingredients"],
      cost: 12.5,
      difficulty: "medium",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([]);
    recipeService.createRecipe.mockResolvedValue(createdRecipe);

    render(<RecipePage />);

    // Wait for and click Add Recipe button
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /\+ Add New Recipe/i })
    );

    // Wait for form to appear and fill in fields
    await waitFor(() => {
      expect(screen.getByText("New Recipe")).toBeInTheDocument();
    });

    // Get input elements by their properties
    const inputs = screen.getAllByRole("textbox");
    const nameInput = inputs[0]; // First text input is the name field

    await user.type(nameInput, "Pasta Carbonara");

    const prepTimeInput = screen.getByPlaceholderText("e.g. 30 minutes");
    await user.type(prepTimeInput, "30 minutes");

    const costInput = screen.getByRole("spinbutton");
    await user.type(costInput, "12.50");

    const difficultySelect = screen.getByRole("combobox");
    fireEvent.change(difficultySelect, { target: { value: "medium" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Create Recipe/i });
    await user.click(submitButton);

    // Verify the API was called with correct data
    await waitFor(() => {
      expect(recipeService.createRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "test-user-123",
          name: "Pasta Carbonara",
          prepTime: "30 minutes",
          cost: 12.5,
          difficulty: "medium",
        })
      );
    });
  });

  /**
   * Expected Result 2: A confirmation message is displayed
   */
  test("Expected Result 2: should display confirmation message after recipe creation", async () => {
    const user = userEvent.setup();

    const createdRecipe = {
      _id: "recipe-456",
      userId: "test-user-123",
      name: "Simple Salad",
      ingredients: ["Lettuce", "Tomato"],
      prepTime: "10 minutes",
      steps: ["Chop vegetables", "Mix together"],
      cost: 5.0,
      difficulty: "easy",
      dietaryTags: ["Vegan"],
    };

    recipeService.getRecipes.mockResolvedValue([]);
    recipeService.createRecipe.mockResolvedValue(createdRecipe);

    render(<RecipePage />);

    // Open form
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /\+ Add New Recipe/i })
    );

    // Fill and submit form
    await waitFor(() => {
      expect(screen.getByText("New Recipe")).toBeInTheDocument();
    });

    const nameInput = screen.getAllByRole("textbox")[0];
    await user.type(nameInput, "Simple Salad");
    await user.click(
      screen.getByRole("button", { name: /Create Recipe/i })
    );

    // Verify confirmation message appears
    await waitFor(() => {
      expect(
        screen.getByText("Recipe created successfully!")
      ).toBeInTheDocument();
    });
  });

  /**
   * Expected Result 3: The new recipe appears immediately in the recipe list with correct details
   */
  test("Expected Result 3: should display recipe in list with correct details after creation", async () => {
    const user = userEvent.setup();

    const createdRecipe = {
      _id: "recipe-789",
      userId: "test-user-123",
      name: "Spaghetti Bolognese",
      ingredients: ["Spaghetti", "Ground beef"],
      prepTime: "45 minutes",
      steps: ["Cook pasta", "Brown meat"],
      cost: 15.75,
      difficulty: "easy",
      dietaryTags: ["High-Protein"],
    };

    recipeService.getRecipes.mockResolvedValue([]);
    recipeService.createRecipe.mockResolvedValue(createdRecipe);

    render(<RecipePage />);

    // Open and fill form
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /\+ Add New Recipe/i })
    );

    await waitFor(() => {
      expect(screen.getByText("New Recipe")).toBeInTheDocument();
    });

    const nameInput = screen.getAllByRole("textbox")[0];
    await user.type(nameInput, "Spaghetti Bolognese");

    const prepTimeInput = screen.getByPlaceholderText("e.g. 30 minutes");
    await user.type(prepTimeInput, "45 minutes");

    const costInput = screen.getByRole("spinbutton");
    await user.type(costInput, "15.75");

    // Check the dietary tag checkbox
    const highProteinCheckbox = screen.getByRole("checkbox", {
      name: /High-Protein/i,
    });
    await user.click(highProteinCheckbox);

    // Submit
    await user.click(
      screen.getByRole("button", { name: /Create Recipe/i })
    );

    // Verify recipe appears in list with all details
    await waitFor(() => {
      expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();
      expect(screen.getByText(/45 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/\$15.75/)).toBeInTheDocument();
      expect(screen.getByText(/easy/)).toBeInTheDocument();
      expect(screen.getByText("High-Protein")).toBeInTheDocument();
    });
  });

  /**
   * Additional test: Form should close after successful submission
   */
  test("should close form after successful recipe submission", async () => {
    const user = userEvent.setup();

    const createdRecipe = {
      _id: "recipe-111",
      userId: "test-user-123",
      name: "Test Recipe",
      ingredients: [],
      prepTime: "",
      steps: [],
      cost: 0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([]);
    recipeService.createRecipe.mockResolvedValue(createdRecipe);

    render(<RecipePage />);

    // Open form
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /\+ Add New Recipe/i })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /\+ Add New Recipe/i })
    );

    await waitFor(() => {
      expect(screen.getByText("New Recipe")).toBeInTheDocument();
    });

    // Submit form
    const nameInput = screen.getAllByRole("textbox")[0];
    await user.type(nameInput, "Test Recipe");
    await user.click(
      screen.getByRole("button", { name: /Create Recipe/i })
    );

    // Verify form is closed
    await waitFor(() => {
      expect(screen.queryByText("New Recipe")).not.toBeInTheDocument();
    });
  });
});
