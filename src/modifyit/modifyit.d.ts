/**
 * Options for the modifyit function
 */
export interface ModifyitOptions {
  /**
   * Whether to erase the specified keys instead of modifying
   * When true, the modifications parameter should be an array of keys to remove
   * @default false
   */
  erase?: boolean;
  /**
   * Whether to throw an error if trying to modify a key that doesn't exist in the original object
   * Only applies when erase is false
   * @default false
   */
  strict?: boolean;
}

/**
 * Modify properties on an existing object with optional key erasure
 * @param originalObject - The original object to modify
 * @param modifications - An object containing the modifications to apply, or an array of keys to erase when erase is true
 * @param options - Optional parameters
 * @returns A new object with the modifications applied
 */
declare function modifyit<T extends Record<string, any>>(
  originalObject: T,
  modifications: Partial<T>,
  options?: ModifyitOptions & { erase?: false }
): T;

declare function modifyit<T extends Record<string, any>>(
  originalObject: T,
  modifications: (keyof T)[],
  options: ModifyitOptions & { erase: true }
): Partial<T>;

export default modifyit;
