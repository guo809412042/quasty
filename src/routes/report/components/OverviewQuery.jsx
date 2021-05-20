/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse, Button, Form, Select, DatePicker,
} from 'antd';
// import moment from 'moment';
import { QUAKLITY_TYPE_FULL } from '../../const';
import styles from './OverviewQuery.less';

export default ({ setSearch, search }) => {
  let timer = null;
  const [form] = Form.useForm();
  const replyTime = form.getFieldValue('reply_time');
  const scoreTime = form.getFieldValue('score_time');
  const fieldsChange = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      const valuse = form.getFieldsValue();
      setSearch(valuse);
    }, 500);
  };

  return (
    <>
      <Collapse defaultActiveKey={['1']} className={styles.overview_wrap}>
        <Collapse.Panel header="质检统计" key="1">
          <Form layout="inline" form={form} onFieldsChange={fieldsChange} initialValues={search}>
            <Form.Item name="reply_time" label="客服回复时间">
              <DatePicker.RangePicker style={{ width: 280 }} disabled={!!scoreTime} />
            </Form.Item>
            <Form.Item name="score_time" label="质检时间">
              <DatePicker.RangePicker style={{ width: 280 }} disabled={!!replyTime} />
            </Form.Item>
            <Form.Item name="quality_type" label="渠道">
              <Select
                style={{ width: 300 }}
                placeholder="渠道"
                filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
                mode="multiple"
                allowClear
              >
                {Object.keys(QUAKLITY_TYPE_FULL).map(v => (
                  <Select.Option key={v} value={v}>
                    {QUAKLITY_TYPE_FULL[v]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={fieldsChange}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};
