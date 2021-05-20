import { requestUrlPre } from '../../../utils/const';
import request from '../../../utils/request';

const { TOOL_ISSUE } = requestUrlPre;

// 获取用户常用搜索列表
export function getSearhListApi(params) {
  return request({
    method: 'get',
    url: `/${TOOL_ISSUE}/api/issue-search/list`,
    data: params,
  });
}

// 创建用户常用搜索
export function createSearchApi(data) {
  return request({
    url: `/${TOOL_ISSUE}/api/issue-search/create`,
    method: 'post',
    data,
  });
}

// 修改用户常用搜索
export function editSearchApi(data) {
  return request({
    url: `/${TOOL_ISSUE}/api/issue-search/edit`,
    method: 'post',
    data,
  });
}

// 删除用户常用搜索
export function deleteSearchApi(data) {
  return request({
    url: `/${TOOL_ISSUE}/api/issue-search/delete`,
    method: 'post',
    data,
  });
}
