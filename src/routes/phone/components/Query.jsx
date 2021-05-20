/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse, Form, DatePicker, InputNumber, Input, Button,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SelectFormView from '../../common/SelectFormView';
import {
  CONNECT_TYPE, INVESTIGATE, REPEAT_CALL, CHECK_TYPE,
} from '../../const';

export default ({
  search, setSearch, getList, userList, PAGE_TYPE, reset, productList = [],
}) => (
  <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
    <Collapse.Panel header="查询" key="1">
      <Form layout="inline">
        <Form.Item label="呼叫时间" style={{ margin: 5 }}>
          <DatePicker.RangePicker
            style={{ width: 360 }}
            value={[search.startDate, search.endDate]}
            showTime
            onChange={values => setSearch({
              ...search,
              startDate: values ? values[0] : '',
              endDate: values ? values[1] : '',
            })
            }
          />
        </Form.Item>
        <SelectFormView
          label="产品"
          keyName="productIdList"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={productList}
          multiple="multiple"
        />
        <SelectFormView
          label="呼叫类型"
          keyName="connectTypeList"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={Object.keys(CONNECT_TYPE).map(v => ({
            value: v,
            name: CONNECT_TYPE[v],
          }))}
          multiple="multiple"
        />

        <Form.Item label="通话时间" style={{ margin: 5 }}>
          <InputNumber
            value={search.callStartTimeLength}
            onChange={e => setSearch({
              ...search,
              callStartTimeLength: e,
            })
            }
          />
        </Form.Item>
        <span style={{ lineHeight: '45px' }}>秒 至</span>
        <Form.Item style={{ margin: 5 }}>
          <InputNumber
            value={search.callEndTimeLength}
            onChange={e => setSearch({
              ...search,
              callEndTimeLength: e,
            })
            }
          />
        </Form.Item>
        <span style={{ lineHeight: '45px' }}>秒 </span>
        <Form.Item label="保持时长" style={{ margin: 5 }}>
          <InputNumber
            value={search.holdStartTimeLength}
            onChange={e => setSearch({
              ...search,
              holdStartTimeLength: e,
            })
            }
          />
        </Form.Item>
        <span style={{ lineHeight: '45px' }}>秒 至</span>
        <Form.Item style={{ margin: 5 }}>
          <InputNumber
            value={search.holdEndTimeLength}
            onChange={e => setSearch({
              ...search,
              holdEndTimeLength: e,
            })
            }
          />
        </Form.Item>
        <span style={{ lineHeight: '45px' }}>秒 </span>
        <Form.Item label="通话标签" style={{ margin: 5 }}>
          <Input
            value={search.labels}
            onChange={e => setSearch({
              ...search,
              labels: e.target.value,
            })
            }
          />
        </Form.Item>
        <span style={{ lineHeight: '45px' }}>秒 </span>

        <SelectFormView
          label="处理坐席"
          keyName="customerIdList"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={userList}
          multiple="multiple"
        />
        <SelectFormView
          label="满意度"
          keyName="investigate"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={Object.keys(INVESTIGATE).map(v => ({
            value: v,
            name: INVESTIGATE[v],
          }))}
        />
        <SelectFormView
          label="重复来电"
          keyName="repeatCallList"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={Object.keys(REPEAT_CALL).map(v => ({
            value: v,
            name: REPEAT_CALL[v],
          }))}
          multiple="multiple"
        />
        <Form.Item label="客户号码" style={{ margin: 5 }}>
          <Input
            value={search.customerPhone}
            onChange={e => setSearch({
              ...search,
              customerPhone: e.target.value,
            })
            }
          />
        </Form.Item>

        <SelectFormView
          label="质检状态"
          keyName="checkTypeList"
          search={search}
          setSearch={setSearch}
          getList={getList}
          list={Object.keys(CHECK_TYPE)
            .filter(v => (PAGE_TYPE === 'wait' ? v === '0' || v === '2' || v === '1' : v === '1'))
            .map(v => ({
              value: v,
              name: CHECK_TYPE[v],
            }))}
          multiple="multiple"
        />
        <Form.Item style={{ margin: 5 }}>
          <Button icon={<SearchOutlined />} type="primary" onClick={() => getList()}>
            查询
          </Button>
        </Form.Item>
        <Form.Item style={{ margin: 5 }}>
          <Button onClick={reset}>重置</Button>
        </Form.Item>
      </Form>
    </Collapse.Panel>
  </Collapse>
);
