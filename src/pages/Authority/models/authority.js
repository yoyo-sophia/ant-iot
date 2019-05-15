import {
  // 账号相关
  getAccountList, // 获取账号列表
  getAccountDetail, // 获取账号详情
  createTopAccount, // 创建顶级账号
  dispatchRoleToAccount, // 给账号分配角色

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

  // api接口设置相关
  apiList, // 所有接口列表
  dispatchApiToMenu, // 给菜单设置接口
  getMenuCurApi, // 当前菜单已有api列表
  deleteMenuApi, // 移除当前菜单中的api

} from '@/services/api';

export default {
  namespace:'authority',
  state:{
    accountData: {
      data:{
        rows:[],
        pagination:{},
      }
    },// 账号列表
    accountDetailData:{
      data:{
        rows:[],
      }
    },// 账号权限详情列表,
    saveCreateAccount:'',// 创建账号后保存数据
    roleData:{
      data:{
        rows:[],
        pagination:{},
      }
    },// 角色详情
    editedRole:'', // 角色修改编辑后的数据
    apiList:{
      data:[]
    }, // api数据
    nodeApiList:{
      rows:[],
    } // 节点拥有的api列表
  },
  effects:{
    /*
    * 账号相关
    * */
    *fetch_account_list({ payload }, { call, put }) {
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
    *create_top_account({payload,callback},{call,put}){
      const response = yield call(createTopAccount,payload);
      yield put({
        type:'saveCreateAccount',
        payload:response
      })
    },//创建顶级账号
    *dispatch_role_to_account({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(dispatchRoleToAccount,payload.params);
      resolve(response);
    },// 给账号分配角色
    /*
    * 角色相关
    * */
    *fetch_role_list({payload,callback},{call,put}){
      const response = yield call(getRoleList,payload.params);
      if(payload.params){
        yield put({
          type:'saveRoleList',
          payload:response
        });
      }else{
        const { resolve } = payload;
        resolve(response);
      };
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
      yield put({
        type:'saveEditRole',
        payload:response
      })
      // callback(response);

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
        payload:response,
      })
    },// 修改节点
    *deleteMenuNode({payload,callback},{call,put}){
      const response = yield call(deleteMenuNode,payload);
      yield put({
        type:'saveManipulationNode',
        payload:response,
      });
      callback(response);
    },// 删除节点

    /*
    * api接口
    * */
    *get_api_list({payload,callback},{call,put}){
      const response = yield call(apiList);
      yield put({
        type:'saveApiList',
        payload:response,
      });
    },// 获取api列表
    *dispatch_api_to_menu({payload},{call,put}){
      const { resolve } = payload;
      const response = yield call(dispatchApiToMenu,payload.params);
      resolve(response);
    },// 给菜单分配api
    *get_menu_cur_api({payload},{call,put}){
      const response = yield call(getMenuCurApi,payload);
      yield put({
        type:'saveNodeApiList',
        payload:response,
      })

    },// 获取子节点api列表
    *delete_menu_api({payload},{call,put}){
      const { resolve } =  payload;
      const response = yield call(deleteMenuApi,payload.params);
      resolve(response);
    },// 移除菜单api
  },
  reducers: {
    /*
    * 账号相关
    * */
    save(state, action) {
      return {
        ...state,
        accountData:{
          ...action.payload
        },// 账号列表
      };
    },
    saveAccountDetail(state,action){
      return{
        ...state,
        accountDetailData: {
          data:{
            rows:action.payload.data,
          }
        },
      }
    }, // 账号列表详情
    saveCreateAccount(state,action){
      return{
        ...state,
        saveCreateAccount:action.payload
      }
    },// 创建账号
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
    saveEditRole(state,action){
      return{
        ...state,
        editedRole:action.payload
      }
    },

    /*
    * 节点相关
    * */
    saveManipulationNode(state,action){
      return{
        ...state,
        modifyState:action.payload
      }
    },
    /*
    * api相关呢
    * */
    saveApiList(state,action){
     return{
       ...state,
       apiList:{
         ...action.payload
       }
     }
    },//接口列表
    saveNodeApiList(state,action){
      return{
        ...state,
        nodeApiList:{
          rows:data.action.payload.data,
          ...action.payload
        }
      }
    },// 节点拥有的api列表
  }
}