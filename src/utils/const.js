/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-02 16:21:19
 * @LastEditTime: 2020-09-17 19:17:22
 * @LastEditors: ssssslf
 */
export const APP_PRODUCT_LIST = {
  2: '小影',
  3: '简拍',
  6: 'VidStatus',
  10: 'Tempo',
  15: 'VivaCut',
  16: '甜影',
  18: 'vimix',
  35: 'facee',
  42: 'mast',
  43: 'gocut',
};

export const APP_PRODUCT_LIST_2 = {
  2: '小影',
  3: '简拍',
  6: 'VidStatus',
  10: 'Tempo',
  15: 'VivaCut',
  16: '甜影',
  18: 'vimix',
  35: 'facee',
  42: 'mast',
  43: 'gocut',
  101: '应用商城',
};

export const PLAFORM_LIST = {
  1: 'Android',
  2: 'iOS',
};

export const FORM_RULES = [
  {
    required: true,
    message: '必填！',
  },
];

//  请求前缀
export const requestUrlPre = {
  common: '/common',
  toolBase: '/tool-base',
  TOOL_ISSUE: '/tool-issue',
  SERVER_URL: '/quality-check',
  SERVER_URL_DEV: '/quality-check',
};
//  状态码
export const statusCode = {
  successCode: 20000,
  //  未登录
  notLoginCode: 40001,
};

export const QC_STATUS = {
  1: '未质检',
  2: '忽略',
  3: '已质检',
};

export const WARNING_STATUS = {
  1: '首响超时',
  2: '客服敏感词',
  3: '客户敏感词',
  4: '重复交互',
};

export const CHANNEL = {
  1: 'App Store',
  2: 'Google Play',
};

export const STAR = {
  1: '一星',
  2: '二星',
  3: '三星',
  4: '四星',
  5: '五星',
};

export const REPLY_STATUS = {
  1: '未处理',
  2: '等待发送',
  3: '发送失败',
  4: '发送成功',
};

export const LINK_PAGE_PATH = {
  issue: '/issue_system/manual_issue/',
  google: '/feedback_manage/application',
  appstore: '/feedback_manage/application',
  email: '/feedback_manage/email',
  huawei: '/feedback_manage/application',
};

export const APP_PRODUCT_LIST_WITHOUT_VID = {
  2: 'VivaVideo',
  3: 'SlidePlus',
  10: 'Tempo',
  15: 'VivaCut',
  16: 'VivaMini',
};
