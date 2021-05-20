/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-01 15:13:41
 * @LastEditTime: 2020-07-22 10:17:33
 * @LastEditors: ssssslf
 */
const config = {
  target: process.env.BUILD_ENV ? '/vcm/quality/dist/' : '',
  host: process.env.BUILD_ENV ? '' : 'http://rc.quvideo.vip',
};
module.exports = config;
