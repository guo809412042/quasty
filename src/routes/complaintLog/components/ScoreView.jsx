/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Tooltip, Divider, Form, Input, Timeline, Button, message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { rules, sampleTypeValue } from '../../const';
import { formatDate, getEmailName, rulesFunction } from '../../../utils/utils';
import { complaintPass, complaintNoPass, qualityScoreConfigQuery } from '../../../service';

const { TextArea } = Input;
// complaint_status 申述状态。
// 0:未申述 2:质检待审核 3:质检审核通过 4:质检审核未通过 5:主管待审核 6:主管审核通过 7:主管审核未通过

export default ({
  row, setVisible, getList, source, qualityRow, qualityType,
}) => {
  const [totalScoreOpt, setTotalScoreOpt] = useState({
    qualityReviewScore: 0, // 质检评分总分
    appealReviewScore: 0, // 申诉评分总分
    reviseReviewScore: 0, // 修正评分总分
  });
  const [checkTotal, setCheckTotal] = useState(0);
  const { complaintStatus, scoreInfo, complaintLogVOList } = row;
  const infoInit = scoreInfo ? JSON.parse(scoreInfo) : [];
  const formRef = React.createRef();
  const infoForm = (list, type = 1, edit = false) => (
    <Col span={4}>
      {list
        .filter(v => v.qualityProjectType * 1 === type)
        .map(v => (
          <Row style={{ marginBottom: 5 }} key={`${v.id}-${type}`}>
            {!edit ? (
              <Form.Item>{v.score}</Form.Item>
            ) : (
              <Form.Item rules={[...rules, { validator: (_, value) => rulesFunction(value, v) }]} name={v.id}>
                <Input />
              </Form.Item>
            )}
          </Row>
        ))}
    </Col>
  );

  const computedScore = (scoreInfo, type) => {
    let total = 0;
    if (scoreInfo) {
      try {
        // eslint-disable-next-line no-restricted-syntax
        for (const i of scoreInfo) {
          if (i.qualityProjectType * 1 === 1) {
            total += i.score;
          }
          if (i.qualityProjectType * 1 === 2) {
            total += i.score;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (totalScoreOpt[type] === undefined) {
      setTotalScoreOpt({
        ...totalScoreOpt,
        [type]: total,
      });
    }
  };
  // 评分
  const scroeForm = (type) => {
    // 质检待审核
    if (complaintStatus * 1 === 2) {
      // infoInit 质检数据
      // complaintLogVOList 只有一条且为申诉数据
      const complaintLogInfo = JSON.parse(complaintLogVOList[0].scoreInfo);
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(complaintLogInfo, 'appealReviewScore');
      // // 修正评分
      // computedScore(infoInit, 'reviseReviewScore');
      return (
        <>
          {infoForm(infoInit, type)}
          {infoForm(complaintLogInfo, type)}
          {infoForm(infoInit, type, true)}
        </>
      );
    }
    // 主管待审核
    if (complaintStatus * 1 === 5) {
      // infoInit 质检数据
      // complaintLogVOList 3条数据 0 第一次申诉 1 第一次驳回  2 第二次申诉
      const complaintLogInfo = JSON.parse(complaintLogVOList[2].scoreInfo);
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(complaintLogInfo, 'appealReviewScore');
      // // 修正评分
      // computedScore(infoInit, 'reviseReviewScore');
      return (
        <>
          {infoForm(infoInit, type)}
          {infoForm(complaintLogInfo, type)}
          {infoForm(infoInit, type, true)}
        </>
      );
    }
    return '';
  };

  // 评论
  const qcDesc = () => {
    // 质检待审核
    if (complaintStatus * 1 === 2) {
      //  infoInit 质检数据
      // complaintLogVOList 只有一条且为申诉数据
      // 质检点评
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      // 申诉理由
      const complaintLogFind = JSON.parse(complaintLogVOList[0].scoreInfo).find(v => v.qualityProjectType === 'desc');
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(complaintLogVOList[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {complaintLogVOList[0].operatorName} ]</p>
            <strong>{complaintLogFind ? complaintLogFind.desc : ''}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }

    // 主管待审核
    if (complaintStatus * 1 === 5) {
      // infoInit 质检数据
      // complaintLogVOList 3条数据 0 第一次申诉 1 第一次驳回  2 第二次申诉
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(complaintLogVOList[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {complaintLogVOList[0].operatorName} ]</p>
            <strong>{complaintLogVOList[0].desc}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(complaintLogVOList[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检审核未通过 [ {complaintLogVOList[1].operatorName} ]</p>
            <strong>{complaintLogVOList[1].desc}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(complaintLogVOList[2].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>再次申诉理由 [ {complaintLogVOList[2].operatorName} ]</p>
            <strong>{complaintLogVOList[2].desc}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }
    return '';
  };

  // 驳回
  const noPass = async () => {
    const values = formRef.current.getFieldsValue();
    if (!values.desc) {
      message.warning('操作原因未填写！');
      return '';
    }
    const data = {
      operatorName: getEmailName(),
      id: row.id,
      desc: values.desc,
      complaintStatusValue: row.complaintStatus * 1 === 2 ? 'QUALITY_NOT_PASS' : 'TL_NOT_PASS',
    };
    await complaintNoPass(data);
    setVisible(false);
    message.success('操作成功！');
    getList();
  };

  // 修正评分
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();
    console.log('values', values);

    const list = [];
    const { data } = await qualityScoreConfigQuery({
      sampleType: sampleTypeValue[source],
    });
    // 标准
    let scoreBase = 0;
    data
      .filter(v => v.qualityProjectType === 1)
      .forEach((v) => {
        delete v.createTime;
        delete v.updateTime;
        delete v.operatorName;
        list.push({
          ...v,
          score: values[v.id] * 1 || 0,
        });
        scoreBase += values[v.id] * 1 || 0;
      });
    // 附加
    let scoreAdditional = 0;
    data
      .filter(v => v.qualityProjectType === 2)
      .forEach((v) => {
        delete v.createTime;
        delete v.updateTime;
        delete v.operatorName;
        list.push({
          ...v,
          score: values[v.id] * 1 || 0,
        });
        scoreAdditional += values[v.id] * 1 || 0;
      });
    if (values.tag) {
      list.push({
        qualityProjectType: 4,
        tag: values.tag,
      });
    }
    if (values.desc) {
      list.push({
        qualityProjectType: 'desc',
        desc: values.desc,
      });
    }
    const passScore = data.find(v => v.qualityProjectType === 3 && v.title === '合格').scoreStandardMin;
    const body = {
      scoreBase,
      scoreAdditional,
      scoreInfo: JSON.stringify(list),
      operatorName: getEmailName(),
      id: row.id,
      isPass: scoreAdditional + scoreBase >= passScore ? 1 : 2,
      desc: values.desc,
      complaintStatusValue: row.complaintStatus * 1 === 2 ? 'QUALITY_PASS' : 'TL_PASS',
      scoreBaseInfo: scoreInfo,
    };
    await complaintPass(body);
    setVisible(false);
    message.success('操作成功！');
    getList();
  };

  const fieldsChange = () => {
    const values = formRef.current.getFieldsValue();
    delete values.desc;

    let total = 0;
    Object.values(values).forEach((v) => {
      total += +v || 0;
    });

    setCheckTotal(total);
  };

  useEffect(() => {
    // form 表单默认要显示的values
    const formInfo = {};
    infoInit.forEach((item) => {
      formInfo[item.id] = item.score;
      // 暂时不用加 操作原因的默认文本
      // if (typeof item.qualityProjectType === 'string') {
      //   formInfo[item.qualityProjectType] = item.desc;
      // }
    });
    formRef.current.setFieldsValue(formInfo);
  }, []);

  return (
    <Form ref={formRef} onFieldsChange={fieldsChange}>
      {+qualityType === 4 && (
        <>
          <Row style={{ marginBottom: 5 }}>
            <Col span={12}>
              <a
                href={`${qualityRow.qualityCheck.fileServer}/${qualityRow.qualityCheck.recordFileName}`}
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
      <Row style={{ marginBottom: 5 }}>
        <Col span={12}>
          <strong>标准指标评分</strong>
        </Col>
        <Col span={4}>
          <strong>质检评分</strong>
        </Col>
        <Col span={4}>
          <strong>申诉评分</strong>
        </Col>
        <Col span={4}>
          <strong>修正评分</strong>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {infoInit
            .filter(v => v.qualityProjectType * 1 === 1)
            .map(v => (
              <Row style={{ marginBottom: 5 }} key={v.id}>
                <Form.Item>
                  <span>
                    <Tooltip title={v.desc}>
                      <ExclamationCircleOutlined />
                    </Tooltip>
                    <span style={{ margin: 5 }}>
                      {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                    </span>
                  </span>
                </Form.Item>
              </Row>
            ))}
        </Col>
        {scroeForm(1)}
      </Row>

      <Divider />
      <Row style={{ marginBottom: 5 }}>
        <Col span={12}>
          <strong>附加指标评分</strong>
        </Col>
        <Col span={4}>
          <strong>质检评分</strong>
        </Col>
        <Col span={4}>
          <strong>申诉评分</strong>
        </Col>
        <Col span={4}>
          <strong>修正评分</strong>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {infoInit
            .filter(v => v.qualityProjectType * 1 === 2)
            .map(v => (
              <Row style={{ marginBottom: 5 }} key={v.id}>
                <Form.Item>
                  <span>
                    <Tooltip title={v.desc}>
                      <ExclamationCircleOutlined />
                    </Tooltip>
                    <span style={{ margin: 5 }}>
                      {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                    </span>
                  </span>
                </Form.Item>
              </Row>
            ))}
        </Col>
        {scroeForm(2)}
      </Row>
      <Divider />
      <Row style={{ marginBottom: 5 }}>
        <Col span={12}>
          <strong>总得分</strong>
        </Col>
        <Col span={4}>
          <strong>{totalScoreOpt.qualityReviewScore || ''}</strong>
        </Col>
        <Col span={4}>
          <strong>{totalScoreOpt.appealReviewScore || ''}</strong>
        </Col>
        <Col span={4}>
          <strong>{checkTotal || ''}</strong>
        </Col>
      </Row>
      <Divider />

      {qcDesc()}

      {/* 操作 */}
      <Form.Item label="操作原因" rules={rules} name="desc">
        <TextArea rows={5} />
      </Form.Item>
      <Button type="primary" onClick={submit}>
        同意并修正评分
      </Button>
      <Button style={{ margin: 5 }} onClick={noPass}>
        驳回
      </Button>
      <Button onClick={() => setVisible(false)}>取消</Button>
    </Form>
  );
};
