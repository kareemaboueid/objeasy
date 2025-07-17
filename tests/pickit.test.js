const { pickit } = require('../index');

describe('pickit', () => {
  const testObject = {
    name: 'John Doe',
    age: 30,
    role: 'developer',
    email: 'john@example.com',
    city: 'New York'
  };

  describe('basic functionality', () => {
    test('should pick specified keys from object', () => {
      const result = pickit(testObject, ['name', 'age']);
      expect(result).toEqual({
        name: 'John Doe',
        age: 30
      });
    });

    test('should return empty object when picking empty array', () => {
      const result = pickit(testObject, []);
      expect(result).toEqual({});
    });

    test('should pick single key', () => {
      const result = pickit(testObject, ['name']);
      expect(result).toEqual({
        name: 'John Doe'
      });
    });

    test('should pick all available keys', () => {
      const result = pickit(testObject, ['name', 'age', 'role', 'email', 'city']);
      expect(result).toEqual(testObject);
    });

    test('should not modify original object', () => {
      const original = { ...testObject };
      pickit(testObject, ['name', 'age']);
      expect(testObject).toEqual(original);
    });
  });

  describe('strict mode (default)', () => {
    test('should throw error for non-existent key by default', () => {
      expect(() => {
        pickit(testObject, ['name', 'nonexistent']);
      }).toThrow('Key "nonexistent" does not exist in the original object.');
    });

    test('should throw error for non-existent key with strict: true', () => {
      expect(() => {
        pickit(testObject, ['name', 'nonexistent'], { strict: true });
      }).toThrow('Key "nonexistent" does not exist in the original object.');
    });
  });

  describe('non-strict mode', () => {
    test('should ignore non-existent keys when strict is false', () => {
      const result = pickit(testObject, ['name', 'nonexistent'], { strict: false });
      expect(result).toEqual({
        name: 'John Doe'
      });
    });

    test('should handle all non-existent keys when strict is false', () => {
      const result = pickit(testObject, ['nonexistent1', 'nonexistent2'], { strict: false });
      expect(result).toEqual({});
    });
  });

  describe('input validation', () => {
    test('should throw TypeError for null object', () => {
      expect(() => {
        pickit(null, ['name']);
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for undefined object', () => {
      expect(() => {
        pickit(undefined, ['name']);
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for non-object input', () => {
      expect(() => {
        pickit('not an object', ['name']);
      }).toThrow('Original object must be a non-null object.');
    });

    test('should throw TypeError for non-array keys', () => {
      expect(() => {
        pickit(testObject, 'not an array');
      }).toThrow('Keys to pick must be an array.');
    });

    test('should throw TypeError for non-string keys in array', () => {
      expect(() => {
        pickit(testObject, ['name', 123]);
      }).toThrow('Keys to pick must be an array of strings.');
    });
  });

  describe('edge cases', () => {
    test('should work with empty object', () => {
      const result = pickit({}, [], { strict: false });
      expect(result).toEqual({});
    });

    test('should work with nested objects', () => {
      const nestedObj = {
        user: { name: 'John' },
        data: [1, 2, 3]
      };
      const result = pickit(nestedObj, ['user']);
      expect(result).toEqual({
        user: { name: 'John' }
      });
    });

    test('should handle falsy values', () => {
      const objWithFalsy = {
        zero: 0,
        empty: '',
        nullValue: null,
        undefinedValue: undefined,
        falseBool: false
      };
      const result = pickit(objWithFalsy, ['zero', 'empty', 'falseBool']);
      expect(result).toEqual({
        zero: 0,
        empty: '',
        falseBool: false
      });
    });
  });
});
