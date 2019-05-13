// import request from '@/utils/request';
import request from '@/utils/newRequest'

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/iot/v1/partners/user_info',{
    method:'GET'
  })
}


