/**
 * objeasy - A lightweight utility toolkit to control and manage plain JavaScript objects with precision.
 * @version 2.0.0
 * @author Kareem Aboueid
 * @license MIT
 */

export { default as pickit, PickitOptions } from './src/pickit/pickit';
export { default as modifyit, ModifyitOptions } from './src/modifyit/modifyit';
export { default as mergeit, MergeitOptions } from './src/mergeit/mergeit';
export {
  default as validateit,
  ValidateitOptions,
  ValidationResult,
  ValidationError,
  Schema
} from './src/validateit/validateit';
export { default as transformit, TransformitOptions, MapperFunction } from './src/transformit/transformit';

import pickit from './src/pickit/pickit';
import modifyit from './src/modifyit/modifyit';
import mergeit from './src/mergeit/mergeit';
import validateit from './src/validateit/validateit';
import transformit from './src/transformit/transformit';

/**
 * Default export containing all utility functions
 */
declare const _default: {
  pickit: typeof pickit;
  modifyit: typeof modifyit;
  mergeit: typeof mergeit;
  validateit: typeof validateit;
  transformit: typeof transformit;
};

export default _default;
