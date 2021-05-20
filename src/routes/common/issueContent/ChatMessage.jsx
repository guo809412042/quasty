import React from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import { UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import MessageView from './MessageView';

import styles from './ChatMessage.less';

const ChatMessage = ({ userMap = {}, info = {}, autoTrans = false }) => (
  <div className={info.type === 0 ? styles.root : `${styles.root} ${styles.service}`}>
    <div className={styles.left}>
      <Avatar size="large" icon={info.type === 0 ? <UserOutlined /> : <CustomerServiceOutlined />} />
    </div>
    <div className={info.type === 0 ? styles.center : `${styles.center} ${styles.service}`}>
      {info.gmtCreate && (
        <div className={styles.subtitle}>
          {info.type === 1 && info.operatorName && userMap[info.operatorName] && `${userMap[info.operatorName]} `}
          {moment(info.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      )}
      <MessageView info={info} autoTrans={autoTrans} />
    </div>
    <div className={styles.right} />
  </div>
);

export default ChatMessage;
