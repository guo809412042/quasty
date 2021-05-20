import React from 'react';
import { Tabs } from 'antd';

import { SAMPLE_TYPE } from './const';
import View from './components/View';
//  1:工单 2:邮件 3:应用商店',4电话
export default () => (
  <div>
    <Tabs defaultActiveKey="1" tabPosition="left">
      {Object.keys(SAMPLE_TYPE).map(i => (
        <Tabs.TabPane tab={SAMPLE_TYPE[i]} key={i} disabled={i === 28}>
          <View sampleType={i} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  </div>
);
