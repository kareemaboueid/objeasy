/**
 * Create a new object with selected keys.
 * @param {Object} originalObject - The original object from which to pick entries.
 * @param {string[]} keysToPick - An array of keys to pick from the original object.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=true] - Whether to throw an error if a key doesn't exist.
 * @param {boolean} [options.deep=false] - Whether to support nested path picking (e.g., 'user.name').
 * @returns {Object} A new object containing only the picked entries.
 */
function pickit(originalObject, keysToPick, { strict = true, deep = false } = {}) {
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }
  if (!Array.isArray(keysToPick)) {
    throw new TypeError('Keys to pick must be an array.');
  }

  // Helper function to get nested value by path
  function getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return { exists: false, value: undefined };
      }
      if (!Object.prototype.hasOwnProperty.call(current, key)) {
        return { exists: false, value: undefined };
      }
      current = current[key];
    }

    return { exists: true, value: current };
  }

  // Helper function to set nested value by path
  function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  const pickedObject = {};

  keysToPick.forEach(key => {
    if (typeof key !== 'string') {
      throw new TypeError('Keys to pick must be an array of strings.');
    }

    if (deep && key.includes('.')) {
      // Handle nested path picking
      const { exists, value } = getNestedValue(originalObject, key);

      if (exists) {
        setNestedValue(pickedObject, key, value);
      } else if (strict) {
        throw new Error(`Nested path "${key}" does not exist in the original object.`);
      }
    } else {
      // Handle regular key picking
      if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
        pickedObject[key] = originalObject[key];
      } else if (strict) {
        throw new Error(`Key "${key}" does not exist in the original object.`);
      }
    }
  });

  return pickedObject;
}

module.exports = pickit;
