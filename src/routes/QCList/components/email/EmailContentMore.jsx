/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
// import { markdown } from 'markdown';
import { onLink } from '../../utils';
import TranslateForm from '../../../common/TranslateForm';
import { warningConfigQuery } from '../../../../service';
import styles from '../../../style.less';

export default ({ record, curContent }) => {
  const [visible, setVisible] = useState(false);
  const files = record.files;
  const [innerHtml, setInnerHtml] = useState(curContent);

  // 拿到 敏感词 给敏感词设置样式
  const getKeyWord = (value, keyword) => {
    keyword.forEach((item) => {
      const r = new RegExp(item, 'g');
      value = value.replace(r, `<span class=${styles.keyword}>${item}</span>`);
    });
    return value;
  };
  useEffect(() => {
    // // 请求接口拿到 敏感词数据
    warningConfigQuery().then((res) => {
      // 结构数据
      const { customerSensitiveWords, serviceSensitiveWords } = res.data;
      // 将字符串 解析为数组
      const customerSensitiveWordsArr = customerSensitiveWords.split('|');
      const serviceSensitiveWordsArr = serviceSensitiveWords.split('|');
      // // 数组去重后等到  存放敏感词的数组
      const keyWord = Array.from(new Set([...customerSensitiveWordsArr, ...serviceSensitiveWordsArr]));
      const result = getKeyWord(curContent, keyWord);
      setInnerHtml(result);
    });
  }, []);


  return (
    <div>
      <a onClick={() => setVisible(true)}>[更多]</a>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[<Button onClick={() => setVisible(false)}>关闭</Button>]}
        title="邮件详情"
      >
        {files
          ? JSON.parse(files).map((v, index) => (
            <span key={index}>
              <a onClick={() => onLink(v)} style={{ marginRight: 5 }}>
                {v.split('.')[v.split('.').length - 1]} {index + 1}
              </a>
            </span>
          ))
          : null}
        <div />
        <strong>{record.subject}</strong>
        <p
          dangerouslySetInnerHTML={{ __html: innerHtml }}
          style={{
            fontSize: '12px',
            color: '#aaa',
            height: '200px',
            overflow: 'auto',
          }}
        />
        <TranslateForm value={record.content} value={record.subject ? `${record.subject} ||||| ${record.content}` : record.content} />
      </Modal>
    </div>
  );
};
