/* eslint-disable react/jsx-filename-extension */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-17 16:43:39
 * @LastEditTime: 2020-10-21 10:25:09
 * @LastEditors: ssssslf
 */
import React from 'react';
import { Tag } from 'antd';

export const SOURCE = {
  1: '工单',
  2: '邮件',
  appstore: 'Appstore',
  google: 'GP',
  huawei: '华为',
  4: '电话',
};

export const QUAKLITY_TYPE = {
  1: '工单',
  2: '邮件',
  3: '应用商城',
  4: '电话',
};

export const QUAKLITY_TYPE_FULL = {
  1: '工单',
  2: '邮件',
  // 3: '应用商城',
  4: '电话',
  5: 'appstore',
  6: 'google',
  7: 'huawei',
};

export const dayLabel = {
  1: '反馈时间',
  2: '收信时间',
  appstore: '评论时间',
  google: '评论时间',
  huawei: '评论时间',
  3: '评论时间',
  4: '呼叫时间',
};

export const idLabel = {
  1: '工单ID',
  2: '邮件ID',
  huawei: '应用商城ID',
  appstore: '应用商城ID',
  google: '应用商城ID',
  3: '应用商城ID',
  id: '通话ID',
};

export const rateList = [
  { value: 1, name: '一星' },
  { value: 2, name: '二星' },
  { value: 3, name: '三星' },
  { value: 4, name: '四星' },
  { value: 5, name: '五星' },
];

export const RESPONSE_STATE = {
  // 0: '未处理',
  1: '等待发送',
  2: '发送成功',
  3: '发送失败',
};

export const RESPONSE_COLOR = {
  0: 'orange',
  1: 'gold',
  2: 'green',
  3: 'red',
};

export const VIP_STATUS = {
  0: '否',
  1: '是',
};
export const CHECK_TYPE = {
  0: '未质检',
  1: '处理中',
  2: '忽略',
  3: '已质检 ',
};
export const CHECK_COLOR = {
  0: 'red',
  1: 'blue',
  2: 'orange',
  3: 'green',
};
export const WARNING_TYPE = {
  0: '无预警',
  1: '首次响应时间',
  10: '客户敏感词',
  100: '客服敏感词',
  1000: '重复交互次数',
};
export const NumberToWarningType = (val) => {
  if (!val) {
    return <Tag color="green">无预警</Tag>;
  }
  const value = val.toString(2);
  console.log();
  return (
    <div>
      {value / 1000 >= 1 ? (
        <Tag color="volcano" style={{ marginTop: 5 }}>
          重复交互次数
        </Tag>
      ) : (
        ''
      )}
      {(value % 1000) / 100 >= 1 ? (
        <Tag color="volcano" style={{ marginTop: 5 }}>
          客服敏感词
        </Tag>
      ) : (
        ''
      )}
      {(value % 100) / 10 >= 1 ? (
        <Tag color="volcano" style={{ marginTop: 5 }}>
          客户敏感词
        </Tag>
      ) : (
        ''
      )}
      {value % 1000 === 1 ? (
        <Tag color="volcano" style={{ marginTop: 5 }}>
          首次响应时间
        </Tag>
      ) : (
        ''
      )}
    </div>
  );
};
export const WARNING_COLOR = {
  0: 'green',
  1: 'volcano',
  2: 'volcano',
  3: 'volcano',
  4: 'volcano',
};

export const ISREPLY_STATE = {
  1: '已回复',
  0: '未回复',
};

export const ISREPLY_COLOR = {
  0: 'red',
  1: 'green',
};

export const userJonContext = React.createContext({});

export const IS_PASS = {
  1: '合格',
  2: '不合格',
};

export const IS_PASS_COLOR = {
  1: 'green',
  2: 'red',
};

export const COMPLAINT_STATUS = {
  // 0: '未申述',
  2: '质检待审核',
  3: '质检审核通过',
  4: '质检审核未通过',
  5: '主管待审核',
  6: '主管审核通过',
  7: '主管审核未通过',
};

export const COMPLAINT_STATUS_COLOR = {
  0: 'blue',
  2: 'orange',
  3: 'green',
  4: 'red',
  5: 'orange',
  6: 'green',
  7: 'red',
};
// complaint_type
export const COMPLAINT_TYPE = {
  0: '客服首次申述',
  1: '质检审核通过并修正',
  2: '质检审核未通过',
  3: '客服再次申述',
  4: '主管审核通过并修正',
  5: '主管审核未通过',
};

export const sampleTypeValue = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  appstore: 3,
  google: 3,
  huawei: 3,
};
export const rules = [
  {
    required: true,
    message: '必填！',
  },
];

// 呼叫类型，值为 normal（普通来电）、dialout（外呼去电）、transfer（来电转接）、dialTransfer（外呼转接）
export const CONNECT_TYPE = {
  normal: '普通来电',
  dialout: '外呼去电',
  transfer: '来电转接',
  dialTransfer: '外呼转接',
};
export const CONNECT_TYPE_COLOR = {
  normal: 'blue',
  dialout: 'green',
  transfer: 'blue',
  dialTransfer: 'green',
};
// investigate 满意度； 1是满意 2是不满意

export const INVESTIGATE = {
  1: '满意',
  2: '不满意',
};
export const INVESTIGATE_COLOR = {
  1: 'green',
  2: 'red',
};

export const REPEAT_CALL = {
  '24h': '24h',
  '48h': '48h',
};
