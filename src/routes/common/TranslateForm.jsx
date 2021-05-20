/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { translate } from '../../service';

export default ({ value, popover = false }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const { data } = await translate({
      text: value,
      target: 'zh-CN',
    });
    setContent(data);
    setLoading(false);
    setIsTranslate(true);
  };
  return (
    <div>
      {popover ? (
        <Popover title="翻译" trigger="click" content={content}>
          <Button
            icon={<GlobalOutlined />}
            shape="circle"
            onClick={handleClick}
            loading={loading}
            disabled={isTranslate}
          />
        </Popover>
      ) : (
        <div>
          <p
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <Button
            icon={<GlobalOutlined />}
            shape="circle"
            onClick={handleClick}
            loading={loading}
            disabled={isTranslate}
          />
        </div>
      )}
    </div>
  );
};
