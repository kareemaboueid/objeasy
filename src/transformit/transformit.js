/**
 * Transform object values using mapper functions.
 * @param {Object} originalObject - The object to transform.
 * @param {Object|Function} mappers - Object with mapper functions for each key, or a single mapper function for all values.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=false] - Whether to throw error if mapper is not found for a key.
 * @param {boolean} [options.deep=false] - Whether to recursively transform nested objects.
 * @param {string[]} [options.includeKeys] - Array of keys to include in transformation (whitelist).
 * @param {string[]} [options.excludeKeys] - Array of keys to exclude from transformation (blacklist).
 * @returns {Object} A new object with transformed values.
 */
function transformit(originalObject, mappers, { strict = false, deep = false, includeKeys, excludeKeys } = {}) {
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }

  if (typeof mappers !== 'object' && typeof mappers !== 'function') {
    throw new TypeError('Mappers must be an object or function.');
  }

  // Validate includeKeys and excludeKeys
  if (includeKeys && excludeKeys) {
    throw new TypeError('Cannot specify both includeKeys and excludeKeys options.');
  }

  if (includeKeys && !Array.isArray(includeKeys)) {
    throw new TypeError('includeKeys must be an array of strings.');
  }

  if (excludeKeys && !Array.isArray(excludeKeys)) {
    throw new TypeError('excludeKeys must be an array of strings.');
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  // Helper function to check if a key should be transformed
  function shouldTransformKey(key) {
    if (includeKeys) {
      return includeKeys.includes(key);
    }
    if (excludeKeys) {
      return !excludeKeys.includes(key);
    }
    return true; // Transform all keys by default
  }

  // Helper function for deep transformation
  function transformValue(value, key, mapperObj, shouldTransform = true) {
    // If key should not be transformed, return original value
    if (!shouldTransform) {
      // For deep transformation, still check nested objects
      if (deep && isPlainObject(value)) {
        return transformit(value, mapperObj, { strict, deep, includeKeys, excludeKeys });
      }
      return value;
    }

    // If we have a specific mapper for this key
    if (typeof mapperObj === 'object' && Object.prototype.hasOwnProperty.call(mapperObj, key)) {
      const mapper = mapperObj[key];
      if (typeof mapper === 'function') {
        return mapper(value, key);
      }
    }

    // Check for wildcard mapper '*'
    if (typeof mapperObj === 'object' && Object.prototype.hasOwnProperty.call(mapperObj, '*')) {
      const mapper = mapperObj['*'];
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
      return transformit(value, mapperObj, { strict, deep, includeKeys, excludeKeys });
    }

    // If strict mode and no mapper found
    if (
      strict &&
      typeof mapperObj === 'object' &&
      !Object.prototype.hasOwnProperty.call(mapperObj, key) &&
      !Object.prototype.hasOwnProperty.call(mapperObj, '*')
    ) {
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
      const shouldTransform = shouldTransformKey(key);

      try {
        result[key] = transformValue(originalValue, key, mappers, shouldTransform);
      } catch (error) {
        // Re-throw with additional context
        throw new Error(`Transformation failed for key "${key}": ${error.message}`);
      }
    }
  }

  return result;
}

module.exports = transformit;
