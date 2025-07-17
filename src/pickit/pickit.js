/**
 * Create a new object with selected keys.
 * @param {Object} originalObject - The original object from which to pick entries.
 * @param {string[]} keysToPick - An array of keys to pick from the original object.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.strict=true] - Whether to throw an error if a key doesn't exist.
 * @returns {Object} A new object containing only the picked entries.
 */
function pickit(originalObject, keysToPick, { strict = true } = {}) {
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }
  if (!Array.isArray(keysToPick)) {
    throw new TypeError('Keys to pick must be an array.');
  }

  const pickedObject = {};

  keysToPick.forEach(key => {
    if (typeof key !== 'string') {
      throw new TypeError('Keys to pick must be an array of strings.');
    }

    if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
      pickedObject[key] = originalObject[key];
    } else if (strict) {
      throw new Error(`Key "${key}" does not exist in the original object.`);
    }
  });

  return pickedObject;
}

module.exports = pickit;
