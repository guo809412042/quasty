/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button, Row, Col, Divider,
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import ScoreDetailView from './ScoreDetailView';
import ScoreReplyView from './ScoreReplyView';
import ScoreRateView from './ScoreRateView';

export default ({ source, row, getList }) => {
  const [visible, setVisible] = useState(false);
  const content = (
    <div>
      {/* 详情 */}
      <ScoreDetailView row={row} source={source} />
      <Divider />
      <Row gutter={24}>
        {
          +source !== 4 && (
            <Col span={12} style={{ borderRight: '1px solid #eee', paddingLeft: 10 }}>
              {/* 消息内容 */}
              <ScoreReplyView row={row} source={source} isTranslate />
            </Col>
          )
        }
        <Col span={11} offset={1}>
          {/* 评分 */}
          <ScoreRateView
            row={row}
            source={source}
            setVisible={setVisible}
            getList={getList}
          />
        </Col>
      </Row>
    </div>
  );
  // const menus = window._VCM_ ? window._VCM_.menu : [];
  // //  质检员评分权限
  // const promissionQC = menus.find(v => v.value === 'qc-rate-button');

  const promissionQC = true;
  return (
    <>
      {promissionQC ? (
        <Button type="primary" onClick={() => setVisible(true)}>
          评分
        </Button>
      ) : (
        ''
      )}
      <Modal width={900} title="评分" onCancel={() => setVisible(false)} visible={visible} footer={null}>
        {content}
      </Modal>
    </>
  );
};
