'use strict';

const co = require('co');
const {CronJob} = require('cron');
const logger = require('./logger');

module.exports = function (time, action) {
  let cron = new CronJob(time, function () {
    return co(action).catch(logger.error);
  });
  cron._action = action;
  return cron;
};
