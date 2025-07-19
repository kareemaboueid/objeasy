/**
 * Options for the omitit function
 */
export interface OmititOptions {
  /**
   * Whether to throw an error if a key to omit doesn't exist in the object
   * @default false
   */
  strict?: boolean;
  /**
   * Whether to perform deep omitting on nested objects
   * Supports dot notation for nested key paths (e.g., 'user.address.city')
   * @default false
   */
  deep?: boolean;
}

/**
 * Create a new object by omitting specified keys from the original object
 * @param originalObject - The source object to omit keys from
 * @param keysToOmit - Array of keys to exclude from the result
 * @param options - Optional parameters
 * @returns A new object without the specified keys
 */
declare function omitit<T extends Record<string, any>>(
  originalObject: T,
  keysToOmit: (keyof T | string)[],
  options?: OmititOptions
): Partial<T>;

export default omitit;
