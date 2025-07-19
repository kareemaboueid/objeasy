/**
 * Options for the pickit function
 */
export interface PickitOptions {
  /**
   * Whether to throw an error if a key doesn't exist in the original object
   * @default true
   */
  strict?: boolean;
  /**
   * Whether to support nested path picking (e.g., 'user.name')
   * @default false
   */
  deep?: boolean;
}

/**
 * Create a new object with selected keys from the original object
 * @param originalObject - The original object from which to pick entries
 * @param keysToPick - An array of keys to pick from the original object
 * @param options - Optional parameters
 * @returns A new object containing only the picked entries
 */
declare function pickit<T extends Record<string, any>, K extends keyof T>(
  originalObject: T,
  keysToPick: K[],
  options?: PickitOptions
): Pick<T, K>;

export default pickit;
