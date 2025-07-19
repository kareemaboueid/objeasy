# objeasy

![objeasy logo](./public/assets/objeasy.png)

**A lightweight utility toolkit to control and manage plain JavaScript objects with precision.**

[![npm version](https://badge.fury.io/js/objeasy.svg)](https://badge.fury.io/js/objeasy)
[![Build Status](https://github.com/kareemaboueid/objeasy/workflows/CI/badge.svg)](https://github.com/kareemaboueid/objeasy/actions)
[![Coverage Status](https://coveralls.io/repos/github/kareemaboueid/objeasy/badge.svg?branch=main)](https://coveralls.io/github/kareemaboueid/objeasy?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dm/objeasy.svg)](https://npmjs.org/package/objeasy)

[Documentation](#api-documentation) • [Examples](#usage-examples) • [Benchmarks](#benchmarks) • [Contributing](#contributing)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
  - [pickit()](#pickit)
  - [modifyit()](#modifyit)
  - [mergeit()](#mergeit)
  - [transformit()](#transformit)
  - [omitit()](#omitit)
  - [flattenit()](#flattenit)
- [TypeScript Support](#typescript-support)
- [Benchmarks](#benchmarks)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Features

**High performance** - Optimized for speed and memory efficiency  
**Type-safe** - Full TypeScript support with detailed type definitions  
**Flexible options** - Configurable behavior for different use cases  
**Lightweight** - Zero dependencies, minimal footprint  
**Well-tested** - 149 comprehensive tests ensuring reliability  
**Immutable** - All operations return new objects, preserving originals  
**Deep operations** - Support for nested object manipulation

## Installation

```bash
# Using npm
npm install objeasy

# Using yarn
yarn add objeasy

# Using pnpm
pnpm add objeasy
```

## Quick Start

```javascript
// CommonJS
const { pickit, modifyit, mergeit, transformit, omitit, flattenit } = require('objeasy');

// ES6 Modules
import { pickit, modifyit, mergeit, transformit, omitit, flattenit } from 'objeasy';

// Example usage
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  role: 'developer',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// Pick specific keys
const basicInfo = pickit(user, ['name', 'email']);
// Result: { name: 'John Doe', email: 'john@example.com' }

// Transform values
const upperCaseInfo = transformit(user, {
  name: value => value.toUpperCase(),
  role: value => value.toUpperCase()
});
// Result: { id: 1, name: 'JOHN DOE', email: 'john@example.com', age: 30, role: 'DEVELOPER', address: {...} }
```

## Usage Examples

### Advanced Object Picking with Deep Support

```javascript
const user = {
  id: 1,
  profile: {
    name: 'John Doe',
    contact: {
      email: 'john@example.com',
      phone: '+1234567890'
    }
  },
  preferences: {
    theme: 'dark',
    language: 'en'
  }
};

// Deep picking with dot notation
const contactInfo = pickit(user, ['id', 'profile.contact.email'], { deep: true });
// Result: { id: 1, 'profile.contact.email': 'john@example.com' }

// Non-strict mode (skip missing keys)
const safeInfo = pickit(user, ['id', 'nonexistent'], { strict: false });
// Result: { id: 1 }
```

### Object Modification and Property Erasing

```javascript
const product = {
  id: 'P001',
  name: 'Laptop',
  price: 999,
  category: 'Electronics',
  internalNotes: 'For admin only'
};

// Modify properties
const updatedProduct = modifyit(product, {
  price: 899,
  onSale: true
});
// Result: { id: 'P001', name: 'Laptop', price: 899, category: 'Electronics', internalNotes: 'For admin only', onSale: true }

// Erase sensitive properties
const publicProduct = modifyit(product, ['internalNotes'], { erase: true });
// Result: { id: 'P001', name: 'Laptop', price: 999, category: 'Electronics' }
```

### Advanced Object Merging

```javascript
const defaultConfig = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  },
  features: ['auth', 'logging']
};

const userConfig = {
  api: {
    timeout: 10000,
    retries: 3
  },
  features: ['auth', 'analytics'],
  debug: true
};

// Deep merge with array concatenation
const finalConfig = mergeit(defaultConfig, userConfig, {
  deep: true,
  arrays: true,
  strategy: 'unique'
});
// Result: {
//   api: { baseUrl: 'https://api.example.com', timeout: 10000, retries: 3 },
//   features: ['auth', 'logging', 'analytics'],
//   debug: true
// }
```

### Complex Object Transformation

```javascript
const users = {
  user1: { name: 'john doe', role: 'admin', lastLogin: '2023-01-15' },
  user2: { name: 'jane smith', role: 'user', lastLogin: '2023-01-10' },
  user3: { name: 'bob wilson', role: 'moderator', lastLogin: null }
};

// Transform with conditional logic and filtering
const processedUsers = transformit(
  users,
  {
    name: value =>
      value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    role: value => value.toUpperCase(),
    lastLogin: value => (value ? new Date(value).toLocaleDateString() : 'Never')
  },
  {
    deep: true,
    excludeKeys: ['user3'] // Skip user3
  }
);
```

### Object Flattening for API Processing

```javascript
const complexData = {
  user: {
    profile: {
      personal: {
        name: 'John Doe',
        age: 30
      },
      contact: {
        email: 'john@example.com'
      }
    },
    settings: {
      theme: 'dark',
      notifications: true
    }
  }
};

const flattened = flattenit(complexData);
// Result: {
//   'user.profile.personal.name': 'John Doe',
//   'user.profile.personal.age': 30,
//   'user.profile.contact.email': 'john@example.com',
//   'user.settings.theme': 'dark',
//   'user.settings.notifications': true
// }
```

## API Documentation

### pickit()

Extract specific keys from an object with optional deep path support.

```typescript
pickit(originalObject: object, keysToPick: string[], options?: PickitOptions): object
```

**Parameters:**

- `originalObject` - The source object to extract keys from
- `keysToPick` - Array of keys to extract (supports dot notation with `deep: true`)
- `options` - Configuration options

**Options:**

- `strict` (boolean, default: `true`) - Throw error if key doesn't exist
- `deep` (boolean, default: `false`) - Enable dot notation path picking

**Example:**

```javascript
const user = { id: 1, name: 'John', profile: { email: 'john@example.com' } };

// Basic usage
pickit(user, ['id', 'name']); // { id: 1, name: 'John' }

// Deep picking
pickit(user, ['id', 'profile.email'], { deep: true });
// { id: 1, 'profile.email': 'john@example.com' }
```

### modifyit()

Modify or erase properties from an object.

```typescript
modifyit(originalObject: object, modifications: object | string[], options?: ModifyitOptions): object
```

**Parameters:**

- `originalObject` - The object to modify
- `modifications` - Object with new values or array of keys to erase
- `options` - Configuration options

**Options:**

- `erase` (boolean, default: `false`) - Erase mode: treat modifications as keys to remove
- `strict` (boolean, default: `false`) - Throw error when modifying non-existent keys

**Example:**

```javascript
const user = { id: 1, name: 'John', temp: 'remove me' };

// Modify properties
modifyit(user, { name: 'Jane', age: 25 });
// { id: 1, name: 'Jane', temp: 'remove me', age: 25 }

// Erase properties
modifyit(user, ['temp'], { erase: true });
// { id: 1, name: 'John' }
```

### mergeit()

Merge multiple objects with advanced options for deep merging and array handling.

```typescript
mergeit(target: object, ...sources: object[], options?: MergeitOptions): object
```

**Parameters:**

- `target` - The target object to merge into
- `sources` - One or more source objects to merge
- `options` - Configuration options

**Options:**

- `deep` (boolean, default: `true`) - Enable deep merging of nested objects
- `arrays` (boolean, default: `false`) - Enable array merging instead of replacement
- `strategy` (string, default: `'replace'`) - Array merge strategy: `'concat'`, `'replace'`, or `'unique'`

**Example:**

```javascript
const base = { a: 1, nested: { x: 1 }, arr: [1, 2] };
const extension = { b: 2, nested: { y: 2 }, arr: [3, 4] };

// Deep merge with unique array strategy
mergeit(base, extension, { arrays: true, strategy: 'unique' });
// { a: 1, b: 2, nested: { x: 1, y: 2 }, arr: [1, 2, 3, 4] }
```

### transformit()

Transform object values using mapper functions with advanced filtering options.

```typescript
transformit(originalObject: object, mappers: object | Function, options?: TransformitOptions): object
```

**Parameters:**

- `originalObject` - The object to transform
- `mappers` - Object with mapper functions for each key or single function for all values
- `options` - Configuration options

**Options:**

- `strict` (boolean, default: `false`) - Throw error if mapper not found for a key
- `deep` (boolean, default: `false`) - Recursively transform nested objects
- `includeKeys` (string[]) - Whitelist of keys to transform
- `excludeKeys` (string[]) - Blacklist of keys to skip

**Example:**

```javascript
const data = { name: 'john', age: 30, role: 'admin' };

// Transform specific properties
transformit(data, {
  name: value => value.toUpperCase(),
  age: value => `${value} years old`
});
// { name: 'JOHN', age: '30 years old', role: 'admin' }

// Transform with filtering
transformit(data, value => (typeof value === 'string' ? value.toUpperCase() : value), {
  includeKeys: ['name', 'role']
});
// { name: 'JOHN', age: 30, role: 'ADMIN' }
```

### omitit()

Remove specific keys from an object (inverse of pickit).

```typescript
omitit(originalObject: object, keysToOmit: string[], options?: OmititOptions): object
```

**Parameters:**

- `originalObject` - The source object to omit keys from
- `keysToOmit` - Array of keys to exclude
- `options` - Configuration options

**Options:**

- `strict` (boolean, default: `false`) - Throw error if key to omit doesn't exist
- `deep` (boolean, default: `false`) - Enable deep omitting with dot notation

**Example:**

```javascript
const user = { id: 1, name: 'John', password: 'secret', profile: { ssn: '123' } };

// Basic omitting
omitit(user, ['password']);
// { id: 1, name: 'John', profile: { ssn: '123' } }

// Deep omitting
omitit(user, ['password', 'profile.ssn'], { deep: true });
// { id: 1, name: 'John', profile: {} }
```

### flattenit()

Flatten nested objects into single-level objects with dot notation keys.

```typescript
flattenit(originalObject: object, prefix?: string): object
```

**Parameters:**

- `originalObject` - The object to flatten
- `prefix` - Internal parameter for recursion (usually omitted)

**Example:**

```javascript
const nested = {
  user: {
    profile: { name: 'John', age: 30 },
    settings: { theme: 'dark' }
  }
};

flattenit(nested);
// {
//   'user.profile.name': 'John',
//   'user.profile.age': 30,
//   'user.settings.theme': 'dark'
// }
```

## TypeScript Support

objeasy provides comprehensive TypeScript support with detailed type definitions:

```typescript
import { pickit, PickitOptions, transformit, MapperFunction } from 'objeasy';

interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    age: number;
    city: string;
  };
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  profile: { age: 30, city: 'New York' }
};

// Type-safe operations
const basicInfo = pickit(user, ['id', 'name']); // Inferred type
const options: PickitOptions = { strict: false, deep: true };

// Custom mapper with proper typing
const stringMapper: MapperFunction<string> = (value: string) => value.toUpperCase();
```

## Benchmarks

objeasy is optimized for performance across all operations:

```text
Performance Metrics (1000 iterations):

PICKIT Performance:
  ✓ Basic Picking:     0.002ms per operation
  ✓ Large Dataset:     0.002ms per operation
  ✓ Complex Object:    0.001ms per operation

MODIFYIT Performance:
  ✓ Basic Modify:      0.003ms per operation
  ✓ Erase Mode:        0.002ms per operation
  ✓ Large Dataset:     0.004ms per operation

MERGEIT Performance:
  ✓ Shallow Merge:     0.004ms per operation
  ✓ Deep Merge:        0.008ms per operation
  ✓ Array Strategies:  0.006ms per operation

TRANSFORMIT Performance:
  ✓ Basic Transform:   0.005ms per operation
  ✓ Deep Transform:    0.012ms per operation
  ✓ Filtered Transform: 0.007ms per operation

Memory Usage: Optimized for minimal heap allocation
All operations maintain O(n) complexity for object size
```

Run benchmarks locally:

```bash
npm run benchmark
```

## Error Handling

objeasy provides clear, actionable error messages:

```javascript
// TypeError examples
pickit(null, ['key']);
// TypeError: Original object must be a non-null object.

pickit({}, 'not-array');
// TypeError: Keys to pick must be an array.

// Strict mode errors
pickit({ a: 1 }, ['b'], { strict: true });
// Error: Key "b" does not exist in the original object.

transformit({}, { a: 'not-function' });
// TypeError: Mapper for key "a" must be a function.
```

## Best Practices

### 1. Use Appropriate Strict Modes

```javascript
// For known object shapes - use strict mode (default for pickit)
const userInfo = pickit(user, ['id', 'name'], { strict: true });

// For dynamic/uncertain data - disable strict mode
const dynamicData = pickit(apiResponse, ['optionalField'], { strict: false });
```

### 2. Leverage Deep Operations

```javascript
// Prefer deep operations for nested structures
const settings = pickit(config, ['database.host', 'cache.ttl'], { deep: true });

// Use dot notation for precise targeting
const sanitized = omitit(user, ['profile.ssn', 'internal.secrets'], { deep: true });
```

### 3. Optimize Performance

```javascript
// For large datasets, prefer shallow operations when possible
const basicFields = pickit(largeObject, ['id', 'name']); // Fast

// Use transformit filtering for selective updates
const processed = transformit(data, mapper, { includeKeys: ['specific', 'fields'] });
```

### 4. Chain Operations

```javascript
// Combine functions for complex transformations
const result = transformit(omitit(user, ['password', 'secrets']), { name: n => n.toUpperCase() });
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/kareemaboueid/objeasy.git

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run benchmarks
npm run benchmark

# Lint and format
npm run lint:fix
npm run format:fix
```

### Testing

We maintain 100% test coverage with 149 comprehensive tests:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

We enforce strict code quality standards:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **TypeScript** - Type checking

## License

MIT © [Kareem Aboueid](https://github.com/kareemaboueid)
