import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import UserFridge from '../src/models/UserFridge.js';

describe('UserFridge Model', () => {
  test('UserFridge model should exist', () => {
    expect(UserFridge).toBeDefined();
  });

  test('UserFridge model should be a mongoose model', () => {
    expect(UserFridge).toHaveProperty('collection');
  });

  test('UserFridge schema should have userId field', () => {
    const schema = UserFridge.schema;
    expect(schema.paths).toHaveProperty('userId');
  });

  test('UserFridge schema should have ingredients field', () => {
    const schema = UserFridge.schema;
    expect(schema.paths).toHaveProperty('ingredients');
  });

  test('UserFridge schema should have missingIngredients field', () => {
    const schema = UserFridge.schema;
    expect(schema.paths).toHaveProperty('missingIngredients');
  });

  test('UserFridge should be instantiable', () => {
    const userId = new mongoose.Types.ObjectId();
    const testFridge = new UserFridge({
      userId: userId,
      ingredients: [
        { name: 'apple', quantity: '2', unit: 'units' }
      ]
    });

    expect(testFridge).toBeDefined();
    expect(testFridge.userId).toEqual(userId);
  });

  test('UserFridge should have default values for arrays', () => {
    const userId = new mongoose.Types.ObjectId();
    const testFridge = new UserFridge({
      userId: userId
    });

    expect(testFridge.ingredients).toBeDefined();
    expect(testFridge.missingIngredients).toBeDefined();
  });
});
