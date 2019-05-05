import mockjs from 'mockjs';


// 权限系统 账号列表
export default {
  'GET /api/account/list': mockjs.mock({
    'list|30': [{
      'key|+1': 1,'id|+1': 1,
      name: '@cword(3, 5)',
      'role': '@cword(3, 5)',
      'phone|1-100':1,
      'status|0-1':1,
    }],
  }),
  'GET /api/account/detail': mockjs.mock({
    'list|30':[{
        'key|+1':1,
        'id|+1': 1,
        'name': '@cword(5,9)',
        'authorities': '@cword(4,8)'
    }],
  })
};