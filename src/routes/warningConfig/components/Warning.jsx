import React, { useState, useEffect } from 'react';
import {
  Collapse, Form, InputNumber, Input, Tag, Button, message,
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import cookie from 'js-cookie';
import { warningConfigQuery, warningConfigUpdate, warningConfigInsert } from '../../../service';

export default () => {
  const [formValues, setFormValues] = useState({});
  const [serviceSensitiveWords, setServiceSensitiveWords] = useState([]); // 客服敏感词
  const [customerSensitiveWords, setCustomerSensitiveWords] = useState([]); // 客户敏感词
  const remove = (item) => {
    setCustomerSensitiveWords(customerSensitiveWords.filter(v => v !== item));
  };
  const removeCS = (item) => {
    setServiceSensitiveWords(serviceSensitiveWords.filter(v => v !== item));
  };
  const query = async () => {
    const { data } = await warningConfigQuery({});
    if (data) {
      setFormValues(data);
      setServiceSensitiveWords(data.serviceSensitiveWords.split('|'));
      setCustomerSensitiveWords(data.customerSensitiveWords.split('|'));
    } else {
      setFormValues({
        firstResponseTime: 0,
        repeatedInteraction: 0,
      });
    }
  };
  const submit = async () => {
    if (
      !(
        formValues.firstResponseTime
        && formValues.repeatedInteraction
        && serviceSensitiveWords.length
        && customerSensitiveWords.length
      )
    ) {
      message.error('信息未填写完整！');
      return '';
    }
    const body = {
      firstResponseTime: formValues.firstResponseTime,
      repeatedInteraction: formValues.repeatedInteraction,
      serviceSensitiveWords: serviceSensitiveWords.join('|'),
      customerSensitiveWords: customerSensitiveWords.join('|'),
      operatorName: cookie.get('email'),
    };
    if (formValues.id) {
      await warningConfigUpdate({ ...body, id: formValues.id });
    } else {
      await warningConfigInsert(body);
    }
    message.success('保存成功！');
    await query();
  };
  useEffect(() => {
    query();
  }, []);
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="预警配置" key="1">
        <Form>
          <Form.Item label="首次响应时间">
            <span style={{ marginRight: 10 }}>{'时长>='}</span>
            <InputNumber
              value={formValues.firstResponseTime}
              onChange={e => setFormValues({
                ...formValues,
                firstResponseTime: e,
              })
              }
            />
            <span style={{ margin: '0 10px' }}>小时</span>
          </Form.Item>
          <Form.Item label="客户敏感词">
            <Input
              style={{ width: 150 }}
              value={formValues.customerSensitiveWord}
              onChange={e => setFormValues({
                ...formValues,
                customerSensitiveWord: e.target.value,
              })
              }
            />
            <CheckCircleTwoTone
              style={{ cursor: 'pointer', fontSize: 18, margin: '0 10px' }}
              twoToneColor="#52c41a"
              onClick={() => {
                if (!formValues.customerSensitiveWord.trim()) {
                  message.error('请输入！');
                } else if (customerSensitiveWords.includes(formValues.customerSensitiveWord.trim())) {
                  message.error('该敏感词已存在！');
                } else {
                  setCustomerSensitiveWords([...customerSensitiveWords, formValues.customerSensitiveWord.trim()]);
                  setFormValues({
                    ...formValues,
                    customerSensitiveWord: undefined,
                  });
                }
              }}
            />
            {customerSensitiveWords.map(v => (
              <Tag color="blue" closable onClose={() => remove(v)} key={v}>
                {v}
              </Tag>
            ))}
          </Form.Item>
          <Form.Item label="客服敏感词">
            <Input
              style={{ width: 150 }}
              value={formValues.serviceSensitiveWord}
              onChange={e => setFormValues({
                ...formValues,
                serviceSensitiveWord: e.target.value,
              })
              }
            />
            <CheckCircleTwoTone
              style={{ cursor: 'pointer', fontSize: 18, margin: '0 10px' }}
              twoToneColor="#52c41a"
              onClick={() => {
                if (!formValues.serviceSensitiveWord.trim()) {
                  message.error('请输入！');
                } else if (serviceSensitiveWords.includes(formValues.serviceSensitiveWord.trim())) {
                  message.error('该敏感词已存在！');
                } else {
                  setServiceSensitiveWords([...serviceSensitiveWords, formValues.serviceSensitiveWord.trim()]);
                  setFormValues({
                    ...formValues,
                    serviceSensitiveWord: undefined,
                  });
                }
              }}
            />
            {serviceSensitiveWords.map(v => (
              <Tag color="blue" closable onClose={() => removeCS(v)} key={v}>
                {v}
              </Tag>
            ))}
          </Form.Item>
          <Form.Item label="重复交互">
            <span style={{ marginRight: 10 }}>{'交互次数>='}</span>
            <InputNumber
              value={formValues.repeatedInteraction}
              onChange={e => setFormValues({
                ...formValues,
                repeatedInteraction: e,
              })
              }
            />
            <span style={{ margin: '0 10px' }}>次</span>
          </Form.Item>
          <Button type="primary" onClick={submit}>
            保存
          </Button>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};
