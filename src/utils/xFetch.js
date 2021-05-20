/*
 * @Author: ssssslf
 * @Date: 2019-10-29 14:51:11
 * @LastEditTime: 2020-06-15 11:00:06
 * @LastEditors: ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/utils/xFetch.js
 */
import fetch from 'isomorphic-fetch';

function xFetch(url, options) {
  const opts = { ...options };
  opts.headers = {
    ...opts.headers,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  return fetch(url, opts).then(res => res.json());
}

export default xFetch;
