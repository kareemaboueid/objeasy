/**
 * Flatten a nested object into a single-level object with dot notation keys.
 * @param {Object} originalObject - The object to flatten.
 * @param {string} [prefix=''] - Internal parameter for recursion, key prefix.
 * @returns {Object} A flattened object with dot notation keys.
 * @throws {TypeError} When originalObject is not a non-null object or is an array.
 */
function flattenit(originalObject, prefix = '') {
  // Input validation
  if (typeof originalObject !== 'object' || originalObject === null || Array.isArray(originalObject)) {
    throw new TypeError('Original object must be a non-null object.');
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  const result = {};

  for (const key in originalObject) {
    if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
      const value = originalObject[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (isPlainObject(value)) {
        // Check if the nested object has any properties to avoid empty objects
        const nestedKeys = Object.keys(value);
        if (nestedKeys.length > 0) {
          // Recursively flatten nested objects
          const flattened = flattenit(value, newKey);
          Object.assign(result, flattened);
        }
        // Skip empty objects - they don't contribute to the flattened result
      } else {
        // Add leaf values to result
        result[newKey] = value;
      }
    }
  }

  return result;
}

module.exports = flattenit;
