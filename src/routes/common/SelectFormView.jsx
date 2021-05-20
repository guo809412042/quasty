/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Select } from 'antd';

export default ({
  search,
  setSearch,
  // getList,
  label,
  keyName,
  list,
  multiple,
  width,
  allowClear = true,
  disabled = false,
}) => (
  <Form.Item label={label} key={keyName} style={{ margin: 5 }}>
    <Select
      style={{ width: width || (multiple ? 300 : 150) }}
      value={search[keyName]}
      onChange={(e) => {
        setSearch({
          ...search,
          [keyName]: e,
        });
        // if (keyName === 'source') {
        //   getList(e);
        // }
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
