/**
 * Basic JavaScript Example for objeasy
 */

const { pickit, modifyit } = require('../index');

console.log('objeasy Basic Example\n');

// Example 1: Using pickit
const user = {
  id: 1,
  name: 'Alice Johnson',
  age: 28,
  role: 'developer',
  email: 'alice@example.com',
  city: 'San Francisco',
  country: 'USA'
};

console.log('Original user:', user);

// Pick only the essential information
const basicInfo = pickit(user, ['name', 'role', 'email']);
console.log('Basic info:', basicInfo);

// Pick with non-strict mode
const partialInfo = pickit(user, ['name', 'nonexistent'], { strict: false });
console.log('Partial info (non-strict):', partialInfo);

console.log('\n---\n');

// Example 2: Using modifyit
const product = {
  id: 101,
  name: 'Laptop',
  price: 999,
  category: 'Electronics'
};

console.log('Original product:', product);

// Modify the product
modifyit(
  product,
  {
    price: 899,
    category: 'Computers',
    onSale: true
  },
  { strict: false }
);

console.log('Modified product:', product);

console.log('\n---\n');

// Example 3: Using modifyit with erase mode
const settings = {
  theme: 'dark',
  notifications: true,
  autoSave: false,
  language: 'en'
};

console.log('Original settings:', settings);

// Modify settings with new values
const modifiedSettings = modifyit(settings, {
  theme: 'light',
  notifications: false,
  newSetting: 'value'
});

console.log('Modified settings:', modifiedSettings);

// Remove specific keys using erase mode
const settingsWithoutKeys = modifyit(settings, ['autoSave', 'language'], { erase: true });

console.log('Settings after removing autoSave and language:', settingsWithoutKeys);

console.log('\nExamples completed!');
