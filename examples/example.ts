import { pickit, modifyit } from '../index';

// Example usage with TypeScript
interface User {
  name: string;
  age: number;
  role: string;
  email?: string;
}

const user: User = {
  name: 'John Doe',
  age: 30,
  role: 'developer',
  email: 'john@example.com'
};

// Type-safe picking - TypeScript will enforce valid keys
const basicInfo = pickit(user, ['name', 'age']); // Type: Pick<User, 'name' | 'age'>
console.log('Basic info:', basicInfo);

// Type-safe modification
modifyit(user, {
  role: 'senior developer',
  age: 31
});
console.log('Modified user:', user);

// Example with strict mode disabled (using type assertion for demo)
const partialInfo = pickit(user, ['name', 'email'] as const, { strict: false });
console.log('Partial info:', partialInfo);

// Example with modifying properties
const modifiedUser = modifyit(user, { name: 'Jane Doe', age: 30 });
console.log('Modified user:', modifiedUser);

// Example with erase mode - removing specific keys
const userWithoutEmail = modifyit(user, ['email'], { erase: true });
console.log('User without email:', userWithoutEmail);
