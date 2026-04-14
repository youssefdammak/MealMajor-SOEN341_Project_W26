import { jest } from '@jest/globals';
import { getMissingIngredients } from '../src/controllers/FridgeController.js';
import UserFridge from '../src/models/UserFridge.js';
import WeeklyMealPlan from '../src/models/WeeklyMealPlan.js';

const FRIDGE_INGREDIENTS = [
  { name: "eggs",   quantity: "6",   unit: "units"  },
  { name: "milk",   quantity: "1",   unit: "litres" },
  { name: "rice",   quantity: "500", unit: "grams"  },
];
const MISSING = ["flour", "butter", "chicken", "soy sauce"];

let mockReq;
let mockRes;

beforeEach(() => {
  jest.clearAllMocks();
  mockReq = { query: { userId: "user123" } };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AT 8.1 Backend", () => {

  // Steps 3–7: fridge has eggs/milk/rice, meals need flour/butter/chicken/soy sauce
  test("returns only missing ingredients when fridge has eggs/milk/rice", async () => {
    const mockPopulate = jest.fn().mockResolvedValue({
      userId: "user123",
      meals: [
        { day: "Monday",  mealType: "lunch",  recipeId: { ingredients: ["eggs", "flour", "butter"] } },
        { day: "Tuesday", mealType: "dinner", recipeId: { ingredients: ["rice", "chicken", "soy sauce"] } },
      ],
    });
    jest.spyOn(WeeklyMealPlan, "findOne").mockReturnValue({ populate: mockPopulate });

    const mockFridge = {
      userId: "user123",
      ingredients: FRIDGE_INGREDIENTS,
      missingIngredients: [],
      missingIngredientsUpdatedAt: null,
      save: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(UserFridge, "findOne").mockResolvedValue(mockFridge);

    await getMissingIngredients(mockReq, mockRes);

    const result = mockRes.json.mock.calls[0][0];
    expect(result.missingIngredients).toEqual(expect.arrayContaining(MISSING));
    FRIDGE_INGREDIENTS.forEach(({ name }) =>
      expect(result.missingIngredients).not.toContain(name)
    );
  });

  // Empty list case
  test("returns empty list when all meal ingredients are already in the fridge", async () => {
    const mockPopulate = jest.fn().mockResolvedValue({
      userId: "user123",
      meals: [
        { day: "Monday", mealType: "lunch", recipeId: { ingredients: ["eggs", "rice"] } },
      ],
    });
    jest.spyOn(WeeklyMealPlan, "findOne").mockReturnValue({ populate: mockPopulate });

    jest.spyOn(UserFridge, "findOne").mockResolvedValue({
      userId: "user123",
      ingredients: [
        { name: "eggs", quantity: "6",   unit: "units" },
        { name: "rice", quantity: "500", unit: "grams" },
      ],
      missingIngredients: [],
      missingIngredientsUpdatedAt: null,
      save: jest.fn().mockResolvedValue(true),
    });

    await getMissingIngredients(mockReq, mockRes);

    const result = mockRes.json.mock.calls[0][0];
    expect(result.missingIngredients).toHaveLength(0);
  });
});
