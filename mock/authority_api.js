import mockjs from 'mockjs';


// 权限系统 账号列表
export default {
  'GET /api/role/list': mockjs.mock({
    'list|30':[{
      'key|+1': 1,
      'id|+1': 1,
      'name':'@cword(4,7)',
      'describe': '@cword(5,9)',
      'partner_id':1,
      'role_partners|1-500':1,
      'status|0-1':0,
      'type|0-1':0,
    }]
  }),
  'GET /api/account/list': mockjs.mock({
    'list|30': [{
      'key|+1': 1,
      'id|+1': 1,
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