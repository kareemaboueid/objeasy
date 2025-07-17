# objeasy

A lightweight utility toolkit to control and manage plain JavaScript objects with precision.

## Features

- **pickit**: Extract specific keys from objects with type safety
- **modifyit**: Modify or erase object properties with flexible options
- **TypeScript Support**: Full type definitions with IntelliSense
- **Zero Dependencies**: No external dependencies
- **Well Tested**: Comprehensive test suite with 100% code coverage
- **Performance Optimized**: Competitive performance with native JavaScript methods

## Installation

```bash
npm install objeasy
```

## Quick Start

### JavaScript

```js
const { pickit, modifyit } = require('objeasy');

const user = {
  id: 1,
  name: 'Alice Johnson',
  age: 28,
  role: 'developer',
  email: 'alice@example.com',
  city: 'San Francisco'
};

// Pick specific keys
const basicInfo = pickit(user, ['name', 'role', 'email']);
console.log(basicInfo);
// { name: 'Alice Johnson', role: 'developer', email: 'alice@example.com' }

// Modify properties (creates new object)
const updatedUser = modifyit(user, {
  name: 'Alice Smith',
  age: 29,
  department: 'Engineering'
});
console.log(updatedUser);
// { id: 1, name: 'Alice Smith', age: 29, role: 'developer', email: 'alice@example.com', city: 'San Francisco', department: 'Engineering' }

// Remove specific keys
const userWithoutEmail = modifyit(user, ['email', 'city'], { erase: true });
console.log(userWithoutEmail);
// { id: 1, name: 'Alice Johnson', age: 28, role: 'developer' }
```

### TypeScript

```typescript
import { pickit, modifyit, PickitOptions, ModifyitOptions } from 'objeasy';

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  age: 30,
  role: 'developer',
  email: 'john@example.com'
};

// Type-safe key picking - only valid keys are allowed
const basicInfo = pickit(user, ['name', 'age']); // Type: Pick<User, 'name' | 'age'>
console.log(basicInfo);

// Type-safe modification with strict mode
const modifiedUser = modifyit(user, { name: 'Jane Doe', age: 30 }, { strict: true });
console.log(modifiedUser);

// Erase specific keys with type safety
const userWithoutEmail = modifyit(user, ['email'], { erase: true });
console.log(userWithoutEmail); // Type: Partial<User>
```

## API Reference

### `pickit(originalObject, keysToPick, options?)`

Creates a new object containing only the specified keys from the original object.

**Parameters:**

- `originalObject: object` - The source object to pick from
- `keysToPick: string[]` - Array of keys to extract
- `options?: PickitOptions` - Optional configuration
  - `strict?: boolean` (default: `true`) - Throw error if key doesn't exist in source object

**Returns:** `object` - New object with only the picked keys

**Example:**

```js
const obj = { a: 1, b: 2, c: 3, d: 4 };
const result = pickit(obj, ['a', 'c']); // { a: 1, c: 3 }

// Non-strict mode - ignores missing keys
const partial = pickit(obj, ['a', 'missing'], { strict: false }); // { a: 1 }
```

### `modifyit(originalObject, modifications, options?)`

Creates a new object with modifications applied or specific keys removed.

**Parameters:**

- `originalObject: object` - The source object to modify
- `modifications: object | string[]` - Changes to apply or keys to remove (when `erase: true`)
- `options?: ModifyitOptions` - Optional configuration
  - `erase?: boolean` (default: `false`) - If true, remove specified keys instead of modifying
  - `strict?: boolean` (default: `false`) - If true, throw error when adding new keys (only applies when `erase: false`)

**Returns:** `object` - New object with modifications applied

**Examples:**

```js
const user = { name: 'John', age: 25, role: 'dev' };

// Modify existing properties and add new ones
const updated = modifyit(user, { age: 26, department: 'Engineering' });
// { name: 'John', age: 26, role: 'dev', department: 'Engineering' }

// Strict mode - only modify existing keys
const strictUpdate = modifyit(user, { age: 26 }, { strict: true }); // OK
// modifyit(user, { newKey: 'value' }, { strict: true }); // Throws error

// Erase mode - remove specific keys
const withoutAge = modifyit(user, ['age'], { erase: true });
// { name: 'John', role: 'dev' }
```

## Advanced Usage

### Error Handling

```js
const { pickit, modifyit } = require('objeasy');

const obj = { a: 1, b: 2 };

try {
  // This will throw an error because 'c' doesn't exist
  pickit(obj, ['a', 'c']); // strict: true by default
} catch (error) {
  console.log(error.message); // 'Key "c" does not exist in the original object.'
}

try {
  // This will throw an error because 'newKey' doesn't exist in strict mode
  modifyit(obj, { newKey: 'value' }, { strict: true });
} catch (error) {
  console.log(error.message); // 'Key "newKey" does not exist in the original object.'
}
```

### Type Safety in TypeScript

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const product: Product = {
  id: 1,
  name: 'Laptop',
  price: 999,
  category: 'Electronics'
};

// TypeScript will enforce valid keys
const info = pickit(product, ['name', 'price']); // ✓ Valid
// const invalid = pickit(product, ['invalid']); // ✗ TypeScript error

// Type-safe modifications
const updated = modifyit(product, { price: 899 }); // ✓ Valid
// const invalid = modifyit(product, { invalidProp: 'test' }); // ✗ TypeScript error (in strict mode)
```

## Testing

objeasy comes with a comprehensive test suite ensuring reliability:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**

- 100% Statement Coverage
- 97%+ Branch Coverage
- 100% Function Coverage
- 100% Line Coverage

## Performance

Performance benchmarks show competitive results with native JavaScript operations:

```bash
# Run performance benchmarks
npm run benchmark
```

**Typical Results:**

- **pickit**: ~15-40ms per 100k operations (depending on object size)
- **modifyit**: ~10-15ms per 100k operations
- **Memory**: Efficient memory usage comparable to native methods

## Project Structure

```
objeasy/
├── src/
│   ├── pickit/
│   │   ├── pickit.js      # pickit implementation
│   │   └── pickit.d.ts    # TypeScript definitions
│   └── modifyit/
│       ├── modifyit.js    # modifyit implementation
│       └── modifyit.d.ts  # TypeScript definitions
├── tests/
│   ├── pickit.test.js     # pickit test suite
│   └── modifyit.test.js   # modifyit test suite
├── examples/
│   ├── basic.js           # JavaScript examples
│   └── example.ts         # TypeScript examples
├── benchmarks/
│   └── performance.js     # Performance benchmarks
├── index.js               # Main entry point
├── index.d.ts             # Main TypeScript definitions
└── setup-gpg.md           # GPG commit signing setup guide
```

## Development

### Code Quality

This project uses automated code quality tools:

- **Husky**: Git hooks for automated checks
- **lint-staged**: Run linters only on staged files
- **ESLint**: Code linting and error detection
- **Prettier**: Code formatting
- **Jest**: Testing framework

### Pre-commit Hooks

Every commit automatically:

1. Runs ESLint with auto-fix on staged JS/TS files
2. Formats all staged files with Prettier
3. Ensures code quality before commit

### Commit Signing

For enhanced security, consider setting up GPG commit signing:

```bash
# See setup-gpg.md for detailed instructions
gpg --full-generate-key
git config --global commit.gpgsign true
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (pre-commit hooks will ensure quality)
4. Run tests: `npm test`
5. Submit a pull request
