const { modifyit } = require('../index');

describe('modifyit', () => {
  const testObject = {
    name: 'John Doe',
    age: 30,
    role: 'developer',
    email: 'john@example.com',
    city: 'New York'
  };

  describe('basic functionality', () => {
    test('should modify specified properties', () => {
      const result = modifyit(testObject, {
        name: 'Jane Doe',
        age: 25
      });
      expect(result).toEqual({
        name: 'Jane Doe',
        age: 25,
        role: 'developer',
        email: 'john@example.com',
        city: 'New York'
      });
    });

    test('should add new properties', () => {
      const result = modifyit(testObject, {
        country: 'USA',
        department: 'Engineering'
      });
      expect(result).toEqual({
        name: 'John Doe',
        age: 30,
        role: 'developer',
        email: 'john@example.com',
        city: 'New York',
        country: 'USA',
        department: 'Engineering'
      });
    });

    test('should not modify original object', () => {
      const original = { ...testObject };
      modifyit(testObject, { name: 'Jane Doe' });
      expect(testObject).toEqual(original);
    });

    test('should handle empty modifications object', () => {
      const result = modifyit(testObject, {});
      expect(result).toEqual(testObject);
    });
  });

  describe('erase mode', () => {
    test('should remove specified keys with erase: true', () => {
      const result = modifyit(testObject, ['name', 'age'], { erase: true });
      expect(result).toEqual({
        role: 'developer',
        email: 'john@example.com',
        city: 'New York'
      });
    });

    test('should ignore non-existent keys in erase mode', () => {
      const result = modifyit(testObject, ['name', 'nonexistent'], { erase: true });
      expect(result).toEqual({
        age: 30,
        role: 'developer',
        email: 'john@example.com',
        city: 'New York'
      });
    });

    test('should handle empty array in erase mode', () => {
      const result = modifyit(testObject, [], { erase: true });
      expect(result).toEqual(testObject);
    });

    test('should erase all specified keys', () => {
      const result = modifyit(testObject, ['name', 'age', 'role'], { erase: true });
      expect(result).toEqual({
        email: 'john@example.com',
        city: 'New York'
      });
    });
  });

  describe('strict mode', () => {
    test('should throw error for adding new key with strict: true', () => {
      expect(() => {
        modifyit(testObject, { newKey: 'value' }, { strict: true });
      }).toThrow('Key "newKey" does not exist in the original object.');
    });

    test('should allow modifying existing keys with strict: true', () => {
      const result = modifyit(testObject, { name: 'Jane Doe' }, { strict: true });
      expect(result).toEqual({
        name: 'Jane Doe',
        age: 30,
        role: 'developer',
        email: 'john@example.com',
        city: 'New York'
      });
    });

    test('should allow adding new keys by default (strict: false)', () => {
      const result = modifyit(testObject, { newKey: 'value' });
      expect(result).toEqual({
        name: 'John Doe',
        age: 30,
        role: 'developer',
        email: 'john@example.com',
        city: 'New York',
        newKey: 'value'
      });
    });
  });

  describe('input validation', () => {
    test('should throw TypeError for null object', () => {
      expect(() => {
        modifyit(null, { name: 'John' });
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for undefined object', () => {
      expect(() => {
        modifyit(undefined, { name: 'John' });
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for non-object input', () => {
      expect(() => {
        modifyit('not an object', { name: 'John' });
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for invalid modifications in modify mode', () => {
      expect(() => {
        modifyit(testObject, 'not an object');
      }).toThrow('Modifications must be an object.');
    });

    test('should throw TypeError for non-array in erase mode', () => {
      expect(() => {
        modifyit(testObject, 'not an array', { erase: true });
      }).toThrow('Keys to erase must be an array.');
    });

    test('should throw TypeError for non-string keys in erase mode', () => {
      expect(() => {
        modifyit(testObject, ['name', 123], { erase: true });
      }).toThrow('Keys to erase must be an array of strings.');
    });
  });

  describe('edge cases', () => {
    test('should work with empty object', () => {
      const result = modifyit({}, { name: 'John' });
      expect(result).toEqual({ name: 'John' });
    });

    test('should handle falsy values', () => {
      const result = modifyit(testObject, {
        zero: 0,
        empty: '',
        nullValue: null,
        undefinedValue: undefined,
        falseBool: false
      });
      expect(result.zero).toBe(0);
      expect(result.empty).toBe('');
      expect(result.nullValue).toBe(null);
      expect(result.undefinedValue).toBe(undefined);
      expect(result.falseBool).toBe(false);
    });

    test('should work with nested objects', () => {
      const nestedObj = {
        user: { name: 'John' },
        data: [1, 2, 3]
      };
      const result = modifyit(nestedObj, {
        user: { name: 'Jane', age: 25 },
        newField: 'value'
      });
      expect(result.user).toEqual({ name: 'Jane', age: 25 });
      expect(result.newField).toBe('value');
    });

    test('should handle complex modifications', () => {
      const result = modifyit(testObject, {
        name: 'Jane Smith',
        age: 28,
        skills: ['JavaScript', 'Node.js'],
        address: {
          street: '123 Main St',
          city: 'Boston'
        }
      });
      expect(result.name).toBe('Jane Smith');
      expect(result.age).toBe(28);
      expect(result.skills).toEqual(['JavaScript', 'Node.js']);
      expect(result.address).toEqual({
        street: '123 Main St',
        city: 'Boston'
      });
    });
  });
});
