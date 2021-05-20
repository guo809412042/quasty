/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Query from './components/Query';
import List from './List';
import { getIssueTagsList, getUserListServer, complaintCheckList } from '../../service';
import { getIssueTree } from '../QCList/utils';
import { formatTimeToISOString } from '../../utils/utils';

export default () => {
  const [search, setSearch] = useState({
    sourceId: '',
    complaintStatusList: ['2'],
    customerIdList: [],
    complaintStartTime: moment().subtract(30, 'days'),
    complaintEndTime: moment().subtract(0, 'days'),
    qualityType: '',
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [userJson, setUserJson] = useState({});
  const [issueTags, setIssueTags] = useState([]);
  const [issueTagList, setIssueTagList] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const getList = async () => {
    setTableLoading(true);
    const params = {
      sourceId: search.sourceId || '',
      qualityType: search.qualityType,
      complaintStartTime: search.complaintStartTime ? formatTimeToISOString(search.complaintStartTime) : '',
      complaintEndTime: search.complaintEndTime ? formatTimeToISOString(search.complaintEndTime, '2') : '',
      complaintStatusList: search.complaintStatusList || [],
      customerIdList: search.customerIdList || [],
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    const res = await complaintCheckList(params);
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
  };
  const init = async () => {
    const {
      data: { list },
    } = await getIssueTagsList(search.sourceId === '1' || search.sourceId === '2' ? '2' : '101');
    setIssueTagList(list);
    const issueTagsList = getIssueTree(list);
    setIssueTags(issueTagsList);
  };
  const reset = async () => {};
  useEffect(() => {
    getUsers();
    init();
  }, []);
  useEffect(() => {
    if (Object.keys(userJson).length) {
      getList();
    }
  }, [userJson, pagination.current]);
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
        userJson={userJson}
        tableLoading={tableLoading}
        issueTagList={issueTagList}
        getList={getList}
        issueTags={issueTags}
        paginationOpts={paginationOpts}
      />
    </div>
  );
};
