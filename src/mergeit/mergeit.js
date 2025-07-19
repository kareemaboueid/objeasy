/**
 * Merge multiple objects into a new object with deep merging support.
 * @param {Object} target - The target object to merge into.
 * @param {...Object} sources - One or more source objects to merge.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.deep=true] - Whether to perform deep merging.
 * @param {boolean} [options.arrays=false] - Whether to merge arrays or replace them.
 * @param {string} [options.strategy='replace'] - Array merge strategy: 'concat', 'replace', or 'unique'.
 * @returns {Object} A new object with merged properties.
 */
function mergeit(target, ...args) {
  // Extract options from last argument if it's an options object
  let sources = args;
  let options = { deep: true, arrays: false, strategy: 'replace' };

  if (
    args.length > 0 &&
    args[args.length - 1] &&
    typeof args[args.length - 1] === 'object' &&
    !Array.isArray(args[args.length - 1]) &&
    (args[args.length - 1].deep !== undefined ||
      args[args.length - 1].arrays !== undefined ||
      args[args.length - 1].strategy !== undefined)
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

  // Validate strategy option
  const validStrategies = ['concat', 'replace', 'unique'];
  if (!validStrategies.includes(options.strategy)) {
    throw new TypeError(`Strategy must be one of: ${validStrategies.join(', ')}`);
  }

  // Helper function to check if value is a plain object
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object;
  }

  // Helper function for deep cloning with circular reference protection
  function deepClone(obj, visited = new Map()) {
    if (obj === null || typeof obj !== 'object') return obj;

    // Check for circular reference
    if (visited.has(obj)) {
      return visited.get(obj);
    }

    if (Array.isArray(obj)) {
      const clonedArray = [];
      visited.set(obj, clonedArray);
      for (let i = 0; i < obj.length; i++) {
        clonedArray[i] = deepClone(obj[i], visited);
      }
      return clonedArray;
    }

    if (isPlainObject(obj)) {
      const cloned = {};
      visited.set(obj, cloned);
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = deepClone(obj[key], visited);
        }
      }
      return cloned;
    }

    return obj; // For dates, functions, etc.
  }

  // Helper function for merging with circular reference protection
  function mergeObjects(target, source, deep, mergeArrays, strategy, visited = new Map()) {
    const result = deepClone(target, visited);

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (deep && isPlainObject(targetValue) && isPlainObject(sourceValue)) {
          // Deep merge objects - pass the same visited map to prevent infinite recursion
          result[key] = mergeObjects(targetValue, sourceValue, deep, mergeArrays, strategy, visited);
        } else if (deep && mergeArrays && Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          // Merge arrays based on strategy
          if (strategy === 'concat') {
            result[key] = [...targetValue, ...sourceValue];
          } else if (strategy === 'unique') {
            const merged = [...targetValue, ...sourceValue];
            result[key] = merged.filter((item, index, arr) => {
              // For primitive values, use simple equality
              if (typeof item !== 'object' || item === null) {
                return arr.indexOf(item) === index;
              }
              // For objects, use JSON.stringify for comparison (simple approach)
              const itemStr = JSON.stringify(item);
              return arr.findIndex(obj => JSON.stringify(obj) === itemStr) === index;
            });
          } else {
            // strategy === 'replace' (default behavior)
            result[key] = deepClone(sourceValue, visited);
          }
        } else {
          // Replace value
          result[key] = deepClone(sourceValue, visited);
        }
      }
    }

    return result;
  }

  // Start with a deep clone of target with circular reference protection
  const visited = new Map();
  let result = deepClone(target, visited);

  // Merge each source with shared visited map
  for (const source of sources) {
    result = mergeObjects(result, source, options.deep, options.arrays, options.strategy, visited);
  }

  return result;
}

module.exports = mergeit;
