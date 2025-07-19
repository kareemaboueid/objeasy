const { transformit } = require('../index');

describe('transformit', () => {
  describe('basic functionality', () => {
    test('should transform object values using mapper functions', () => {
      const obj = { name: 'john', age: 25 };
      const mappers = {
        name: value => value.toUpperCase(),
        age: value => value * 2
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({ name: 'JOHN', age: 50 });
    });

    test('should not modify original object', () => {
      const obj = { name: 'john', age: 25 };
      const original = { ...obj };
      const mappers = { name: value => value.toUpperCase() };

      transformit(obj, mappers);

      expect(obj).toEqual(original);
    });

    test('should preserve untransformed properties', () => {
      const obj = { name: 'john', age: 25, city: 'New York' };
      const mappers = { name: value => value.toUpperCase() };
      const result = transformit(obj, mappers);
      expect(result).toEqual({ name: 'JOHN', age: 25, city: 'New York' });
    });

    test('should handle empty mappers object', () => {
      const obj = { name: 'john', age: 25 };
      const result = transformit(obj, {});
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a copy
    });
  });

  describe('transformation types', () => {
    test('should handle string transformations', () => {
      const obj = {
        firstName: 'john',
        lastName: 'DOE',
        email: 'John.Doe@EXAMPLE.COM'
      };
      const mappers = {
        firstName: value => value.charAt(0).toUpperCase() + value.slice(1),
        lastName: value => value.toLowerCase(),
        email: value => value.toLowerCase()
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'doe',
        email: 'john.doe@example.com'
      });
    });

    test('should handle number transformations', () => {
      const obj = { price: 100, quantity: 5, discount: 0.1 };
      const mappers = {
        price: value => value * 1.2, // Add tax
        quantity: value => Math.max(1, value), // Ensure minimum
        discount: value => Math.round(value * 100) // Convert to percentage
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({ price: 120, quantity: 5, discount: 10 });
    });

    test('should handle array transformations', () => {
      const obj = {
        numbers: [1, 2, 3, 4, 5],
        names: ['john', 'jane', 'bob']
      };
      const mappers = {
        numbers: arr => arr.filter(n => n % 2 === 0),
        names: arr => arr.map(name => name.toUpperCase())
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({
        numbers: [2, 4],
        names: ['JOHN', 'JANE', 'BOB']
      });
    });

    test('should handle object transformations', () => {
      const obj = {
        user: { firstName: 'john', lastName: 'doe' },
        metadata: { created: '2023-01-01', version: 1 }
      };
      const mappers = {
        user: user => ({ fullName: `${user.firstName} ${user.lastName}` }),
        metadata: meta => ({ ...meta, updated: new Date().toISOString().split('T')[0] })
      };
      const result = transformit(obj, mappers);
      expect(result.user).toEqual({ fullName: 'john doe' });
      expect(result.metadata.created).toBe('2023-01-01');
      expect(result.metadata.version).toBe(1);
      expect(result.metadata.updated).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('deep transformation', () => {
    test('should perform shallow transformation by default', () => {
      const obj = {
        user: { name: 'john', profile: { email: 'JOHN@EXAMPLE.COM' } },
        settings: { theme: 'DARK' }
      };
      const mappers = {
        user: user => ({ ...user, name: user.name.toUpperCase() })
      };
      const result = transformit(obj, mappers);
      expect(result.user.name).toBe('JOHN');
      expect(result.user.profile.email).toBe('JOHN@EXAMPLE.COM'); // Unchanged
      expect(result.settings.theme).toBe('DARK'); // Unchanged
    });

    test('should perform deep transformation when deep option is true', () => {
      const obj = {
        user: { name: 'john', email: 'JOHN@EXAMPLE.COM' },
        settings: { theme: 'DARK', language: 'EN' }
      };
      const mappers = {
        name: value => value.toUpperCase(),
        email: value => value.toLowerCase(),
        theme: value => value.toLowerCase(),
        language: value => value.toLowerCase()
      };
      const result = transformit(obj, mappers, { deep: true });
      expect(result).toEqual({
        user: { name: 'JOHN', email: 'john@example.com' },
        settings: { theme: 'dark', language: 'en' }
      });
    });

    test('should handle nested deep transformation', () => {
      const obj = {
        company: {
          name: 'tech corp',
          employees: {
            manager: { name: 'alice johnson', role: 'MANAGER' },
            developer: { name: 'bob smith', role: 'DEVELOPER' }
          }
        }
      };
      const mappers = {
        name: value =>
          value
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        role: value => value.toLowerCase()
      };
      const result = transformit(obj, mappers, { deep: true });
      expect(result.company.name).toBe('Tech Corp');
      expect(result.company.employees.manager.name).toBe('Alice Johnson');
      expect(result.company.employees.manager.role).toBe('manager');
      expect(result.company.employees.developer.name).toBe('Bob Smith');
      expect(result.company.employees.developer.role).toBe('developer');
    });
  });

  describe('error handling', () => {
    test('should handle mapper function errors gracefully', () => {
      const obj = { name: 'john', age: null };
      const mappers = {
        name: value => value.toUpperCase(),
        age: value => value.toString() // Will throw on null
      };

      expect(() => transformit(obj, mappers)).toThrow(
        'Transformation failed for key "age": Cannot read properties of null (reading \'toString\')'
      );
    });

    test('should skip transformation when mapper not found', () => {
      const obj = { name: 'john', age: null };
      const mappers = {
        name: value => value.toUpperCase()
        // No mapper for age
      };
      const result = transformit(obj, mappers);
      expect(result.name).toBe('JOHN');
      expect(result.age).toBe(null); // Preserved original value
    });
  });

  describe('input validation', () => {
    test('should throw error for non-object input', () => {
      expect(() => transformit(null, {})).toThrow('Original object must be a non-null object.');
      expect(() => transformit('string', {})).toThrow('Original object must be a non-null object.');
    });

    test('should handle null and string mappers', () => {
      const obj = { name: 'john' };
      // null mappers will cause an error when trying to access properties
      expect(() => transformit(obj, null)).toThrow(
        'Transformation failed for key "name": Cannot convert undefined or null to object'
      );

      expect(() => transformit(obj, 'string')).toThrow('Mappers must be an object or function.');
    });

    test('should handle non-function mapper values', () => {
      const obj = { name: 'john' };
      const mappers = { name: 'not a function' };
      // Should not throw, just skip transformation
      const result = transformit(obj, mappers);
      expect(result.name).toBe('john');
    });
  });

  describe('edge cases', () => {
    test('should handle empty object', () => {
      const result = transformit({}, { name: value => value.toUpperCase() });
      expect(result).toEqual({});
    });

    test('should handle mappers for non-existent keys', () => {
      const obj = { name: 'john' };
      const mappers = {
        name: value => value.toUpperCase(),
        age: value => value * 2 // Key doesn\'t exist
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({ name: 'JOHN' });
    });

    test('should handle complex data types', () => {
      const date = new Date('2023-01-01');
      const obj = {
        created: date,
        tags: new Set(['javascript', 'nodejs']),
        metadata: new Map([
          ['version', 1],
          ['author', 'john']
        ])
      };
      const mappers = {
        created: date => date.getFullYear(),
        tags: set => Array.from(set).join(', '),
        metadata: map => Object.fromEntries(map)
      };
      const result = transformit(obj, mappers);
      expect(result.created).toBe(2023);
      expect(result.tags).toBe('javascript, nodejs');
      expect(result.metadata).toEqual({ version: 1, author: 'john' });
    });

    test('should handle null and undefined values', () => {
      const obj = {
        name: 'john',
        age: null,
        email: undefined,
        active: false
      };
      const mappers = {
        name: value => value.toUpperCase(),
        age: value => value || 0,
        email: value => value || 'no-email@example.com',
        active: value => !value
      };
      const result = transformit(obj, mappers);
      expect(result).toEqual({
        name: 'JOHN',
        age: 0,
        email: 'no-email@example.com',
        active: true
      });
    });
  });

  describe('includeKeys and excludeKeys options', () => {
    const testObject = {
      name: 'Kareem',
      age: 30,
      email: 'me@example.com',
      isAdmin: false,
      role: 'developer'
    };

    describe('includeKeys', () => {
      test('should transform only specified keys', () => {
        const mappers = {
          name: value => value.toUpperCase(),
          email: value => value.replace('@', ' at '),
          age: value => value * 2
        };

        const result = transformit(testObject, mappers, {
          includeKeys: ['name', 'email']
        });

        expect(result).toEqual({
          name: 'KAREEM',
          age: 30, // unchanged
          email: 'me at example.com',
          isAdmin: false, // unchanged
          role: 'developer' // unchanged
        });
      });

      test('should work with wildcard mapper and includeKeys', () => {
        const result = transformit(
          testObject,
          {
            '*': value => String(value).toUpperCase()
          },
          {
            includeKeys: ['name', 'role']
          }
        );

        expect(result).toEqual({
          name: 'KAREEM',
          age: 30, // unchanged
          email: 'me@example.com', // unchanged
          isAdmin: false, // unchanged
          role: 'DEVELOPER'
        });
      });

      test('should work with function mapper and includeKeys', () => {
        const result = transformit(testObject, value => String(value).toUpperCase(), {
          includeKeys: ['name', 'email']
        });

        expect(result).toEqual({
          name: 'KAREEM',
          age: 30, // unchanged
          email: 'ME@EXAMPLE.COM',
          isAdmin: false, // unchanged
          role: 'developer' // unchanged
        });
      });
    });

    describe('excludeKeys', () => {
      test('should exclude specified keys from transformation', () => {
        const result = transformit(
          testObject,
          {
            '*': value => String(value).toUpperCase()
          },
          {
            excludeKeys: ['isAdmin', 'age']
          }
        );

        expect(result).toEqual({
          name: 'KAREEM',
          age: 30, // unchanged
          email: 'ME@EXAMPLE.COM',
          isAdmin: false, // unchanged
          role: 'DEVELOPER'
        });
      });

      test('should work with specific mappers and excludeKeys', () => {
        const mappers = {
          name: value => value.toUpperCase(),
          email: value => value.replace('@', ' at '),
          age: value => value * 2,
          isAdmin: value => !value
        };

        const result = transformit(testObject, mappers, {
          excludeKeys: ['isAdmin', 'role']
        });

        expect(result).toEqual({
          name: 'KAREEM',
          age: 60,
          email: 'me at example.com',
          isAdmin: false, // unchanged
          role: 'developer' // unchanged
        });
      });
    });

    describe('validation', () => {
      test('should throw error when both includeKeys and excludeKeys are specified', () => {
        expect(() => {
          transformit(
            testObject,
            { '*': value => value },
            {
              includeKeys: ['name'],
              excludeKeys: ['age']
            }
          );
        }).toThrow('Cannot specify both includeKeys and excludeKeys options.');
      });

      test('should throw error when includeKeys is not an array', () => {
        expect(() => {
          transformit(
            testObject,
            { '*': value => value },
            {
              includeKeys: 'name'
            }
          );
        }).toThrow('includeKeys must be an array of strings.');
      });

      test('should throw error when excludeKeys is not an array', () => {
        expect(() => {
          transformit(
            testObject,
            { '*': value => value },
            {
              excludeKeys: 'name'
            }
          );
        }).toThrow('excludeKeys must be an array of strings.');
      });
    });

    describe('edge cases', () => {
      test('should handle empty includeKeys array', () => {
        const result = transformit(
          testObject,
          {
            '*': value => String(value).toUpperCase()
          },
          {
            includeKeys: []
          }
        );

        // No keys should be transformed
        expect(result).toEqual(testObject);
      });

      test('should handle empty excludeKeys array', () => {
        const result = transformit(
          testObject,
          {
            '*': value => String(value).toUpperCase()
          },
          {
            excludeKeys: []
          }
        );

        // All keys should be transformed
        expect(result).toEqual({
          name: 'KAREEM',
          age: '30',
          email: 'ME@EXAMPLE.COM',
          isAdmin: 'FALSE',
          role: 'DEVELOPER'
        });
      });

      test('should handle includeKeys with non-existent keys', () => {
        const result = transformit(
          testObject,
          {
            '*': value => String(value).toUpperCase()
          },
          {
            includeKeys: ['name', 'nonExistent']
          }
        );

        expect(result).toEqual({
          name: 'KAREEM',
          age: 30, // unchanged
          email: 'me@example.com', // unchanged
          isAdmin: false, // unchanged
          role: 'developer' // unchanged
        });
      });
    });

    describe('deep transformation with filtering', () => {
      test('should apply filtering to nested objects with deep option', () => {
        const nestedObj = {
          user: {
            name: 'John',
            age: 25,
            email: 'john@test.com'
          },
          meta: {
            created: '2024-01-01',
            updated: '2024-01-02'
          }
        };

        const result = transformit(
          nestedObj,
          {
            '*': value => (typeof value === 'string' ? value.toUpperCase() : value)
          },
          {
            deep: true,
            excludeKeys: ['age', 'updated']
          }
        );

        expect(result).toEqual({
          user: {
            name: 'John', // transformed because it's a string but 'age' is excluded
            age: 25, // unchanged due to excludeKeys
            email: 'john@test.com' // transformed because it's a string
          },
          meta: {
            created: '2024-01-01', // transformed because it's a string
            updated: '2024-01-02' // unchanged due to excludeKeys
          }
        });
      });
    });
  });
});
