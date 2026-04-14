import { jest } from '@jest/globals';
import { getGroceryPrices } from '../src/controllers/GroceryPriceController.js';

describe('GroceryPriceController - getGroceryPrices', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        ingredients: ['apple', 'milk', 'bread']
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
    jest.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  test('returns 400 if ingredients array is empty', async () => {
    mockReq.body.ingredients = [];
    
    await getGroceryPrices(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "ingredients array is required" });
  });

  test('returns 400 if ingredients is not an array', async () => {
    mockReq.body.ingredients = 'apple';
    
    await getGroceryPrices(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "ingredients array is required" });
  });

  test('returns 400 if ingredients is missing', async () => {
    mockReq.body.ingredients = undefined;
    
    await getGroceryPrices(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "ingredients array is required" });
  });

  test('returns 500 if GEMINI_API_KEY is not configured', async () => {
    process.env.GEMINI_API_KEY = '';
    
    await getGroceryPrices(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "AI service not configured" });
  });

  test('sets up Server-Sent Events headers on success', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    await getGroceryPrices(mockReq, mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
    expect(mockRes.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
    expect(mockRes.setHeader).toHaveBeenCalledWith("Connection", "keep-alive");
    expect(mockRes.flushHeaders).toHaveBeenCalled();
  });
});
