'use strict';

const isTest = require('../lib/test/is_test');

require('moder')(__dirname, {
  naming: 'camel',
  lazy: false,
  exports,
  filter: isTest,
});
