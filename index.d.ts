/**
 * objeasy - A lightweight utility toolkit to control and manage plain JavaScript objects with precision.
 *
 * This package provides six powerful utility functions for object manipulation:
 * - pickit: Extract specific keys from objects
 * - modifyit: Modify or erase object properties
 * - mergeit: Merge multiple objects with deep merging support
 * - transformit: Transform object values using mapper functions
 * - omitit: Remove specific keys from objects (inverse of pickit)
 * - flattenit: Flatten nested objects to single-level with dot notation
 *
 * @version 2.0.0
 * @author Kareem Aboueid
 * @license MIT
 * @homepage https://github.com/kareemaboueid/objeasy
 */

// Named exports
export { default as pickit, PickitOptions } from './src/pickit/pickit';
export { default as modifyit, ModifyitOptions } from './src/modifyit/modifyit';
export { default as mergeit, MergeitOptions } from './src/mergeit/mergeit';
export { default as transformit, TransformitOptions, MapperFunction } from './src/transformit/transformit';
export { default as omitit, OmititOptions } from './src/omitit/omitit';
export { default as flattenit } from './src/flattenit/flattenit';

// Import functions for default export
import pickit from './src/pickit/pickit';
import modifyit from './src/modifyit/modifyit';
import mergeit from './src/mergeit/mergeit';
import transformit from './src/transformit/transformit';
import omitit from './src/omitit/omitit';
import flattenit from './src/flattenit/flattenit';

/**
 * Default export containing all utility functions
 */
declare const _default: {
  /** Extract specific keys from objects with type safety */
  pickit: typeof pickit;
  /** Modify or erase object properties with flexible options */
  modifyit: typeof modifyit;
  /** Merge multiple objects with deep merging support and array strategies */
  mergeit: typeof mergeit;
  /** Transform object values using mapper functions with key filtering */
  transformit: typeof transformit;
  /** Remove specific keys from objects (inverse of pickit) */
  omitit: typeof omitit;
  /** Flatten nested objects to single-level with dot notation */
  flattenit: typeof flattenit;
};

export default _default;
