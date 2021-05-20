/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react';
import {
  Table, Modal, Form, Input, InputNumber, Row, Col, Button, message, Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
    await qualityScoreConfigDelete({ id, delete: deleteFalg });
    query();
  };
  const columns = [
    { dataIndex: 'title', title: '内容' },
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
    };
    if (editRow.id) {
      await qualityScoreConfigUpdate({ ...body, id: editRow.id });
    } else {
      await qualityScoreConfigInsert({ ...body });
    }
    message.success('操作成功！');
    formRef.current.setFieldsValue({
      title: undefined,
      scoreStandardMax: undefined,
      scoreStandardMin: undefined,
    });
    setVisible(false);
    await query();
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>分数段</h2>
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
        <label style={{ color: '#888' }}>添加</label>
      </div>
      <Modal
        visible={visible}
        onCancel={async () => {
          setVisible(false);
          formRef.current.setFieldsValue({
            title: undefined,
            scoreStandardMax: undefined,
            scoreStandardMin: undefined,
          });
        }}
        cancelText="关闭"
        okText="提交"
        onOk={submit}
        title="标准分项"
        width={500}
      >
        <Form ref={formRef} initialValues={editRow}>
          <Form.Item label="内容" name="title" rules={rules}>
            <Input />
          </Form.Item>
          <Row>
            <Col span={8}>
              <Form.Item label="分值" name="scoreStandardMin" rules={rules}>
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={2}>~</Col>
            <Col span={8}>
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
