import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { qualityScoreConfigQuery } from '../../../service';
import QC from './QC';
import OtherQC from './OtherQC';
import Scale from './Scale';
import QCTagView from './QCTagView';

// `quality_project_type` int(2) DEFAULT NULL COMMENT '质检项目 1:质检项目 2:附加质检项目 3:分数段标签 4:质检标签',
export default ({ sampleType }) => {
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState([]);
  const query = async () => {
    setLoading(true);
    const { data } = await qualityScoreConfigQuery({
      sampleType,
    });
    setLoading(false);
    setInitData(data);
  };
  useEffect(() => {
    query();
  }, [sampleType]);
  return (
    <Spin spinning={loading}>
      <QC
        sampleType={sampleType}
        query={query}
        initData={initData.filter(v => v.qualityProjectType * 1 === 1)}
        qualityProjectType={1}
      />
      <OtherQC
        sampleType={sampleType}
        query={query}
        initData={initData.filter(v => v.qualityProjectType * 1 === 2)}
        qualityProjectType={2}
      />
      <Scale
        sampleType={sampleType}
        query={query}
        initData={initData.filter(v => v.qualityProjectType * 1 === 3)}
        qualityProjectType={3}
      />
      <QCTagView
        sampleType={sampleType}
        query={query}
        initData={initData.filter(v => v.qualityProjectType * 1 === 4)}
        qualityProjectType={4}
      />
    </Spin>
  );
};
