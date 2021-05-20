/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Table, Modal, Form, Input, InputNumber, Row, Col, Radio, Button, message, Popconfirm,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UpOutlined, DownOutlined,
} from '@ant-design/icons';
import { qualityScoreConfigDelete, qualityScoreConfigUpdate, qualityScoreConfigInsert } from '../../../service';
import { getEmailName } from '../../../utils/utils';

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
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    const body = {
      operatorName: getEmailName(),
      qualityProjectType,
      sampleType,
      scoreStandardMax: values.type === '+' ? values.number : 0,
      scoreStandardMin: values.type === '+' ? 0 : -1 * values.number,
      title: values.title,
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
    await formRef.current.setFieldsValue({});
    setEditRow({});
    setVisible(false);
    await query();
  };
  const columns = [
    { dataIndex: 'num', title: '序号', render: (text, row, index) => index + 1 },
    { dataIndex: 'title', title: '附加分项' },
    {
      dataIndex: 'number',
      title: '附加分值',
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
              formRef.current.setFieldsValue({
                ...row,
                type: row.scoreStandardMin < 0 ? '-' : '+',
                number: row.scoreStandardMin < 0 ? -1 * row.scoreStandardMin : row.scoreStandardMax,
              });
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

  return (
    <div style={{ borderTop: '2px solid #eee', borderBottom: '2px solid #eee', padding: '20px 0' }}>
      <h2>附加质检项</h2>
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
        <label style={{ color: '#888' }}>添加附加分项</label>
      </div>
      <Modal
        visible={visible}
        onCancel={() => {
          formRef.current.setFieldsValue({
            title: undefined,
            type: '+',
            number: undefined,
          });
          setEditRow({});
          setVisible(false);
        }}
        cancelText="关闭"
        okText="提交"
        onOk={submit}
        title="附加分项"
        width={500}
      >
        <Form
          ref={formRef}
          initialValues={{
            ...editRow,
            type: editRow.scoreStandardMin < 0 ? '-' : '+',
            number: editRow.scoreStandardMin < 0 ? -1 * editRow.scoreStandardMin : editRow.scoreStandardMax,
          }}
        >
          <Form.Item label="附加分项" name="title" rules={rules}>
            <Input />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="附加分值" name="type" rules={rules}>
                <Radio.Group>
                  <Radio key="+" value="+">
                    加分
                  </Radio>
                  <Radio key="-" value="-">
                    减分
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>0 ~</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required name="number" rules={rules}>
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
