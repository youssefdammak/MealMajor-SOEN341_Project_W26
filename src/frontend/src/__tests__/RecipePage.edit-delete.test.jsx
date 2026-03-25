import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipePage from "../pages/RecipePage";
import * as recipeService from "../services/recipeService";

// Mock the recipe service
jest.mock("../services/recipeService");

describe("AT 4.2: Edit and Delete Recipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage with userId BEFORE any component renders
    const store = { userId: "test-user-123" };
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          Object.keys(store).forEach((key) => delete store[key]);
          store.userId = "test-user-123";
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  /**
   * AT 4.2 Step 1-3: Navigate to Recipes and select existing recipe
   */
  test("AT 4.2 Steps 1-3: should display recipes in list with Edit and Delete buttons", async () => {
    const existingRecipe = {
      _id: "recipe-existing",
      userId: "test-user-123",
      name: "Existing Pasta",
      ingredients: ["Pasta", "Tomato"],
      prepTime: "30 minutes",
      steps: ["Cook pasta", "Add sauce"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: ["Vegan"],
    };

    recipeService.getRecipes.mockResolvedValue([existingRecipe]);

    render(<RecipePage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText("My Recipes")).toBeInTheDocument();
    });

    // Verify existing recipe is displayed
    await waitFor(() => {
      expect(screen.getByText("Existing Pasta")).toBeInTheDocument();
      expect(screen.getByText(/30 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/\$10/)).toBeInTheDocument();
    });

    // Verify Edit and Delete buttons are present
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    const deleteButtons = screen.queryAllByRole("button", { name: /Delete/i });

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  /**
   * AT 4.2 Step 4-5: Edit recipe and modify fields, then save changes
   */
  test("AT 4.2 Steps 4-5: should edit recipe and save changes", async () => {
    const user = userEvent.setup();

    const originalRecipe = {
      _id: "recipe-edit-test",
      userId: "test-user-123",
      name: "Original Recipe",
      ingredients: ["Ingredient 1"],
      prepTime: "20 minutes",
      steps: ["Step 1"],
      cost: 5.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    const updatedRecipe = {
      _id: "recipe-edit-test",
      userId: "test-user-123",
      name: "Updated Recipe Name",
      ingredients: ["New Ingredient 1", "New Ingredient 2"],
      prepTime: "40 minutes",
      steps: ["New Step 1"],
      cost: 15.5,
      difficulty: "hard",
      dietaryTags: ["High-Protein"],
    };

    recipeService.getRecipes.mockResolvedValue([originalRecipe]);
    recipeService.updateRecipe.mockResolvedValue(updatedRecipe);

    render(<RecipePage />);

    // Wait for page to load and recipe to display
    await waitFor(() => {
      expect(screen.getByText("Original Recipe")).toBeInTheDocument();
    });

    // Click Edit button
    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    // Wait for form to appear with "Edit Recipe" title
    await waitFor(() => {
      expect(screen.getByText("Edit Recipe")).toBeInTheDocument();
    });

    // Verify form is pre-populated with original values
    const textInputs = screen.getAllByRole("textbox");
    expect(textInputs[0]).toHaveValue("Original Recipe");

    // Modify recipe fields
    const nameInput = textInputs[0];
    fireEvent.change(nameInput, { target: { value: "Updated Recipe Name" } });

    const prepTimeInput = screen.getByPlaceholderText("e.g. 30 minutes");
    fireEvent.change(prepTimeInput, { target: { value: "40 minutes" } });

    const costInput = screen.getByRole("spinbutton");
    fireEvent.change(costInput, { target: { value: "15.50" } });

    // Change difficulty
    const difficultySelect = screen.getByRole("combobox");
    fireEvent.change(difficultySelect, { target: { value: "hard" } });

    // Save changes
    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveButton);

    // Verify updateRecipe was called with correct data
    await waitFor(() => {
      expect(recipeService.updateRecipe).toHaveBeenCalled();
    });

    expect(recipeService.updateRecipe).toHaveBeenCalledWith(
      "recipe-edit-test",
      expect.objectContaining({
        userId: "test-user-123",
        name: "Updated Recipe Name",
        prepTime: "40 minutes",
        cost: 15.5,
        difficulty: "hard",
      })
    );
  });

  /**
   * Expected Result 1 & 2: Recipe is updated and changes reflected in list
   */
  test("Expected Result 1 & 2: should display updated recipe in list after editing", async () => {
    const user = userEvent.setup();

    const originalRecipe = {
      _id: "recipe-123",
      userId: "test-user-123",
      name: "Original Name",
      ingredients: ["Ingredient 1"],
      prepTime: "30 minutes",
      steps: ["Step 1"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    const updatedRecipe = {
      _id: "recipe-123",
      userId: "test-user-123",
      name: "New Name",
      ingredients: ["New Ingredient"],
      prepTime: "45 minutes",
      steps: ["New Step"],
      cost: 20.0,
      difficulty: "medium",
      dietaryTags: ["Vegan"],
    };

    recipeService.getRecipes.mockResolvedValue([originalRecipe]);
    recipeService.updateRecipe.mockResolvedValue(updatedRecipe);

    render(<RecipePage />);

    // Verify original recipe is displayed
    await waitFor(() => {
      expect(screen.getByText("Original Name")).toBeInTheDocument();
      expect(screen.getByText(/30 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/\$10/)).toBeInTheDocument();
    });

    // Click Edit
    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Recipe")).toBeInTheDocument();
    });

    // Modify and save
    const textInputs = screen.getAllByRole("textbox");
    const nameInput = textInputs[0];
    fireEvent.change(nameInput, { target: { value: "New Name" } });

    const prepTimeInput = screen.getByPlaceholderText("e.g. 30 minutes");
    fireEvent.change(prepTimeInput, { target: { value: "45 minutes" } });

    const costInput = screen.getByRole("spinbutton");
    fireEvent.change(costInput, { target: { value: "20.00" } });

    const difficultySelect = screen.getByRole("combobox");
    fireEvent.change(difficultySelect, { target: { value: "medium" } });

    const veganCheckbox = screen.getByRole("checkbox", { name: /Vegan/i });
    await user.click(veganCheckbox);

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveButton);

    // Verify updated recipe appears in the list
    await waitFor(() => {
      expect(screen.getByText("New Name")).toBeInTheDocument();
      expect(screen.getByText(/45 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/\$20/)).toBeInTheDocument();
      expect(screen.getByText("Vegan")).toBeInTheDocument();
    });
  });

  /**
   * Expected Result 3: Confirmation message is displayed after editing
   */
  test("Expected Result 3: should display confirmation message after editing recipe", async () => {
    const user = userEvent.setup();

    const originalRecipe = {
      _id: "recipe-456",
      userId: "test-user-123",
      name: "Test Recipe",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    const updatedRecipe = {
      _id: "recipe-456",
      userId: "test-user-123",
      name: "Test Recipe Modified",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([originalRecipe]);
    recipeService.updateRecipe.mockResolvedValue(updatedRecipe);

    render(<RecipePage />);

    // Open recipe page and edit
    await waitFor(() => {
      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Recipe")).toBeInTheDocument();
    });

    // Make a small change and save
    const textInputs = screen.getAllByRole("textbox");
    const nameInput = textInputs[0];
    fireEvent.change(nameInput, { target: { value: "Test Recipe Modified" } });

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveButton);

    // Verify confirmation message appears (may disappear after 3 seconds)
    await waitFor(() => {
      expect(
        screen.queryByText("Recipe updated successfully!")
      ).toBeInTheDocument();
    });
  });

  /**
   * AT 4.2 Step 7-8: Delete recipe and confirm deletion
   */
  test("AT 4.2 Steps 7-8: should delete recipe after confirmation", async () => {
    const user = userEvent.setup();

    const recipeToDelete = {
      _id: "recipe-delete-test",
      userId: "test-user-123",
      name: "Recipe to Delete",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([recipeToDelete]);
    recipeService.deleteRecipe.mockResolvedValue({});

    render(<RecipePage />);

    // Wait for recipe to display
    await waitFor(() => {
      expect(screen.getByText("Recipe to Delete")).toBeInTheDocument();
    });

    // Get the recipe card and find its Delete button
    const recipeCard = screen.getByText("Recipe to Delete").closest(
      ".recipe-card"
    );
    const deleteButtonInCard = within(recipeCard).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButtonInCard);

    // Wait for confirmation dialog
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this recipe?")
      ).toBeInTheDocument();
    });

    // Find and click the Delete button in the dialog
    const dialog = screen.getByText(
      "Are you sure you want to delete this recipe?"
    ).closest("div");
    const deleteButtonInDialog = within(dialog).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButtonInDialog);

    // Verify deleteRecipe was called
    await waitFor(() => {
      expect(recipeService.deleteRecipe).toHaveBeenCalledWith(
        "recipe-delete-test"
      );
    });
  });

  /**
   * Expected Result 4 & 5: Recipe is deleted and removed from list
   */
  test("Expected Result 4 & 5: should remove recipe from list after deletion", async () => {
    const user = userEvent.setup();

    const recipeToDelete = {
      _id: "recipe-delete-789",
      userId: "test-user-123",
      name: "Deletable Recipe",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([recipeToDelete]);
    recipeService.deleteRecipe.mockResolvedValue({});

    render(<RecipePage />);

    // Verify recipe is in list
    await waitFor(() => {
      expect(screen.getByText("Deletable Recipe")).toBeInTheDocument();
    });

    // Click Delete button on the recipe card
    const recipeCard = screen.getByText("Deletable Recipe").closest(
      ".recipe-card"
    );
    const deleteButton = within(recipeCard).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButton);

    // Confirm deletion in dialog
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this recipe?")
      ).toBeInTheDocument();
    });

    const dialog = screen.getByText(
      "Are you sure you want to delete this recipe?"
    ).closest("div");
    const deleteButtonInDialog = within(dialog).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButtonInDialog);

    // Verify recipe is removed from list
    await waitFor(() => {
      expect(screen.queryByText("Deletable Recipe")).not.toBeInTheDocument();
    });
  });

  /**
   * Expected Result 6: Confirmation message is displayed after deletion
   */
  test("Expected Result 6: should display confirmation message after deleting recipe", async () => {
    const user = userEvent.setup();

    const recipeToDelete = {
      _id: "recipe-delete-confirm",
      userId: "test-user-123",
      name: "Recipe for Deletion",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([recipeToDelete]);
    recipeService.deleteRecipe.mockResolvedValue({});

    render(<RecipePage />);

    // Wait and delete recipe
    await waitFor(() => {
      expect(screen.getByText("Recipe for Deletion")).toBeInTheDocument();
    });

    const recipeCard = screen.getByText("Recipe for Deletion").closest(
      ".recipe-card"
    );
    const deleteButton = within(recipeCard).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButton);

    // Find and click confirmation button
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this recipe?")
      ).toBeInTheDocument();
    });

    const dialog = screen.getByText(
      "Are you sure you want to delete this recipe?"
    ).closest("div");
    const deleteButtonInDialog = within(dialog).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButtonInDialog);

    // Verify deletion confirmation message
    await waitFor(() => {
      expect(
        screen.queryByText("Recipe deleted successfully!")
      ).toBeInTheDocument();
    });
  });

  /**
   * Additional Test: Cancel edit without saving changes
   */
  test("should cancel edit and not save changes", async () => {
    const user = userEvent.setup();

    const originalRecipe = {
      _id: "recipe-cancel-test",
      userId: "test-user-123",
      name: "Original Name",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([originalRecipe]);

    render(<RecipePage />);

    // Open edit form
    await waitFor(() => {
      expect(screen.getByText("Original Name")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Recipe")).toBeInTheDocument();
    });

    // Modify fields but cancel
    const textInputs = screen.getAllByRole("textbox");
    const nameInput = textInputs[0];
    fireEvent.change(nameInput, { target: { value: "Modified Name" } });

    // Click Cancel button
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    // Verify form is closed and original name is still displayed
    await waitFor(() => {
      expect(screen.queryByText("Edit Recipe")).not.toBeInTheDocument();
      expect(screen.getByText("Original Name")).toBeInTheDocument();
    });

    // Verify update was NOT called
    expect(recipeService.updateRecipe).not.toHaveBeenCalled();
  });

  /**
   * Additional Test: Cancel delete confirmation
   */
  test("should cancel deletion when user clicks Cancel in confirmation dialog", async () => {
    const user = userEvent.setup();

    const recipeToKeep = {
      _id: "recipe-keep",
      userId: "test-user-123",
      name: "Recipe to Keep",
      ingredients: ["Ingredient"],
      prepTime: "30 minutes",
      steps: ["Step"],
      cost: 10.0,
      difficulty: "easy",
      dietaryTags: [],
    };

    recipeService.getRecipes.mockResolvedValue([recipeToKeep]);

    render(<RecipePage />);

    // Click Delete button
    await waitFor(() => {
      expect(screen.getByText("Recipe to Keep")).toBeInTheDocument();
    });

    const recipeCard = screen.getByText("Recipe to Keep").closest(
      ".recipe-card"
    );
    const deleteButton = within(recipeCard).getByRole("button", {
      name: /Delete/i,
    });
    await user.click(deleteButton);

    // Click Cancel in confirmation dialog
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this recipe?")
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    // Verify dialog is closed and recipe is still displayed
    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to delete this recipe?")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Recipe to Keep")).toBeInTheDocument();
    });

    // Verify delete was NOT called
    expect(recipeService.deleteRecipe).not.toHaveBeenCalled();
  });
});
