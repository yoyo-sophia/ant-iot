import {planList,queryRule} from "@/services/api";

export default {
  namespace:'plan',
  state:{
    plan_list:[],
  },
  effects:{
    *fetch({payload},{call,put}){
      console.log(payload);
      const response = yield call(planList,payload);
      yield put({
        type:'queryList',
        payload:Array.isArray(response.rows)?response.rows:[],
      });
    },
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