/**
 * objeasy - A lightweight utility toolkit to control and manage plain JavaScript objects with precision.
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
