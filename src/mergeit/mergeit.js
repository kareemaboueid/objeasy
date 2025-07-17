/**
 * Merge multiple objects into a new object with deep merging support.
 * @param {Object} target - The target object to merge into.
 * @param {...Object} sources - One or more source objects to merge.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.deep=true] - Whether to perform deep merging.
 * @param {boolean} [options.arrays=false] - Whether to merge arrays or replace them.
 * @returns {Object} A new object with merged properties.
 */
function mergeit(target, ...args) {
  // Extract options from last argument if it's an options object
  let sources = args;
  let options = { deep: true, arrays: false };

  if (
    args.length > 0 &&
    args[args.length - 1] &&
    typeof args[args.length - 1] === 'object' &&
    !Array.isArray(args[args.length - 1]) &&
    (args[args.length - 1].deep !== undefined || args[args.length - 1].arrays !== undefined)
  ) {
    options = { ...options, ...args[args.length - 1] };
    sources = args.slice(0, -1);
  }

  if (typeof target !== 'object' || target === null) {
    throw new TypeError('Target must be a non-null object.');
  }

  // Validate all sources
  for (let i = 0; i < sources.length; i++) {
    if (typeof sources[i] !== 'object' || sources[i] === null) {
      throw new TypeError(`Source at index ${i} must be a non-null object.`);
    }
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  // Helper function for deep cloning
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    if (isPlainObject(obj)) {
      const cloned = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj; // For dates, functions, etc.
  }

  // Helper function for merging
  function mergeObjects(target, source, deep, mergeArrays) {
    const result = deepClone(target);

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (deep && isPlainObject(targetValue) && isPlainObject(sourceValue)) {
          // Deep merge objects
          result[key] = mergeObjects(targetValue, sourceValue, deep, mergeArrays);
        } else if (deep && mergeArrays && Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          // Merge arrays
          result[key] = [...targetValue, ...sourceValue];
        } else {
          // Replace value
          result[key] = deepClone(sourceValue);
        }
      }
    }

    return result;
  }

  // Start with a deep clone of target
  let result = deepClone(target);

  // Merge each source
  for (const source of sources) {
    result = mergeObjects(result, source, options.deep, options.arrays);
  }

  return result;
}

module.exports = mergeit;
