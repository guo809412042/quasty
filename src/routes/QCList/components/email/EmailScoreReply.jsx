/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { markdown } from 'markdown';
import { Divider } from 'antd';
import { formatDate } from '../../../../utils/utils';
import styles from '../../../style.less';
import { onLink } from '../../utils';
import { LANGUAGE_MAP } from '../../../../utils/enum';
import TranslateForm from '../../../common/TranslateForm';
import { userJonContext } from '../../../const';

export default ({ row }) => {
  const userJson = useContext(userJonContext);
  const replyText = row.replyText ? JSON.parse(row.replyText) : [];
  return <div>
    <p className={styles.time}>
      <span>{formatDate(row.dateString, 'YYYY-MM-DD HH:mm:ss')}</span>
    </p>
    <p className={styles.nickname}>
      <span>{row.nickname}[{row.fromAuth}]</span>
      <span style={{ fontSize: 10, float: 'right' }}>
        {LANGUAGE_MAP[row.lang]}
      </span>
    </p>
    {row.files
      ? JSON.parse(row.files).map((v, index) => (
        <span key={index}>
          <a onClick={() => onLink(v)} style={{ marginRight: 5 }}>
            {v.split('.')[v.split('.').length - 1]} {index + 1}
          </a>
        </span>
      ))
      : null}
    <div/>
    <div className={styles.scoreEmailContent}>
      <strong>{row.subject}</strong>
      <p
        dangerouslySetInnerHTML={{ __html: markdown.toHTML(row.content || '') }}
        style={{
          fontSize: '12px',
          color: '#aaa',
          height: '100px',
          overflow: 'auto',
          width: '400px',
        }}
      />
      <TranslateForm value={row.content} />
    </div>
    <Divider/>
    {replyText.map(i => <div>
      <p className={styles.time}>
        <span>{formatDate(i.createTime, 'YYYY-MM-DD HH:mm:ss')}</span>
      </p>
      <p className={styles.nickname}>
        <span>{userJson[i.operatorUserId] || '客服'}</span>
      </p>
      <div className={styles.scoreEmailContent}>
        <p
          dangerouslySetInnerHTML={{ __html: i.data || '' }}
          style={{
            fontSize: '12px',
            color: '#aaa',
            height: '100px',
            overflow: 'auto',
            width: '400px',
          }}
        />
        <TranslateForm value={i.data} />
      </div>

    </div>)}
  </div>;
};
