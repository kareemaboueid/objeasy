const { omitit } = require('../index');

describe('omitit', () => {
  describe('basic functionality', () => {
    test('should omit specified keys from flat object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omitit(obj, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    test('should return object with all keys when omitting empty array', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitit(obj, []);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a copy
    });

    test('should not modify original object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };

      omitit(obj, ['b']);

      expect(obj).toEqual(original);
    });

    test('should handle non-existent keys gracefully', () => {
      const obj = { a: 1, b: 2 };
      const result = omitit(obj, ['c', 'a']);
      expect(result).toEqual({ b: 2 });
    });

    test('should handle omitting all keys', () => {
      const obj = { a: 1, b: 2 };
      const result = omitit(obj, ['a', 'b']);
      expect(result).toEqual({});
    });
  });

  describe('strict mode', () => {
    test('should throw error when key does not exist in strict mode', () => {
      const obj = { a: 1, b: 2 };

      expect(() => {
        omitit(obj, ['c'], { strict: true });
      }).toThrow('Key "c" does not exist in the object.');
    });

    test('should work normally when all keys exist in strict mode', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitit(obj, ['a', 'c'], { strict: true });
      expect(result).toEqual({ b: 2 });
    });
  });

  describe('deep mode', () => {
    test('should perform shallow omitting by default', () => {
      const obj = {
        a: 1,
        b: { x: 1, y: 2 },
        c: 3
      };
      const result = omitit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    test('should perform deep omitting with deep option', () => {
      const obj = {
        user: { name: 'John', age: 30, email: 'john@test.com' },
        settings: { theme: 'dark', lang: 'en' },
        meta: { created: '2024-01-01' }
      };
      const result = omitit(obj, ['age', 'theme'], { deep: true });
      expect(result).toEqual({
        user: { name: 'John', email: 'john@test.com' },
        settings: { lang: 'en' },
        meta: { created: '2024-01-01' }
      });
    });

    test('should handle dot notation for nested keys', () => {
      const obj = {
        user: {
          name: 'John',
          address: {
            city: 'Jeddah',
            country: 'SA'
          }
        },
        settings: { theme: 'dark' }
      };
      const result = omitit(obj, ['user.address.city'], { deep: true });
      expect(result).toEqual({
        user: {
          name: 'John',
          address: {
            country: 'SA'
          }
        },
        settings: { theme: 'dark' }
      });
    });

    test('should handle multiple dot notation keys', () => {
      const obj = {
        user: {
          name: 'John',
          contact: {
            email: 'john@test.com',
            phone: '123456'
          }
        },
        config: {
          ui: {
            theme: 'dark',
            lang: 'en'
          }
        }
      };
      const result = omitit(obj, ['user.contact.email', 'config.ui.theme'], { deep: true });
      expect(result).toEqual({
        user: {
          name: 'John',
          contact: {
            phone: '123456'
          }
        },
        config: {
          ui: {
            lang: 'en'
          }
        }
      });
    });

    test('should throw error for non-existent nested keys in strict mode', () => {
      const obj = {
        user: { name: 'John' }
      };

      expect(() => {
        omitit(obj, ['user.age'], { deep: true, strict: true });
      }).toThrow('Nested key "user.age" does not exist in the object.');
    });
  });

  describe('input validation', () => {
    test('should throw error for non-object input', () => {
      expect(() => omitit(null, ['a'])).toThrow('Original object must be a non-null object.');
      expect(() => omitit(undefined, ['a'])).toThrow('Original object must be a non-null object.');
      expect(() => omitit('string', ['a'])).toThrow('Original object must be a non-null object.');
    });

    test('should throw error for non-array keysToOmit', () => {
      const obj = { a: 1 };
      expect(() => omitit(obj, 'a')).toThrow('Keys to omit must be an array.');
      expect(() => omitit(obj, null)).toThrow('Keys to omit must be an array.');
    });
  });

  describe('edge cases', () => {
    test('should handle empty object', () => {
      const result = omitit({}, ['a', 'b']);
      expect(result).toEqual({});
    });

    test('should handle complex nested structures', () => {
      const obj = {
        data: {
          users: [{ id: 1, name: 'John' }],
          meta: {
            count: 1,
            page: 1
          }
        },
        config: {
          api: {
            timeout: 5000
          }
        }
      };
      const result = omitit(obj, ['data.meta.page', 'config.api'], { deep: true });
      expect(result).toEqual({
        data: {
          users: [{ id: 1, name: 'John' }],
          meta: {
            count: 1
          }
        },
        config: {}
      });
    });

    test('should handle arrays and preserve them', () => {
      const obj = {
        items: [1, 2, 3],
        tags: ['a', 'b'],
        meta: { count: 2 }
      };
      const result = omitit(obj, ['tags'], { deep: true });
      expect(result).toEqual({
        items: [1, 2, 3],
        meta: { count: 2 }
      });
    });

    test('should handle null and undefined values', () => {
      const obj = {
        a: null,
        b: undefined,
        c: 'value',
        d: 0
      };
      const result = omitit(obj, ['b', 'd']);
      expect(result).toEqual({
        a: null,
        c: 'value'
      });
    });
  });
});
