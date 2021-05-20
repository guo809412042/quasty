/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { message } from 'antd';
import Query from './components/Query';
import {
  getUserListServer,
  qualityCheckQueryIssueReport,
  qualityCheckQueryEmail,
  getIssueTagsList,
  qualityCheckQueryAppStore,
  qualityScoreConfigQuery,
  queryCustomerSource,
  customerConfigQuery,
  getEmailTagsListApi,
} from '../../../service';
import { formatTimeToISOString, getUserId, exportExcel } from '../../../utils/utils';
import List from './List';
import { getIssueTree } from '../../QCList/utils';
import { APP_PRODUCT_LIST, APP_PRODUCT_LIST_2 } from '../../../utils/const';
import {
  sampleTypeValue, SOURCE, IS_PASS, CHECK_TYPE,
} from '../../const';

export default () => {
  const [search, setSearch] = useState({
    source: '1',
    startDate: null,
    endDate: null,
    scoreStartTime: moment().subtract(30, 'days'),
    scoreEndTime: moment().subtract(0, 'days'),
    operateNameList: [], // 处理客服
    operateNameListQC: [getUserId() * 1], // 质检员
    checkTypeList: ['3'],
    product: [],
    // isPass: '1',
  });
  const [allProductTags, setAllProductTags] = useState({});
  const [customerConfigList, setCustomerConfigList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [userJson, setUserJson] = useState({});
  const [issueTags, setIssueTags] = useState([]);
  const [issueTagList, setIssueTagList] = useState([]);
  const [scoreConfigData, setScoreConfigData] = useState([]);
  const [customerConfigJSON, setCustomerConfigJSON] = useState({});
  const [customerIdJSON, setCustomerIdJSON] = useState({});
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [exportBtnLoading, setExportBtnLoading] = useState(false);
  const [emailIssueTagList, setEmailIssueTagList] = useState([]);
  const query = async () => {
    const { data } = await qualityScoreConfigQuery({
      sampleType: sampleTypeValue[search.source],
    });
    setScoreConfigData(data);
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
  // qualityType 1:工单 2:邮件 3:应用商店 4:电话

  const getList = async (config) => {
    const { isExport = false } = config || {};
    await init();
    if (!isExport) {
      setTableLoading(true);
    }
    let res;
    const commonParams = {
      isPass: search.isPass || '',
      scoreBaseMin: search.scoreBaseMin || '',
      scoreBaseMax: search.scoreBaseMax || '',
      scoreAdditionalMin: search.scoreAdditionalMin || '',
      scoreAdditionalMax: search.scoreAdditionalMax || '',
      checkTypeList: search.checkTypeList.length ? search.checkTypeList : ['2', '3'],
      operatorNameList: search.operateNameListQC.map(v => userJson[v]),
      scoreStartTime: search.scoreStartTime ? formatTimeToISOString(search.scoreStartTime) : '',
      scoreEndTime: search.scoreEndTime ? formatTimeToISOString(search.scoreEndTime, '2') : '',
    };
    let pageParams = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    if (isExport) {
      pageParams = {
        pageSize: 50000,
        pageNum: 1,
      };
    }

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
        },
        ...pageParams,
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
        },
        ...pageParams,
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
        ...pageParams,
      });
    } else {
      res = await queryCustomerSource({
        qualityStatus: {
          qualityType: 4,
          ...commonParams,
          customerIdList: search.operateNameList.map(v => customerIdJSON[v]),
        },
        qualityCheck: {
          offeringStartTime: search.startDate ? formatTimeToISOString(search.startDate) : '',
          offeringEndTime: search.endDate ? formatTimeToISOString(search.endDate, '2') : '',
        },
        ...pageParams,
      });
    }
    if (!isExport) {
      setPagination({
        ...pagination,
        total: res.count,
      });
      setDataSource(res.data);
      setTableLoading(false);
    } else {
      return res.data;
    }
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
    const customerIdJSONs = {};
    for (const v of data) {
      customerConfigJSONs[v.customerId] = `${usersJson[v.operatorId]}[${v.customerId}]`;
      customerIdJSONs[v.id] = v.operatorId;
    }
    setCustomerConfigList(
      data.map(v => ({
        name: customerConfigJSONs[v.customerId],
        value: v.id,
      })),
    );
    setCustomerConfigJSON(customerConfigJSONs);
    setCustomerIdJSON(customerIdJSONs);
  };
  const reset = async () => {
    setSearch({
      source: '1',
      startDate: null,
      endDate: null,
      scoreStartTime: moment().subtract(30, 'days'),
      scoreEndTime: moment().subtract(0, 'days'),
      operateNameList: [], // 处理客服
      operateNameListQC: [getUserId() * 1], // 质检员
      checkTypeList: ['3'],
    });
    getList();
  };

  const computedScore = (scoreInfo) => {
    let total = 0;
    let totalBase = 0;
    let totalAdd = 0;
    const preLineScoreOpt = {};
    if (scoreInfo) {
      try {
        const info = JSON.parse(scoreInfo);
        // eslint-disable-next-line no-restricted-syntax
        for (const i of info) {
          if (i.qualityProjectType * 1 === 1) {
            total += i.score;
            totalBase += i.score;
            preLineScoreOpt[i.title] = i.score || 0;
          }
          if (i.qualityProjectType * 1 === 2) {
            total += i.score;
            totalAdd += i.score;
            preLineScoreOpt[i.title] = i.score || 0;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return {
      total,
      totalBase,
      totalAdd,
      preLineScoreOpt,
    };
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

  const couputedDesc = (scoreInfo) => {
    if (!scoreInfo) {
      return '';
    }
    let info = [];
    try {
      info = JSON.parse(scoreInfo);
    } catch (e) {
      console.log(e);
    }
    const find = info.find(v => v.qualityProjectType === 'desc');
    if (find) {
      return find.desc;
    }
    return '';
  };

  const exportFile = async () => {
    const data = await getList({ isExport: true });
    setExportBtnLoading(true);
    if (data && data.length) {
      const exportData = [];
      data.forEach((item) => {
        // 渠道、产品 、ID  、VIP状态、回复时间 、受理客服、服务标签、评分情况（展示每项指标内容和最终得分）、
        // 总得分、评语 、是否合格、 质检时间、质检人、质检状态、质检标签
        const { source } = search;
        const { qualityStatus, qualityCheck } = item;
        const {
          replyTime = '',
          productId,
          issueId,
          isVip,
          evaluationTypeId,
          tagId,
          emailId,
          reviewType,
          createTime,
          callNo,
          connectType,
          calledNo,
          exten,
          offeringTime,
          callSheetId,
          tagRemark,
          typeRemarks,
        } = qualityCheck || {};
        const {
          scoreInfo, isPass, scoreTime, operatorName, checkType, customerId, sourceId,
        } = qualityStatus || {};
        const {
          total, totalBase, totalAdd, preLineScoreOpt,
        } = computedScore(scoreInfo);
        const descReview = couputedDesc(scoreInfo);
        let rowData = {};
        let coumerName = '客服';
        const find = userList.find(v => v.value * 1 === customerId * 1);
        if (find) {
          coumerName = find.name;
        }
        if (source === '1') {
          let serviceTag = '';
          const find = issueTagList.find(v => v.id * 1 === evaluationTypeId * 1);
          if (find) {
            serviceTag = `${find.levelOne}/${find.levelTwo}/${find.levelThree}`;
          }
          rowData = {
            渠道: SOURCE[source],
            产品: APP_PRODUCT_LIST[productId],
            ID: issueId,
            VIP状态: isVip ? '是' : '否',
            回复时间: replyTime ? moment(replyTime).format('YYYY-MM-DD HH:mm:ss') : '',
            受理客服: coumerName,
            服务标签: serviceTag,
            标签备注: tagRemark,
          };
        }
        if (source === '2') {
          let serviceTag = '';
          // if (replyTime <= new Date('2021-03-08 12:00:00').getTime()) {
          //   const find = emailIssueTagList.find(v => +v.id === +tagId);
          //   if (find) {
          //     serviceTag = find.tag_name;
          //   }
          // } else {
          const find = issueTagList.find(v => +v.id === +tagId);
          if (find) {
            serviceTag = `${find.levelOne}-${find.levelTwo}-${find.levelThree}`;
          }
          // }

          rowData = {
            渠道: SOURCE[source],
            产品: APP_PRODUCT_LIST['2'],
            ID: emailId,
            回复时间: replyTime ? moment(replyTime).format('YYYY-MM-DD HH:mm:ss') : '',
            受理客服: coumerName,
            服务标签: serviceTag,
            标签备注: tagRemark,
          };
        }
        if (source === '3') {
          let serviceTag = '';
          const find = issueTagList.find(v => v.id * 1 === reviewType * 1);
          if (find) {
            serviceTag = `${find.levelOne}/${find.levelTwo}/${find.levelThree}`;
          }
          rowData = {
            渠道: SOURCE[source],
            产品: APP_PRODUCT_LIST[productId],
            ID: sourceId,
            评论获取时间: createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '',
            受理客服: coumerName,
            服务标签: serviceTag,
            标签备注: typeRemarks,
          };
        }
        if (source === '4') {
          const operateName = userJson[qualityStatus.customerId] || '';
          const operateNameStr = `${operateName}[${exten}]`;

          rowData = {
            通话ID: callSheetId,
            客户号码: connectType === 'dialTransfer' || connectType === 'dialout' ? calledNo : callNo,
            产品: APP_PRODUCT_LIST[qualityStatus.productId],
            处理坐席: operateNameStr,
            呼叫时间: offeringTime ? moment(offeringTime).format('YYYY-MM-DD HH:mm:ss') : '',
          };
        }
        rowData = {
          ...rowData,
          ...preLineScoreOpt,
          标准得分: totalBase,
          附加得分: totalAdd,
          总得分: total,
          评语: descReview,
          是否合格: IS_PASS[isPass],
          质检时间: scoreTime ? moment(scoreTime).format('YYYY-MM-DD HH:mm:ss') : '',
          质检人: operatorName,
          质检状态: CHECK_TYPE[checkType],
        };
        exportData.push(rowData);
      });
      exportExcel(exportData, '结果查询-质检员登录.xlsx');
      setExportBtnLoading(false);
    } else {
      message.warn('搜索结果为空！');
    }
  };

  useEffect(() => {
    init();
  }, [allProductTags]);

  useEffect(() => {
    getUsers();
    init();
    query();
    // 获取所有服务标签
    getAllTgasByProduce();
  }, []);
  useEffect(() => {
    if (Object.keys(userJson).length) {
      getList();
      query();
    }
  }, [userJson, search.source, pagination.current]);
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
      <Query
        search={search}
        setSearch={setSearch}
        getList={getList}
        userList={userList}
        reset={reset}
        customerConfigList={customerConfigList}
        exportFile={exportFile}
        exportBtnLoading={exportBtnLoading}
      />
      <List
        dataSource={dataSource}
        source={search.source}
        userList={userList}
        userJson={userJson}
        tableLoading={tableLoading}
        issueTagList={issueTagList}
        getList={getList}
        issueTags={issueTags}
        scoreConfigData={scoreConfigData}
        paginationOpts={paginationOpts}
        customerConfigJSON={customerConfigJSON}
        emailIssueTagList={emailIssueTagList}
      />
    </div>
  );
};
