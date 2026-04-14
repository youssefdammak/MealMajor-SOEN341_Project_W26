import { jest } from '@jest/globals';
import User from '../src/models/User.js';

describe('User Model', () => {
  test('User model should exist', () => {
    expect(User).toBeDefined();
  });

  test('User model should be a mongoose model', () => {
    expect(User).toHaveProperty('collection');
  });

  test('User schema should have email field', () => {
    const schema = User.schema;
    expect(schema.paths).toHaveProperty('email');
  });

  test('User schema should have password field', () => {
    const schema = User.schema;
    expect(schema.paths).toHaveProperty('password');
  });

  test('User schema should have userName field', () => {
    const schema = User.schema;
    expect(schema.paths).toHaveProperty('userName');
  });

  test('User should be instantiable', () => {
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      userName: 'testuser'
    });

    expect(testUser).toBeDefined();
    expect(testUser.email).toBe('test@example.com');
    expect(testUser.userName).toBe('testuser');
  });
});
