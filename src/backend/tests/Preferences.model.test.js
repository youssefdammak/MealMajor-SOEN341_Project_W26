import { jest } from '@jest/globals';
import Preference from '../src/models/Preferences.js';

describe('Preference Model', () => {
  test('Preference model should exist', () => {
    expect(Preference).toBeDefined();
  });

  test('Preference model should be a mongoose model', () => {
    expect(Preference).toHaveProperty('collection');
  });

  test('Preference schema should have userId field', () => {
    const schema = Preference.schema;
    expect(schema.paths).toHaveProperty('userId');
  });

  test('Preference schema should have dietaryRestrictions field', () => {
    const schema = Preference.schema;
    expect(schema.paths).toHaveProperty('dietaryRestrictions');
  });

  test('Preference schema should have allergies field', () => {
    const schema = Preference.schema;
    expect(schema.paths).toHaveProperty('allergies');
  });

  test('Preference should be instantiable with all fields', () => {
    const testPreference = new Preference({
      userId: 'user123',
      dietaryRestrictions: ['vegan', 'gluten-free'],
      allergies: ['peanuts', 'shellfish'],
      otherAllergy: 'tree nuts'
    });

    expect(testPreference).toBeDefined();
    expect(testPreference.userId).toBe('user123');
    expect(testPreference.dietaryRestrictions.length).toBe(2);
    expect(testPreference.allergies.length).toBe(2);
  });

  test('Preference should have default values', () => {
    const testPreference = new Preference({
      userId: 'user123'
    });

    expect(testPreference.dietaryRestrictions).toBeDefined();
    expect(testPreference.allergies).toBeDefined();
    expect(testPreference.otherAllergy).toBe('');
  });
});
