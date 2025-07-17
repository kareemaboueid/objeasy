const { mergeit } = require('../index');

describe('mergeit', () => {
  describe('basic functionality', () => {
    test('should merge two flat objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const result = mergeit(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    test('should override properties from first object', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { b: 20, d: 4 };
      const result = mergeit(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 20, c: 3, d: 4 });
    });

    test('should not modify original objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const originalObj1 = { ...obj1 };
      const originalObj2 = { ...obj2 };

      mergeit(obj1, obj2);

      expect(obj1).toEqual(originalObj1);
      expect(obj2).toEqual(originalObj2);
    });
  });

  describe('deep merging', () => {
    test('should perform deep merge by default', () => {
      const obj1 = { a: { x: 1, y: 2 }, b: 1 };
      const obj2 = { a: { z: 3 }, c: 2 };
      const result = mergeit(obj1, obj2);
      expect(result).toEqual({ a: { x: 1, y: 2, z: 3 }, b: 1, c: 2 });
    });

    test('should perform shallow merge when deep option is false', () => {
      const obj1 = { a: { x: 1, y: 2 }, b: 1 };
      const obj2 = { a: { z: 3 }, c: 2 };
      const result = mergeit(obj1, obj2, { deep: false });
      expect(result).toEqual({ a: { z: 3 }, b: 1, c: 2 });
    });

    test('should handle nested deep merging', () => {
      const obj1 = {
        user: {
          profile: { name: 'John', age: 30 },
          settings: { theme: 'dark' }
        }
      };
      const obj2 = {
        user: {
          profile: { email: 'john@example.com' },
          settings: { language: 'en' },
          preferences: { notifications: true }
        }
      };
      const result = mergeit(obj1, obj2, { deep: true });
      expect(result).toEqual({
        user: {
          profile: { name: 'John', age: 30, email: 'john@example.com' },
          settings: { theme: 'dark', language: 'en' },
          preferences: { notifications: true }
        }
      });
    });

    test('should override arrays by default in deep merge', () => {
      const obj1 = { items: [1, 2, 3], name: 'test' };
      const obj2 = { items: [4, 5], other: 'value' };
      const result = mergeit(obj1, obj2, { deep: true });
      expect(result).toEqual({ items: [4, 5], name: 'test', other: 'value' });
    });
  });

  describe('multiple objects', () => {
    test('should merge multiple objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = mergeit(obj1, obj2, obj3);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('should merge multiple objects with deep option', () => {
      const obj1 = { user: { name: 'John' } };
      const obj2 = { user: { age: 30 } };
      const obj3 = { user: { email: 'john@example.com' } };
      const result = mergeit(obj1, obj2, obj3, { deep: true });
      expect(result).toEqual({
        user: { name: 'John', age: 30, email: 'john@example.com' }
      });
    });

    test('should handle precedence correctly with multiple objects', () => {
      const obj1 = { a: 1, b: 1 };
      const obj2 = { a: 2, c: 2 };
      const obj3 = { a: 3, d: 3 };
      const result = mergeit(obj1, obj2, obj3);
      expect(result).toEqual({ a: 3, b: 1, c: 2, d: 3 });
    });
  });

  describe('input validation', () => {
    test('should throw error for non-object first argument', () => {
      expect(() => mergeit(null, {})).toThrow('Target must be a non-null object.');
      expect(() => mergeit(undefined, {})).toThrow('Target must be a non-null object.');
      expect(() => mergeit('string', {})).toThrow('Target must be a non-null object.');
    });

    test('should throw error for non-object subsequent arguments', () => {
      expect(() => mergeit({}, null)).toThrow('Source at index 0 must be a non-null object.');
      expect(() => mergeit({}, {}, 'string')).toThrow('Source at index 1 must be a non-null object.');
    });

    test('should handle empty objects', () => {
      const result = mergeit({}, {});
      expect(result).toEqual({});
    });

    test('should handle single object', () => {
      const obj = { a: 1, b: 2 };
      const result = mergeit(obj);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a copy
    });
  });

  describe('edge cases', () => {
    test('should handle objects with null and undefined values', () => {
      const obj1 = { a: null, b: undefined, c: 1 };
      const obj2 = { a: 'value', d: null };
      const result = mergeit(obj1, obj2);
      expect(result).toEqual({ a: 'value', b: undefined, c: 1, d: null });
    });

    test('should handle objects with function values', () => {
      const fn1 = () => 'function1';
      const fn2 = () => 'function2';
      const obj1 = { a: 1, fn: fn1 };
      const obj2 = { b: 2, fn: fn2 };
      const result = mergeit(obj1, obj2);
      expect(result.fn).toBe(fn2);
      expect(result.fn()).toBe('function2');
    });

    test('should handle objects with Date values', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-12-31');
      const obj1 = { created: date1, other: 'value' };
      const obj2 = { updated: date2 };
      const result = mergeit(obj1, obj2);
      expect(result).toEqual({ created: date1, updated: date2, other: 'value' });
    });

    test('should handle complex objects', () => {
      const obj1 = { a: 1, nested: { x: 1 } };
      const obj2 = { b: 2, nested: { y: 2 } };

      const result = mergeit(obj1, obj2);
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result.nested).toEqual({ x: 1, y: 2 });
    });
  });
});
