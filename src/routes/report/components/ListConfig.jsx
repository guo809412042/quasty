import { Tooltip } from 'antd';
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default () => [
  {
    title: (
      <Tooltip title="总处理量=客服处理工单/邮件/应用商店/电话总量">
        <span>总处理量</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'total',
  },
  {
    title: '已质检量',
    key: 'is_check',
  },
  {
    title: '待质检量',
    key: 'wait_check',
  },
  {
    title: '质检覆盖率',
    key: 'cover',
    formatter: v => (v ? Math.round(v * 10000) / 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '质检客服数',
    key: 'customer',
  },
  {
    title: '质检平均得分',
    key: 'avgscore',
    props: {
      precision: 2,
    },
  },
  {
    title: '质检合格率',
    key: 'qualifend',
    formatter: v => (v ? Math.round(v * 10000) / 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '首次申诉量',
    key: 'fst_complain',
  },
  {
    title: '首次申诉通过量',
    key: 'fst_complain_pass',
  },
  {
    title: '首次申诉通过率',
    key: 'fst_com_pas_rate',
    formatter: v => (v ? Math.round(v * 10000) / 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: '再次申诉量',
    key: 'aga_complain',
  },
  {
    title: '再次申诉通过量',
    key: 'aga_complain_pass',
  },
  {
    title: '再次申诉通过率',
    key: 'aga_com_pas_rate',
    formatter: v => (v ? Math.round(v * 10000) / 100 : 0),
    props: {
      precision: 2,
      suffix: '%',
    },
  },
  {
    title: (
      <Tooltip title="首响超时预警量：首响超时预警工单中，未被质检评分操作为“忽略”的量">
        <span>首响超时警报预警量</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'is_fst_resp_otime',
  },
  {
    title: (
      <Tooltip title="客户敏感词：客户敏感词预警工单中，未被质检评分操作为“忽略”的量">
        <span>客户敏感词</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'is_client_sensitive',
  },
  {
    title: (
      <Tooltip title="客服敏感词：客服敏感词预警工单中，未被质检评分操作为“忽略”的量">
        <span>客服敏感词</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'is_customer_sensitive',
  },
  {
    title: (
      <Tooltip title="首响超时忽略量：首响超时预警工单中，质检评分操作为“忽略”的量">
        <span>首响超时忽略量</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'fst_resp_otime',
  },
  {
    title: (
      <Tooltip title="客户敏感词忽略量：客户敏感词预警工单中，质检评分操作为“忽略”的量">
        <span>客户敏感词忽略量</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'client_sensitive',
  },
  {
    title: (
      <Tooltip title="客户敏感词忽略量：客户敏感词预警工单中，质检评分操作为“忽略”的量">
        <span>客服敏感词忽略量</span>
        <QuestionCircleOutlined style={{ marginLeft: 2 }} theme="twoTone" twoToneColor="#FF7F50" />
      </Tooltip>
    ),
    key: 'customer_sensitive',
  },
];
