/* eslint-disable react/prop-types */
/* eslint-disable react/no-danger */
import React from 'react';
import EmailContentMore from './EmailContentMore';

export default ({ record, curContent }) => (
  <div>
    <EmailContentMore record={record} curContent={curContent} />
    <strong>{record.subject}</strong>
    <p
      dangerouslySetInnerHTML={{ __html: curContent }}
      style={{
        fontSize: '12px',
        color: '#aaa',
        height: '100px',
        overflow: 'auto',
        width: '400px',
      }}
    />
  </div>
);
