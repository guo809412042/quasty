/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse, Form, Select, DatePicker, Input, InputNumber, Button,
} from 'antd';
import {
  dayLabel, QUAKLITY_TYPE, idLabel, IS_PASS,
} from '../../../const';
import { APP_PRODUCT_LIST } from '../../../../utils/const';

export default ({
  search, setSearch, getList, userList, reset, customerConfigList = [], exportFile, exportBtnLoading,
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
          // if (key === 'source') {
          //   getList({ source: e });
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
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <Form layout="inline">
          {selectForm(
            '渠道',
            'source',
            Object.keys(QUAKLITY_TYPE).map(v => ({
              value: v,
              name: QUAKLITY_TYPE[v],
            })),
            false,
            false,
            false
          )}
          <Form.Item label='质检时间' style={{ margin: 5 }}>
            <DatePicker.RangePicker
              style={{ width: 240 }}
              value={[search.scoreStartTime, search.scoreEndTime]}
              onChange={values => setSearch({
                ...search,
                scoreStartTime: values ? values[0] : '',
                scoreEndTime: values ? values[1] : '',
              })
              }
            />
          </Form.Item>
          <Form.Item label={dayLabel[search.source]} style={{ margin: 5 }}>
            <DatePicker.RangePicker
              style={{ width: 240 }}
              value={[search.startDate, search.endDate]}
              onChange={values => setSearch({
                ...search,
                startDate: values ? values[0] : '',
                endDate: values ? values[1] : '',
              })
              }
            />
          </Form.Item>
          {selectForm(
            '产品',
            'product',
            Object.keys(APP_PRODUCT_LIST).map(v => ({
              value: v,
              name: APP_PRODUCT_LIST[v],
            })),
            'multiple',
            '',
            '',
            search.source === '1',
          )}
          {selectForm('质检员', 'operateNameListQC', userList, 'multiple')}
          {selectForm('处理客服', 'operateNameList', search.source === '4' ? customerConfigList : userList, 'multiple')}
          {search.source === '4' ? ''
            : <Form.Item label={idLabel[search.source]} style={{ margin: 5 }}>
              <Input
                value={search.id}
                style={{ width: 150 }}
                onChange={e => setSearch({
                  ...search,
                  id: e.target.value,
                })
                }
              />
            </Form.Item>}
          {selectForm(
            '是否合格',
            'isPass',
            Object.keys(IS_PASS).map(v => ({
              value: v,
              name: IS_PASS[v],
            })),
          )}
          <Form.Item label="标准得分" style={{ margin: 5 }}>
            <div>
              <InputNumber
                onChange={val => setSearch({
                  ...search,
                  scoreBaseMin: val,
                })
                }
              />
              <label style={{ margin: 5 }}>至</label>
              <InputNumber
                onChange={val => setSearch({
                  ...search,
                  scoreBaseMax: val,
                })
                }
              />
            </div>
          </Form.Item>
          <Form.Item label="附加得分" style={{ margin: 5 }}>
            <div>
              <InputNumber
                onChange={val => setSearch({
                  ...search,
                  scoreAdditionalMin: val,
                })}
              />
              <label style={{ margin: 5 }}>至</label>
              <InputNumber
                onChange={val => setSearch({
                  ...search,
                  scoreAdditionalMax: val,
                })}
              />
            </div>
          </Form.Item>
          {selectForm(
            '质检状态',
            'checkTypeList',
            [{ name: '已质检', value: '3' }, { name: '忽略', value: '2' }],
            'multiple',
          )}
          <Form.Item>
            <Button type="primary" onClick={getList}>
              查询
            </Button>
            <Button onClick={reset} style={{ margin: 5 }}>
              重置
            </Button>
            <Button onClick={exportFile} style={{ margin: 5 }} loading={exportBtnLoading}>
              导出
            </Button>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};
