/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Form, Select, InputNumber, Button, message,
} from 'antd';
import cookie from 'js-cookie';
import { sampleConfigQuery, sampleConfigInsert, sampleConfigUpdate } from '../../../service';

export default () => {
  const [values, setValues] = useState({});
  const [isAdd, setIsAdd] = useState(true);
  const [initData, setData] = useState([]);

  const query = async () => {
    // `sample_type` int(2) DEFAULT NULL COMMENT '抽样类型 1:工单 2:邮件 3:应用商店',
    // `sample_plan` int(2) DEFAULT NULL COMMENT '抽样方式 1:按比例抽样 2:按条数抽样',
    // `sample_group_by` int(2) DEFAULT NULL COMMENT '抽样group by 1:人均 2:其他（国家/语言） 3:整体',
    // `sample_proportion` int(11) DEFAULT NULL COMMENT '抽样比例。 抽样方式为按比例时使用',
    // `sample_number` int(11) DEFAULT NULL COMMENT '抽样条数。 抽样方式为按条数时使用',
    // `day_limit` int(11) DEFAULT NULL COMMENT '每日抽样上限',
    const { data } = await sampleConfigQuery({});
    const value = {};
    if (data && data.length) {
      for (const i of data) {
        value[`samplePlan${i.sampleType * 1}`] = String(i.samplePlan);
        value[`sampleGroupBy${i.sampleType * 1}`] = String(i.sampleGroupBy);
        value[`limit${i.sampleType * 1}`] = String(i.dayLimit);
        value[`input${i.sampleType * 1}`] = String(i.samplePlan) === '1' ? i.sampleProportion : i.sampleNumber;
      }
      setValues(value);
      setIsAdd(false);
      setData(data);
    } else {
      setValues({
        samplePlan1: undefined,
        sampleGroupBy1: undefined,
        limit1: undefined,
        input1: undefined,
        samplePlan2: undefined,
        sampleGroupBy2: undefined,
        limit2: undefined,
        input2: undefined,
        samplePlan3: undefined,
        sampleGroupBy3: undefined,
        limit3: undefined,
        input3: undefined,
      });
      setIsAdd(true);
      setData();
    }
    console.log(data);
  };
  const submit = async () => {
    console.log(values);
    for (const i of Object.keys(values)) {
      if (!values[i]) {
        message.error('信息未填写完成！');
        return '';
      }
    }
    const body = [];
    for (const i of [1, 2, 3]) {
      body.push({
        sampleType: i,
        samplePlan: values[`samplePlan${i}`],
        sampleGroupBy: values[`sampleGroupBy${i}`],
        dayLimit: values[`limit${i}`],
        sampleProportion: String(values[`samplePlan${i}`]) === '1' ? values[`input${i}`] : '',
        sampleNumber: String(values[`samplePlan${i}`]) !== '1' ? values[`input${i}`] : '',
        operatorName: cookie.get('email'),
      });
    }
    if (isAdd) {
      for (const i of body) {
        await sampleConfigInsert(i);
      }
    } else {
      for (const i of body) {
        const find = initData.find(v => v.sampleType * 1 === i.sampleType * 1);
        await sampleConfigUpdate({ ...i, id: find.id });
      }
    }
    message.success('操作成功！');
    await query();
  };
  useEffect(() => {
    query();
  }, []);
  return (
    <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
      <Collapse.Panel header="抽样规则配置" key="1">
        <Form>
          <Form.Item label="工单抽样规则">
            <Select
              value={values.samplePlan1}
              onChange={e => setValues({
                ...values,
                samplePlan1: e,
              })
              }
              style={{ width: 120 }}
              placeholder="按**抽样"
            >
              <Select.Option key="1" value="1">
                按比例抽样
              </Select.Option>
              <Select.Option key="2" value="2">
                按条数抽样
              </Select.Option>
            </Select>
            <Select
              value={values.sampleGroupBy1}
              onChange={e => setValues({
                ...values,
                sampleGroupBy1: e,
              })
              }
              placeholder="抽样类型"
              style={{ width: 120, margin: '0 8px' }}
            >
              <Select.Option key="1" value="1">
                人均
              </Select.Option>
              <Select.Option key="2" value="2">
                国家
              </Select.Option>
              <Select.Option key="3" value="3">
                整体
              </Select.Option>
              <Select.Option key="4" value="4">
                产品
              </Select.Option>
            </Select>
            <InputNumber
              value={values.input1}
              onChange={e => setValues({
                ...values,
                input1: e,
              })
              }
              style={{ width: 130 }}
              placeholder={values.samplePlan1 === '1' ? '请输入抽样比例%' : '请输入条数'}
              formatter={value => `${values.samplePlan1 === '1' ? `${value}%` : value}`}
            />
            <label style={{ margin: '0 8px' }}>每日抽样上限：</label>
            <InputNumber
              value={values.limit1}
              onChange={e => setValues({
                ...values,
                limit1: e,
              })
              }
              style={{ width: 80 }}
            />
            <label style={{ margin: '0 8px' }}>条</label>
          </Form.Item>
          <Form.Item label="邮件抽样规则">
            <Select
              value={values.samplePlan2}
              onChange={e => setValues({
                ...values,
                samplePlan2: e,
              })
              }
              style={{ width: 120 }}
              placeholder="按**抽样"
            >
              <Select.Option key="1" value="1">
                按比例抽样
              </Select.Option>
              <Select.Option key="2" value="2">
                按条数抽样
              </Select.Option>
            </Select>
            <Select
              value={values.sampleGroupBy2}
              onChange={e => setValues({
                ...values,
                sampleGroupBy2: e,
              })
              }
              placeholder="抽样类型"
              style={{ width: 120, margin: '0 8px' }}
            >
              <Select.Option key="1" value="1">
                人均
              </Select.Option>
              <Select.Option key="2" value="2">
                语言
              </Select.Option>
              <Select.Option key="3" value="3">
                整体
              </Select.Option>
              {/* <Select.Option key="4" value="4">
                产品
              </Select.Option> */}
            </Select>
            <InputNumber
              value={values.input2}
              onChange={e => setValues({
                ...values,
                input2: e,
              })
              }
              style={{ width: 130 }}
              placeholder={values.samplePlan2 === '1' ? '请输入抽样比例%' : '请输入条数'}
              formatter={value => `${values.samplePlan2 === '1' ? `${value}%` : value}`}
            />
            <label style={{ margin: '0 8px' }}>每日抽样上限：</label>
            <InputNumber
              value={values.limit2}
              onChange={e => setValues({
                ...values,
                limit2: e,
              })
              }
              style={{ width: 80 }}
            />
            <label style={{ margin: '0 8px' }}>条</label>
          </Form.Item>
          <Form.Item label="应用商店抽样规则">
            <Select
              value={values.samplePlan3}
              onChange={e => setValues({
                ...values,
                samplePlan3: e,
              })
              }
              style={{ width: 120 }}
              placeholder="按**抽样"
            >
              <Select.Option key="1" value="1">
                按比例抽样
              </Select.Option>
              <Select.Option key="2" value="2">
                按条数抽样
              </Select.Option>
            </Select>
            <Select
              value={values.sampleGroupBy3}
              onChange={e => setValues({
                ...values,
                sampleGroupBy3: e,
              })
              }
              placeholder="抽样类型"
              style={{ width: 120, margin: '0 8px' }}
            >
              <Select.Option key="1" value="1">
                人均
              </Select.Option>
              <Select.Option key="2" value="2">
                国家/语言
              </Select.Option>
              <Select.Option key="3" value="3">
                整体
              </Select.Option>
              <Select.Option key="4" value="4">
                产品
              </Select.Option>
              <Select.Option key="5" value="5">
                渠道
              </Select.Option>
            </Select>
            <InputNumber
              value={values.input3}
              onChange={e => setValues({
                ...values,
                input3: e,
              })
              }
              style={{ width: 130 }}
              placeholder={values.samplePlan3 === '1' ? '请输入抽样比例%' : '请输入条数'}
              formatter={value => `${values.samplePlan3 === '1' ? `${value}%` : value}`}
            />
            <label style={{ margin: '0 8px' }}>每日抽样上限：</label>
            <InputNumber
              value={values.limit3}
              onChange={e => setValues({
                ...values,
                limit3: e,
              })
              }
              style={{ width: 80 }}
            />
            <label style={{ margin: '0 8px' }}>条</label>
          </Form.Item>
          <Button type="primary" onClick={submit}>
            保存
          </Button>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};
