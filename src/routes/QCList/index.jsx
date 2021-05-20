/* eslint-disable react/prop-types */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-17 16:31:56
 * @LastEditTime: ,: 2020-10-21 16:31:42
 * @LastEditors: ,: ssssslf
 */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Query from './components/Query';
import {
  getIssueTagsList,
  getUserListServer,
  qualityCheckQueryEmail,
  qualityCheckQueryAppStore,
  qualityCheckQueryIssueReport,
  customerConfigQuery,
  customerProductConfigQuery,
  queryCustomerSource,
  getOperatorNotQualityTotalApi,
  getEmailTagsListApi,
} from '../../service';
import List from './components/List';
import { getIssueTree } from './utils';
import { formatTimeToISOString, getEmailName, formatTimeToISOStringSingle } from '../../utils/utils';
import { APP_PRODUCT_LIST_2 } from '../../utils/const';
import { userJonContext } from '../const';
import styles from './style.less';

// wait 领取 rate 评分
export default () => {
  const [productList, setProductList] = useState([]);
  // const [customerConfigList, setCustomerConfigList] = useState([]);
  const [customerConfigJSON, setCustomerConfigJSON] = useState({});
  const [allProductTags, setAllProductTags] = useState({});
  // const [customerIdJSON, setCustomerIdJSON] = useState({});
  const [operatorNotQualityTotal, setOperatorNotQualityTotal] = useState(0);
  const routerName = window.location.href.split('/').pop();
  const [search, setSearch] = useState({
    source: '1',
    startDate: '',
    endDate: '',
    completeStartTime: moment().subtract(30, 'days'),
    completeEndTime: moment().subtract(0, 'days'),
    customerReplyStartTime: moment().subtract(30, 'days'),
    customerReplyEndTime: moment().subtract(0, 'days'),
    product: [],
    issueTag: [],
    warningTypeList: [],
    checkTypeList: routerName === 'wait' ? ['0'] : ['1'],
    lCountry: [],
    responseState: [],
    operatorIdList: [],
    rating: [],
    restCount: 0,
    productIdList: [],
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
    operatorNameList: [],
    createTimeStart: null,
    createTimeEnd: null,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userJson, setUserJson] = useState({});
  const [issueTags, setIssueTags] = useState([]);
  const [issueTagList, setIssueTagList] = useState([]);
  const [emailIssueTagList, setEmailIssueTagList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
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
    const customerIdJSONs = {};
    for (const v of data) {
      customerConfigJSONs[v.customerId] = `${usersJson[v.operatorId]}[${v.customerId}]`;
      customerIdJSONs[v.id] = v.operatorId;
    }
    // setCustomerConfigList(
    //   data.map(v => ({
    //     name: `${usersJson[v.operatorId]}[${v.customerId}]`,
    //     value: v.id,
    //   })),
    // );
    setCustomerConfigJSON(customerConfigJSONs);
    // setCustomerIdJSON(customerIdJSONs);

    const { data: products } = await customerProductConfigQuery({});
    setProductList(
      products.map(v => ({
        value: v.productId,
        name: v.name,
      })),
    );
  };
  const init = async () => {
    const { source, product } = search;
    if (source === '2' && !emailIssueTagList.length) {
      // 邮件 应用商场 电话 服务标签有一套自己的id 参考autofeedback的标签保存
      const { data } = await getEmailTagsListApi();
      setEmailIssueTagList(data);
    }
    let tagList = [];
    let allTagList = [];
    let currentProductIds = product.slice(0);

    if (!product.length) {
      currentProductIds = Object.keys(APP_PRODUCT_LIST_2);
    }
    console.log('allProductTags init', allProductTags, product, currentProductIds);
    currentProductIds.forEach((id) => {
      tagList = tagList.concat(allProductTags[id] || []);
    });
    Object.keys(APP_PRODUCT_LIST_2).forEach((id) => {
      allTagList = allTagList.concat(allProductTags[id] || []);
    });
    // table list中使用
    setIssueTagList(allTagList);
    const issueTagsList = getIssueTree(tagList);
    // query中使用
    setIssueTags(issueTagsList);
  };
  const getList = async (source = search.source) => {
    // 质检状态。0:未质检 1:处理中 2:忽略 3:已质检
    setTableLoading(true);
    init();
    let res;
    const commonParams = {
      checkTypeList: search.checkTypeList.length
        ? search.checkTypeList.map(v => Number(v))
        : routerName === 'wait'
          ? ['0', '1', '2']
          : ['1'], // 质检
    };
    if (routerName === 'rate') {
      commonParams.operatorNameList = [getEmailName()];
    }
    if (routerName === 'wait') {
      commonParams.operatorNameList = search.operatorNameList.map(v => userJson[v]);
    }
    // 预警状态查询将二进制转十进制
    if (search.warningTypeList && search.warningTypeList.length) {
      const num = search.warningTypeList.reduce((a, b) => a + b, 0);
      commonParams.warningType = parseInt(num, 2);
    }
    // 邮件
    if (source === '2') {
      res = await qualityCheckQueryEmail({
        qualityStatus: {
          qualityType: 2,
          ...commonParams,
          customerReplyStartTime: search.customerReplyStartTime
            ? formatTimeToISOString(search.customerReplyStartTime)
            : '',
          customerReplyEndTime: search.customerReplyEndTime
            ? formatTimeToISOString(search.customerReplyEndTime, '2')
            : '',
        },
        qualityCheck: {
          dateStart: search.startDate ? formatTimeToISOString(search.startDate) : '', // 收信开始时间
          dateEnd: search.endDate ? formatTimeToISOString(search.endDate, '2') : '', // 收信结束时间
          emailId: search.id, // 邮件iD
          langList: search.lCountry, // 语言
          tagIdList: search.issueTag, // 标签ID
          operatorIdList: search.operatorIdList, // 操作人员ID
          // 获取时间
          createTimeStart: search.createTimeStart ? formatTimeToISOString(search.createTimeStart) : '',
          createTimeEnd: search.createTimeEnd ? formatTimeToISOString(search.createTimeEnd, '2') : '',
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    } else if (['google', 'appstore', 'huawei'].includes(source)) {
      const params = {
        qualityStatus: {
          qualityType: 3,
          ...commonParams,
          customerReplyStartTime: search.customerReplyStartTime
            ? formatTimeToISOString(search.customerReplyStartTime)
            : '',
          customerReplyEndTime: search.customerReplyEndTime
            ? formatTimeToISOString(search.customerReplyEndTime, '2')
            : '',
        },
        qualityCheck: {
          source,
          id: search.id,
          lastStartModified: search.startDate ? formatTimeToISOString(search.startDate) : '',
          lastEndModified: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
          productIdList: search.product,
          ratingList: search.rating,
          responsePeopleList: search.operatorIdList.map(v => userJson[v]), // email
          reviewTypeList: search.issueTag, // 标签ID
          responseStatusList: search.responseStatusList || [],
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      };
      if (source === 'google') {
        params.qualityCheck.languageList = search.lCountry;
      }
      if (source === 'appstore') {
        params.qualityCheck.countryList = search.lCountry;
      }
      res = await qualityCheckQueryAppStore(params);
    } else if (source === '1') {
      // 工单
      res = await qualityCheckQueryIssueReport({
        qualityStatus: {
          qualityType: 1,
          ...commonParams,
        },
        qualityCheck: {
          gmtStartCreate: search.startDate ? formatTimeToISOString(search.startDate) : '',
          gmtEndCreate: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
          completeStartTime: search.completeStartTime ? formatTimeToISOString(search.completeStartTime) : '',
          completeEndTime: search.completeEndTime ? formatTimeToISOString(search.completeEndTime, '2') : '',
          productIdList: search.product,
          countryCodeList: search.lCountry,
          operateNameList: search.operatorIdList, // id
          evaluationTypeIdList: search.issueTag, // 服务标签
          issueId: search.id,
        },
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    } else {
      res = await queryCustomerSource({
        qualityStatus: {
          ...commonParams,
          qualityType: 4,
          productIdList: search.productIdList.map(v => Number(v)),
          ...(search.source === '4' ? { customerIdList: search.customerIdList } : {}),
        },
        qualityCheck: {
          offeringStartTime: search.startDate ? formatTimeToISOStringSingle(search.startDate) : '',
          offeringEndTime: search.endDate ? formatTimeToISOStringSingle(search.endDate) : '',
          callStartTimeLength: search.callStartTimeLength || '',
          callEndTimeLength: search.callEndTimeLength || '',
          holdStartTimeLength: search.holdStartTimeLength ? search.holdStartTimeLength * 1000 : '',
          holdEndTimeLength: search.holdEndTimeLength ? search.holdEndTimeLength * 1000 : '',
          labels: search.labels || '',
          investigate: search.investigate || '',
          customerPhone: search.customerPhone || '',
          connectTypeList: search.connectTypeList || [],
          repeatCallList: search.repeatCallList || [],
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

  const reset = async () => {
    setSearch({
      source: search.source,
      restCount: search.restCount + 1,
      startDate: '',
      endDate: '',
      completeStartTime: moment().subtract(30, 'days'),
      completeEndTime: moment().subtract(0, 'days'),
      customerReplyStartTime: moment().subtract(30, 'days'),
      customerReplyEndTime: moment().subtract(0, 'days'),
      product: [],
      issueTag: [],
      warningTypeList: [],
      checkTypeList: routerName === 'wait' ? ['0'] : ['1'],
      lCountry: [],
      responseState: [],
      operatorIdList: [],
      rating: [],
      productIdList: [],
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
      operatorNameList: [],
    });
  };

  const getOperatorNotQualityTotal = async () => {
    const resp = await getOperatorNotQualityTotalApi({
      operatorName: getEmailName(),
    });
    setOperatorNotQualityTotal(resp.data);
  };

  const getAllTgasByProduce = async () => {
    const productId = Object.keys(APP_PRODUCT_LIST_2);
    const promiseList = [];

    productId.forEach((id) => {
      promiseList.push(getIssueTagsList(id));
    });
    const tagOpts = {};

    Promise.all(promiseList).then((respDatas) => {
      respDatas.forEach((resp, idx) => {
        const { data, code } = resp || {};

        if (code === 20000) {
          const { list } = data || {};
          tagOpts[productId[idx]] = list || [];
        }
      });
      setAllProductTags(tagOpts);
    });
  };

  useEffect(() => {
    console.log('allProductTags', allProductTags);
    init();
  }, [allProductTags]);

  useEffect(() => {
    getUsers();
    if (routerName === 'rate') {
      getOperatorNotQualityTotal();
    }
    // 获取所有服务标签
    getAllTgasByProduce();
  }, []);

  useEffect(() => {
    if (Object.keys(userJson).length) {
      getList();
    }
  }, [userJson, pagination.current, search.restCount]);

  useEffect(() => {
    init();
  }, [search.product, search.source]);

  useEffect(() => {
    getList();
  }, [search.source]);

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
    <div className={styles.root}>
      <Query
        search={search}
        setSearch={setSearch}
        issueTags={issueTags}
        userList={userList}
        reset={reset}
        getList={getList}
        PAGE_TYPE={routerName}
        productList={productList}
      />
      {routerName === 'rate' && (
        <ul className={styles.ul_wrap}>
          <li>
            <span className={styles.label}>已领取总量:</span>
            <span className={styles.label_text}>{operatorNotQualityTotal}</span>
          </li>
        </ul>
      )}
      <userJonContext.Provider value={userJson}>
        <List
          search={search}
          loading={tableLoading}
          dataSource={dataSource}
          paginationOpts={paginationOpts}
          issueTagList={issueTagList}
          userList={userList}
          getList={getList}
          PAGE_TYPE={routerName}
          userMap={userJson}
          customerConfigJSON={customerConfigJSON}
          emailIssueTagList={emailIssueTagList}
        />
      </userJonContext.Provider>
    </div>
  );
};
