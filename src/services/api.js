import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: {
      ...params,
      method:'post',
    },
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


export async function getMockMenu() {
  return request('/api/menu');
}




















/*
* iot 测试环境
* */

/*
* About Login
* */

// 获取标识符
export async function getUniqueToken() {
  return request('/iot/unique')
}

// 获取图文验证码
export async function getLoginCode(payload) {
  return request (`/iot/code_img?${stringify(payload)}`,{
    method:'GET',
    payload:payload
  })
}
// 登录接口
export async function iotLogin(params) {
  // let paramFormData = new FormData();
  // paramFormData.append('data',JSON.stringify(params));
  return request('/iot/v1/partners/login',{
    method:'POST',
    body:params,
  })
}

// 登出接口
export async function iotLogout() {
   return request('/iot/v1/partners/logout',{
     method:'GET'
   })
}



/*
* end Login
* */






/*
* 获取套餐接口
* */
export async function planList(params) {
  return request(`/iot/v1/plans?${stringify(params.params)}`);
}

/*
* 卡详情
* */
export async function cardList() {
  return request(`/iot/v1/cards/new_list`);
}



/*
*  权限相关接口
* */

// 角色列表
export async function getRoleList() {
  return request('/api/role/list');
}

// 删除角色
export async function deleteRole(params) {
  return request('/api/deleteRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编辑角色
export async function editRole(params) {
  return request('/api/editRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//  分配角色权限
export async function dispatchAuthorityToRole(params) {
  return request('/api/dispatchAuthorityToRole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取当前角色的权限列表
export async function getCurRoleAuthority(params) {
  return request('/api/getCurRoleAuthority');
}


// 账号列表
export async function getAccountList(params) {
  return request(`/api/account/list?${stringify({
    id:params.id
  })}`);
}

// 账号权限详情列表
export async function getAccountDetail(params) {
  return request(`/api/account/detail?${stringify({
    id:params.id
  })}`);
}

