/* eslint-disable react/prop-types */
import React from 'react';
import {
  Collapse, Select, Form, DatePicker, Input, TreeSelect, Button, InputNumber,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  SOURCE,
  dayLabel,
  idLabel,
  RESPONSE_STATE,
  CHECK_TYPE,
  WARNING_TYPE,
  INVESTIGATE,
  REPEAT_CALL,
  CONNECT_TYPE,
} from '../../const';
import { APP_PRODUCT_LIST, STAR } from '../../../utils/const';
import { COUNTRY_SHOR_LIST, LANGUAGE_MAP } from '../../../utils/enum';
import SelectFormView from '../../common/SelectFormView';

export default ({
  search, setSearch, issueTags = [], userList = [], reset, getList, PAGE_TYPE, productList = [],
}) => {
  let langAndCountry = [];
  if (search.source === 'appstore' || search.source === '1') {
    langAndCountry = COUNTRY_SHOR_LIST.map(v => ({
      value: v.key,
      name: `${v.value}-${v.key}`,
    }));
  }
  if (search.source === 'google' || search.source === '2') {
    langAndCountry = Object.keys(LANGUAGE_MAP).map(v => ({
      value: v,
      name: `${LANGUAGE_MAP[v]}-${v}`,
    }));
  }
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
            setTimeout(() => {
              getList(e);
            }, 20);
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
  const tProps = {
    treeData: issueTags,
    value: search.issueTag,
    onChange: val => setSearch({
      ...search,
      issueTag: val,
    }),
    treeCheckable: true,
    style: {
      width: 300,
    },
    allowClear: true,
  };
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <Form layout="inline">
          {selectForm(
            '渠道',
            'source',
            Object.keys(SOURCE).map(v => ({
              value: v,
              name: SOURCE[v],
            })),
            false,
            false,
            false,
          )}
          {+search.source === 2 && (
            <Form.Item label="获取时间" style={{ margin: 5 }}>
              <DatePicker.RangePicker
                style={{ width: 240 }}
                value={[search.createTimeStart, search.createTimeEnd]}
                onChange={values => setSearch({
                  ...search,
                  createTimeStart: values ? values[0] : '',
                  createTimeEnd: values ? values[1] : '',
                })
                }
              />
            </Form.Item>
          )}
          {search.source * 1 !== 4 ? (
            <>
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
              {search.source === '1' ? (
                <Form.Item label="人工工单解决时间" style={{ margin: 5 }}>
                  <DatePicker.RangePicker
                    style={{ width: 240 }}
                    value={[search.completeStartTime, search.completeEndTime]}
                    onChange={values => setSearch({
                      ...search,
                      completeStartTime: values ? values[0] : '',
                      completeEndTime: values ? values[1] : '',
                    })
                    }
                  />
                </Form.Item>
              ) : (
                <Form.Item label="回复时间" style={{ margin: 5 }}>
                  <DatePicker.RangePicker
                    style={{ width: 240 }}
                    value={[search.customerReplyStartTime, search.customerReplyEndTime]}
                    onChange={values => setSearch({
                      ...search,
                      customerReplyStartTime: values ? values[0] : '',
                      customerReplyEndTime: values ? values[1] : '',
                    })
                    }
                  />
                </Form.Item>
              )}
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
                search.source === '2',
              )}
              {selectForm(
                search.source === '1' || search.source === 'appstore' ? '国家' : '语言',
                'lCountry',
                langAndCountry,
                'multiple',
                400,
                true,
                search.source === 'huawei',
              )}
              <Form.Item label={idLabel[search.source]} style={{ margin: 5 }}>
                <Input
                  value={search.id}
                  style={{ width: 150 }}
                  onChange={e => setSearch({
                    ...search,
                    id: e.target.value,
                  })
                  }
                />
              </Form.Item>
              {selectForm(
                '评分',
                'rating',
                Object.keys(STAR).map(v => ({
                  value: v,
                  name: STAR[v],
                })),
                'multiple',
                300,
                '',
                search.source === '1' || search.source === '2',
              )}
              {selectForm(
                '回复状态',
                'responseStatusList',
                Object.keys(RESPONSE_STATE).map(v => ({
                  value: v,
                  name: RESPONSE_STATE[v],
                })),
                'multiple',
                300,
                '',
                search.source === '2' || search.source === '1',
              )}
              <Form.Item label="服务标签" style={{ margin: 5 }}>
                <TreeSelect {...tProps} />
              </Form.Item>
              {selectForm('处理客服', 'operatorIdList', userList, 'multiple')}
              {selectForm(
                '质检状态',
                'checkTypeList',
                Object.keys(CHECK_TYPE)
                  .filter(v => (PAGE_TYPE === 'wait' ? v === '0' || v === '2' || v === '1' : v === '1'))
                  .map(v => ({
                    value: v,
                    name: CHECK_TYPE[v],
                  })),
                'multiple',
                300,
              )}
              {selectForm(
                '预警状态',
                'warningTypeList',
                Object.keys(WARNING_TYPE).map(v => ({
                  value: v,
                  name: WARNING_TYPE[v],
                })),
                'multiple',
                300,
              )}
            </>
          ) : (
            <>
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
            </>
          )}
          {PAGE_TYPE === 'wait' ? selectForm('领取人', 'operatorNameList', userList, 'multiple') : ''}
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
};
