/**
 * Flatten a nested object into a single-level object with dot notation keys
 * @param originalObject - The object to flatten (must be a plain object, not an array)
 * @returns A flattened object with dot notation keys
 * @throws {TypeError} When originalObject is not a non-null object or is an array
 *
 * @example
 * ```typescript
 * const nested = { user: { name: 'John', age: 30 }, config: { theme: 'dark' } };
 * const flat = flattenit(nested);
 * // Result: { 'user.name': 'John', 'user.age': 30, 'config.theme': 'dark' }
 * ```
 */
declare function flattenit(originalObject: Record<string, any>): Record<string, any>;

export default flattenit;
