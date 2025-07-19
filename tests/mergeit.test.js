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

  describe('array merge strategies', () => {
    describe('concat strategy', () => {
      test('should concatenate arrays with concat strategy', () => {
        const obj1 = { items: [1, 2, 3], name: 'test' };
        const obj2 = { items: [4, 5], other: 'value' };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'concat' });
        expect(result).toEqual({ items: [1, 2, 3, 4, 5], name: 'test', other: 'value' });
      });

      test('should concatenate nested arrays with concat strategy', () => {
        const obj1 = { data: { numbers: [1, 2], letters: ['a'] } };
        const obj2 = { data: { numbers: [3, 4], symbols: ['!'] } };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'concat' });
        expect(result).toEqual({
          data: {
            numbers: [1, 2, 3, 4],
            letters: ['a'],
            symbols: ['!']
          }
        });
      });

      test('should concatenate arrays with objects', () => {
        const obj1 = { users: [{ id: 1, name: 'John' }] };
        const obj2 = { users: [{ id: 2, name: 'Jane' }] };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'concat' });
        expect(result).toEqual({
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
          ]
        });
      });
    });

    describe('replace strategy', () => {
      test('should replace arrays with replace strategy (default)', () => {
        const obj1 = { items: [1, 2, 3], name: 'test' };
        const obj2 = { items: [4, 5], other: 'value' };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'replace' });
        expect(result).toEqual({ items: [4, 5], name: 'test', other: 'value' });
      });

      test('should replace arrays when arrays option is false regardless of strategy', () => {
        const obj1 = { items: [1, 2, 3] };
        const obj2 = { items: [4, 5] };
        const result = mergeit(obj1, obj2, { arrays: false, strategy: 'concat' });
        expect(result).toEqual({ items: [4, 5] });
      });
    });

    describe('unique strategy', () => {
      test('should merge arrays and remove duplicates with unique strategy', () => {
        const obj1 = { items: [1, 2, 3, 2] };
        const obj2 = { items: [3, 4, 5, 1] };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'unique' });
        expect(result).toEqual({ items: [1, 2, 3, 4, 5] });
      });

      test('should handle unique strategy with string arrays', () => {
        const obj1 = { tags: ['red', 'blue', 'green'] };
        const obj2 = { tags: ['blue', 'yellow', 'red'] };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'unique' });
        expect(result).toEqual({ tags: ['red', 'blue', 'green', 'yellow'] });
      });

      test('should handle unique strategy with object arrays', () => {
        const obj1 = {
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
          ]
        };
        const obj2 = {
          users: [
            { id: 1, name: 'John' },
            { id: 3, name: 'Bob' }
          ]
        };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'unique' });
        expect(result).toEqual({
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Bob' }
          ]
        });
      });

      test('should handle unique strategy with mixed type arrays', () => {
        const obj1 = { mixed: [1, 'hello', { key: 'value' }, true] };
        const obj2 = { mixed: ['hello', 2, { key: 'value' }, false] };
        const result = mergeit(obj1, obj2, { arrays: true, strategy: 'unique' });
        expect(result).toEqual({
          mixed: [1, 'hello', { key: 'value' }, true, 2, false]
        });
      });
    });

    describe('strategy validation', () => {
      test('should throw error for invalid strategy', () => {
        const obj1 = { items: [1, 2] };
        const obj2 = { items: [3, 4] };
        expect(() => {
          mergeit(obj1, obj2, { strategy: 'invalid' });
        }).toThrow('Strategy must be one of: concat, replace, unique');
      });

      test('should use replace as default strategy', () => {
        const obj1 = { items: [1, 2, 3] };
        const obj2 = { items: [4, 5] };
        const result = mergeit(obj1, obj2, { arrays: true });
        expect(result).toEqual({ items: [4, 5] });
      });
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

  describe('circular reference protection', () => {
    test('should handle objects with circular references', () => {
      const obj1 = { a: 1, b: 2 };
      obj1.self = obj1; // Create circular reference

      const obj2 = { c: 3, d: 4 };

      // This should not cause a stack overflow
      const result = mergeit(obj1, obj2);

      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      expect(result.c).toBe(3);
      expect(result.d).toBe(4);
      expect(result.self).toBe(result); // Circular reference preserved
    });

    test('should handle nested circular references', () => {
      const obj1 = {
        user: { name: 'Alice', id: 1 },
        data: { values: [1, 2, 3] }
      };
      obj1.user.parent = obj1; // Nested circular reference
      obj1.data.owner = obj1.user; // Another reference

      const obj2 = {
        user: { age: 30 },
        extra: 'value'
      };

      const result = mergeit(obj1, obj2);

      expect(result.user.name).toBe('Alice');
      expect(result.user.age).toBe(30);
      expect(result.extra).toBe('value');
      // Check that circular references are preserved in some form
      expect(result.user.parent).toBeTruthy();
      expect(result.data.owner).toBeTruthy();
    });

    test('should handle self-referencing object merge', () => {
      const obj = { value: 1 };
      obj.self = obj;

      const other = { extra: 'data' };

      // Merging object with circular reference should not cause stack overflow
      const result = mergeit(obj, other);

      expect(result.value).toBe(1);
      expect(result.extra).toBe('data');
      expect(result.self).toBeTruthy(); // Circular reference should exist in some form
    });

    test('should handle circular references in arrays', () => {
      const obj1 = { items: [] };
      obj1.items.push(obj1); // Array with circular reference

      const obj2 = { name: 'test' };

      const result = mergeit(obj1, obj2);

      expect(result.name).toBe('test');
      expect(result.items[0]).toBe(result);
    });

    test('should handle multiple circular references', () => {
      const objA = { name: 'A' };
      const objB = { name: 'B' };
      objA.ref = objB;
      objB.ref = objA; // Mutual circular reference

      const container = { a: objA, b: objB };
      const other = { c: 'value' };

      const result = mergeit(container, other);

      expect(result.a.name).toBe('A');
      expect(result.b.name).toBe('B');
      expect(result.a.ref).toBe(result.b);
      expect(result.b.ref).toBe(result.a);
      expect(result.c).toBe('value');
    });
  });
});
