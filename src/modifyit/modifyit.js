/**
 * Modify properties on an existing object with optional key erasure.
 * @param {Object} originalObject - The original object to modify.
 * @param {Object|Array} modifications - An object containing the modifications to apply, or an array of keys to erase when erase is true.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.erase=false] - Whether to erase the specified keys.
 * @param {boolean} [options.strict=false] - Whether to throw an error if modifying non-existent keys.
 * @returns {Object} A new object with the modifications applied.
 */
function modifyit(originalObject, modifications, { erase = false, strict = false } = {}) {
  if (typeof originalObject !== 'object' || originalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }

  // Create a copy of the original object
  const result = { ...originalObject };

  if (erase) {
    // In erase mode, modifications should be an array of keys to remove
    if (!Array.isArray(modifications)) {
      throw new TypeError('Keys to erase must be an array.');
    }

    for (const key of modifications) {
      if (typeof key !== 'string') {
        throw new TypeError('Keys to erase must be an array of strings.');
      }
      delete result[key];
    }
  } else {
    // In modify mode, modifications should be an object
    if (typeof modifications !== 'object' || modifications === null) {
      throw new TypeError('Modifications must be an object.');
    }

    for (const key in modifications) {
      if (Object.prototype.hasOwnProperty.call(modifications, key)) {
        if (strict && !Object.prototype.hasOwnProperty.call(originalObject, key)) {
          throw new Error(`Key "${key}" does not exist in the original object.`);
        }
        result[key] = modifications[key];
      }
    }
  }

  return result;
}

module.exports = modifyit;
