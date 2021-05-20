import React, { useEffect, useState } from 'react';
import { Statistic, List } from 'antd';
import dashboardSchema from './ListConfig';

export default ({ data, loading }) => {
  const [schema, setSchema] = useState(dashboardSchema());

  useEffect(() => {
    const list = schema.slice(0);
    if (Object.keys(data).length) {
      list.forEach((v) => {
        const { key } = v;
        v.value = data[key];
      });
    }
    setSchema(list);
  }, [data]);

  return (
    <List
      style={{
        backgroundColor: '#fff',
        padding: '1em',
        margin: '1em auto',
      }}
      grid={{
        gutter: 16,
        xs: 3,
        sm: 3,
        md: 6,
        lg: 6,
        xl: 8,
        xxl: 8,
      }}
      dataSource={schema}
      loading={loading}
      renderItem={item => (
        <List.Item>
          <Statistic title={item.title} value={item.value || ''} formatter={item.formatter} {...item.props} />
        </List.Item>
      )}
    />
  );
};
