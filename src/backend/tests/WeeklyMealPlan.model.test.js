import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import WeeklyMealPlan from '../src/models/WeeklyMealPlan.js';

describe('WeeklyMealPlan Model', () => {
  test('WeeklyMealPlan should exist', () => {
    expect(WeeklyMealPlan).toBeDefined();
  });

  test('WeeklyMealPlan should be a mongoose model', () => {
    expect(WeeklyMealPlan).toHaveProperty('collection');
  });

  test('WeeklyMealPlan schema should have userId field', async () => {
    const schema = WeeklyMealPlan.schema;
    expect(schema.paths).toHaveProperty('userId');
  });

  test('WeeklyMealPlan schema should have meals field', async () => {
    const schema = WeeklyMealPlan.schema;
    expect(schema.paths).toHaveProperty('meals');
  });

  test('WeeklyMealPlan should support creating instances', () => {
    const testData = {
      userId: new mongoose.Types.ObjectId(),
      meals: []
    };
    const instance = new WeeklyMealPlan(testData);
    expect(instance).toBeDefined();
  });
});
