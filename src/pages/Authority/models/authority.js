import { getAccountList,getAccountDetail } from '@/services/api';

export default {
  namespace:'authority',
  state:{
    data: {
      list: [],
      pagination: {},
    },
    accountDetailData:{
        list: [],
        pagination: {},

    }
  },
  effects:{
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAccountList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetch_account_detail({payload},{call,put}){
      const response = yield call(getAccountDetail,payload);
      yield put({
        type:'save',
        payload:response,
      })
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        accountDetailData: action.payload,
      };
    },
  }
}