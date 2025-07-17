/**
 * Validation error details
 */
export interface ValidationError {
  /**
   * The path to the property that failed validation
   */
  path: string;
  /**
   * Human-readable error message
   */
  message: string;
  /**
   * Expected type or value
   */
  expected?: string;
  /**
   * Actual type or value
   */
  actual?: string;
  /**
   * The actual value that failed validation
   */
  value?: any;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Whether the object is valid
   */
  isValid: boolean;
  /**
   * Array of validation errors (empty if valid)
   */
  errors: ValidationError[];
}

/**
 * Options for the validateit function
 */
export interface ValidateitOptions {
  /**
   * Whether to require all schema properties to be present in the object
   * @default false
   */
  strict?: boolean;
  /**
   * Whether to allow properties not defined in the schema
   * @default true
   */
  allowExtra?: boolean;
}

/**
 * Schema definition types
 */
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'undefined' | 'any';

export type CustomValidator = (value: any, path: string) => boolean;

export type SchemaRule = SchemaType | CustomValidator | { [key: string]: SchemaRule } | SchemaRule[];

export type Schema = { [key: string]: SchemaRule };

/**
 * Validate an object against a schema
 * @param object - The object to validate
 * @param schema - The schema to validate against
 * @param options - Optional parameters
 * @returns Validation result with isValid boolean and errors array
 */
declare function validateit(object: Record<string, any>, schema: Schema, options?: ValidateitOptions): ValidationResult;

export default validateit;
