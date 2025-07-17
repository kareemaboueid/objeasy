/**
 * objeasy - A lightweight utility toolkit to control and manage plain JavaScript objects with precision.
 * @version 2.0.0
 * @author Kareem Aboueid
 * @license MIT
 */

const pickit = require('./src/pickit/pickit');
const modifyit = require('./src/modifyit/modifyit');
const mergeit = require('./src/mergeit/mergeit');
const validateit = require('./src/validateit/validateit');
const transformit = require('./src/transformit/transformit');

module.exports = {
  pickit,
  modifyit,
  mergeit,
  validateit,
  transformit
};

exports.default = {
  pickit,
  modifyit,
  mergeit,
  validateit,
  transformit
};
