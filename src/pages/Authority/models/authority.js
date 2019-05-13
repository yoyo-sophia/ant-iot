import {
  // 账号相关
  getAccountList,
  getAccountDetail,
  // 角色操作相关
  getRoleList, // 获取角色列表
  addRole, // 新增角色
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
      data:[],
      pagination:{},
    },// 角色详情
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
        payload: response.data,
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
    *add_role({payload,callback},{call,put}){
      const response = yield call(addRole,payload);
      callback(response);
    },
    *delete_role({payload,callback},{call,put}){
      const response = yield call(deleteRole,payload);
      callback(response);
    },// 删除角色
    *edit_role({payload,callback},{call,put}){
      const response = yield call(editRole,payload);
      callback(response);

    },// 编辑角色
    *dispatch_authority_to_role({payload,callback},{call,put}){
      const response = yield call(dispatchAuthorityToRole,payload);
      callback(response);
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
    *deleteMenuNode({payload,callback},{call,put}){
      const response = yield call(deleteMenuNode,payload);
      yield put({
        type:'saveManipulationNode',
        payload:response
      });
      callback(response);
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
        roleData: {
          ...action.payload,
        },
      }
    }, // 角色列表
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