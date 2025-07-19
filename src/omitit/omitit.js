/**
 * Create a new object by omitting specified keys from the original object.
 * @param {Object} originalObject - The source object to omit keys from.
 * @param {string[]} keysToOmit - Array of keys to exclude from the result.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=false] - Whether to throw error if a key to omit doesn't exist.
 * @param {boolean} [options.deep=false] - Whether to perform deep omitting on nested objects.
 * @returns {Object} A new object without the specified keys.
 * @throws {TypeError} When originalObject is not a non-null object or keysToOmit is not an array.
 * @throws {Error} When strict mode is enabled and a key doesn't exist.
 */
function omitit(originalObject, keysToOmit, { strict = false, deep = false } = {}) {
  // Input validation
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }

  if (!Array.isArray(keysToOmit)) {
    throw new TypeError('Keys to omit must be an array.');
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  // Helper function for checking nested key existence
  function hasNestedKey(obj, path) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
        return false;
      }
      current = current[key];
    }
    return true;
  }

  // Helper function for omitting nested keys
  function omitNestedKey(obj, path) {
    const keys = path.split('.');
    const result = JSON.parse(JSON.stringify(obj)); // Deep clone
    let current = result;

    // Navigate to the parent of the key to omit
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return result;
      current = current[keys[i]];
    }

    // Delete the final key
    delete current[keys[keys.length - 1]];
    return result;
  }

  // Validate keys in strict mode
  if (strict) {
    for (const key of keysToOmit) {
      if (typeof key !== 'string') {
        throw new TypeError('All keys to omit must be strings.');
      }

      // Handle dot notation keys differently
      if (key.includes('.')) {
        if (deep && !hasNestedKey(originalObject, key)) {
          throw new Error(`Nested key "${key}" does not exist in the object.`);
        }
      } else {
        if (!Object.prototype.hasOwnProperty.call(originalObject, key)) {
          throw new Error(`Key "${key}" does not exist in the object.`);
        }
      }
    }
  }

  // Create a new object excluding the specified keys
  const result = {};

  // Handle deep omitting with dot notation
  if (deep) {
    // First, copy the entire object
    let workingObject = JSON.parse(JSON.stringify(originalObject));

    // Check for dot notation keys and handle them
    const dotNotationKeys = keysToOmit.filter(key => key.includes('.'));
    const regularKeys = keysToOmit.filter(key => !key.includes('.'));

    // Remove dot notation keys
    for (const key of dotNotationKeys) {
      if (hasNestedKey(workingObject, key)) {
        workingObject = omitNestedKey(workingObject, key);
      }
    }

    // Remove regular keys and handle deep omitting for nested objects
    for (const key in workingObject) {
      if (Object.prototype.hasOwnProperty.call(workingObject, key)) {
        if (!regularKeys.includes(key)) {
          const value = workingObject[key];
          if (isPlainObject(value)) {
            // Recursively omit from nested objects
            result[key] = omitit(value, keysToOmit, { strict, deep });
          } else {
            result[key] = value;
          }
        }
      }
    }
  } else {
    // Shallow omitting
    for (const key in originalObject) {
      if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
        if (!keysToOmit.includes(key)) {
          result[key] = originalObject[key];
        }
      }
    }
  }

  return result;
}

module.exports = omitit;
