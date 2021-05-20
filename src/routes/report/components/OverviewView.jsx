/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Card, Table } from 'antd';
import OverviewQuery from './OverviewQuery';
import Dashborad from './Dashborad';
import {
  overviewTableSQL,
  customerOverviewSql,
  issueOverviewSql,
  issueOverviewTitleSql,
  scoreTime2replyTime,
  getTotalCountByScoretime,
  getPerTotalCountByScoretime,
} from '../sqlTemplate';
import { getUserListServer } from '../../../service';
import { getData } from '../../../utils/request';
import { columnLineRender } from './common/columnLineRender';
import DownLoadButton from './common/DownLoadButton';

import styles from './OverviewQuery.less';

const dateFormat = 'YYYYMMDD';
export default () => {
  const baseColumn2 = {};
  const [search, setSearch] = useState({
    reply_time: null,
    score_time: [moment().subtract(7, 'days'), moment().subtract(0, 'days')],
    quality_type: ['1'],
  });
  const [databoradSource, setDataboradSource] = useState({});
  const [customerOverview, setCustomerOverview] = useState([]);
  const [issueOverview, setIssueOverview] = useState([]);
  const [fieldsCustomer, setFieldsCustomer] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(false);

  const formateNum = (val) => {
    if (!val || val === Infinity) {
      return 0;
    }
    return Math.round(val * 1000) / 1000 || 0;
  };

  const getSQLData = async (baseSql) => {
    const { reply_time, score_time, quality_type } = search;
    let extraWhere = '';

    if (reply_time) {
      const [sTime, eTime] = reply_time;
      const formatSTime = sTime.format(dateFormat);
      const formatETime = eTime.format(dateFormat);

      extraWhere += `AND reply_time >= ${formatSTime}
        AND reply_time <= ${formatETime} `;
    }
    if (score_time) {
      const [sTime, eTime] = score_time;
      const formatSTime = sTime.format(dateFormat);
      const formatETime = eTime.format(dateFormat);
      extraWhere += `AND score_time >= ${formatSTime}
        AND score_time <= ${formatETime} `;
    }
    if (quality_type.length) {
      extraWhere += 'AND quality_type IN (';
      quality_type.forEach((type) => {
        extraWhere += `${type},`;
      });
      extraWhere = extraWhere.slice(0, extraWhere.length - 1);
      extraWhere += ') ';
    }

    const sql = baseSql(extraWhere);
    const res = await getData(sql);

    return res;
  };

  const getTableData = async (total) => {
    const respData = await getSQLData(overviewTableSQL);
    const data = respData[0] || {};
    if (total > 0) {
      data.total = total;
      data.cover = formateNum(data.is_check / total);
    }
    setDataboradSource(data);
  };

  const getCustomerOverview = async (customerTotalList) => {
    const res = (await getSQLData(customerOverviewSql)) || [];
    const list = res.filter(item => item.is_check > 0);

    list.forEach((item) => {
      const { customer, is_check } = item;

      item.customer_name = userMap[customer] || customer || '-';
      if (customerTotalList.length) {
        const opt = customerTotalList.find(l => l.customer === customer);

        if (opt.total > 0) {
          item.total = opt.total;
          item.cover = formateNum(is_check / opt.total);
        }
      }
    });
    setCustomerOverview(list || []);
  };

  const getIssueOverview = async (lastColumns) => {
    const res = await getSQLData(issueOverviewSql);
    const data = [];
    res.forEach((item) => {
      const opt = { ...baseColumn2 };
      const {
        customer_id, title = '', total, num = '',
      } = item;
      const titleList = title.split(',');
      const numList = num.split(',');

      opt.customer_id = customer_id;
      opt.customer_name = userMap[customer_id] || customer_id || '-';
      opt.total = total;
      titleList.forEach((text, idx) => {
        opt[text] = numList[idx];
      });

      data.push(opt);
    });
    columnLineRender(data, document.getElementById('chart2'));
    data.push(lastColumns);
    setIssueOverview(data);
  };

  const getIssueOverviewTitle = async () => {
    const res = await getSQLData(issueOverviewTitleSql);
    const fields = [
      {
        dataIndex: 'customer_name',
        key: 'customer_name',
        title: '出错量',
      },
    ];
    const lastColumns2 = {
      customer_name: '总计',
    };
    let total = 0;
    if (res.length) {
      res.forEach((item) => {
        const { title, num } = item;

        baseColumn2[title] = 0;
        fields.push({
          dataIndex: title,
          key: title,
          title,
        });
        total += num;
        lastColumns2[title] = num;
      });
    }

    lastColumns2.total = total;
    fields.push({
      dataIndex: 'total',
      key: 'total',
      title: '合计',
    });
    getIssueOverview(lastColumns2);
    setFieldsCustomer(fields);
  };

  const scoreTime2replyTimeGetData = async () => {
    const { quality_type } = search;
    const resp = await getSQLData(scoreTime2replyTime);
    const { fst_reply_time, lat_reply_time } = resp[0] || {};
    let extraWhere = '';

    if (fst_reply_time && lat_reply_time) {
      extraWhere += `AND reply_time >= ${fst_reply_time}
        AND reply_time <= ${lat_reply_time} `;
    }
    if (quality_type.length) {
      extraWhere += 'AND quality_type IN (';
      quality_type.forEach((type) => {
        extraWhere += `${type},`;
      });
      extraWhere = extraWhere.slice(0, extraWhere.length - 1);
      extraWhere += ') ';
    }
    const totalCountSpl = getTotalCountByScoretime(extraWhere);
    const perCustomerSql = getPerTotalCountByScoretime(extraWhere);
    const totalResp = await getData(totalCountSpl);
    const customerTotalList = await getData(perCustomerSql);
    const { total = 0 } = totalResp[0] || {};

    return { total, customerTotalList };
  };

  const init = async () => {
    const { score_time } = search;
    let total = 0;
    let customerTotalList = [];
    setLoading(true);
    if (score_time) {
      const opts = await scoreTime2replyTimeGetData();

      total = opts.total;
      customerTotalList = opts.customerTotalList;
    }
    await getTableData(total);
    await getCustomerOverview(customerTotalList);
    await getIssueOverviewTitle();
    setLoading(false);
  };

  const getUserList = async () => {
    const { data = [] } = await getUserListServer();
    const listOpts = {};

    data.forEach((item) => {
      const {
        id, last_name, first_name, email,
      } = item;
      if (first_name || last_name) {
        listOpts[id] = `${first_name || ''}${last_name || ''}`;
      } else {
        listOpts[id] = email;
      }
    });
    setUserMap(listOpts);
  };

  useEffect(() => {
    init();
  }, [search, userMap]);

  useEffect(() => {
    getUserList();
  }, []);

  const fields = {
    customer_name: '人员概况',
    total: '处理量',
    is_check: '质检量',
    cover: '质检占比',
    avgscore: '质检得分',
    pass_count: '合格量',
    qualifend: '合格率',
    fst_complain: '首次申诉量',
    fst_complain_pass: '首次申诉通过量',
    aga_complain: '再次申诉通过量',
    aga_complain_pass: '再次申诉通过量',
  };
  const columns = Object.keys(fields).map(v => ({
    dataIndex: v,
    key: v,
    title: fields[v],
    render: (text = 0) => {
      if (v === 'qualifend' || v === 'cover') {
        return `${Math.round(text * 10000) / 100}%`;
      }
      if (v === 'avgscore') {
        return Math.round(text * 100) / 100;
      }
      return text;
    },
  }));

  return (
    <div className={styles.report_wrap}>
      <OverviewQuery search={search} setSearch={setSearch} />
      <h3 className={styles.m20}>质检概况</h3>
      <div className={styles.line} />
      <Dashborad data={databoradSource} loading={loading} />
      <h3 className={styles.m20}>人员概况</h3>
      <div className={styles.line} />
      <DownLoadButton title="人员概况导出" filename="人员概况" data={customerOverview} columns={columns} />
      <Table style={{ marginTop: 20 }} dataSource={customerOverview} columns={columns} loading={loading} bordered />
      <h3 className={styles.m20}>业务概况</h3>
      <div className={styles.line} />
      <Card style={{ margin: '20px 0' }}>
        <div id="chart2" />
      </Card>
      <DownLoadButton title="业务概况导出" filename="业务概况" data={issueOverview} columns={fieldsCustomer} />
      <Table style={{ marginTop: 20 }} dataSource={issueOverview} columns={fieldsCustomer} loading={loading} bordered />
    </div>
  );
};
