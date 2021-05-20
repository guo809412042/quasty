/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react';
import {
  Table, Modal, Form, Input, InputNumber, Row, Col, Button, message, Popconfirm,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UpOutlined, DownOutlined,
} from '@ant-design/icons';

import { getEmailName } from '../../../utils/utils';
import { qualityScoreConfigUpdate, qualityScoreConfigInsert, qualityScoreConfigDelete } from '../../../service';

const rules = [
  {
    required: true,
    message: '必填！',
  },
];
export default ({
  sampleType, initData = [], qualityProjectType, query,
}) => {
  const formRef = React.createRef();
  const [visible, setVisible] = useState(false);
  const [editRow, setEditRow] = useState({});
  const remove = async (id, deleteFalg = false) => {
    const params = { id, delete: deleteFalg };
    await qualityScoreConfigDelete(params);
    query();
  };
  const down = async (index) => {
    const { id: upId, orderNum: upOrderNum } = initData[index + 1];
    const { id: downId, orderNum: downOrderNum } = initData[index];
    await qualityScoreConfigUpdate({
      id: upId,
      orderNum: downOrderNum,
    });
    await qualityScoreConfigUpdate({
      id: downId,
      orderNum: upOrderNum,
    });
    message.success('操作成功！');
    query();
  };
  const up = async (index) => {
    const { id: upId, orderNum: upOrderNum } = initData[index];
    const { id: downId, orderNum: downOrderNum } = initData[index - 1];
    await qualityScoreConfigUpdate({
      id: upId,
      orderNum: downOrderNum,
    });
    await qualityScoreConfigUpdate({
      id: downId,
      orderNum: upOrderNum,
    });
    message.success('操作成功！');
    query();
  };

  const columns = [
    { dataIndex: 'num', title: '序号', render: (text, row, index) => index + 1 },
    { dataIndex: 'title', title: '标准分项' },
    { dataIndex: 'desc', title: '指标说明' },
    {
      dataIndex: 'number',
      title: '标准分值',
      render: (text, row) => `${row.scoreStandardMin} ~ ${row.scoreStandardMax}`,
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, row, index) => (
        <div style={{ fontSize: 20 }}>
          <Button
            style={{ marginRight: 5 }}
            icon={<EditOutlined />}
            shape="circle"
            onClick={() => {
              setVisible(true);
              setEditRow(row);
              formRef.current.setFieldsValue(row);
            }}
            type="primary"
          />
          <Button
            style={{ marginRight: 5 }}
            shape="circle"
            disabled={!index}
            icon={<UpOutlined />}
            onClick={() => up(index)}
          />
          <Button
            style={{ marginRight: 5 }}
            shape="circle"
            disabled={index === initData.length - 1}
            icon={<DownOutlined />}
            onClick={() => down(index)}
          />
          <Popconfirm title="是否确定删除？" onConfirm={() => remove(row.id)} okText="是" cancelText="否">
            <Button style={{ marginRight: 5 }} icon={<DeleteOutlined />} shape="circle" danger />
          </Popconfirm>
          <Popconfirm title="是否确定彻底删除？" onConfirm={() => remove(row.id, true)} okText="是" cancelText="否">
            <Button style={{ marginRight: 5 }} danger>
              彻底删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    const body = {
      ...values,
      sampleType,
      operatorName: getEmailName(),
      qualityProjectType,
      scoreStandardMin: 0,
    };
    if (editRow.id) {
      await qualityScoreConfigUpdate({ ...body, id: editRow.id, orderNum: editRow.orderNum });
    } else {
      await qualityScoreConfigInsert({
        ...body,
        orderNum: initData.length ? initData[initData.length - 1].orderNum + 1 : 1,
      });
    }
    message.success('操作成功！');
    formRef.current.setFieldsValue({
      title: undefined,
      desc: '',
      scoreStandardMax: undefined,
    });
    setVisible(false);
    await query();
  };
  const total = useMemo(() => {
    let num = 0;
    for (const i of initData) {
      num += i.scoreStandardMax;
    }
    return num;
  }, [initData]);
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>质检项</h2>
      <Table columns={columns} dataSource={initData} bordered rowKey="id" pagination={false} />
      <div style={{ fontSize: 16, margin: '10px 0' }}>
        <Button
          icon={<PlusOutlined />}
          style={{ marginRight: 10 }}
          onClick={() => {
            setVisible(true);
            setEditRow({});
          }}
          type="primary"
          shape="circle"
        />
        <label style={{ color: '#888' }}>添加标准分项</label>
        <label style={{ float: 'right' }}>当前满分值：{total}</label>
      </div>
      <Modal
        visible={visible}
        onCancel={async () => {
          setVisible(false);
          formRef.current.setFieldsValue({
            title: undefined,
            desc: '',
            scoreStandardMax: undefined,
          });
        }}
        cancelText="关闭"
        okText="提交"
        onOk={submit}
        title="标准分项"
        width={500}
      >
        <Form ref={formRef} initialValues={editRow}>
          <Form.Item label="标准分项" name="title" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="指标说明" name="desc" rules={rules}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row>
            <Col span={6}>
              <Form.Item label="标准分值" required>
                0 ~
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item required name="scoreStandardMax" rules={rules}>
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
