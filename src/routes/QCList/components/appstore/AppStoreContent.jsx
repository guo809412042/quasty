/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import styles from '../../../style.less';
import AppStoreReplyView from './AppStoreReplyView';
// import TranslateForm from '../../common/TranslateForm';

export default ({ row }) => {
  const [isExpand, setIsExpand] = useState(false);
  return (
    <div key={row.id}>
      <AppStoreReplyView
        source={row.source}
        row={row}
        isTranslate
      />

      {row.source === 'huawei' ? (
        <Row className={styles.device}>
          <Col span={16}>{row.device}</Col>
          <Col span={8}>应用版本：{row.appVersion}</Col>
        </Row>
      ) : (
        ''
      )}
      {row.source === 'appstore' ? (
        <Row className={styles.device}>
          <Col span={8}>应用版本：{row.appVersion}</Col>
        </Row>
      ) : (
        ''
      )}
      {row.source === 'google' && !isExpand ? (
        <Row className={styles.device}>
          <Col span={8}>{row.device.productName}</Col>
          <Col span={7}>应用版本：{row.appVersion}</Col>
          <Col span={8}>操作系统：{row.device.androidVersion}</Col>
          <CaretUpOutlined style={{ cursor: 'pointer' }} onClick={() => setIsExpand(true)} />
        </Row>
      ) : (
        ''
      )}
      {row.source === 'google' && isExpand ? (
        <Row className={styles.device}>
          <Col span={24}>
            <CaretDownOutlined style={{ cursor: 'pointer', float: 'right' }} onClick={() => setIsExpand(false)} />

            <span>当地平台：{row.device.nativePlatform}</span>
          </Col>
          <Col span={12}>
            <span>产品：{row.device.productName}</span>
          </Col>
          <Col span={12}>
            <span>生产商：{row.device.manufacturer}</span>
          </Col>
          <Col span={12}>
            <span>cpuMake：{row.device.cpuMake}</span>
          </Col>
          <Col span={12}>
            <span>cpuModel：{row.device.cpuModel}</span>
          </Col>
          <Col span={12}>
            <span>屏幕分辨率：{row.device.screenDensityDpi}</span>
          </Col>
          <Col span={12}>
            <span>
              屏幕： {row.device.screenWidthPx} * {row.device.screenHeightPx}
            </span>
          </Col>
          <Col span={12}>
            <span>语言：{row.device.language}</span>
          </Col>
          <Col span={12}>
            <span>安卓版本：{row.device.androidVersion}</span>
          </Col>
        </Row>
      ) : (
        ''
      )}
    </div>
  );
};
