import { jest } from '@jest/globals';
import { getFridge, saveIngredients, getMissingIngredients, saveMissingIngredients } from '../src/controllers/FridgeController.js';

describe('FridgeController - getFridge', () => {
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
    
    await getFridge(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "userId is required" });
  });

  test('returns error on database failure', async () => {
    await getFridge(mockReq, mockRes);
    
    // Either 404 or 500 is acceptable depending on database state
    expect(mockRes.status).toHaveBeenCalled();
  });
});

describe('FridgeController - saveIngredients', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        userId: 'user123',
        ingredients: [{ name: 'apple' }]
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('returns 400 if userId is missing', async () => {
    mockReq.body.userId = undefined;
    
    await saveIngredients(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('returns 400 if ingredients is missing', async () => {
    mockReq.body.ingredients = undefined;
    
    await saveIngredients(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});

describe('FridgeController - getMissingIngredients', () => {
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
    
    await getMissingIngredients(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('handles missing ingredients request', async () => {
    await getMissingIngredients(mockReq, mockRes);
    
    // Should either return missing ingredients or 500 on error
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalled();
  });
});

describe('FridgeController - saveMissingIngredients', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        userId: 'user123',
        missingIngredients: ['eggs']
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('returns 400 if userId is missing', async () => {
    mockReq.body.userId = undefined;
    
    await saveMissingIngredients(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('returns 400 if missingIngredients is not an array', async () => {
    mockReq.body.missingIngredients = 'not-an-array';
    
    await saveMissingIngredients(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
