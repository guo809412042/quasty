/* eslint-disable react/prop-types */
import React from 'react';
import { Table, Pagination, Tag } from 'antd';
import moment from 'moment';
import { QUAKLITY_TYPE, COMPLAINT_STATUS_COLOR, COMPLAINT_STATUS } from '../const';
import { gotoIssuePage } from '../../utils/utils';
import { APP_PRODUCT_LIST } from '../../utils/const';
import Audit from './components/Audit';
import DetailView from '../Result/customerService/components/DetailView';

export default ({
  getList, dataSource, tableLoading, paginationOpts = {}, userJson,
}) => {
  const columns = [
    { dataIndex: 'qualityType', title: '渠道', render: text => QUAKLITY_TYPE[text] },
    { dataIndex: 'productId', title: '产品', render: text => APP_PRODUCT_LIST[text] },
    {
      dataIndex: 'sourceId',
      title: 'ID',
      render(text, row) {
        const { qualityType, productId } = row;

        if (qualityType === 1) {
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
        }
        if (qualityType === 4) {
          const { fileServer, recordFileName, callSheetId } = row.customerSourceVO || {};

          return (
            <a href={`${fileServer}/${recordFileName}`} target="_blank" rel="nofollow noopener noreferrer">
              {callSheetId}
            </a>
          );
        }
        return text;
      },
    },
    { dataIndex: 'customerId', title: '被质检人', render: text => userJson[text] },
    {
      dataIndex: 'complaintTime',
      title: '申诉时间',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      dataIndex: 'complaintStatus',
      title: '申诉状态',
      render: text => <Tag color={COMPLAINT_STATUS_COLOR[text]}>{COMPLAINT_STATUS[text]}</Tag>,
    },
    {
      dataIndex: 'action',
      title: '操作',
      // complaint_status 申述状态。
      // 0:未申述 2:质检待审核 3:质检审核通过 4:质检审核未通过 5:主管待审核 6:主管审核通过 7:主管审核未通过
      render: (text, row) => {
        const menus = window._VCM_ ? window._VCM_.menu : [];
        //  质检员评分权限
        const promissionQC = menus.find(v => v.value === 'qc-rate-button');
        //  TL评分权限
        const promissionTL = menus.find(v => v.value === 'tl-rate-button');

        const showReviewBtn = (row.complaintStatus * 1 === 2 && promissionQC) || (row.complaintStatus * 1 === 5 && promissionTL);
        // const showReviewBtn = true;
        const showDetail = +row.complaintStatus >= 2 && +row.complaintStatus !== 5;

        return (
          <div>
            {showReviewBtn && <Audit row={row} getList={getList} />}
            {showDetail && <DetailView row={row} />}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        loading={tableLoading}
        dataSource={dataSource}
        bordered
        rowKey={row => row.id}
        scroll={{ x: columns.length * 160 }}
        pagination={false}
        style={{ margin: '10px 0' }}
      />
      <Pagination {...paginationOpts} />
    </>
  );
};
