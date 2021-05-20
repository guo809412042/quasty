/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button, Modal, Form, Input, Select, message,
} from 'antd';
import { rules } from '../../const';
import { customerConfigInsert, customerConfigUpdate } from '../../../service';

// eslint-disable-next-line react/prop-types
export default ({
  row = {}, type = 'add', userList = [], getData,
}) => {
  const [visible, setVisible] = useState(false);
  const formRef = React.createRef();
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    const body = {
      ...values,
      id: type === 'add' ? undefined : row.id,
    };
    if (type === 'add') {
      await customerConfigInsert(body);
    } else {
      await customerConfigUpdate(body);
    }
    await getData();
    setVisible(false);
    message.success('操作成功！');
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} style={{ margin: 5 }}>
        {type === 'add' ? '添加' : '编辑'}
      </Button>
      <Modal
        title={type === 'add' ? '添加' : '编辑'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
      >
        {visible ? (
          <Form ref={formRef} initialValues={row}>
            <Form.Item rules={rules} label="坐席工号" name="customerId">
              <Input />
            </Form.Item>
            <Form.Item rules={rules} label="客服名称" name="operatorId">
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {userList.map(v => (
                  <Select.Option key={v.value} value={v.value}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        ) : (
          ''
        )}
      </Modal>
    </>
  );
};
