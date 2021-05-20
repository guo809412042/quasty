import React from 'react';
import { Button } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import exportParams from '../../../../utils/exportExecl';

export default ({
  filename, columns, data, size = 'default', buttonText = true, title = '导出',
}) => (
  <Button
    style={{ marginRight: 10 }}
    icon={<CloudDownloadOutlined />}
    type="primary"
    size={size}
    onClick={() => exportParams({
      filename,
      columns,
      data,
    })
    }
  >
    {buttonText && title}
  </Button>
);
