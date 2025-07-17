/**
 * objeasy - A lightweight utility toolkit to control and manage plain JavaScript objects with precision.
 * @version 2.0.0
 * @author Kareem Aboueid
 * @license MIT
 */

export { default as pickit, PickitOptions } from './src/pickit/pickit';
export { default as modifyit, ModifyitOptions } from './src/modifyit/modifyit';

import pickit from './src/pickit/pickit';
import modifyit from './src/modifyit/modifyit';

/**
 * Default export containing all utility functions
 */
declare const _default: {
  pickit: typeof pickit;
  modifyit: typeof modifyit;
};

export default _default;
