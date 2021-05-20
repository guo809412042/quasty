/* eslint-disable react/prop-types */
import React from 'react';
import { Table, Tag, Pagination } from 'antd';
import moment from 'moment';
import {
  SOURCE, IS_PASS, IS_PASS_COLOR, COMPLAINT_STATUS, COMPLAINT_STATUS_COLOR,
} from '../../const';
import { APP_PRODUCT_LIST } from '../../../utils/const';
import { formatDate, gotoIssuePage } from '../../../utils/utils';
import DetailView from './components/DetailView';
import ComplaintView from './components/ComplaintView';

export default ({
  source,
  dataSource,
  userJson,
  userList = [],
  tableLoading,
  issueTagList,
  getList,
  paginationOpts = {},
}) => {
  source = source && source.toString();
  let columns = [];
  if (source === '1') {
    columns = [
      { dataIndex: 'source', title: '渠道', render: () => SOURCE[source] },
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text] },
      {
        dataIndex: ['qualityCheck', 'issueId'],
        title: 'ID',
        render(text, row) {
          const { productId } = row.qualityStatus || {};

          return (
            <a
              href={gotoIssuePage({
                p: productId,
                issueId: text,
                pageType: 'issue',
                issueState: -1,
                productId,
              })}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {text}
            </a>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'replyTime'],
        title: '回复时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
      {
        dataIndex: ['qualityCheck', 'evaluationTypeId'],
        title: '服务标签',
        render: (text) => {
          const find = issueTagList.find(v => v.id * 1 === text * 1);
          if (find) {
            return `${find.levelOne}/${find.levelTwo}/${find.levelThree}`;
          }
          return '';
        },
      },
      {
        dataIndex: ['qualityCheck', 'tagRemark'],
        title: '标签备注',
        render: text => text || '-',
      },
    ];
  }
  if (source === '2') {
    columns = [
      { dataIndex: 'source', title: '渠道', render: () => SOURCE[source] },
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: () => APP_PRODUCT_LIST['2'] },
      {
        dataIndex: ['qualityCheck', 'emailId'],
        title: 'ID',
        // render(text) {
        //   return (
        //     <a
        //       href={gotoIssuePage({ p: 101, emailId: text, pageType: 'email' })}
        //       rel="nofollow noopener noreferrer"
        //       target="_blank"
        //     >
        //       {text}
        //     </a>
        //   );
        // },
      },
      {
        dataIndex: ['qualityCheck', 'replyTime'],
        title: '回复时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
      {
        dataIndex: ['qualityCheck', 'tagId'],
        title: '服务标签',
        render: (text) => {
          let tag = text;
          // if (replyTime <= new Date('2021-03-08 12:00:00').getTime()) {
          //   const find = emailIssueTagList.find(v => +v.id === +text);
          //   if (find) {
          //     tag = find.tag_name;
          //   }
          // } else {
          const find = issueTagList.find(v => +v.id === +text);
          if (find) {
            tag = `${find.levelOne}-${find.levelTwo}-${find.levelThree}`;
          }
          // }
          return tag;
        },
      },
      {
        dataIndex: ['qualityCheck', 'tagRemark'],
        title: '标签备注',
        render: text => text || '-',
      },
    ];
  }
  if (source === '3') {
    columns = [
      { dataIndex: ['qualityCheck', 'source'], title: '渠道' },
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text] },
      {
        dataIndex: ['qualityStatus', 'sourceId'],
        title: 'ID',
        // render(text, row) {
        //   const { source, productId } = row.qualityCheck;
        //   return (
        //     <a
        //       href={gotoIssuePage({
        //         p: 101,
        //         id: text,
        //         pageType: source,
        //         source,
        //         product: productId,
        //       })}
        //       rel="nofollow noopener noreferrer"
        //       target="_blank"
        //     >
        //       {text}
        //     </a>
        //   );
        // },
      },
      {
        dataIndex: ['qualityCheck', 'createTime'],
        title: '评论获取时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
      {
        dataIndex: ['qualityCheck', 'reviewType'],
        title: '服务标签',
        render: (text) => {
          const find = issueTagList.find(v => v.id * 1 === text * 1);
          if (find) {
            return `${find.levelOne}/${find.levelTwo}/${find.levelThree}`;
          }
          return '';
        },
      },
      {
        dataIndex: ['qualityCheck', 'typeRemarks'],
        title: '标签备注',
        render: text => text || '-',
      },
    ];
  }
  if (source === '4') {
    columns = [
      {
        dataIndex: ['qualityCheck', 'callSheetId'],
        title: '通话ID',
        render: (text, row) => {
          const { fileServer, recordFileName } = row.qualityCheck || {};

          return (
            <a href={`${fileServer}/${recordFileName}`} target="_blank" rel="nofollow noopener noreferrer">
              {text}
            </a>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'callNo'],
        title: '客户号码',
        render: (text, row) => (row.qualityCheck.connectType === 'dialTransfer' || row.qualityCheck.connectType === 'dialout'
          ? row.qualityCheck.calledNo
          : text),
      },
      { dataIndex: ['qualityStatus', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text] },
      {
        dataIndex: ['qualityCheck', 'exten'],
        title: '处理坐席',
        render: (text, row) => {
          const { qualityStatus } = row;
          const operateName = userJson[qualityStatus.customerId] || '';

          return `${operateName}[${text}]`;
        },
      },
      {
        dataIndex: ['qualityCheck', 'offeringTime'],
        title: '呼叫时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
    ];
  }
  // qualityProjectType 质检项目 1:质检项目 2:附加质检项目 3:分数段标签 4:质检标签
  columns = columns.concat([
    {
      dataIndex: ['qualityStatus', 'scoreInfo'],
      title: '评分情况',
      render: (text, row) => {
        if (text) {
          const info = JSON.parse(text);
          let total = 0;
          let totalBase = 0;
          let totalAdd = 0;
          // eslint-disable-next-line no-restricted-syntax
          for (const i of info) {
            if (i.qualityProjectType * 1 === 1) {
              total += i.score;
              totalBase += i.score;
            }
            if (i.qualityProjectType * 1 === 2) {
              total += i.score;
              totalAdd += i.score;
            }
          }
          return (
            <div>
              <p>
                总得分：<strong>{total}</strong>
              </p>
              <p>
                标准得分：<strong>{totalBase}</strong>
              </p>
              <p>
                附加得分：<strong>{totalAdd}</strong>{' '}
              </p>
              {info
                .filter(v => v.qualityProjectType * 1 === 4)
                .map(v => (
                  <Tag style={{ marginTop: 10 }} color="blue" key={row.qualityStatus.id}>
                    {v.tag}
                  </Tag>
                ))}
            </div>
          );
        }
        return '';
      },
    },
    {
      dataIndex: ['qualityStatus', 'desc'],
      title: '评语',
      render: (text, row) => {
        if (row.qualityStatus.scoreInfo) {
          const info = JSON.parse(row.qualityStatus.scoreInfo);
          const find = info.find(v => v.qualityProjectType === 'desc');
          if (find) {
            return find.desc;
          }
          return '';
        }
        return '';
      },
    },
    {
      dataIndex: ['qualityStatus', 'isPass'],
      title: '是否合格',
      render: text => (text ? <Tag color={IS_PASS_COLOR[text]}>{IS_PASS[text]}</Tag> : ''),
    },
    {
      dataIndex: ['qualityStatus', 'scoreTime'],
      title: '质检时间',
      render: text => formatDate(text, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: ['qualityStatus', 'operatorName'],
      title: '质检人',
    },
    {
      dataIndex: ['qualityStatus', 'complaintStatus'],
      title: '申诉状态',
      render: text => <Tag color={COMPLAINT_STATUS_COLOR[text]}>{COMPLAINT_STATUS[text]}</Tag>,
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (text, row) => (
        <div>
          <ComplaintView
            row={row.qualityStatus}
            rowInfo={row.qualityCheck}
            getList={getList}
            source={source}
            userJson={userJson}
          />
          <DetailView
            row={row.qualityStatus}
            getList={getList}
            // id={row.qualityStatus.id}
            // scoreInfo={row.qualityStatus.scoreInfo}
            // complaintStatus={row.qualityStatus.complaintStatus}
          />
        </div>
      ),
    },
  ]);

  return (
    <>
      <Table
        columns={columns}
        loading={tableLoading}
        dataSource={dataSource}
        bordered
        rowKey={row => row.qualityStatus.id}
        scroll={{ x: columns.length * 160 }}
        pagination={false}
        style={{ margin: '10px 0' }}
      />
      <Pagination {...paginationOpts} />
    </>
  );
};
