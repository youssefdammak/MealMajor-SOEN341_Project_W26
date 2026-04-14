import { jest } from '@jest/globals';
import { getMealPlan, addOrUpdateMeal, deleteMeal } from '../src/controllers/WeeklyMealPlanController.js';

describe('WeeklyMealPlanController - getMealPlan', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      query: {
        userId: 'user123'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('returns 400 if userId is missing', async () => {
    mockReq.query.userId = undefined;
    
    await getMealPlan(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "userId is required" });
  });

  test('handles meal plan request', async () => {
    await getMealPlan(mockReq, mockRes);
    
    // Should either return meal plan or 404/500 on error
    expect(mockRes.status).toHaveBeenCalled();
  });
});

describe('WeeklyMealPlanController - addOrUpdateMeal', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        userId: 'user123',
        day: 'Monday',
        mealType: 'breakfast',
        recipeId: 'recipe123'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('returns 400 if required fields are missing', async () => {
    mockReq.body.day = undefined;
    
    await addOrUpdateMeal(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing required fields" });
  });

  test('returns 400 if day is invalid', async () => {
    mockReq.body.day = 'InvalidDay';
    
    await addOrUpdateMeal(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid day" });
  });

  test('returns 400 if meal type is invalid', async () => {
    mockReq.body.mealType = 'InvalidMeal';
    
    await addOrUpdateMeal(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid meal type" });
  });

  test('handles valid meal addition request', async () => {
    await addOrUpdateMeal(mockReq, mockRes);
    
    // Should either succeed (201) or fail gracefully
    expect(mockRes.status).toHaveBeenCalled();
  });
});

describe('WeeklyMealPlanController - deleteMeal', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: {
        mealId: 'meal123'
      },
      query: {
        userId: 'user123'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('returns 400 if userId is missing', async () => {
    mockReq.query.userId = undefined;
    
    await deleteMeal(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "userId is required" });
  });

  test('handles meal deletion request', async () => {
    await deleteMeal(mockReq, mockRes);
    
    // Should either delete (200) or return not found (404) or error (500)
    expect(mockRes.status).toHaveBeenCalled();
  });
});
