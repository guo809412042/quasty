/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Table, Pagination, Button, Tag, Rate, Modal, message, Popover,
} from 'antd';
import moment from 'moment';
import { markdown } from 'markdown';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { APP_PRODUCT_LIST } from '../../../utils/const';
import {
  ISREPLY_STATE,
  CHECK_TYPE,
  ISREPLY_COLOR,
  CHECK_COLOR,
  SOURCE,
  RESPONSE_STATE,
  RESPONSE_COLOR,
  VIP_STATUS,
  NumberToWarningType,
  REPEAT_CALL,
  INVESTIGATE_COLOR,
  INVESTIGATE,
  CONNECT_TYPE_COLOR,
  CONNECT_TYPE,
} from '../../const';
import EmailContent from './email/EmailContent';
import { onLink } from '../utils';
import AppStoreContent from './appstore/AppStoreContent';
import { LANGUAGE_MAP } from '../../../utils/enum';
import {
  handleCopyText, getEmailName, formatSeconds, gotoIssuePage,
} from '../../../utils/utils';
import { updateCheckTypeSVC } from '../../../service';
import ScoreView from './score/ScoreView';
import Chat from '../../common/issueContent/Chat';
import MessageView from '../../common/issueContent/MessageView';
import styles from './style.less';

export default ({
  dataSource,
  search,
  loading,
  paginationOpts = {},
  issueTagList = [],
  userList = [],
  getList,
  PAGE_TYPE,
  userMap = {},
}) => {
  const handleCopy = (record) => {
    const content = `
    手机系统: ${record.sysVer || ''}
    设备机型: ${record.deviceOs || ''}
    APP 版本: ${record.appVersion || ''}
    auid: ${record.auid || ''}
    duiddigest: ${record.duiddigest || ''}
    appKey: ${record.appKey || ''}
    渠道: ${record.channel || ''}
    国家: ${record.countryCode || ''}
    语言: ${record.lang || ''}
    `;
    handleCopyText(content);
  };
  const [selectKeys, setSelectKeys] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectKeys(selectedRowKeys);
    },
  };

  // QUALITY_ING 。 忽略：IGNORE_QUALITY type 1 批量 2 单个
  const updateCheckType = async (checkTypeValue, type = 1, id) => {
    if (!selectKeys.length && type === 1) {
      message.error('请选择要操作的数据！');
      return;
    }
    Modal.confirm({
      title: `确定${checkTypeValue === 'QUALITY_ING' ? '领取' : '忽略'}?`,
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const body = {
          checkTypeValue,
          operatorName: getEmailName(),
        };
        if (type === 1) {
          body.idList = selectKeys;
        } else {
          body.id = id;
        }
        const res = await updateCheckTypeSVC(body);
        if (res.status) {
          message.success('操作成功！');
        }
        setSelectKeys([]);
        getList();
      },
      onCancel() {},
    });
  };
  let columns = [];
  // 工单
  if (search.source === '1') {
    columns = [
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text || '2'] },
      {
        dataIndex: ['qualityCheck', 'issueId'],
        title: 'ID',
        render(text, row) {
          const { productId } = row.qualityStatus || {};

          return (
            <a
              href={gotoIssuePage({
                p: productId,
                issueId: text,
                pageType: 'issue',
                issueState: -1,
                productId,
              })}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {text}
            </a>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'isVip'],
        title: 'VIP状态',
        render: text => <Tag color={ISREPLY_COLOR[text]}>{VIP_STATUS[text]}</Tag>,
      },
      {
        dataIndex: ['qualityCheck', 'gmtCreate'],
        title: '人工工单生成时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityCheck', 'operateCreateTime'],
        title: '客服领取时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityCheck', 'replyTime'],
        title: '客服首次回复时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityCheck', 'chatLogHistory'],
        title: '消息内容',
        width: 380,
        render: (text) => {
          const record = text ? JSON.parse(text) : [];
          if (record && record.length) {
            const info = record[0];
            return (
              <>
                <MessageView info={info} />
                {record.length > 1 && (
                  <Popover trigger="click" content={<Chat userMap={userMap} list={record} />}>
                    <a>点击展开更多&gt;&gt;</a>
                  </Popover>
                )}
              </>
            );
          }
          return null;
        },
      },
      {
        dataIndex: 'info',
        title: '系统信息',
        render: (text, record) => {
          const {
            sysVer, // 手机系统
            deviceOs, // 设备机型
            appVersion, // APP 版本
            auid,
            duiddigest,
            appKey,
            channel, // 渠道
            countryCode,
            lang,
          } = record.qualityCheck;
          return (
            <div>
              <div>手机系统: {sysVer}</div>
              <div>设备机型: {deviceOs}</div>
              <div>APP 版本: {appVersion}</div>
              <div>auid: {auid}</div>
              <div>duiddigest: {duiddigest}</div>
              <div>appKey: {appKey}</div>
              <div>渠道: {channel}</div>
              <div>国家: {countryCode}</div>
              <div>语言: {lang}</div>
              <a onClick={() => handleCopy(record.qualityCheck)}>一键复制</a>
            </div>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'evaluationTypeId'],
        title: '服务总结标签',
        render: (text, record) => {
          const { tagRemark } = record.qualityCheck || {};
          const find = (issueTagList || []).find(v => v.id * 1 === text * 1);
          if (find) {
            return (
              <div>
                {`${find.levelOne}-${find.levelTwo}-${find.levelThree}`}
                {tagRemark && <p className={styles.label_text}>标签备注：{tagRemark}</p>}
              </div>
            );
          }
          return <div>{tagRemark && <p className={styles.label_text}>标签备注：{tagRemark}</p>}</div>;
        },
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
      // {
      //   dataIndex: 'action',
      //   title: '操作',
      //   fixed: 'right',
      //   render: (text, row) => (
      //     PAGE_TYPE === 'wait'
      //       ? <Button type="primary" onClick={() => updateCheckType('QUALITY_ING', 2, row.qualityCheck.id)}>
      //       领取
      //       </Button>
      //       : <ScoreView row={row} />
      //   ),
      // },
    ];
  }
  // 邮件
  if (search.source === '2') {
    columns = [
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: () => APP_PRODUCT_LIST['2'] },
      {
        dataIndex: ['qualityCheck', 'emailId'],
        title: 'ID',
        // render(text) {
        //   return (
        //     <a
        //       href={gotoIssuePage({ p: 101, emailId: text, pageType: 'email' })}
        //       rel="nofollow noopener noreferrer"
        //       target="_blank"
        //     >
        //       {text}
        //     </a>
        //   );
        // },
      },
      {
        dataIndex: ['qualityCheck', 'fromAuth'],
        title: '发件人',
        render: (text, row) => (
          <div>
            <p>{row.qualityCheck.nickname}</p>
            {text}
          </div>
        ),
      },
      {
        dataIndex: ['qualityCheck', 'createTime'],
        title: '获取时间',
        width: 200,
        render: text => (text
          ? moment(text)
            .add(8, 'h')
            .format('YYYY-MM-DD HH:mm:ss')
          : ''),
      },
      {
        dataIndex: ['qualityCheck', 'isReply'],
        title: '回复状态',
        render: text => <Tag color={ISREPLY_COLOR[text]}>{ISREPLY_STATE[text]}</Tag>,
      },
      {
        dataIndex: ['qualityCheck', 'tagId'],
        title: '邮件内容',
        width: 400,
        render: (text, record) => {
          const { content = '', tagRemark } = record.qualityCheck || {};
          let tag = text;
          // if (replyTime <= new Date('2021-03-08 12:00:00').getTime()) {
          //   const find = emailIssueTagList.find(v => +v.id === +text);
          //   if (find) {
          //     tag = find.tag_name;
          //   }
          // } else {
          const find = issueTagList.find(v => +v.id === +text);
          if (find) {
            tag = `${find.levelOne}-${find.levelTwo}-${find.levelThree}`;
          }
          // }
          let curContent = '';
          if (content) {
            const isHtml = /<([a-z][\s\S]*)\/>|<\/([a-z][\s\S]*)>/.test(content);
            curContent = isHtml ? content : markdown.toHTML(content);
          }

          return (
            <div>
              <EmailContent record={record.qualityCheck} curContent={curContent} />
              <Tag>{tag}</Tag>
              {tagRemark && <p className={styles.label_text}>标签备注：{tagRemark}</p>}
            </div>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'files'],
        title: '附件',
        render: value => (value
          ? JSON.parse(value).map((v, index) => (
            <p>
              <a onClick={() => onLink(v)}>
                {v.split('.')[v.split('.').length - 1]} {index + 1}
              </a>
            </p>
          ))
          : null),
      },
      { dataIndex: ['qualityCheck', 'lang'], title: '语言', render: text => LANGUAGE_MAP[text] },
      {
        dataIndex: ['qualityCheck', 'replyTime'],
        title: '客服回复时间',
        width: 200,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
      // {
      //   dataIndex: 'action',
      //   title: '操作',
      //   fixed: 'right',
      //   render: (text, row) => (
      //     PAGE_TYPE === 'wait'
      //       ? <Button type="primary" onClick={() => updateCheckType('QUALITY_ING', 2, row.qualityCheck.id)}>
      //       领取
      //       </Button>
      //       : <ScoreView row={row} />
      //   ),
      // },
    ];
  }

  if (['google', 'appstore', 'huawei'].includes(search.source)) {
    columns = [
      { dataIndex: ['qualityCheck', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text] },
      {
        dataIndex: ['qualityStatus', 'sourceId'],
        title: 'ID',
        // render(text, row) {
        //   const { source, productId } = row.qualityCheck;
        //   return (
        //     <a
        //       href={gotoIssuePage({
        //         p: 101,
        //         id: text,
        //         pageType: search.source,
        //         source,
        //         product: productId,
        //       })}
        //       rel="nofollow noopener noreferrer"
        //       target="_blank"
        //     >
        //       {text}
        //     </a>
        //   );
        // },
      },
      { dataIndex: ['qualityCheck', 'source'], title: '渠道', render: text => SOURCE[text] },
      { dataIndex: ['qualityCheck', 'rating'], title: '评星', render: text => <Rate value={text} /> },
      {
        dataIndex: ['qualityCheck', 'createTime'],
        title: '评论获取时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityCheck', 'responseStatus'],
        title: '回复状态',
        render: text => <Tag color={RESPONSE_COLOR[text || '0']}>{RESPONSE_STATE[text || '0']}</Tag>,
      },
      {
        dataIndex: ['qualityCheck', 'reviewType'],
        title: '服务总结标签',
        width: 300,
        render: (text, record) => {
          const { typeRemarks } = record.qualityCheck || {};
          const tag = text ? issueTagList.find(v => v.id * 1 === text * 1) : '';
          if (tag) {
            return (
              <div>
                {tag ? <Tag style={{ marginTop: 5 }}>{`${tag.levelOne}/${tag.levelTwo}/${tag.levelThree}`}</Tag> : ''}
                {typeRemarks && <p className={styles.label_text}>标签备注：{typeRemarks}</p>}
              </div>
            );
          }
          return <div>{typeRemarks && <p className={styles.label_text}>标签备注：{typeRemarks}</p>}</div>;
        },
      },
      {
        dataIndex: 'qualityCheck',
        title: '消息内容',
        width: 500,
        render: (text, record) => {
          const row = record.qualityCheck;
          // const tag = row.reviewType ? issueTagList.find(v => v.id * 1 === row.reviewType * 1) : '';
          return (
            <>
              <AppStoreContent
                row={{
                  ...row,
                  device: row.device ? (row.device.includes('{') ? JSON.parse(row.device) : row.device) : '',
                }}
              />
              {/* {tag ? <Tag style={{ marginTop: 5 }}>{`${tag.levelOne}/${tag.levelTwo}/${tag.levelThree}`}</Tag> : ''} */}
            </>
          );
        },
      },
      // {
      //   dataIndex: 'qualityCheck',
      //   title: '国家/语言',
      //   render: text => (search.source === 'huawei'
      //     ? ''
      //     : search.source === 'google'
      //       ? `${LANGUAGE_MAP[text.language]}-${text.language}`
      //       : `${COUNTRY_MAP[text.country]}-${text.country}`),
      // },
      {
        dataIndex: ['qualityCheck', 'responseLastModified'],
        title: '客服回复时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityStatus', 'customerId'],
        title: '受理客服',
        render: (text) => {
          const find = userList.find(v => v.value * 1 === text * 1);
          if (find) {
            return find.name;
          }
          return '客服';
        },
      },
    ];
  }
  if (search.source === '4') {
    columns = [
      {
        dataIndex: ['qualityCheck', 'callSheetId'],
        title: '通话ID',
        render: (text, row) => {
          const { fileServer, recordFileName } = row.qualityCheck || {};

          return (
            <a href={`${fileServer}/${recordFileName}`} target="_blank" rel="nofollow noopener noreferrer">
              {text}
            </a>
          );
        },
      },
      {
        dataIndex: ['qualityCheck', 'callNo'],
        title: '客户号码',
        render: (text, row) => (row.qualityCheck.connectType === 'dialTransfer' || row.qualityCheck.connectType === 'dialout'
          ? row.qualityCheck.calledNo
          : text),
      },
      { dataIndex: ['qualityStatus', 'productId'], title: '产品', render: text => APP_PRODUCT_LIST[text] },
      {
        dataIndex: ['qualityCheck', 'connectType'],
        title: '呼叫类型',
        render: text => <Tag color={CONNECT_TYPE_COLOR[text]}>{CONNECT_TYPE[text]}</Tag>,
      },
      {
        dataIndex: ['qualityCheck', 'exten'],
        title: '处理坐席',
        render: (text, row) => {
          const { qualityStatus } = row;
          const operateName = userMap[qualityStatus.customerId] || '';

          return `${operateName}[${text}]`;
        },
      },
      {
        dataIndex: ['qualityCheck', 'offeringTime'],
        title: '呼叫时间',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        dataIndex: ['qualityCheck', 'ringTimeLength'],
        title: '振铃时长',
        render: text => formatSeconds(text),
      },
      {
        dataIndex: ['qualityCheck', 'callTimeLength'],
        title: '通话时长',
        render: text => formatSeconds(text),
      },
      {
        dataIndex: ['qualityCheck', 'holdTimeLength'],
        title: '保持时长',
        render: text => formatSeconds(text / 1000),
      },
      {
        dataIndex: ['qualityCheck', 'repeatCall'],
        title: '重复来电',
        render: text => REPEAT_CALL[text],
      },
      {
        dataIndex: ['qualityCheck', 'labels'],
        title: '通话标签',
        render: text => text || '',
      },
      {
        dataIndex: ['qualityCheck', 'investigate'],
        title: '满意度',
        render: text => (text ? <Tag color={INVESTIGATE_COLOR[text]}>{INVESTIGATE[text]}</Tag> : ''),
      },
      {
        dataIndex: ['qualityCheck', 'comments'],
        title: '备注',
        render: text => <p style={{ height: 150, overflowY: 'auto' }}>{text}</p>,
      },
    ];
  }
  if (columns.length) {
    if (search.source !== '4') {
      columns.push({
        dataIndex: ['qualityStatus', 'warningType'],
        title: '预警状态',
        render: text => NumberToWarningType(text),
      });
    }
    columns = columns.concat([
      {
        dataIndex: ['qualityStatus', 'checkType'],
        title: '质检状态',
        render: text => <Tag color={CHECK_COLOR[text]}>{CHECK_TYPE[text]}</Tag>,
      },
    ]);

    if (PAGE_TYPE === 'wait') {
      columns.push({
        dataIndex: ['qualityStatus', 'operatorName'],
        title: '领取人',
      });
    }

    columns.push({
      dataIndex: 'action',
      title: '操作',
      fixed: 'right',
      render: (text, row) => (PAGE_TYPE === 'wait' ? (
        <Button type="primary" onClick={() => updateCheckType('QUALITY_ING', 2, row.qualityStatus.id)}>
            领取
        </Button>
      ) : (
        <ScoreView source={search.source} row={row} getList={getList} />
      )),
    });
  }

  useEffect(() => {
    setSelectKeys([]);
  }, []);
  return (
    <div>
      {PAGE_TYPE === 'wait' ? (
        <div>
          <Button type="primary" onClick={() => updateCheckType('QUALITY_ING')}>
            一键领取
          </Button>
          <Button style={{ margin: 10 }} onClick={() => updateCheckType('IGNORE_QUALITY')}>
            批量忽略
          </Button>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={row => row.qualityStatus.id}
            loading={loading}
            pagination={false}
            style={{ margin: '10px 0' }}
            scroll={{ x: columns.length * 150, y: 600 }}
            rowSelection={rowSelection}
          />

          <Pagination {...paginationOpts} />
        </div>
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={row => row.qualityStatus.id}
            loading={loading}
            pagination={false}
            style={{ margin: '10px 0' }}
            scroll={{ x: columns.length * 150, y: 600 }}
          />
          <Pagination {...paginationOpts} />
        </div>
      )}
    </div>
  );
};
