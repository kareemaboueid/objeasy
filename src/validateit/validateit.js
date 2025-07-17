/**
 * Validate an object against a schema.
 * @param {Object} object - The object to validate.
 * @param {Object} schema - The schema to validate against.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=false] - Whether to require all schema properties to be present.
 * @param {boolean} [options.allowExtra=true] - Whether to allow extra properties not in schema.
 * @returns {Object} Validation result with isValid boolean and errors array.
 */
function validateit(object, schema, { strict = false, allowExtra = true } = {}) {
  if (typeof object !== 'object' || object === null) {
    throw new TypeError('Object to validate must be a non-null object.');
  }

  if (typeof schema !== 'object' || schema === null) {
    throw new TypeError('Schema must be a non-null object.');
  }

  const errors = [];
  const result = { isValid: true, errors: [] };

  // Helper function to get type of value
  function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  // Helper function to validate a single value against schema rule
  function validateValue(value, rule, path = '') {
    // Handle string type rules
    if (typeof rule === 'string') {
      const expectedType = rule.toLowerCase();
      const actualType = getType(value);

      if (expectedType === 'any') return true;

      if (expectedType !== actualType) {
        errors.push({
          path,
          message: `Expected ${expectedType} but got ${actualType}`,
          expected: expectedType,
          actual: actualType,
          value
        });
        return false;
      }
      return true;
    }

    // Handle function type rules (custom validators)
    if (typeof rule === 'function') {
      try {
        const isValid = rule(value, path);
        if (!isValid) {
          errors.push({
            path,
            message: `Custom validation failed`,
            value
          });
          return false;
        }
        return true;
      } catch (error) {
        errors.push({
          path,
          message: `Custom validation error: ${error.message}`,
          value
        });
        return false;
      }
    }

    // Handle object type rules (nested schema)
    if (typeof rule === 'object' && rule !== null && !Array.isArray(rule)) {
      if (typeof value !== 'object' || value === null) {
        errors.push({
          path,
          message: `Expected object but got ${getType(value)}`,
          expected: 'object',
          actual: getType(value),
          value
        });
        return false;
      }

      // Recursively validate nested object
      let isValid = true;
      for (const key in rule) {
        if (Object.prototype.hasOwnProperty.call(rule, key)) {
          const nestedPath = path ? `${path}.${key}` : key;
          if (!validateValue(value[key], rule[key], nestedPath)) {
            isValid = false;
          }
        }
      }
      return isValid;
    }

    // Handle array type rules
    if (Array.isArray(rule)) {
      if (!Array.isArray(value)) {
        errors.push({
          path,
          message: `Expected array but got ${getType(value)}`,
          expected: 'array',
          actual: getType(value),
          value
        });
        return false;
      }

      // If rule has one element, validate all array items against it
      if (rule.length === 1) {
        let isValid = true;
        for (let i = 0; i < value.length; i++) {
          const itemPath = `${path}[${i}]`;
          if (!validateValue(value[i], rule[0], itemPath)) {
            isValid = false;
          }
        }
        return isValid;
      }
    }

    return true;
  }

  // Validate each schema property
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const hasProperty = Object.prototype.hasOwnProperty.call(object, key);

      if (!hasProperty && strict) {
        errors.push({
          path: key,
          message: `Required property '${key}' is missing`,
          expected: 'property to exist',
          actual: 'property missing'
        });
        continue;
      }

      if (hasProperty) {
        validateValue(object[key], schema[key], key);
      }
    }
  }

  // Check for extra properties if not allowed
  if (!allowExtra) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key) && !Object.prototype.hasOwnProperty.call(schema, key)) {
        errors.push({
          path: key,
          message: `Extra property '${key}' is not allowed`,
          expected: 'property not to exist',
          actual: 'extra property',
          value: object[key]
        });
      }
    }
  }

  result.isValid = errors.length === 0;
  result.errors = errors;

  return result;
}

module.exports = validateit;
