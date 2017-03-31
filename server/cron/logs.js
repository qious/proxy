'use strict';

const _ = require('lodash');
const config = require('config');
const cron = require('../lib/cron');
const {Log, IpLocation} = require('../service');

// 更新数据库中的地理位置信息
let set_location = cron(config.proxy_log.cron.set_location, function* () {
  if (config.proxy_log.save_days <= 0) {
    return;
  }

  let ips = yield Log.findIpsAsync();
  for (let ip of ips) {
    let location = yield IpLocation.getAsync(ip);
    if (location) {
      location = _.pick(location, ['region', 'city', 'isp']);
    } else {
      location = {region: '', city: '', isp: ''};
    }

    yield Log.updateByIpAsync(ip, location);
  }
});

// 清理过期日志
let data_clean = cron(config.proxy_log.cron.data_clean, function* () {
  if (config.proxy_log.save_days <= 0) {
    return;
  }

  yield Log.deleteByTimeAsync(config.proxy_log.save_days);
});

module.exports = {
  data_clean,
  set_location,
};
