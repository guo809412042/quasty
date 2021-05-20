/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-cycle */
import XLSX from 'xlsx';
import qs from 'qs';
import cookie from 'js-cookie';
// downloadRes('http://xy-hybrid.kakalili.com/vcm/20200728/211113/202007282111138.vvc', '测试.vvc')
import * as clipboard from 'clipboard-polyfill';
import moment from 'moment';
import { message } from 'antd';
import { LINK_PAGE_PATH } from './const';
// import { productDict, projectTypeDict, groupDict } from './const';

// const UIDCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * [generateSalt 生成一个随机盐]
 */
const generateSalt = () => Math.random()
  .toString(36)
  .slice(7) + Date.now();

/**
 * 生成 url 签名
 */
const urlSignStr = ({
  playload, token, openid, randomStr,
}) => {
  const queryDoc = {
    token,
    openid,
    nonce_str: randomStr || generateSalt(),
    timestamp: Date.now(),
    playload,
  };

  let str = '';
  const signObj = window.signOAuth(queryDoc, true);
  queryDoc.sign = signObj.sign;
  ['token', 'playload'].map((item) => {
    delete queryDoc[item];
  });

  Object.keys(queryDoc).map((item) => {
    str += `&${item}=${queryDoc[item]}`;
  });
  str = str.slice(1);
  return str;
};

/**
 * 删除左右空格
 * @param {String} str
 */
const trim = (str) => {
  try {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  } catch (err) {
    return str;
  }
};

const filterParams = (opts) => {
  const res = {};
  Object.keys(opts).forEach((prop) => {
    if (!opts[prop] && typeof opts[prop] !== 'number') return;
    res[prop] = opts[prop];
  });
  return res;
};

const getLang = () => cookie.get('lang') || localStorage.getItem('lang') || 'zh-Hans-CN';

const getEmailName = () => cookie.get('email');
const getUserId = () => cookie.get('userid');
/**
 * 字典转数组
 * @param {Object} obj
 */
const dict2Array = (obj, value = 'value', label = 'label') => {
  const arr = [];
  Object.keys(obj).map((key) => {
    arr.push({
      [value]: key,
      [label]: obj[key],
    });
  });
  return arr;
};

/**
 * 数组转字典
 * @param {Array} array
 */
const array2Dict = (array, key = 'key', value = 'value') => {
  const dict = {};
  array.map((item) => {
    dict[item[key]] = item[value];
  });
  return dict;
};

/**
 * 获取产品ID，projecttype
 */
const getProductPtAndGroup = () => {
  const url = window.location.href;
  const reg = /p=[0-9]+&pt=[0-9]+&g=[0-9]+/;
  const result = {
    productId: 15,
    projectType: 1,
    groupId: 1,
  };
  const dict = {
    p: 'productId',
    pt: 'projectType',
    g: 'groupId',
  };
  try {
    const [paramStr] = url.match(reg);
    const strArr = paramStr.split('&');
    strArr.map((item) => {
      const [key, value] = item.split('=');
      result[dict[key]] = value;
    });
    return result;
  } catch (err) {
    return result;
  }
};

const stringifyJSON = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    return obj;
  }
};

const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
};

const dataType = (data) => {
  const str = Object.prototype.toString.call(data);
  const type = str.slice(8, -1);
  return type.toLocaleLowerCase();
};

/**
 * 判断是否是空数据 {}, [], Null, '', undefind, Boolean
 * @param {*} obj any
 */
const isEmpty = (obj) => {
  const type = dataType(obj);
  // 约定：传入boolean类型，说明实际是有值的
  if (type === 'boolean') return false;
  if (type === 'string') return obj.length === 0;
  if (type === 'nan') return true;
  // if (type === 'array') return obj.length === 0;
  if (type === 'object') return Object.keys(obj).length === 0;
  if (['date', 'html', 'browser', 'number', 'infinity', 'function'].includes(type)) return false;
  if (!obj) return true;
  // return false;
};

/**
 * 获取事件参数
 * @param {Object} obj
 */
const getEventTypeAndContent = (obj) => {
  let eventCode;
  const eventContent = {};
  Object.keys(obj).map((key) => {
    if (key === 'eventType') {
      eventCode = obj[key];
    }
    if (key.includes('_')) {
      const [code] = key.split('_');
      const text = key
        .split('_')
        .slice(2)
        .join('_');
      if (Number(code) === Number(eventCode)) {
        let value = obj[key];
        value = value && typeof value === 'string' ? trim(value) : value;
        eventContent[text] = value;
      }
    }
  });
  return {
    eventCode,
    eventContent,
  };
};

