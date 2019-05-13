import {queryRule} from "@/services/api";

export default {
  namespace:'plan',
  state:{
    plan_list:[],
  },
  effects:{
    *fetch_1({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },
  reducers:{
    queryList(state,action){
      return{
        ...state,
        plan_list:action.payload,
      };
    },
  }
}