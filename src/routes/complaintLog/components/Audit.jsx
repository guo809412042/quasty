/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Spin, Divider, Row, Col,
} from 'antd';
import {
  qualityCheckQueryIssueReport,
  qualityCheckQueryEmail,
  qualityCheckQueryAppStore,
  qualityCheckQueryPhone,
} from '../../../service';
import ScoreDetailView from '../../QCList/components/score/ScoreDetailView';
import ScoreReplyView from '../../QCList/components/score/ScoreReplyView';
import ScoreView from './ScoreView';

export default ({ row, getList }) => {
  const { sourceId, qualityType } = row;
  const [loading, setLoading] = useState(false);
  const [qualityRow, setQualityRow] = useState({
    qualityCheck: {},
    qualityStatus: {},
  });
  const [visible, setVisible] = useState(false);
  const getDetailInfo = async () => {
    setLoading(true);
    const params = { qualityStatus: { qualityType, sourceId }, qualityCheck: {} };
    let res;
    if (qualityType * 1 === 1) {
      res = await qualityCheckQueryIssueReport(params);
    } else if (qualityType * 1 === 2) {
      res = await qualityCheckQueryEmail(params);
    } else if (qualityType * 1 === 3) {
      res = await qualityCheckQueryAppStore(params);
    } else if (qualityType * 1 === 4) {
      res = await qualityCheckQueryPhone(params);
    }
    setQualityRow(
      res.data.length
        ? res.data[0]
        : {
          qualityCheck: {},
          qualityStatus: {},
        },
    );
    setLoading(false);
  };
  useEffect(() => {
    if (visible) {
      getDetailInfo();
    }
  }, [visible]);
  const content = () => {
    if (qualityRow.qualityStatus.qualityType) {
      const { qualityCheck } = qualityRow;
      let source = qualityType;
      if (source * 1 === 3) {
        source = qualityCheck.source;
      }
      return (
        <>
          {/* 历史回复记录 */}
          <ScoreDetailView row={qualityRow} source={source} />
          <Divider />
          <Row gutter={24}>
            {+qualityType !== 4 && (
              <Col span={12} style={{ borderRight: '1px solid #eee', paddingLeft: 10 }}>
                {/* 消息内容 */}
                <ScoreReplyView row={qualityRow} source={source} isTranslate />
              </Col>
            )}
            <Col span={11} offset={1}>
              {/* 评分 */}
              <ScoreView
                row={row}
                qualityRow={qualityRow}
                setVisible={setVisible}
                getList={getList}
                source={source}
                qualityType={qualityType}
              />
            </Col>
          </Row>
        </>
      );
    }
    return '';
  };
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        审核
      </Button>
      <Modal destroyOnClose width={900} title="审核" visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Spin spinning={loading}>{content()}</Spin>
      </Modal>
    </>
  );
};
