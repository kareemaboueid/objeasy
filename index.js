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
 * @author Kareem Aboueid
 * @license MIT
 * @homepage https://github.com/kareemaboueid/objeasy
 */

const pickit = require('./src/pickit/pickit');
const modifyit = require('./src/modifyit/modifyit');
const mergeit = require('./src/mergeit/mergeit');
const transformit = require('./src/transformit/transformit');
const omitit = require('./src/omitit/omitit');
const flattenit = require('./src/flattenit/flattenit');

// Named exports for CommonJS
module.exports = {
  pickit,
  modifyit,
  mergeit,
  transformit,
  omitit,
  flattenit
};

// Default export for ES6 modules compatibility
exports.default = {
  pickit,
  modifyit,
  mergeit,
  transformit,
  omitit,
  flattenit
};
