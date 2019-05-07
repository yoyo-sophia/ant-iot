import {
  getRoleList,
  getAccountList,
  getAccountDetail,
  // 角色操作相关
  deleteRole, // 移除角色
  editRole, // 编辑角色
  dispatchAuthorityToRole, //分配角色权限

} from '@/services/api';

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

    },
    roleData:{
      list:[],
      pagination:{},
    },
    deleteRole:{},
    editRole:{},
    dispatchRole:{},
  },
  effects:{
    /*
    * 账号相关
    * */
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAccountList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },// 权限列表
    *fetch_account_detail({payload},{call,put}){
      const response = yield call(getAccountDetail,payload);
      yield put({
        type:'saveAccountDetail',
        payload:response,
      });
    },// 账号权限详情

    /*
    * 角色相关
    * */
    *fetch_role_list({payload,callback},{call,put}){
      const response = yield call(getRoleList,payload);
      yield put({
        type:'saveRoleList',
        payload:response
      });
    },// 角色列表
    *delete_role({payload,callback},{call,put}){
      const response = yield call(deleteRole,payload);
      yield put({
        type:'saveDeleteRole',
        payload:response,
      });
      callback(response);
    },// 删除角色
    *edit_role({payload},{call,put}){
      const response = yield call(editRole,payload);
      yield put({
        type:'saveEditRole',
        payload:response,
      });
    },// 编辑角色
    *dispatch_role_to_partner({payload},{call,put}){
      const response = yield call(dispatchAuthorityToRole,payload);
      yield put({
        type:'saveDispatchRoleToPartner',
        payload:response,
      });
    },// 给角色分配权限
  },
  reducers: {
    /*
    * 账号相关
    * */
    save(state, action) {
      return {
        ...state,
        data: action.payload,// 账号列表
      };
    },
    saveAccountDetail(state,action){
      return{
        ...state,
        accountDetailData: action.payload,
      }
    }, // 账号列表详情

    /*
    * 角色相关
    * */
    saveRoleList(state,action){
      return{
        ...state,
        roleData: action.payload,
      }
    }, // 角色列表
    saveDeleteRole(state,action){
      return{
        ...state,
        deleteRole:action.payload,
      }
    },// 移除角色
    saveEditRole(state,action){
      return{
        ...state,
        editRole:action.payload,
      }
    },// 编辑角色
    saveDispatchRoleToPartner(state,action){
      return{
        ...state,
        dispatchRole:action.payload,
      }
    }, // 给角色分配权限
  }
}