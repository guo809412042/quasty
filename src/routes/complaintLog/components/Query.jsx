/* eslint-disable react/prop-types */
import React from 'react';
import {
  Form, Select, Collapse, DatePicker, Input, Button,
} from 'antd';
import { COMPLAINT_STATUS, QUAKLITY_TYPE } from '../../const';

export default ({
  search, setSearch, getList, userList,
}) => {
  const selectForm = (label, key, list, multiple, width, allowClear = true, disabled = false) => (
    <Form.Item label={label} key={key} style={{ margin: 5 }}>
      <Select
        style={{ width: width || (multiple ? 300 : 150) }}
        value={search[key]}
        onChange={(e) => {
          setSearch({
            ...search,
            [key]: e,
          });
          if (key === 'source') {
            getList(e);
          }
        }}
        mode={multiple || false}
        showSearch
        allowClear={allowClear}
        optionFilterProp="children"
        disabled={disabled}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {list.map(v => (
          <Select.Option key={v.value} value={v.value}>
            {v.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <Form layout="inline">
          {selectForm(
            '渠道',
            'qualityType',
            Object.keys(QUAKLITY_TYPE).map(v => ({
              value: v,
              name: QUAKLITY_TYPE[v],
            })),
          )}
          {selectForm('被质检人', 'customerIdList', userList, 'multiple')}
          {selectForm(
            '申诉状态',
            'complaintStatusList',
            Object.keys(COMPLAINT_STATUS).map(v => ({
              value: v,
              name: COMPLAINT_STATUS[v],
            })),
            'multiple',
          )}
          <Form.Item label="申诉时间" style={{ margin: 5 }}>
            <DatePicker.RangePicker
              style={{ width: 240 }}
              value={[search.complaintStartTime, search.complaintEndTime]}
              onChange={values => setSearch({
                ...search,
                complaintStartTime: values ? values[0] : '',
                complaintEndTime: values ? values[1] : '',
              })
              }
            />
          </Form.Item>
          <Form.Item label="ID" style={{ margin: 5 }}>
            <Input
              value={search.sourceId}
              style={{ width: 150 }}
              onChange={e => setSearch({
                ...search,
                sourceId: e.target.value,
              })
              }
            />
          </Form.Item>
          <Form.Item style={{ margin: 5 }}>
            <Button type="primary" onClick={getList}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};
