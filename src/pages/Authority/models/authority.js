import {
  getRoleList,
  getAccountList,
  getAccountDetail,
  // 角色操作相关
  deleteRole, // 移除角色
  editRole, // 编辑角色
  dispatchAuthorityToRole, // 分配角色权限
  getCurRoleAuthority, // 获取当前角色权限

  // 节点相关操作
  createMenuNode, // 创建节点
  editMenuNode, // 编辑节点
  deleteMenuNode, // 删除节点
  settingMenuApi, // 配置菜单API
  deleteMenuApi, // 移除菜单API
  getMenuApiList, // 获取菜单API列表

} from '@/services/api';

export default {
  namespace:'authority',
  state:{
    data: {
      list: [],
      pagination: {},
    },// 账号列表
    accountDetailData:{
        list: [],
        pagination: {},

    },// 账号详情
    roleData:{
      list:[],
      pagination:{},
    },// 角色详情
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
    *fetch_curRole_authority({payload,callback},{call,put}){
      const response = yield call(getCurRoleAuthority,payload);
      callback(response);
    },//获取角色列表当前拥有的权限

    /*
    * 节点相关
    * */
    *createMenuNode({payload,callback},{call,put}){
      const response = yield call(createMenuNode,payload);
      callback(response);
    },// 创建节点
    *editMenuNode({payload},{call,put}){
      const response = yield call(editMenuNode,payload);
      yield put({
        type:'saveManipulationNode',
        payload:response
      })
    },// 修改节点
    *deleteMenuNode({payload},{call,put}){
      const response = yield call(deleteMenuNode,payload);
      yield put({
        type:'saveManipulationNode',
        payload:response
      })
    },// 删除节点

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

    /*
    * 节点相关
    * */
    saveManipulationNode(state,action){
      return{
        ...state,
        modifyState:action.payload
      }
    }

  }
}