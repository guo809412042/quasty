/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Row, Col, Tooltip, InputNumber, Form, Divider, Select, Input, message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ScoreReplyView from '../../../QCList/components/score/ScoreReplyView';
import { getEmailName, getUserId, rulesFunction } from '../../../../utils/utils';
import { complaintPass, qualityScoreConfigQuery, qualityStatusUpdateScore } from '../../../../service';
import { sampleTypeValue } from '../../../const';

const rules = [
  {
    required: true,
    message: '必填！',
  },
];

export default ({
  row, source, getList, scoreConfigData = [],
}) => {
  const [visible, setVisible] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const formRef = React.createRef();
  const {
    qualityStatus: {
      scoreInfo, id, complaintStatus, checkType,
    },
  } = row;
  const [info, setInfo] = useState([]);
  const getInfoConfig = async () => {
    // 忽略状态评分标准为最近评分标准
    const { data } = await qualityScoreConfigQuery({
      sampleType: sampleTypeValue[source],
    });
    setInfo(data);
    let total = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const i of data) {
      if (i.qualityProjectType * 1 === 1) {
        total += i.scoreStandardMax;
      }
    }

    setTotalScore(total);
  };
  useEffect(() => {
    if (visible) {
      if (scoreInfo) {
        const data = JSON.parse(scoreInfo);
        setInfo(data);
        let total = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const i of data) {
          if (i.qualityProjectType * 1 === 1) {
            total += i.score;
          }
          if (i.qualityProjectType * 1 === 2) {
            total += i.score;
          }
        }
        setTotalScore(total);
      } else if (checkType.toString() === '2') {
        getInfoConfig();
      }
    }
  }, [scoreInfo, visible]);
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    const passScore = scoreConfigData.find(v => v.qualityProjectType === 3 && v.title === '合格').scoreStandardMin;
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
    const data = {
      scoreBase,
      scoreAdditional,
      scoreInfo: JSON.stringify(scoreInfo),
      operatorName: getEmailName(),
      id,
      desc: values.desc,
      isPass: scoreAdditional + scoreBase >= passScore ? 1 : 2,
    };
    if (checkType * 1 === 2 || (!complaintStatus * 1 && checkType * 1 === 3)) {
      await qualityStatusUpdateScore(data);
    } else {
      data.complaintStatusValue = complaintStatus * 1 === 2 ? 'QUALITY_PASS' : 'TL_PASS';
      data.scoreBaseInfo = JSON.stringify(info);
      await complaintPass(data);
    }
    setVisible(false);
    message.success('操作成功！');
    getList();
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

  // const menus = window._VCM_ ? window._VCM_.menu : [];
  // //  质检员评分权限
  // const promissionQC = menus.find(v => v.value === 'qc-rate-button');
  // //  TL评分权限
  // const promissionTL = menus.find(v => v.value === 'tl-rate-button');
  //  TL评分权限
  const promissionTL = true;
  const title = checkType * 1 === 2 ? '评分' : '修正评分';
  const { operatorName } = row.qualityStatus || {};
  //  质检员评分权限
  const promissionQC = operatorName === getEmailName();

  return (
    <div>
      {/* 忽略情况 */}
      {checkType * 1 === 2 && promissionQC ? <Button type="primary" onClick={() => setVisible(true)}>
        {title}
      </Button> : ''}

      {/* 质检待审核 */}
      {complaintStatus * 1 === 2 && promissionQC ? <Button type="primary" onClick={() => setVisible(true)}>
        {title}
      </Button> : ''}

      {/* 主管待审核 */}
      {complaintStatus * 1 === 5 && promissionTL ? <Button type="primary" onClick={() => setVisible(true)}>
        {title}
      </Button> : ''}

      {/* 未申诉+已质检 */}
      {!complaintStatus * 1 && checkType * 1 === 3 && promissionQC ? <Button type="primary" onClick={() => setVisible(true)}>
        {title}
      </Button> : ''}

      <Modal
        width={800}
        cancelText="关闭"
        okText="提交"
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
      >
        <Form ref={formRef} onValuesChange={onValuesChange}>
          <Row gutter={30}>
            {
              source !== '4' && (
                <Col span={12}>
                  <ScoreReplyView row={row} source={source} isTranslate />
                </Col>
              )
            }
            <Col span={12} style={{ borderLeft: '1px solid #eee' }}>
              <p style={{ marginRight: 5, color: '#FF7F50', fontSize: 16 }}>标准指标评分</p>
              {info
                .filter(v => v.qualityProjectType * 1 === 1)
                .map(v => (
                  <Form.Item
                    rules={[...rules, { validator: (_, value) => rulesFunction(value, v) }]}
                    name={`base-${v.id}`}
                    label={
                      <div>
                        <span style={{ marginRight: 5 }}>
                          {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})
                        </span>
                        <Tooltip title={v.desc}>
                          <ExclamationCircleOutlined />
                        </Tooltip>
                      </div>
                    }
                    key={v.id}
                    initialValue={v.scoreStandardMax}
                  >
                    <InputNumber />
                  </Form.Item>
                ))}
              <Divider />
              <p style={{ marginRight: 5, color: '#FF7F50', fontSize: 16 }}>附加指标评分</p>
              {info
                .filter(v => v.qualityProjectType * 1 === 2)
                .map(v => (
                  <Form.Item
                  // 增加一个 输入内容的规则
                    rules={[...rules, { validator: (_, value) => rulesFunction(value, v) }]}
                    name={`additional-${v.id}`}
                    initialValue={0}
                    label={
                      <div>
                        <span style={{ marginRight: 5 }}>
                          {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})
                        </span>
                        <Tooltip title={v.desc}>
                          <ExclamationCircleOutlined />
                        </Tooltip>
                      </div>
                    }
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
                <Input.TextArea rows={4} />
              </Form.Item>
              <Divider />
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
              <Divider />
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
