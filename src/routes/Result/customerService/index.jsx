/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Query from './components/Query';
import {
  getUserListServer,
  qualityCheckQueryIssueReport,
  qualityCheckQueryEmail,
  getIssueTagsList,
  qualityCheckQueryAppStore,
  queryCustomerSource,
  customerConfigQuery,
  getEmailTagsListApi,
} from '../../../service';
import { formatTimeToISOString, getUserId } from '../../../utils/utils';
import List from './List';
import { getIssueTree } from '../../QCList/utils';

export default () => {
  const [search, setSearch] = useState({
    source: '1',
    startDate: null,
    endDate: null,
    scoreStartTime: moment().subtract(30, 'days'),
    scoreEndTime: moment().subtract(0, 'days'),
    operateNameList: [getUserId() * 1],
    complaintStatusList: [],
    isPass: '',
    // source: '1',
    // startDate: moment().subtract(300, 'days'),
    // endDate: moment().subtract(0, 'days'),
    // operateNameList: [],
    // complaintStatusList: [],
    // isPass: '',
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [userJson, setUserJson] = useState({});
  const [issueTags, setIssueTags] = useState([]);
  const [issueTagList, setIssueTagList] = useState([]);
  const [customerConfigJSON, setCustomerConfigJSON] = useState({});
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [emailIssueTagList, setEmailIssueTagList] = useState([]);

  const init = async () => {
    const source = search.source;
    if (source === '2' && !emailIssueTagList.length) {
      // 邮件 应用商场 电话 服务标签有一套自己的id 参考autofeedback的标签保存
      const { data } = await getEmailTagsListApi();
      setEmailIssueTagList(data);
    }
    const {
      data: { list },
    } = await getIssueTagsList(+source === 1 || +source === 2 ? '2' : '101');
    setIssueTagList(list);
    const issueTagsList = getIssueTree(list);
    setIssueTags(issueTagsList);
  };
  // qualityType 1:工单 2:邮件 3:应用商店 4:电话

  const getList = async () => {
    setTableLoading(true);
    init();
    let res;
    const commonParams = {
      checkTypeList: [3],
      isPass: search.isPass || '',
      scoreBaseMin: search.scoreBaseMin || '',
      scoreBaseMax: search.scoreBaseMax || '',
      scoreAdditionalMin: search.scoreAdditionalMin || '',
      scoreAdditionalMax: search.scoreAdditionalMax || '',
      complaintStatusList: search.complaintStatusList,
      scoreStartTime: search.scoreStartTime ? formatTimeToISOString(search.scoreStartTime) : '',
      scoreEndTime: search.scoreEndTime ? formatTimeToISOString(search.scoreEndTime, '2') : '',
    };
    if (search.source === '1') {
      res = await qualityCheckQueryIssueReport({
        qualityStatus: {
          qualityType: 1,
          ...commonParams,
        },
        qualityCheck: {
          gmtStartCreate: search.startDate ? formatTimeToISOString(search.startDate) : '',
          gmtEndCreate: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
          operateNameList: search.operateNameList,
          issueId: search.id,
          // productIdList: search.product,
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    } else if (search.source === '2') {
      res = await qualityCheckQueryEmail({
        qualityStatus: {
          ...commonParams,
        },
        qualityCheck: {
          dateStart: search.startDate ? formatTimeToISOString(search.startDate) : '',
          dateEnd: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
          operatorIdList: search.operateNameList,
          emailId: search.id,
          // productIdList: search.product,
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    } else if (search.source === '3') {
      res = await qualityCheckQueryAppStore({
        qualityStatus: {
          qualityType: 3,
          ...commonParams,
        },
        qualityCheck: {
          lastStartModified: search.startDate ? formatTimeToISOString(search.startDate) : '',
          lastEndModified: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
          responsePeopleList: search.operateNameList.map(v => userJson[v]),
          id: search.id,
          productIdList: search.product,
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    } else {
      res = await queryCustomerSource({
        qualityStatus: {
          qualityType: 4,
          ...commonParams,
          customerIdList: search.operateNameList,
        },
        qualityCheck: {
          offeringStartTime: search.startDate ? formatTimeToISOString(search.startDate) : '',
          offeringEndTime: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    }
    setPagination({
      ...pagination,
      total: res.count,
    });
    setDataSource(res.data);
    setTableLoading(false);
  };
  const getUsers = async () => {
    const { data: users } = await getUserListServer();
    const usersList = [];
    const userData = [];
    const usersJson = {};
    for (const i of users) {
      if (!usersList.includes(i.email) && i.email) {
        usersList.push(i.email);
        userData.push({
          value: i.id,
          name: `${i.first_name || ''}${i.last_name || ''}[${i.email}]`,
        });
        usersJson[i.id] = i.email;
      }
    }
    setUserList(userData);
    setUserJson(usersJson);
    const { data } = await customerConfigQuery({});
    const customerConfigJSONs = {};
    for (const v of data) {
      customerConfigJSONs[v.customerId] = v.operatorId;
    }
    setCustomerConfigJSON(customerConfigJSONs);
  };
  const reset = async () => {
    setSearch({
      source: '1',
      scoreStartTime: moment().subtract(30, 'days'),
      scoreEndTime: moment().subtract(0, 'days'),
      startDate: null,
      endDate: null,
      operateNameList: [getUserId() * 1],
      complaintStatusList: [],
      isPass: '',
    });
    getList();
  };
  useEffect(() => {
    getUsers();
    init();
  }, []);
  useEffect(() => {
    if (Object.keys(userJson).length) {
      getList();
    }
  }, [userJson, pagination.current, search.source]);
  const paginationOpts = {
    ...pagination,
    onChange: (current) => {
      setPagination({ ...pagination, current });
    },
    showTotal: total => `共 ${total} 条`,
    onShowSizeChange: (current, pageSize) => {
      setPagination({ ...pagination, current, pageSize });
    },
    showSizeChanger: false,
  };
  useEffect(() => {
    setPagination({ ...pagination, current: 1 });
  }, [search]);
  return (
    <div>
      <Query search={search} setSearch={setSearch} getList={getList} userList={userList} reset={reset} />
      <List
        dataSource={dataSource}
        source={search.source}
        userList={userList}
        userJson={userJson}
        tableLoading={tableLoading}
        issueTagList={issueTagList}
        getList={getList}
        issueTags={issueTags}
        paginationOpts={paginationOpts}
        customerConfigJSON={customerConfigJSON}
        emailIssueTagList={emailIssueTagList}
      />
    </div>
  );
};
