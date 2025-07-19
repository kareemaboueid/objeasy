/**
 * Options for the mergeit function
 */
export interface MergeitOptions {
  /**
   * Whether to perform deep merging of nested objects
   * @default true
   */
  deep?: boolean;
  /**
   * Whether to merge arrays or replace them
   * When true, arrays are merged according to the strategy; when false, source arrays replace target arrays
   * @default false
   */
  arrays?: boolean;
  /**
   * Array merge strategy when arrays option is true
   * - 'concat': Concatenate arrays together
   * - 'replace': Replace target array with source array (default behavior)
   * - 'unique': Concatenate arrays and remove duplicates
   * @default 'replace'
   */
  strategy?: 'concat' | 'replace' | 'unique';
}

/**
 * Merge multiple objects into a new object with deep merging support
 * @param target - The target object to merge into
 * @param sources - One or more source objects to merge
 * @param options - Optional parameters
 * @returns A new object with merged properties
 */
declare function mergeit<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T;

declare function mergeit<T extends Record<string, any>>(target: T, source1: Partial<T>, options: MergeitOptions): T;

declare function mergeit<T extends Record<string, any>>(
  target: T,
  source1: Partial<T>,
  source2: Partial<T>,
  options: MergeitOptions
): T;

declare function mergeit<T extends Record<string, any>>(
  target: T,
  source1: Partial<T>,
  source2: Partial<T>,
  source3: Partial<T>,
  options: MergeitOptions
): T;

export default mergeit;
