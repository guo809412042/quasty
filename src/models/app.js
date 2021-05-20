/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-02 16:30:40
 * @LastEditTime: 2020-09-04 11:05:26
 * @LastEditors: ssssslf
 */
import cookie from 'js-cookie';

export default {
  namespace: 'app',
  state: {
    user: JSON.parse(cookie.get('user') || localStorage.getItem('user')),
    product: cookie.get('PRODUCT_ID') || localStorage.getItem('PRODUCT_ID'),
    ghProduct: cookie.get('GH_PRODUCT_ID') || localStorage.getItem('GH_PRODUCT_ID'),
    ghPlatform: cookie.get('GH_PLATFORM') || localStorage.getItem('GH_PLATFORM'),
  },
  subscriptions: {},
  effects: {},
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
