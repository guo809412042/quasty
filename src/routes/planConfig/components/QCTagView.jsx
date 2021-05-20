/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Input, Button, message, Tag,
} from 'antd';
import { getEmailName } from '../../../utils/utils';
import { qualityScoreConfigInsert, qualityScoreConfigDelete } from '../../../service';

export default ({
  sampleType, initData = [], qualityProjectType, query,
}) => {
  const [title, setTitle] = useState(undefined);
  const submit = async () => {
    if (!title) {
      message.error('质检标签未填写！');
      return '';
    }
    const body = {
      operatorName: getEmailName(),
      qualityProjectType,
      sampleType,
      title,
    };
    await qualityScoreConfigInsert(body);
    await query();
    message.success('操作成功！');
    setTitle(undefined);
  };

  const remove = async (id, deleteFlag = true) => {
    await qualityScoreConfigDelete({ id, delete: deleteFlag });
    message.success('操作成功！');
    query();
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>质检标签</h2>
      <p style={{ color: '#888' }}>* 质检标签用于对质检会话进行标记</p>
      <Input style={{ width: 300 }} value={title} onChange={e => setTitle(e.target.value)} />{' '}
      <Button type="primary" onClick={submit}>
        添加
      </Button>
      <div style={{ marginTop: 10 }}>
        {initData.map(v => (
          <Tag closable color="blue" onClose={() => remove(v.id)} key={v.id}>
            {v.title}
          </Tag>
        ))}
      </div>
    </div>
  );
};
