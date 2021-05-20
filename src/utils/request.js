/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-30 11:47:03
 * @LastEditTime: 2020-09-17 19:51:35
 * @LastEditors: ssssslf
 */
import axios from 'axios';
import qs from 'qs';
import cookie from 'js-cookie';
import xFetch from './xFetch';

import {
  urlSignStr,
  generateSalt,
  filterParams,
  stringifyJSON,
  // isEmpty,
  // dataType,
} from './utils';

import { statusCode } from './const';

import config from '../config';

const signstr = data => urlSignStr({
  playload: data,
  token: cookie.get('openid'),
  openid: cookie.get('openid'),
  randomStr: generateSalt(),
});

const request = async ({
  method = 'GET', url, headers = {}, data = {}, noFilterEmpty,
}) => {
  let filterData;
  if (noFilterEmpty) {
    filterData = data;
  } else {
    // 筛除空字段
    filterData = filterParams(data);
  }
  // 签名
  const sign = signstr(filterData);

  // 声明query & body
  let query = '';
  let body = null;

  // 设置query&body
  if (method.toLocaleUpperCase() === 'GET') {
    query = qs.stringify(filterData);
  } else {
    body = filterData;
  }

  const urlHandle = `${url}?${query}&${sign}`;
  try {
    const result = await axios({
      url: urlHandle,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': generateSalt(),
        ...headers,
      },
      data: body,
      method,
    });
    if (result.data && result.data.code) {
      const {
        data: {
          code, data: res, message: msg, success, count = 0,
        },
      } = result;
      if (code === statusCode.notLoginCode) {
        //  登录校验
        window.location.href = `${config.portal}/login?redirect=${encodeURIComponent(window.location.href)}`;
      }
      return {
        status: [statusCode.successCode].includes(code) || code === 'success' || success,
        code,
        data: res,
        msg,
        count,
      };
    }
    return result;
  } catch (err) {
    return {
      status: false,
      msg: stringifyJSON(err && err.message),
    };
  }
};

export default request;

export async function getData(sql) {
  console.log(sql);
  return xFetch('https://gh.quvideo.com/v1/query', {
    method: 'POST',
    body: JSON.stringify({ sql }).replace(/\+/g, 'self_plus'),
  });
}
