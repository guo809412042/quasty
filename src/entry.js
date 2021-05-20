/*
 * @Author: ssssslf
 * @Date: 2019-10-28 16:36:03
 * @LastEditTime: 2020-10-09 13:50:44
 * @LastEditors: ssssslf
 * @Description: In User Settings Edit
 * @FilePath: /vcm-gh-show/src/entry.ts
 */
/* eslint-disable global-require */
import dva from 'dva';
import ReactDOM from 'react-dom';

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  const app = dva();

  app.model(require('./models/app').default);

  app.router(require('./router').default);

  app.start('#root');

  console.log('props from main framework', props);
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
}

if (!process.env.BUILD_ENV) {
  document.cookie = 'productList=2%2C5%2C3%2C6;';
  // document.cookie = 'email=junguo.jiang@quvideo.com;';
  // document.cookie = 'username=junguo.jiang;';
  document.cookie = 'email=siyan.wang@quvideo.com';
  document.cookie = 'username=siyan.wang;';
  document.cookie = 'groupIdList=1%2C9;';
  document.cookie = 'role_id=11;';
  document.cookie = 'country_code=CN;';
  document.cookie = 'project_type=2;';
  document.cookie = 'group_id=1;';
  document.cookie = 'userid=3181;';
  document.cookie = 'user_leader_department=;';
  document.cookie = 'openid=225de30ed95d4a2eae93f7ff6e00d143;';
  document.cookie = 'user={"user":{"username":"lifen.sheng@quvideo.com","id":1241,"email":"lifen.sheng@quvideo.com"},"isLogin":true,"product_list":"2,5,3,6","group_list":"1,9","role_id":11,"app_channel":"","user_leader_department":null};';
  document.cookie = 'PRODUCT_ID=2';
  mount();
}