/**
 * 获取带有前缀的事件参数
 * @param {Object} obj
 */
const getEventTypeAndContentByPreFix = (obj, eventKey = 'eventType', preFix) => {
  let eventCode;
  const eventContent = {};
  Object.keys(obj).map((key) => {
    if (key === eventKey) {
      eventCode = obj[key];
    }
    if (key.includes('_') && key.includes(preFix)) {
      const [, code] = key.split('_');
      const text = key
        .split('_')
        .slice(2)
        .join('_');
      if (Number(code) === Number(eventCode)) {
        let value = obj[key];
        value = value && typeof value === 'string' ? trim(value) : value;
        eventContent[text] = value;
      }
    }
  });
  return {
    eventCode,
    eventContent,
  };
};

/**
 * 组装默认的事件参数值
 * @param {*} eventType
 * @param {*} contentStr
 */
const getInitialEventContent = (eventType, contentStr, preFix = '') => {
  const eventContent = parseJSON(contentStr);
  const defaultEventContent = {};
  if (eventType && contentStr) {
    Object.keys(eventContent).map((key) => {
      const value = eventContent[key] && typeof eventContent[key] === 'string' ? trim(eventContent[key]) : eventContent[key];
      defaultEventContent[`${preFix}${eventType}_${key}`] = value;
    });
  }
  return defaultEventContent;
};

const urlParse = (key, infoStr = window.location.href.split('?')[1]) => {
  const urlInfo = {};
  try {
    if (infoStr) {
      const infoArr = infoStr.split('&');
      for (let i = 0, l = infoArr.length; i < l; i++) {
        const arr = infoArr[i].split('=');
        urlInfo[arr[0]] = arr[1];
      }
    }
  } catch (err) {
    console.log(err);
  }
  if (key) {
    return urlInfo[key];
  }
  return urlInfo;
};

/**
 * 获取图片宽高
 * @param {String} url
 */
const getImgSize = url => new Promise((resolve) => {
  const img = new Image();
  img.src = url;
  img.onload = function () {
    resolve({
      width: img.width,
      height: img.height,
    });
  };
  img.onerror = function () {
    resolve({
      width: 0,
      height: 0,
    });
  };
});

/**
 *
 * @param {String} url
 */
const getVideoSize = url => new Promise((resolve) => {
  const videoObj = document.createElement('video');
  videoObj.onloadedmetadata = function () {
    URL.revokeObjectURL(url);
    resolve({
      width: videoObj.videoWidth,
      height: videoObj.videoHeight,
    });
  };
  videoObj.onerror = function () {
    resolve({
      width: 0,
      height: 0,
    });
  };
  videoObj.src = url;
  videoObj.load();
});

const changeOssUrl = (country, url) => url.replace('rc.vivacut.cn', country === 'CN' || country === '中国大陆' ? 'rc.vivacut.cn' : 'rc.vccresource.com');

export {
  generateSalt,
  urlSignStr,
  filterParams,
  getLang,
  dict2Array,
  array2Dict,
  getProductPtAndGroup,
  stringifyJSON,
  parseJSON,
  dataType,
  getEventTypeAndContent,
  getEventTypeAndContentByPreFix,
  getInitialEventContent,
  urlParse,
  isEmpty,
  getImgSize,
  getVideoSize,
  trim,
  changeOssUrl,
  getEmailName,
  getUserId,
};

export const downloadRes = async (url, name) => {
  const response = await fetch(url);
  // 内容转变成blob地址
  const blob = await response.blob();
  // 创建隐藏的可下载链接
  const objectUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  // 地址
  a.href = objectUrl;
  // 修改文件名
  a.download = name;
  // 触发点击
  document.body.appendChild(a);
  a.click();
  // 移除
  setTimeout(() => document.body.removeChild(a), 1000);
};

export const formatTimeToISOString = (data, type = '1') => new Date(moment(data).format('YYYY-MM-DD') + (type === '1' ? ' 00:00:00' : ' 23:59:59')).toISOString();

export const formatTimeToISOStringSingle = data => new Date(moment(data).format('YYYY-MM-DD HH:mm:ss')).toISOString();

export const formatDate = (value, format = 'YYYY-MM-DD') => (value ? moment(value).format(format) : '');

// 复制
export const handleCopyText = (content) => {
  // const input = document.createElement('textarea');
  // input.value = content;
  // document.body.appendChild(input);
  // input.select();
  // if (document.execCommand('copy')) {
  //   document.execCommand('copy');
  //   message.success('已复制');
  // }
  // document.body.removeChild(input);
  clipboard.writeText(content).then(
    () => {
      message.success('已复制');
    },
    (err) => {
      console.log('err: ', err);
      message.error('复制失败');
    },
  );
};

