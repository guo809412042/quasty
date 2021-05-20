/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-04 11:02:12
 * @LastEditTime: 2020-10-16 17:01:11
 * @LastEditors: ssssslf
 */
import { requestUrlPre } from './utils/const';
import request from './utils/request';
/**
 * 获取所有国家
 * TODO 后期新加一个获取所有国家的接口，
 *      用来翻译显示的内容，当前用的接口做了权限过滤，无法获取所有国家
 * @param {Object} data
 */
export const getAllCountryList = async () => {
  const res = await request({
    url: `${requestUrlPre.common}/regioncountry/getcountrychoice/`,
  });
  return res;
};
export const getLangList = async () => {
  const res = await request({
    url: `${requestUrlPre.common}/regioncountry/get_lang_and_country/`,
  });
  return res;
};

/**
 * 获取有权限的国家列表
 * @param {Object} data
 */
export const getPowerCountryList = async () => {
  const res = await request({
    url: `${requestUrlPre.common}/regioncountry/getcountrychoice/`,
  });
  return res;
};

// 获取所有用户id => email
export async function getAllUser() {
  return request({ url: `${requestUrlPre.common}/vcmadmin/get-all-user/` });
}

// 服务标签
export async function getIssueList(params = {}) {
  // return request({ url: `${requestUrlPre.common}/vcmadmin/get-all-user/` });
  return request({
    url: `${requestUrlPre.TOOL_ISSUE}/api/issue-tag/list`,
    data: params,
  });
}

// 预警配置查询
export async function warningConfigQuery(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/warningConfig/query`,
    data: body,
    method: 'POST',
  });
}

// 预警配置添加
export async function warningConfigInsert(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/warningConfig/insert`,
    data: body,
    method: 'POST',
  });
}
// 预警配置编辑
export async function warningConfigUpdate(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/warningConfig/update`,
    data: body,
    method: 'POST',
  });
}
// 抽样规则配置查询
export async function sampleConfigQuery(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/sampleConfig/query`,
    data: body,
    method: 'POST',
  });
}

// 抽样规则配置添加
export async function sampleConfigInsert(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/sampleConfig/insert`,
    data: body,
    method: 'POST',
  });
}
// 抽样规则配置编辑
export async function sampleConfigUpdate(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/sampleConfig/update`,
    data: body,
    method: 'POST',
  });
}

// 质检方案配置add
export async function qualityScoreConfigInsert(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityScoreConfig/insert`,
    data: body,
    method: 'POST',
  });
}
// 质检方案配置update
export async function qualityScoreConfigUpdate(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityScoreConfig/update`,
    data: body,
    method: 'POST',
  });
}
// 质检方案配置query
export async function qualityScoreConfigQuery(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityScoreConfig/query`,
    data: body,
    method: 'POST',
  });
}
// 质检方案配置delete
export async function qualityScoreConfigDelete(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityScoreConfig/delete`,
    data: body,
    method: 'POST',
  });
}

// 服务标签
export async function getIssueTagsList(productId) {
  return request({
    url: `${requestUrlPre.TOOL_ISSUE}/api/issue-tag/list`,
    data: {
      isDelete: 0,
      productId,
    },
  });
}

// 邮件服务标签
export async function getEmailTagsListApi() {
  return request({
    url: '/autofeedback/feedback/tag_list',
  });
}

//  获取用户
export async function getUserListServer(params) {
  return request({
    url: `${requestUrlPre.common}/vcmadmin/getusers`,
    data: params,
  });
}

// 质检列表-邮件
export async function qualityCheckQueryEmail(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityCheck/queryEmail`,
    data: body,
    method: 'POST',
  });
}
// 质检列表-appstore
export async function qualityCheckQueryAppStore(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityCheck/queryAppStore`,
    data: body,
    method: 'POST',
  });
}
// 质检列表-phone
export async function qualityCheckQueryPhone(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityCheck/queryCustomerSource`,
    data: body,
    method: 'POST',
  });
}
// 质检列表-工单
export async function qualityCheckQueryIssueReport(body) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityCheck/queryIssueReport`,
    data: body,
    method: 'POST',
  });
}

// 翻译
export async function translate(params) {
  return request({
    url: `${requestUrlPre.TOOL_ISSUE}/api/common/translate/`,
    data: params,
    method: 'POST',
  });
}

// 质检员批量单个 领取/忽略质检单
export async function updateCheckTypeSVC(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/updateCheckType`,
    data: params,
    method: 'POST',
  });
}

// 质检员打分
export async function qualityStatusUpdateScore(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/updateScore`,
    data: params,
    method: 'POST',
  });
}

// 客服申述/再次申述 并打分
export async function operatorComplaint(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/operatorComplaint`,
    data: params,
    method: 'POST',
  });
}

// 获取申述列表
export async function complaintLogList(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/complaintLog/queryList`,
    data: params,
    method: 'POST',
  });
}

// 质检员/主管审核通过并且修正评分
export async function complaintPass(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/complaintPass`,
    data: params,
    method: 'POST',
  });
}
// 获取待申述列表
export async function complaintCheckList(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/complaintCheckList`,
    data: params,
    method: 'POST',
  });
}
// 获取待申述列表
export async function complaintNoPass(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/complaintNoPass`,
    data: params,
    method: 'POST',
  });
}

// 客服配置查询列表
export async function customerConfigQuery(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/customerConfig/query`,
    data: params,
    method: 'POST',
  });
}
// 客服配置添加
export async function customerConfigInsert(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/customerConfig/insert`,
    data: params,
    method: 'POST',
  });
}
// 客服配置编辑
export async function customerConfigUpdate(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/customerConfig/update`,
    data: params,
    method: 'POST',
  });
}
// 客服配置删除
export async function customerConfigDelete(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/customerConfig/delete`,
    data: params,
    method: 'POST',
  });
}
// 电话渠道
export async function queryCustomerSource(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityCheck/queryCustomerSource`,
    data: params,
    method: 'POST',
  });
}
// 电话（第三方客服平台）产品列表
export async function customerProductConfigQuery(params) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/customerProductConfig/query`,
    data: params,
    method: 'POST',
  });
}
// 电话（第三方客服平台）产品列表
export async function getOperatorNotQualityTotalApi(data) {
  return request({
    url: `${requestUrlPre.SERVER_URL_DEV}/api/rest/quality/qualityStatus/getOperatorNotQualityTotal`,
    method: 'POST',
    data,
  });
}
