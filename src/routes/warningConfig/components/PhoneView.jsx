/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Table, Button, Popconfirm,
} from 'antd';
import { getUserListServer, customerConfigQuery, customerConfigDelete } from '../../../service';
import PhoneInsertOrUpdateView from './PhoneInsertOrUpdateView';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userList, setUserList] = useState([]);
  const [userJson, setUserJson] = useState({});

  const getData = async () => {
    setLoading(true);
    const res = await customerConfigQuery({});
    setDataSource(res.data);
    setLoading(false);
  };

  const remove = async (id) => {
    await customerConfigDelete({ id });
    getData();
  };
  const columns = [
    { dataIndex: 'customerId', title: '坐席工号' },
    { dataIndex: 'operatorId', title: '客服名称', render: text => userJson[text] },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text, row) => (
        <div>
          <PhoneInsertOrUpdateView row={row} type="edit" userList={userList} getData={getData} />
          <Popconfirm title="是否确定删除？" onConfirm={() => remove(row.id)} okText="是" cancelText="否">
            <Button style={{ marginRight: 5 }} danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
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
        usersJson[i.id] = i.email;
      }
    }
    setUserList(userData);
    setUserJson(usersJson);
  };
  useEffect(() => {
    init();
    getData();
  }, []);
  return (
    <div>
      <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
        <Collapse.Panel header="电话客服工号配置" key="1">
          <PhoneInsertOrUpdateView row={{}} type="add" userList={userList} getData={getData} />
          <Table dataSource={dataSource} columns={columns} rowKey="id" loading={loading} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
