import React from 'react';
import {
  Row, Col, Rate, Tag,
} from 'antd';
import { APP_PRODUCT_LIST } from '../../../../utils/const';
import {
  SOURCE, RESPONSE_STATE, CHECK_TYPE, RESPONSE_COLOR, CHECK_COLOR, ISREPLY_COLOR, ISREPLY_STATE, VIP_STATUS, NumberToWarningType, CONNECT_TYPE, CONNECT_TYPE_COLOR,
} from '../../../const';
import { formatDate } from '../../../../utils/utils';


export default ({ source, row }) => {
  source = source && source.toString();
  const { qualityCheck, qualityStatus } = row;
  const labelForm = (name, value) => <Col span={6}>
    <span><strong>{name}：</strong>{value}</span>
  </Col>;
  if (['google', 'appstore', 'huawei'].includes(source)) {
    return <Row>
      {labelForm('产品', APP_PRODUCT_LIST[qualityCheck.productId])}
      {labelForm('ID', qualityStatus.sourceId)}
      {labelForm('渠道', SOURCE[qualityCheck.source])}
      {labelForm('评星', <Rate value={qualityCheck.rating}/>)}
      {labelForm('回复状态', <Tag color={RESPONSE_COLOR[qualityCheck.responseStatus || '0']}>{RESPONSE_STATE[qualityCheck.responseStatus || '0']}</Tag>)}
      {labelForm('预警状态', NumberToWarningType(qualityStatus.warningType))}
      {labelForm('质检状态', <Tag color={CHECK_COLOR[qualityStatus.checkType]}>{CHECK_TYPE[qualityStatus.checkType]}</Tag>)}
    </Row>;
  }
  if (source === '2') {
    return <Row>
      {labelForm('产品', APP_PRODUCT_LIST['2'])}
      {labelForm('ID', qualityCheck.emailId)}
      {labelForm('发件人', qualityCheck.nickname)}
      {labelForm('收信时间', formatDate(qualityCheck.dateString, 'YYYY-MM-DD HH:mm:ss'))}
      {labelForm('回复状态', <Tag color={ISREPLY_COLOR[qualityCheck.isReply || '0']}>{ISREPLY_STATE[qualityCheck.isReply || '0']}</Tag>)}
      {labelForm('预警状态', NumberToWarningType(qualityStatus.warningType))}
      {labelForm('质检状态', <Tag color={CHECK_COLOR[qualityStatus.checkType]}>{CHECK_TYPE[qualityStatus.checkType]}</Tag>)}
    </Row>;
  }
  if (source === '1') {
    return <Row>
      {labelForm('产品', APP_PRODUCT_LIST[qualityCheck.productId || '2'])}
      {labelForm('ID', qualityCheck.issueId)}
      {labelForm('VIP状态', <Tag color={ISREPLY_COLOR[qualityCheck.isVip]}>{VIP_STATUS[qualityCheck.isVip]}</Tag>)}
      {labelForm('预警状态', NumberToWarningType(qualityStatus.warningType))}
      {labelForm('质检状态', <Tag color={CHECK_COLOR[qualityStatus.checkType]}>{CHECK_TYPE[qualityStatus.checkType]}</Tag>)}
    </Row>;
  }
  if (source === '4') {
    return <Row>
      {labelForm('通话ID', qualityCheck.callSheetId)}
      {labelForm('客户号码', (qualityCheck.connectType === 'dialTransfer' || qualityCheck.connectType === 'dialout'
        ? qualityCheck.calledNo
        : qualityCheck.callNo))}
      {labelForm('产品', APP_PRODUCT_LIST[qualityStatus.productId])}
      {labelForm('呼叫类型', <Tag color={CONNECT_TYPE_COLOR[qualityCheck.connectType]}>{CONNECT_TYPE[qualityCheck.connectType]}</Tag>)}

    </Row>;
  }
  return '';
};
