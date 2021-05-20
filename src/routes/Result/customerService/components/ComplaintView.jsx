/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Row, Col, Tooltip, InputNumber, Divider, Form, message, Timeline,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import {
  getEmailName, formatDate, getUserId, rulesFunction,
} from '../../../../utils/utils';
import { operatorComplaint, complaintLogList } from '../../../../service';

const rules = [
  {
    required: true,
    message: '必填！',
  },
];
export default ({
  row, getList, rowInfo, source, userJson,
}) => {
  const [visible, setVisible] = useState(false);
  const info = row.scoreInfo ? JSON.parse(row.scoreInfo) : [];
  const [scoreNum, setScoreNum] = useState({});
  const [total, setTotal] = useState(0);
  useEffect(() => {
    let num = 0;
    Object.keys(scoreNum).forEach((v) => {
      num += scoreNum[v];
    });
    setTotal(num);
  }, [scoreNum]);
  const formRef = React.createRef();
  const submit = async () => {
    const { errorFields } = await formRef.current.validateFields();
    if (errorFields) {
      return '';
    }
    const values = formRef.current.getFieldsValue();

    const scoreInfo = [];
    for (const i of info) {
      if (i.qualityProjectType * 1 === 1 || i.qualityProjectType * 1 === 2) {
        delete i.createTime;
        delete i.updateTime;
        delete i.operatorName;
        scoreInfo.push({
          ...i,
          score: values[i.id],
        });
      }
    }
    if (values.desc) {
      scoreInfo.push({
        qualityProjectType: 'desc',
        desc: values.desc,
      });
    }

    // 客服首次申述：CUSTOMER_FIRST_COMPLAINT 。客服再次申述：CUSTOMER_TWICE_COMPLAINT
    const data = {
      complaintTypeValue: !row.complaintStatus * 1 ? 'CUSTOMER_FIRST_COMPLAINT' : 'CUSTOMER_TWICE_COMPLAINT',
      operatorName: getEmailName(),
      id: row.id,
      desc: values.desc,
    };
    data.scoreInfo = JSON.stringify(scoreInfo);
    await operatorComplaint(data);
    setVisible(false);
    message.success('操作成功！');
    getList();
  };
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
    getComplaintList();
  }, []);

  const content = () => {
    if (visible) {
      if (!row.complaintStatus * 1) {
        return <>
        <Timeline>
          {info
            .filter(v => v.qualityProjectType === 'desc')
            .map(v => (
              <Timeline.Item color="blue">
                <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
                <p>质检点评 [ {row.operatorName} ]</p>
                <strong>{v ? v.desc : ''}</strong>
              </Timeline.Item>
            ))}
        </Timeline>
        </>;
      }
      if (row.complaintStatus * 1 === 4 && dataSource.length) {
        let find = {};
        try {
          find = JSON.parse(dataSource[0].scoreInfo).find(v => v.qualityProjectType === 'desc');
        } catch (e) {
          console.log(e);
          find = {};
        }
        return <>
       <Timeline>
         {info
           .filter(v => v.qualityProjectType === 'desc')
           .map(v => (
             <Timeline.Item color="blue">
               <p style={{ color: '#888' }}>{formatDate(row.scoreTime, 'YYYY-MM-DD HH:mm:ss')}</p>
               <p>质检点评 [ {row.operatorName} ]</p>
               <strong>{v ? v.desc : ''}</strong>
             </Timeline.Item>
           ))}
         <Timeline.Item color="blue">
           <p style={{ color: '#888' }}>{formatDate(dataSource[0].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
           <p>首次申诉 [ {dataSource[0].operatorName} ]</p>
           <strong>{find ? find.desc : ''}</strong>
         </Timeline.Item>
         <Timeline.Item color="blue">
           <p style={{ color: '#888' }}>{formatDate(dataSource[1].operatorTime, 'YYYY-MM-DD HH:mm:ss')}</p>
           <p>质检审核未通过 [ {dataSource[1].operatorName} ]</p>
           <strong>{dataSource[1].desc}</strong>
         </Timeline.Item>
       </Timeline>
        </>;
      }
    }
    return '';
  };
  const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const scoreTime = moment(row.scoreTime).format('YYYY-MM-DD HH:mm:ss');
  const day = moment(currentDate).diff(scoreTime, 'days');
  // 再次申诉时间
  let secondApplyStatus = 1;
  if (row.complaintStatus * 1 === 4) {
    const secondApplyTime = ((dataSource || []).find(v => +v.complaintType === 2) || {}).operatorTime || 0;
    if (secondApplyTime) {
      const diffDay = moment(currentDate).diff(secondApplyTime, 'days');
      secondApplyStatus = diffDay >= 3;
    }
  }

  const title = !row.complaintStatus * 1 ? '申诉' : row.complaintStatus * 1 === 4 ? '再次申诉' : '';
  let isNotCurrentUser = true;
  isNotCurrentUser = +row.customerId !== +getUserId();
  const feedbackStatus = isNotCurrentUser || (!row.complaintStatus * 1 ? day >= 7 : secondApplyStatus);

  return (
    <div>
      {title && row.checkType * 1 === 3 ? (
        <Button type="primary"
          onClick={() => setVisible(true)}
          style={{ marginTop: 5 }}
          disabled={feedbackStatus}
        >
          {title}
        </Button>
      ) : (
        ''
      )}
      {
      }
      <Modal
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
        okText="提交"
        cancelText="取消"
      >
        <Form ref={formRef}>
          <Row style={{ marginBottom: 5 }}>
            <Col span={14}>
              <strong>标准指标评分</strong>
            </Col>
            <Col span={5}>
              <strong>质检评分</strong>
            </Col>
            <Col span={5}>
              <strong>申诉评分</strong>
            </Col>
          </Row>
          {info
            .filter(v => v.qualityProjectType * 1 === 1)
            .map(v => (
              <Row style={{ marginBottom: 5 }} key={v.id}>
                <Col span={14}>
                  <span>
                    <Tooltip title={v.desc}>
                      <ExclamationCircleOutlined />
                    </Tooltip>
                    <span style={{ margin: 5 }}>
                      {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                    </span>
                  </span>
                </Col>
                <Col span={5}>
                  <span>{v.score}</span>
                </Col>
                <Col span={5}>
                  <Form.Item name={v.id}
                    rules={[...rules, { validator: (_, value) => rulesFunction(value, v) }]}>
                    <InputNumber
                      onChange={val => setScoreNum({
                        ...scoreNum,
                        [v.id]: val,
                      })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          <Divider />
          <Row style={{ marginBottom: 5 }}>
            <Col span={14}>
              <strong>附加指标评分</strong>
            </Col>
            <Col span={5}>
              <strong>质检评分</strong>
            </Col>
            <Col span={5}>
              <strong>申诉评分</strong>
            </Col>
          </Row>
          {info
            .filter(v => v.qualityProjectType * 1 === 2)
            .map(v => (
              <Row style={{ marginBottom: 5 }} key={v.id}>
                <Col span={14}>
                  <span>
                    <Tooltip title={v.desc}>
                      <ExclamationCircleOutlined />
                    </Tooltip>
                    <span style={{ margin: 5 }}>
                      {v.title} ({v.scoreStandardMin}-{v.scoreStandardMax})：
                    </span>
                  </span>
                </Col>
                <Col span={5}>
                  <span>{v.score}</span>
                </Col>
                <Col span={5}>
                  <Form.Item name={v.id}
                    rules={[...rules, { validator: (_, value) => rulesFunction(value, v) }]}>
                    <InputNumber
                      onChange={val => setScoreNum({
                        ...scoreNum,
                        [v.id]: val,
                      })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          <Divider />
          <Row style={{ marginBottom: 5 }}>
            <Col span={14}>
              <span>合计</span>
            </Col>
            <Col span={5}>
              <span>{row.scoreAdditional + row.scoreBase}</span>
            </Col>
            <Col span={5}>
              <span>{total}</span>
            </Col>
          </Row>
          <Divider />
          {content()}

          <Divider />
          {!row.complaintStatus * 1 || row.complaintStatus * 1 === 4 ? (
            <div>
              <Form.Item label="申诉理由" name="desc" rules={rules}>
                <TextArea rows={5} />
              </Form.Item>
            </div>
          ) : (
            ''
          )}
        </Form>
      </Modal>
    </div>
  );
};
