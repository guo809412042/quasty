/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Row, Col, Tooltip, Divider, Timeline,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { complaintLogList } from '../../../../service';
import { formatDate } from '../../../../utils/utils';

export default ({ row }) => {
  const { complaintStatus } = row;
  const [visible, setVisible] = useState(false);
  const [totalScoreOpt, setTotalScoreOpt] = useState({
    qualityReviewScore: 0, // 质检评分总分
    appealReviewScore: 0, // 申诉评分总分
    reviseReviewScore: 0, // 修正评分总分
  });
  // 质检评分或者是修正后的评分
  const infoInit = row.scoreInfo ? JSON.parse(row.scoreInfo) : [];
  const [dataSource, setDataSource] = useState([]);
  // complaint_type 申述类型。0:客服首次申述 1:质检审核通过并修正 2:质检审核未通过
  // 3:客服再次申述 4:主管审核通过并修正 5:主管审核未通过
  const getComplaintList = async () => {
    const { data } = await complaintLogList({
      qualityStatusId: row.id,
    });
    setDataSource(data);
  };
  useEffect(() => {
    if (visible) {
      getComplaintList();
    }
  }, [visible]);

  const infoForm = (list, type = 1) => (
    <Col span={4}>
      {list
        .filter(v => v.qualityProjectType * 1 === type)
        .map(v => (
          <Row style={{ marginBottom: 5 }} key={`${v.id}-${type}`}>
            {v.score}
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

  const scroeForm = (type) => {
    // 打分类型 0:原始分 1:质检修正评分 2:TL修正评分
    // complaint_status 申述状态。
    // 0:未申述 2:质检待审核 3:质检审核通过 4:质检审核未通过 5:主管待审核 6:主管审核通过 7:主管审核未通过
    if (!complaintStatus) {
      computedScore(infoInit, 'qualityReviewScore');
      return <>{infoForm(infoInit, type)}</>;
    }
    if (!dataSource.length) return '';
    // 质检待审核 申诉表中只有一条申诉数据
    if (complaintStatus * 1 === 2) {
      let info = [];
      try {
        info = JSON.parse(dataSource[0].scoreInfo);
      } catch (e) {
        console.log(e);
        info = [];
      }
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(info, 'appealReviewScore');
      return (
        <>
          {infoForm(infoInit, type)}
          {infoForm(info, type)}
        </>
      );
    }
    // 3:质检审核通过
    // infoInit为修正评分
    // dataSource长度为2 dataSource[0] 申诉数据 dataSource[1] 第一次质检数据
    if (complaintStatus * 1 === 3) {
      let firstInfo = []; // 质检
      let info = []; // 申诉
      try {
        firstInfo = JSON.parse(dataSource[1].scoreInfo);
        info = JSON.parse(dataSource[0].scoreInfo);
      } catch (e) {
        console.log(e);
        firstInfo = [];
        info = [];
      }
      // 质检评分
      computedScore(firstInfo, 'qualityReviewScore');
      // 申诉评分
      computedScore(info, 'appealReviewScore');
      // 修正评分
      computedScore(infoInit, 'reviseReviewScore');
      return (
        <>
          {infoForm(firstInfo, type)}
          {infoForm(info, type)}
          {infoForm(infoInit, type)}
        </>
      );
    }

    // 质检审核未通过
    if (complaintStatus * 1 === 4) {
      let info = [];
      try {
        info = JSON.parse(dataSource[0].scoreInfo);
      } catch (e) {
        console.log(e);
        info = [];
      }
      // infoInit 质检分数
      // dataSource[1]申诉表2条数据 第一条申诉数据 第二条 驳回数据
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(info, 'appealReviewScore');
      return (
        <>
          {infoForm(infoInit, type)}
          {infoForm(info, type)}
        </>
      );
    }

    // 主管待审核
    if (complaintStatus * 1 === 5) {
      // dataSource 三条数据 0 第一次申诉 1 第一次驳回  2 第二次申诉
      // infoInit 质检分数
      let info = [];
      try {
        info = JSON.parse(dataSource[2].scoreInfo);
      } catch (e) {
        console.log(e);
        info = [];
      }
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(info, 'appealReviewScore');
      return <>
          {infoForm(infoInit, type)}
          {infoForm(info, type)}
        </>;
    }

    // 主管审核通过
    if (complaintStatus * 1 === 6) {
      // dataSource 4条数据 0 第一次申诉 1 质检员驳回  2 第二次申诉 3 第一次质检分数
      // infoInit 第二次质检分数(修正)
      let info = [];
      let dataSource2 = [];
      try {
        info = JSON.parse(dataSource[3].scoreInfo);
        dataSource2 = JSON.parse(dataSource[2].scoreInfo);
      } catch (e) {
        console.log(e);
        info = [];
        dataSource2 = [];
      }
      // 质检评分
      computedScore(info, 'qualityReviewScore');
      // 申诉评分
      computedScore(dataSource2, 'appealReviewScore');
      // 修正评分
      computedScore(infoInit, 'reviseReviewScore');
      return <>
          {infoForm(info, type)}
          {infoForm(dataSource2, type)}
          {infoForm(infoInit, type)}
        </>;
    }


    // 主管审核未通过
    if (complaintStatus * 1 === 7) {
      // dataSource 4条数据 0 第一次申诉 1 质检员驳回  2 第二次申诉 3 主管驳回
      // infoInit 质检分数
      let info = [];
      try {
        info = JSON.parse(dataSource[2].scoreInfo);
      } catch (e) {
        console.log(e);
        info = [];
      }
      // 质检评分
      computedScore(infoInit, 'qualityReviewScore');
      // 申诉评分
      computedScore(info, 'appealReviewScore');
      return <>
          {infoForm(infoInit, type)}
          {infoForm(info, type)}
        </>;
    }
    return '';
  };
  const qcDesc = () => {
    // complaint_status 0:未申述
    if (!complaintStatus) {
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }
    if (!dataSource.length) return '';
    // 质检待审核 申诉表中只有一条申诉数据
    if (complaintStatus * 1 === 2) {
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      let info = {};
      try {
        info = JSON.parse(dataSource[0].scoreInfo).find(v => v.qualityProjectType === 'desc');
      } catch (e) {
        console.log(e);
        info = {};
      }
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
            <strong>{info ? info.desc : ''}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }

    // 3:质检审核通过
    // infoInit为修正评分
    // dataSource长度为2 dataSource[0] 申诉数据 dataSource[1] 第一次质检数据
    if (complaintStatus * 1 === 3) {
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      let firstInfo = {}; // 质检
      let info = {}; // 申诉
      try {
        firstInfo = JSON.parse(dataSource[1].scoreInfo).find(v => v.qualityProjectType === 'desc');
        info = JSON.parse(dataSource[0].scoreInfo).find(v => v.qualityProjectType === 'desc');
      } catch (e) {
        console.log(e);
        firstInfo = {};
        info = {};
      }
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{firstInfo ? firstInfo.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
            <strong>{info ? info.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检审核通过 [ {dataSource[1].operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }

    // 质检审核未通过
    if (complaintStatus * 1 === 4) {
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      let info = {};
      try {
        info = JSON.parse(dataSource[0].scoreInfo).find(v => v.qualityProjectType === 'desc');
      } catch (e) {
        console.log(e);
        info = {};
      }
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
            <strong>{info ? info.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检审核未通过 [ {dataSource[1].operatorName} ]</p>
            <strong>{dataSource[1].desc}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }
    // 主管待审核
    if (complaintStatus * 1 === 5) {
      // dataSource 三条数据 0 第一次申诉 1 第一次驳回  2 第二次申诉
      // infoInit 质检分数
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
            <strong>{dataSource[0].desc}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检审核未通过 [ {dataSource[1].operatorName} ]</p>
            <strong>{dataSource[1].desc}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[2].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>再次申诉理由 [ {dataSource[1].operatorName} ]</p>
            <strong>{dataSource[2].desc}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }

    // 主管审核通过
    if (complaintStatus * 1 === 6) {
      // dataSource 4条数据 0 第一次申诉 1 质检员驳回  2 第二次申诉 3 第一次质检分数
      // infoInit 第二次质检分数(修正)
      const find = JSON.parse(dataSource[3].scoreInfo).find(v => v.qualityProjectType === 'desc');
      // 主管审核通过
      const findResult = dataSource.find(v => v.complaintType === 4) || {};
      // 再次申诉审核
      const secondReviewResult = dataSource.find(v => v.complaintType === 3);
      return <Timeline>
        <Timeline.Item color="blue">
          <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
          <p>质检点评 [ {row.operatorName} ]</p>
          <strong>{find ? find.desc : ''}</strong>
        </Timeline.Item>
        <Timeline.Item color="blue">
          <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
          <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
          <strong>{dataSource[0].desc}</strong>
        </Timeline.Item>
        <Timeline.Item color="blue">
          <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
          <p>质检审核未通过 [ {dataSource[1].operatorName} ]</p>
          <strong>{dataSource[1].desc}</strong>
        </Timeline.Item>
        {
          secondReviewResult && (
            <>
              <Timeline.Item color="blue">
                <p style={{ color: '#888' }}>{formatDate(secondReviewResult.operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
                <p>再次申诉 [ {secondReviewResult.operatorName} ]</p>
                <strong>{secondReviewResult.desc}</strong>
              </Timeline.Item>
            </>
          )
        }
        <Timeline.Item color="blue">
          <p style={{ color: '#888' }}>{formatDate(findResult.operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
          <p>主管审核通过 [ {findResult.operatorName} ]</p>
          <strong>{findResult.desc}</strong>
        </Timeline.Item>
      </Timeline>;
    }

    // 主管驳回
    if (complaintStatus * 1 === 7) {
      // dataSource 4条数据 0 第一次申诉 1 第一次驳回  2 第二次申诉 3 主管驳回
      // infoInit 质检分数
      const find = infoInit.find(v => v.qualityProjectType === 'desc');
      // 主管审核未通过
      const findResult = dataSource.find(v => v.complaintType === 5) || {};
      // 再次申诉审核
      const secondReviewResult = dataSource.find(v => v.complaintType === 3);
      return (
        <Timeline>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检点评 [ {row.operatorName} ]</p>
            <strong>{find ? find.desc : ''}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
            <strong>{dataSource[0].desc}</strong>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>质检审核未通过 [ {dataSource[1].operatorName} ]</p>
            <strong>{dataSource[1].desc}</strong>
          </Timeline.Item>
          {
            secondReviewResult && (
              <Timeline.Item color="blue">
                <p style={{ color: '#888' }}>{formatDate(secondReviewResult.operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
                <p>再次申诉理由 [ {secondReviewResult.operatorName} ]</p>
                <strong>{secondReviewResult.desc}</strong>
              </Timeline.Item>
            )
          }
          <Timeline.Item color="blue">
            <p style={{ color: '#888' }}>{formatDate(findResult.operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
            <p>主管审核未通过 [ {findResult.operatorName} ]</p>
            <strong>{findResult.desc}</strong>
          </Timeline.Item>
        </Timeline>
      );
    }

    return '';
  };

  return (
    <div>
      <Button style={{ marginTop: 5 }} onClick={() => setVisible(true)}>
        详情
      </Button>
      {
        visible && (
          <Modal width={600} title="详情" visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
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
                      <span>
                        <Tooltip title={v.desc}>
                          <ExclamationCircleOutlined />
                        </Tooltip>
                        <span style={{ margin: 5 }}>
                          {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                        </span>
                      </span>
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
                      <span>
                        <Tooltip title={v.desc}>
                          <ExclamationCircleOutlined />
                        </Tooltip>
                        <span style={{ margin: 5 }}>
                          {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                        </span>
                      </span>
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
                <strong>{totalScoreOpt.reviseReviewScore || ''}</strong>
              </Col>
            </Row>
            <Divider />

            {qcDesc()}
          </Modal>
        )
      }
    </div>
  );
};
