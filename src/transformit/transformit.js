/**
 * Transform object values using mapper functions.
 * @param {Object} originalObject - The object to transform.
 * @param {Object|Function} mappers - Object with mapper functions for each key, or a single mapper function for all values.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=false] - Whether to throw error if mapper is not found for a key.
 * @param {boolean} [options.deep=false] - Whether to recursively transform nested objects.
 * @returns {Object} A new object with transformed values.
 */
function transformit(originalObject, mappers, { strict = false, deep = false } = {}) {
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }

  if (typeof mappers !== 'object' && typeof mappers !== 'function') {
    throw new TypeError('Mappers must be an object or function.');
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  // Helper function for deep transformation
  function transformValue(value, key, mapperObj) {
    // If we have a specific mapper for this key
    if (typeof mapperObj === 'object' && Object.prototype.hasOwnProperty.call(mapperObj, key)) {
      const mapper = mapperObj[key];
      if (typeof mapper === 'function') {
        return mapper(value, key);
      }
    }

    // If mappers is a single function, apply it to all values
    if (typeof mapperObj === 'function') {
      return mapperObj(value, key);
    }

    // If deep transformation is enabled and value is a plain object
    if (deep && isPlainObject(value)) {
      return transformit(value, mapperObj, { strict, deep });
    }

    // If strict mode and no mapper found
    if (strict && typeof mapperObj === 'object' && !Object.prototype.hasOwnProperty.call(mapperObj, key)) {
      throw new Error(`No mapper function found for key "${key}".`);
    }

    // Return original value if no transformation
    return value;
  }

  // Create new object with transformed values
  const result = {};

  for (const key in originalObject) {
    if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
      const originalValue = originalObject[key];

      try {
        result[key] = transformValue(originalValue, key, mappers);
      } catch (error) {
        // Re-throw with additional context
        throw new Error(`Transformation failed for key "${key}": ${error.message}`);
      }
    }
  }

  return result;
}

module.exports = transformit;
