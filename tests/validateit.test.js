const { validateit } = require('../index');

describe('validateit', () => {
  describe('basic type validation', () => {
    test('should validate string type correctly', () => {
      const obj = { name: 'John' };
      const schema = { name: 'string' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate number type correctly', () => {
      const obj = { age: 25 };
      const schema = { age: 'number' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate boolean type correctly', () => {
      const obj = { active: true };
      const schema = { active: 'boolean' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate object type correctly', () => {
      const obj = { user: { name: 'John' } };
      const schema = { user: 'object' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate array type correctly', () => {
      const obj = { tags: ['javascript', 'nodejs'] };
      const schema = { tags: 'array' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('type validation failures', () => {
    test('should detect string type mismatch', () => {
      const obj = { name: 123 };
      const schema = { name: 'string' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        path: 'name',
        expected: 'string',
        actual: 'number',
        message: 'Expected string but got number',
        value: 123
      });
    });

    test('should detect number type mismatch', () => {
      const obj = { age: 'twenty-five' };
      const schema = { age: 'number' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('age');
      expect(result.errors[0].expected).toBe('number');
      expect(result.errors[0].actual).toBe('string');
    });

    test('should detect boolean type mismatch', () => {
      const obj = { active: 'yes' };
      const schema = { active: 'boolean' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('active');
      expect(result.errors[0].expected).toBe('boolean');
      expect(result.errors[0].actual).toBe('string');
    });
  });

  describe('schema validation', () => {
    test('should handle missing properties in non-strict mode', () => {
      const obj = { name: 'John' };
      const schema = { name: 'string', age: 'number' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing required properties in strict mode', () => {
      const obj = { name: 'John' };
      const schema = { name: 'string', age: 'number' };
      const result = validateit(obj, schema, { strict: true });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        path: 'age',
        message: "Required property 'age' is missing",
        expected: 'property to exist',
        actual: 'property missing'
      });
    });

    test('should allow extra properties by default', () => {
      const obj = { name: 'John', age: 25, extra: 'value' };
      const schema = { name: 'string', age: 'number' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject extra properties when allowExtra is false', () => {
      const obj = { name: 'John', age: 25, extra: 'value' };
      const schema = { name: 'string', age: 'number' };
      const result = validateit(obj, schema, { allowExtra: false });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        path: 'extra',
        message: "Extra property 'extra' is not allowed",
        expected: 'property not to exist',
        actual: 'extra property',
        value: 'value'
      });
    });
  });

  describe('custom validator functions', () => {
    test('should handle custom validation function that passes', () => {
      const obj = { email: 'john@example.com' };
      const schema = {
        email: value => value.includes('@') && value.includes('.')
      };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect custom validation failure', () => {
      const obj = { email: 'invalid-email' };
      const schema = {
        email: value => value.includes('@') && value.includes('.')
      };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('email');
      expect(result.errors[0].message).toBe('Custom validation failed');
    });

    test('should handle custom validator errors', () => {
      const obj = { age: 15 };
      const schema = {
        age: value => {
          if (value < 18) throw new Error('Must be 18 or older');
          return true;
        }
      };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Custom validation error: Must be 18 or older');
    });
  });

  describe('nested object validation', () => {
    test('should validate nested objects', () => {
      const obj = {
        user: { name: 'John', age: 25 },
        settings: { theme: 'dark', notifications: true }
      };
      const schema = {
        user: { name: 'string', age: 'number' },
        settings: { theme: 'string', notifications: 'boolean' }
      };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect nested validation errors', () => {
      const obj = {
        user: { name: 123, age: 'twenty-five' }
      };
      const schema = {
        user: { name: 'string', age: 'number' }
      };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].path).toBe('user.name');
      expect(result.errors[1].path).toBe('user.age');
    });
  });

  describe('array validation', () => {
    test('should validate array of strings', () => {
      const obj = { tags: ['javascript', 'nodejs', 'web'] };
      const schema = { tags: ['string'] };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate array of numbers', () => {
      const obj = { scores: [85, 90, 78, 92] };
      const schema = { scores: ['number'] };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect array item validation errors', () => {
      const obj = { tags: ['javascript', 123, 'web'] };
      const schema = { tags: ['string'] };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('tags[1]');
      expect(result.errors[0].expected).toBe('string');
      expect(result.errors[0].actual).toBe('number');
    });
  });

  describe('input validation', () => {
    test('should throw error for non-object input', () => {
      expect(() => validateit(null, {})).toThrow('Object to validate must be a non-null object.');
      expect(() => validateit('string', {})).toThrow('Object to validate must be a non-null object.');
    });

    test('should throw error for non-object schema', () => {
      expect(() => validateit({}, null)).toThrow('Schema must be a non-null object.');
      expect(() => validateit({}, 'string')).toThrow('Schema must be a non-null object.');
    });
  });

  describe('edge cases', () => {
    test('should handle empty object', () => {
      const result = validateit({}, {});
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle null values', () => {
      const obj = { name: null };
      const schema = { name: 'null' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle any type', () => {
      const obj = { value: 'anything' };
      const schema = { value: 'any' };
      const result = validateit(obj, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle complex mixed validation', () => {
      const obj = { name: 123, age: 'thirty' };
      const schema = { name: 'string', age: 'number' };
      const result = validateit(obj, schema, { allowExtra: false });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
