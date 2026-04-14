import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as fridgeService from "../services/fridgeService";
import * as groceryPriceService from "../services/groceryPriceService";
import FridgePage from "../pages/FridgePage";

const FRIDGE = [
  { name: "eggs",   quantity: "6",   unit: "units"  },
  { name: "milk",   quantity: "1",   unit: "litres" },
  { name: "rice",   quantity: "500", unit: "grams"  },
];
const MISSING = ["flour", "butter", "chicken", "soy sauce"];

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem("userId", "user123");
  jest.spyOn(fridgeService, "getFridge").mockResolvedValue({ ingredients: FRIDGE });
  jest.spyOn(fridgeService, "saveIngredients").mockResolvedValue({});
  jest.spyOn(fridgeService, "saveMissingIngredients").mockResolvedValue({});
  jest.spyOn(groceryPriceService, "streamGroceryPrices").mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("AT 8.1 Frontend", () => {

  // Steps 4–7: fridge has eggs/milk/rice → click Generate Missing Ingredients → missing items displayed
  test("generates and displays missing ingredients after clicking Generate Missing Ingredients", async () => {
    jest.spyOn(fridgeService, "getMissingIngredients").mockResolvedValue({
      missingIngredients: MISSING,
    });
    render(<FridgePage />);

    fireEvent.click(screen.getByRole("button", { name: /generate missing ingredients/i }));

    // Missing ingredients are displayed
    await waitFor(() => {
      MISSING.forEach((item) =>
        expect(screen.getByText(new RegExp(item, "i"))).toBeInTheDocument()
      );
    });

    // Fridge items are NOT in the missing list (exact name match)
    FRIDGE.forEach(({ name }) =>
      expect(screen.queryByText(new RegExp(`^${name}$`, "i"))).not.toBeInTheDocument()
    );
  });

  // No missing ingredients case
  test("shows 'fridge has everything' when fridge covers all meal ingredients", async () => {
    jest.spyOn(fridgeService, "getMissingIngredients").mockResolvedValue({ missingIngredients: [] });
    render(<FridgePage />);

    fireEvent.click(screen.getByRole("button", { name: /generate missing ingredients/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/your fridge has everything needed for your weekly meal plan/i)
      ).toBeInTheDocument()
    );
  });
});