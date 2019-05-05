// 卡详情
import { cardList } from '@/services/api'

export default {
  namespace: 'card',
  state:{
    data:{
      list:[],
      pagination:{},
    },
    test:{
      name:'yoyoyo',
      attr:'新增参数'
    },
  },
  effects:{
    *fetch({payload},{call,put}){
      // payload 请求参数
      const response = yield  call(cardList,payload);
      yield put({
          type:'save', // 请求处理成功之后同步信息
          payload:response,
      })
    },
  },
  reducers:{
    save(state,action){
      return {
        ...state,
        data: action.payload,
      };
    },

  }
}