// 富文本复制
export const cpoyRichText = (text) => {
  const div = document.createElement('div');
  div.innerHTML = text;

  const blob = new Blob([new XMLSerializer().serializeToString(div)], { type: 'text/html' });
  const items = [
    new clipboard.ClipboardItem({
      'text/html': blob,
    }),
  ];
  clipboard.write(items).then(
    () => {
      message.success('已复制');
    },
    (err) => {
      console.log('err: ', err);
      message.error('复制失败');
    },
  );
};

// 将秒数转换为时分秒格式
export function formatSeconds(value) {
  if (!value) {
    return '-';
  }
  let theTime = parseInt(value, 10); // 秒
  let middle = 0; // 分
  let hour = 0; // 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60, 10);
    theTime = parseInt(theTime % 60, 10);
    if (middle > 60) {
      hour = parseInt(middle / 60, 10);
      middle = parseInt(middle % 60, 10);
    }
  }
  let result = `${parseInt(theTime, 10)}秒`;
  if (middle > 0) {
    result = `${parseInt(middle, 10)}分${result}`;
  }
  if (hour > 0) {
    result = `${parseInt(hour, 10)}小时${result}`;
  }
  return result;
}

// 将字符串转ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

// 将workbook装化成blob对象
function workbook2blob(workbook) {
  // 生成excel的配置项
  const wopts = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    // 二进制类型
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  });
  return blob;
}

// 将blob对象创建bloburl，然后用a标签实现弹出下载框
function openDownloadDialog(blob, fileName) {
  if (typeof blob === 'object' && blob instanceof Blob) {
    blob = URL.createObjectURL(blob); // 创建blob地址
  }
  const aLink = document.createElement('a');
  aLink.href = blob;
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || '';
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  //   移动端
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
  URL.revokeObjectURL(blob);
}
export function exportExcel(data, fileName = '导出.xlsx') {
  const sheet1 = XLSX.utils.json_to_sheet(data);
  // 创建一个新的空的workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet1, fileName.split('.')[0]);
  const workbookBlob = workbook2blob(wb);
  openDownloadDialog(workbookBlob, fileName);
}

// 跳转vcm-工单列表-显示本工单的信息
export function gotoIssuePage(params) {
  const { pageType, p, ...rest } = params;
  const path = LINK_PAGE_PATH[pageType];

  if (['google', 'appstore', 'huawei', 'email'].indexOf(pageType) > -1) {
    return `/page?p=${p}&${qs.stringify(rest)}#${path}`;
  }
  return `/page?p=${p}&fg=viva-tools-issue#${path}?${qs.stringify(rest)}`;
}

export const createSqlWhere = ({
  sql,
  startDate,
  endDate,
  where,
  day,
  type,
  database,
  denominator,
  molecular,
  product,
  order,
  country,
  platform,
  state,
  dateFormat = 'YYYYMMDD',
  select,
  yestoday = moment().subtract(1, 'days'),
  weekday = moment().subtract(7, 'days'),
  otherWhere = '',
  group,
  query,
}) => {
  const fetchSql = sql
    .replace(/#startDate#/g, moment(startDate).format(dateFormat))
    .replace(/#endDate#/g, moment(endDate).format(dateFormat))
    .replace(/#yestoday#/g, moment(yestoday).format(dateFormat))
    .replace(/#weekday#/g, moment(weekday).format(dateFormat))
    .replace(/#where#/g, where)
    .replace(/#database#/g, database)
    .replace(/#product#/g, product)
    .replace(/#denominator#/g, denominator)
    .replace(/#molecular#/g, molecular)
    .replace(/#day#/g, day)
    .replace(/#country#/g, country)
    .replace(/#order#/g, order)
    .replace(/#platform#/g, platform)
    .replace(/#state#/g, state)
    .replace(/#select#/g, select)
    .replace(/#otherWhere#/g, otherWhere)
    .replace(/#group#/g, group)
    .replace(/#type#/g, type)
    .replace(/#query#/g, query);
  return fetchSql;
};

// 工单客户评分界面文本框输入的跪着 方法
export const rulesFunction = (value, v) => {
  if ((value > v.scoreStandardMin && value > v.scoreStandardMax) || value < 0) {
    return Promise.reject(new Error(`${v.scoreStandardMin}-${v.scoreStandardMax}的值`));
  }
  return Promise.resolve(value);
};
