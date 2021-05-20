/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Query from './components/Query';
import {
  customerConfigQuery, getUserListServer, queryCustomerSource, customerProductConfigQuery,
} from '../../service';
import { formatTimeToISOString, getEmailName } from '../../utils/utils';
import List from './List';

export default () => {
  const routerName = window.location.href.split('/').pop();
  const [productList, setProductList] = useState([]);
  const [productJSON, setProductJson] = useState({});
  const [search, setSearch] = useState({
    startDate: moment().subtract(30, 'days'),
    endDate: moment().subtract(0, 'days'),
    productIdList: [],
    checkTypeList: routerName === 'wait' ? ['0'] : ['1'],
    customerIdList: [],
    customerPhone: '',
    investigate: '',
    labels: '',
    callStartTimeLength: '',
    callEndTimeLength: '',
    holdStartTimeLength: '',
    holdEndTimeLength: '',
    connectTypeList: [],
    repeatCallList: [],
    restCount: 0,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [userJson, setUserJson] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [customerConfigList, setCustomerConfigList] = useState([]);
  const [customerConfigJSON, setCustomerConfigJSON] = useState({});
  const [customerIdJSON, setCustomerIdJSON] = useState({});
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const getList = async () => {
    setTableLoading(true);
    const res = await queryCustomerSource({
      qualityStatus: {
        qualityType: 4,
        checkTypeList: search.checkTypeList.length
          ? search.checkTypeList.map(v => Number(v))
          : routerName === 'wait'
            ? ['0', '1', '2']
            : ['1'], // 质检
        productIdList: search.productIdList.map(v => Number(v)),
        operatorNameList: routerName === 'rate' ? [getEmailName()] : [],
        customerIdList: search.customerIdList.map(v => customerIdJSON[v]),
      },
      qualityCheck: {
        offeringStartTime: search.startDate ? formatTimeToISOString(search.startDate) : '',
        offeringEndTime: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
        callStartTimeLength: search.callStartTimeLength || '',
        callEndTimeLength: search.callEndTimeLength || '',
        holdStartTimeLength: search.holdStartTimeLength || '',
        holdEndTimeLength: search.holdEndTimeLength || '',
        labels: search.labels || '',
        investigate: search.investigate || '',
        customerPhone: search.customerPhone || '',
        connectTypeList: search.connectTypeList || [],
        repeatCallList: search.repeatCallList || [],
      },
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    });
    setPagination({
      ...pagination,
      total: res.count,
    });
    setDataSource(res.data);
    setTableLoading(false);
  };
  const reset = async () => {
    setSearch({
      startDate: moment().subtract(30, 'days'),
      endDate: moment().subtract(0, 'days'),
      productIdList: [],
      checkTypeList: routerName === 'wait' ? ['0'] : ['1'],
      customerIdList: [],
      customerPhone: '',
      investigate: '',
      labels: '',
      callStartTimeLength: '',
      callEndTimeLength: '',
      holdStartTimeLength: '',
      holdEndTimeLength: '',
      connectTypeList: [],
      repeatCallList: [],
      restCount: search.restCount + 1,
    });
  };
  // 全部用户
  const init = async () => {
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
        usersJson[i.id] = `${i.first_name || ''}${i.last_name || ''}`;
      }
    }
    setUserJson(usersJson);

    const { data } = await customerConfigQuery({});
    const customerConfigJSONs = {};
    const customerIdJSONs = {};
    for (const v of data) {
      customerConfigJSONs[v.customerId] = `${usersJson[v.operatorId]}[${v.customerId}]`;
      customerIdJSONs[v.id] = v.operatorId;
    }
    setCustomerConfigList(
      data.map(v => ({
        name: `${usersJson[v.operatorId]}[${v.customerId}]`,
        value: v.id,
      })),
    );
    setCustomerConfigJSON(customerConfigJSONs);
    setCustomerIdJSON(customerIdJSONs);

    const { data: products } = await customerProductConfigQuery({});
    setProductList(
      products.map(v => ({
        value: v.productId,
        name: v.name,
      })),
    );
    const productsJSon = {};
    products.forEach((v) => {
      productsJSon[v.productId] = v.name;
    });
    setProductJson(productsJSon);
  };
  useEffect(() => {
    getList();
  }, [pagination.current, search.restCount]);
  useEffect(() => {
    init();
  }, []);

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
  return (
    <div>
      <Query
        search={search}
        setSearch={setSearch}
        userList={customerConfigList}
        reset={reset}
        getList={getList}
        PAGE_TYPE={routerName}
        productList={productList}
      />
      <List
        search={search}
        loading={tableLoading}
        dataSource={dataSource}
        paginationOpts={paginationOpts}
        getList={getList}
        PAGE_TYPE={routerName}
        userMap={userJson}
        productJSON={productJSON}
        customerConfigJSON={customerConfigJSON}
      />
    </div>
  );
};
