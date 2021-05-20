/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Modal, message, Button, Table, Pagination, Tag,
} from 'antd';
import moment from 'moment';
import { getEmailName, formatSeconds } from '../../utils/utils';
import { updateCheckTypeSVC } from '../../service';
import {
  CONNECT_TYPE,
  CONNECT_TYPE_COLOR,
  REPEAT_CALL,
  INVESTIGATE,
  INVESTIGATE_COLOR,
  CHECK_COLOR,
  CHECK_TYPE,
} from '../const';
import ScoreView from '../QCList/components/score/ScoreView';

export default ({
  PAGE_TYPE, getList, dataSource, loading, userMap, paginationOpts, productJSON = {},
}) => {
  const [selectKeys, setSelectKeys] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectKeys(selectedRowKeys);
    },
  };
  const updateCheckType = async (checkTypeValue, type = 1, id) => {
    if (!selectKeys.length && type === 1) {
      message.error('请选择要操作的数据！');
      return;
    }
    Modal.confirm({
      title: `确定${checkTypeValue === 'QUALITY_ING' ? '领取' : '忽略'}?`,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const body = {
          checkTypeValue,
          operatorName: getEmailName(),
        };
        if (type === 1) {
          body.idList = selectKeys;
        } else {
          body.id = id;
        }
        const res = await updateCheckTypeSVC(body);
        if (res.status) {
          message.success('操作成功！');
        }
        setSelectKeys([]);
        getList();
      },
      onCancel() {},
    });
  };
  const columns = [
    { dataIndex: ['qualityCheck', 'idNo'], title: '通话ID' },
    {
      dataIndex: ['qualityCheck', 'callNo'],
      title: '客户号码',
      render: (text, row) => (row.qualityCheck.connectType === 'dialTransfer' || row.qualityCheck.connectType === 'dialout'
        ? row.qualityCheck.calledNo
        : text),
    },
    { dataIndex: ['qualityStatus', 'productId'], title: '产品', render: text => productJSON[text] },
    {
      dataIndex: ['qualityCheck', 'connectType'],
      title: '呼叫类型',
      render: text => <Tag color={CONNECT_TYPE_COLOR[text]}>{CONNECT_TYPE[text]}</Tag>,
    },
    {
      dataIndex: ['qualityCheck', 'exten'],
      title: '处理坐席',
      render: (text, row) => {
        const { qualityStatus } = row;
        const operateName = userMap[qualityStatus.customerId] || '';

        return `${operateName}[${text}]`;
      },
    },
    {
      dataIndex: ['qualityCheck', 'offeringTime'],
      title: '呼叫时间',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      dataIndex: ['qualityCheck', 'ringTimeLength'],
      title: '振铃时长',
      render: text => formatSeconds(text),
    },
    {
      dataIndex: ['qualityCheck', 'callTimeLength'],
      title: '通话时长',
      render: text => formatSeconds(text),
    },
    {
      dataIndex: ['qualityCheck', 'holdTimeLength'],
      title: '保持时长',
      render: text => formatSeconds(text / 1000),
    },
    {
      dataIndex: ['qualityCheck', 'repeatCall'],
      title: '重复来电',
      render: text => REPEAT_CALL[text],
    },
    {
      dataIndex: ['qualityCheck', 'investigate'],
      title: '满意度',
      render: text => (text ? <Tag color={INVESTIGATE_COLOR[text]}>{INVESTIGATE[text]}</Tag> : ''),
    },
    {
      dataIndex: ['qualityCheck', 'comments'],
      title: '备注',
    },
    {
      dataIndex: ['qualityStatus', 'checkType'],
      title: '质检状态',
      render: text => <Tag color={CHECK_COLOR[text]}>{CHECK_TYPE[text]}</Tag>,
    },
    {
      dataIndex: 'action',
      title: '操作',
      fixed: 'right',
      render: (text, row) => (PAGE_TYPE === 'wait' ? (
        <Button type="primary" onClick={() => updateCheckType('QUALITY_ING', 2, row.qualityStatus.id)}>
            领取
        </Button>
      ) : (
        <ScoreView source="4" row={row} getList={getList} />
      )),
    },
  ];
  return (
    <div>
      {PAGE_TYPE === 'wait' ? (
        <div>
          <Button type="primary" onClick={() => updateCheckType('QUALITY_ING')}>
            一键领取
          </Button>
          <Button style={{ margin: 10 }} onClick={() => updateCheckType('IGNORE_QUALITY')}>
            批量忽略
          </Button>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={row => row.qualityStatus.id}
            loading={loading}
            pagination={false}
            style={{ margin: '10px 0' }}
            scroll={{ x: columns.length * 150, y: 600 }}
            rowSelection={rowSelection}
          />

          <Pagination {...paginationOpts} />
        </div>
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={row => row.qualityStatus.id}
            loading={loading}
            pagination={false}
            style={{ margin: '10px 0' }}
            scroll={{ x: columns.length * 150, y: 600 }}
          />
          <Pagination {...paginationOpts} />
        </div>
      )}
    </div>
  );
};
