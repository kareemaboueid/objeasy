/**
 * Mapper function type
 */
export type MapperFunction<T = any, R = any> = (value: T, key: string) => R;

/**
 * Mapper configuration - either an object with mapper functions for specific keys,
 * or a single function to apply to all values
 */
export type Mappers<T extends Record<string, any>> = { [K in keyof T]?: MapperFunction<T[K]> } | MapperFunction;

/**
 * Options for the transformit function
 */
export interface TransformitOptions {
  /**
   * Whether to throw an error if no mapper is found for a key
   * @default false
   */
  strict?: boolean;
  /**
   * Whether to recursively transform nested objects
   * @default false
   */
  deep?: boolean;
  /**
   * Array of keys to include in transformation (whitelist)
   * Cannot be used together with excludeKeys
   */
  includeKeys?: string[];
  /**
   * Array of keys to exclude from transformation (blacklist)
   * Cannot be used together with includeKeys
   */
  excludeKeys?: string[];
}

/**
 * Transform object values using mapper functions
 * @param originalObject - The object to transform
 * @param mappers - Object with mapper functions for each key, or a single mapper function for all values
 * @param options - Optional parameters
 * @returns A new object with transformed values
 */
declare function transformit<T extends Record<string, any>>(
  originalObject: T,
  mappers: Mappers<T>,
  options?: TransformitOptions
): T;

export default transformit;
