import { jest } from '@jest/globals';
import Recipe from '../src/models/Recipe.js';

describe('Recipe Model', () => {
  test('Recipe model should exist', () => {
    expect(Recipe).toBeDefined();
  });

  test('Recipe model should be a mongoose model', () => {
    expect(Recipe).toHaveProperty('collection');
  });

  test('Recipe schema should have userId field', () => {
    const schema = Recipe.schema;
    expect(schema.paths).toHaveProperty('userId');
  });

  test('Recipe schema should have name field', () => {
    const schema = Recipe.schema;
    expect(schema.paths).toHaveProperty('name');
  });

  test('Recipe schema should have ingredients field', () => {
    const schema = Recipe.schema;
    expect(schema.paths).toHaveProperty('ingredients');
  });

  test('Recipe should be instantiable with all fields', () => {
    const testRecipe = new Recipe({
      userId: 'user123',
      name: 'Pasta Carbonara',
      ingredients: ['pasta', 'eggs', 'bacon'],
      prepTime: '20 minutes',
      difficulty: 'easy'
    });

    expect(testRecipe).toBeDefined();
    expect(testRecipe.userId).toBe('user123');
    expect(testRecipe.name).toBe('Pasta Carbonara');
    expect(testRecipe.difficulty).toBe('easy');
  });

  test('Recipe should have default values for optional fields', () => {
    const testRecipe = new Recipe({
      userId: 'user123',
      name: 'Simple Dish'
    });

    expect(testRecipe.prepTime).toBe('');
    expect(testRecipe.cost).toBe(0);
    expect(testRecipe.difficulty).toBe('easy');
  });
});
