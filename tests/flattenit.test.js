const { flattenit } = require('../index');

describe('flattenit', () => {
  describe('basic functionality', () => {
    test('should flatten flat object (no change)', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = flattenit(obj);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
      expect(result).not.toBe(obj); // Should be a copy
    });

    test('should flatten simple nested object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        a: 1,
        'b.c': 2,
        'b.d': 3
      });
    });

    test('should handle deep nesting', () => {
      const obj = {
        user: {
          name: 'Kareem',
          address: {
            city: 'Jeddah',
            country: {
              code: 'SA',
              name: 'Saudi Arabia'
            }
          }
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        'user.name': 'Kareem',
        'user.address.city': 'Jeddah',
        'user.address.country.code': 'SA',
        'user.address.country.name': 'Saudi Arabia'
      });
    });

    test('should not modify original object', () => {
      const obj = {
        a: 1,
        b: { c: 2 }
      };
      const original = JSON.parse(JSON.stringify(obj));

      flattenit(obj);

      expect(obj).toEqual(original);
    });
  });

  describe('data types', () => {
    test('should handle arrays as leaf values', () => {
      const obj = {
        items: [1, 2, 3],
        nested: {
          tags: ['a', 'b', 'c']
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        items: [1, 2, 3],
        'nested.tags': ['a', 'b', 'c']
      });
    });

    test('should handle null and undefined values', () => {
      const obj = {
        a: null,
        b: undefined,
        nested: {
          c: null,
          d: undefined
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        a: null,
        b: undefined,
        'nested.c': null,
        'nested.d': undefined
      });
    });

    test('should handle string, number, and boolean values', () => {
      const obj = {
        str: 'hello',
        num: 42,
        bool: true,
        nested: {
          str2: 'world',
          num2: 0,
          bool2: false
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        str: 'hello',
        num: 42,
        bool: true,
        'nested.str2': 'world',
        'nested.num2': 0,
        'nested.bool2': false
      });
    });

    test('should handle Date objects', () => {
      const date = new Date('2024-01-01');
      const obj = {
        created: date,
        nested: {
          updated: date
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        created: date,
        'nested.updated': date
      });
    });

    test('should handle functions', () => {
      const fn = () => 'test';
      const obj = {
        handler: fn,
        nested: {
          callback: fn
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        handler: fn,
        'nested.callback': fn
      });
    });
  });

  describe('complex structures', () => {
    test('should handle mixed nested and flat keys', () => {
      const obj = {
        id: 1,
        name: 'Test',
        config: {
          theme: 'dark',
          settings: {
            autoSave: true,
            timeout: 5000
          }
        },
        active: true
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        id: 1,
        name: 'Test',
        'config.theme': 'dark',
        'config.settings.autoSave': true,
        'config.settings.timeout': 5000,
        active: true
      });
    });

    test('should handle multiple branches at same level', () => {
      const obj = {
        user: {
          name: 'John',
          age: 30
        },
        settings: {
          theme: 'dark',
          lang: 'en'
        },
        metadata: {
          created: '2024-01-01',
          version: '1.0'
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        'user.name': 'John',
        'user.age': 30,
        'settings.theme': 'dark',
        'settings.lang': 'en',
        'metadata.created': '2024-01-01',
        'metadata.version': '1.0'
      });
    });

    test('should handle empty nested objects', () => {
      const obj = {
        a: 1,
        empty: {},
        nested: {
          b: 2,
          alsoEmpty: {}
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        a: 1,
        'nested.b': 2
      });
    });
  });

  describe('edge cases', () => {
    test('should handle empty object', () => {
      const result = flattenit({});
      expect(result).toEqual({});
    });

    test('should handle object with only nested empty objects', () => {
      const obj = {
        a: {},
        b: {
          c: {}
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({});
    });

    test('should handle very deep nesting', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep'
                }
              }
            }
          }
        }
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        'level1.level2.level3.level4.level5.value': 'deep'
      });
    });

    test('should handle objects with array-like keys', () => {
      const obj = {
        0: 'first',
        1: {
          0: 'nested first',
          1: 'nested second'
        },
        normal: 'key'
      };
      const result = flattenit(obj);
      expect(result).toEqual({
        0: 'first',
        '1.0': 'nested first',
        1.1: 'nested second',
        normal: 'key'
      });
    });
  });

  describe('input validation', () => {
    test('should throw error for non-object input', () => {
      expect(() => flattenit(null)).toThrow('Original object must be a non-null object.');
      expect(() => flattenit(undefined)).toThrow('Original object must be a non-null object.');
      expect(() => flattenit('string')).toThrow('Original object must be a non-null object.');
      expect(() => flattenit(123)).toThrow('Original object must be a non-null object.');
      expect(() => flattenit([])).toThrow('Original object must be a non-null object.');
    });
  });

  describe('real-world examples', () => {
    test('should flatten configuration object', () => {
      const config = {
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            username: 'admin',
            password: 'secret'
          }
        },
        api: {
          timeout: 5000,
          retries: 3
        },
        features: {
          auth: {
            enabled: true,
            provider: 'oauth'
          }
        }
      };
      const result = flattenit(config);
      expect(result).toEqual({
        'database.host': 'localhost',
        'database.port': 5432,
        'database.credentials.username': 'admin',
        'database.credentials.password': 'secret',
        'api.timeout': 5000,
        'api.retries': 3,
        'features.auth.enabled': true,
        'features.auth.provider': 'oauth'
      });
    });

    test('should flatten user profile object', () => {
      const user = {
        id: 123,
        personal: {
          firstName: 'Kareem',
          lastName: 'Aboueid',
          contact: {
            email: 'kareem@example.com',
            phone: '+966123456789'
          }
        },
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: false
          }
        }
      };
      const result = flattenit(user);
      expect(result).toEqual({
        id: 123,
        'personal.firstName': 'Kareem',
        'personal.lastName': 'Aboueid',
        'personal.contact.email': 'kareem@example.com',
        'personal.contact.phone': '+966123456789',
        'preferences.language': 'en',
        'preferences.notifications.email': true,
        'preferences.notifications.push': false
      });
    });
  });
});
