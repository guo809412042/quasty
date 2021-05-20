/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Form, InputNumber, Tooltip, Select, Button, Divider, message, Input, Modal, Row, Col,
} from 'antd';

import { CloudFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { qualityScoreConfigQuery, qualityStatusUpdateScore, updateCheckTypeSVC } from '../../../../service';
import { getEmailName, rulesFunction } from '../../../../utils/utils';

const { TextArea } = Input;

const sampleTypeValue = {
  1: 1,
  2: 2,
  appstore: 3,
  google: 3,
  huawei: 3,
  4: 4,
};
const rules = [
  {
    required: true,
    message: '必填！',
  },
];
//  1:质检项目 2:附加质检项目
export default ({
  source, row, setVisible, getList,
}) => {
  //  1:工单 2:邮件 3:应用商店',4电话
  const formRef = React.createRef();
  const [scoreConfigData, setScoreConfigData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const query = async () => {
    const { data } = await qualityScoreConfigQuery({
      sampleType: sampleTypeValue[source],
    });
    setScoreConfigData(data);
    let total = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const i of data) {
      if (i.qualityProjectType * 1 === 1) {
        total += i.scoreStandardMax;
      }
    }

    setTotalScore(total);
  };

  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    const scoreInfo = [];
    // 标准
    let scoreBase = 0;
    scoreConfigData.filter(v => v.qualityProjectType === 1).forEach((v) => {
      delete v.createTime;
      delete v.updateTime;
      delete v.operatorName;
      scoreInfo.push({
        ...v,
        score: values[`base-${v.id}`] || 0,
      });
      scoreBase += (values[`base-${v.id}`] || 0);
    });
    // 附加
    let scoreAdditional = 0;
    scoreConfigData.filter(v => v.qualityProjectType === 2).forEach((v) => {
      delete v.createTime;
      delete v.updateTime;
      delete v.operatorName;
      scoreInfo.push({
        ...v,
        score: values[`additional-${v.id}`] || 0,
      });
      scoreAdditional += (values[`additional-${v.id}`] || 0);
    });
    if (values.tag) {
      scoreInfo.push({
        qualityProjectType: 4,
        tag: values.tag,
      });
    }
    if (values.desc) {
      scoreInfo.push({
        qualityProjectType: 'desc',
        desc: values.desc,
      });
    }
    const passScore = scoreConfigData.find(v => v.qualityProjectType === 3 && v.title === '合格').scoreStandardMin;
    const body = {
      scoreBase,
      scoreAdditional,
      scoreInfo: JSON.stringify(scoreInfo),
      operatorName: getEmailName(),
      id: row.qualityStatus.id,
      desc: values.desc,
      isPass: scoreAdditional + scoreBase >= passScore ? 1 : 2,
    };
    await qualityStatusUpdateScore(body);
    message.success('操作成功！');
    setVisible(false);
    getList(source);
  };

  const ignore = async () => {
    Modal.confirm({
      title: '确定忽略?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const body = {
          checkTypeValue: 'IGNORE_QUALITY',
          operatorName: getEmailName(),
        };
        body.id = row.qualityStatus.id;
        await updateCheckTypeSVC(body);
        message.success('操作成功！');
        setVisible(false);
        getList(source);
      },
      onCancel() {},
    });
  };

  const onValuesChange = (changedValues, values) => {
    const scoreInfo = [];
    // 标准
    let scoreBase = 0;
    scoreConfigData.filter(v => v.qualityProjectType === 1).forEach((v) => {
      delete v.createTime;
      delete v.updateTime;
      delete v.operatorName;
      scoreInfo.push({
        ...v,
        score: values[`base-${v.id}`] || 0,
      });
      scoreBase += (values[`base-${v.id}`] || 0);
    });
    // 附加
    let scoreAdditional = 0;
    scoreConfigData.filter(v => v.qualityProjectType === 2).forEach((v) => {
      delete v.createTime;
      delete v.updateTime;
      delete v.operatorName;
      scoreInfo.push({
        ...v,
        score: values[`additional-${v.id}`] || 0,
      });
      scoreAdditional += (values[`additional-${v.id}`] || 0);
    });

    setTotalScore(scoreBase + scoreAdditional);
  };

  useEffect(() => {
    query();
  }, [source]);
  //   `quality_project_type` '质检项目 1:质检项目 2:附加质检项目 3:分数段标签 4:质检标签',
  return (
    <div>
      {+source === 4 && (
        <>
          <Row style={{ marginBottom: 5 }}>
            <Col span={12}>
              <a
                href={`${row.qualityCheck.fileServer}/${row.qualityCheck.recordFileName}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ fontSize: '16px' }}
              >
                点击查看通话
              </a>
            </Col>
          </Row>
          <Divider />
        </>
      )}
      <Form ref={formRef} onValuesChange={onValuesChange}>
        <p style={{ marginRight: 5, color: '#FF7F50', fontSize: 16 }}>标准指标评分</p>
        {scoreConfigData
          .filter(v => v.qualityProjectType === 1)
          .map(v => (
            <Form.Item
              rules={[...rules, {
                validator: (_, value) => rulesFunction(value, v),
              }]}
              name={`base-${v.id}`}
              initialValue={v.scoreStandardMax}
              label={<div >
                <span style={{ marginRight: 5 }}>{v.title}  ({v.scoreStandardMin}-{v.scoreStandardMax})</span>
                <Tooltip title={v.desc}>
                  <ExclamationCircleOutlined />
                </Tooltip>
              </div>}
              key={v.id}
            >
              <InputNumber />
            </Form.Item>
          ))}
        <Divider/>
        <p style={{ marginRight: 5, color: '#FF7F50', fontSize: 16 }}>加分指标评分</p>
        {scoreConfigData
          .filter(v => v.qualityProjectType === 2)
          .map(v => (
            <Form.Item
              rules={[...rules, {
                validator: (_, value) => rulesFunction(value, v),
              }]}
              name={`additional-${v.id}`}
              initialValue={0}
              label={<div>
                <span style={{ marginRight: 5 }}>{v.title}  ({v.scoreStandardMin}-{v.scoreStandardMax})</span>
                <Tooltip title={v.desc}>
                  <ExclamationCircleOutlined />
                </Tooltip>
              </div>}
              key={v.id}
            >
              <InputNumber />
            </Form.Item>
          ))}
        <Divider/>
        <Form.Item label="总得分">
          {totalScore}
        </Form.Item>
        <Divider/>
        <Form.Item label="质检点评" name="desc" rules={rules}>
          <TextArea rows={4} />
        </Form.Item>
        <Divider/>
        <Form.Item label="质检标签" name="tag">
          <Select allowClear>
            {scoreConfigData
              .filter(v => v.qualityProjectType === 4)
              .map(v => (
                <Select.Option key={v.title} value={v.title}>
                  {v.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Divider/>
        <Form.Item>
          <Button type="primary" onClick={submit} >提交</Button>
          <Button style={{ margin: 5 }} onClick={ignore}>忽略</Button>
          <Button onClick={() => setVisible(false)}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
