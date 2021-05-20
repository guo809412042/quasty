/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import styles from '../../../style.less';
import { LANGUAGE_MAP, COUNTRY_MAP } from '../../../../utils/enum';
import kefuUrl from '../kefu.png';
import userUrl from '../user-reply.png';
import TranslateForm from '../../../common/TranslateForm';

export default ({ source, row, isTranslate = false }) => {
  const userName = row.responsePeople || '客服';
  return <div className={styles.content}>
    {source === 'huawei' ? (
      ''
    ) : source === 'google' ? (
      <p className={styles.language}>
        <span>
          {LANGUAGE_MAP[row.language]}-{row.language}
        </span>
      </p>
    ) : (
      <p className={styles.language}>
        <span>{`${COUNTRY_MAP[row.country]}-${row.country}`}</span>
      </p>
    )}
    <p className={styles.time}>
      <span>{row.lastModified ? moment(row.lastModified).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
    </p>
    <p className={styles.nickname}>
      <span>{row.nickname}</span>
    </p>
    <div className={styles.main}>
      <img className={styles.avatar} alt="用户" src={userUrl} width="30" height="30" />
      <div className={styles.text}>
          {row.title && <p>{row.title}</p>}
        {row.reviewOriginal}
      </div>
      {isTranslate ? <TranslateForm value={row.title ? row.title + ' ||||| ' + row.reviewOriginal : row.reviewOriginal} popover /> : ''}
    </div>
    {/* 回复状态：0未回复，1未执行，2回复成功，3回复失败 */}
    {row.responseStatus * 1 ? (
      <div>
        <p className={styles.time}>
          <span>
            {row.responseLastModified ? moment(row.responseLastModified).format('YYYY-MM-DD HH:mm:ss') : ''}
          </span>
        </p>
        <p className={classnames(styles.self, styles.nickname)}>{userName}</p>
        <div className={classnames(styles.main, styles.self)}>
          <img className={styles.avatar} alt="客服" src={kefuUrl} width="30" height="30" />
          {+row.responseStatus === 3 ? (
            <Tooltip title="发送失败">
              <ExclamationCircleFilled className={styles.redIcon} />
            </Tooltip>
          ) : (
            ''
          )}
          {+row.responseStatus === 1 ? (
            <Tooltip title="等待发送">
              <LoadingOutlined className={styles.waitIcon} />
            </Tooltip>
          ) : (
            ''
          )}
          <div className={styles.text}>{row.response}</div>
          {isTranslate ? <TranslateForm value={row.response} popover /> : ''}
        </div>
      </div>
    ) : (
      ''
    )}
  </div>;
};
