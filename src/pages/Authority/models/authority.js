import { getAccountList } from '@/services/api';

export default {
  namespace:'authority',
  state:{
    data: {
      list: [],
      pagination: {},
    },
  },
  effects:{
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAccountList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers:{
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  }
}