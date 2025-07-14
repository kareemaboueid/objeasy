/**
 * # Pickit
 * @description Create a new object with selected keys.
 * @param {Object} orginalObject - The original object from which to pick entries.
 * @param {Array} keysToPick - An array of keys to pick from the original object.
 * @param {Object} options - Optional parameters.
 * @returns {Object} A new object containing only the picked entries.
 */
function pickit(orginalObject, keysToPick, { strict = true } = {}) {
  if (typeof orginalObject !== 'object' || orginalObject === null) {
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

    if (Object.prototype.hasOwnProperty.call(orginalObject, key)) {
      pickedObject[key] = orginalObject[key];
    } else if (strict) {
      throw new Error(`Key "${key}" does not exist in the original object.`);
    }
  });

  return pickedObject;
}

/**
 * # Modifyit
 * @description Modify properties on an existing object with optional key erasure.
 * @param {Object} orginalObject - The original object to modify.
 * @param {Object} modifications - An object containing the modifications to apply.
 * @param {Object} options - Optional parameters.
 * @returns {Object} The modified original object.
 */
function modifyit(orginalObject, modifications, { erase = false, strict = true } = {}) {
  if (typeof orginalObject !== 'object' || orginalObject === null) {
    throw new TypeError('Original object must be a non-null object.');
  }
  if (typeof modifications !== 'object' || modifications === null) {
    throw new TypeError('Modifications must be a non-null object.');
  }

  // If erase is true, remove all keys not in modifications
  if (erase) {
    for (const key in orginalObject) {
      if (!Object.prototype.hasOwnProperty.call(modifications, key)) {
        delete orginalObject[key];
      }
    }
  }

  for (const key in modifications) {
    if (Object.prototype.hasOwnProperty.call(modifications, key)) {
      if (strict && !Object.prototype.hasOwnProperty.call(orginalObject, key)) {
        throw new Error(`Key "${key}" does not exist in the original object.`);
      }
      orginalObject[key] = modifications[key];
    }
  }

  return orginalObject;
}

module.exports = {
  pickit,
  modifyit
};

exports.default = {
  pickit,
  modifyit
};
