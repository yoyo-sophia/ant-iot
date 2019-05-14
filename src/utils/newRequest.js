import axios from 'axios'
import { notification } from 'antd';
import router from 'umi/router';
import { token } from './utils';
import qs from 'qs'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

axios.interceptors.request.use(function(config) {
  if(config.method === 'post'){
    config.headers['Qhyl-Token'] = token(config.data)
  }else if(config.method === 'get'){
    config.headers['Qhyl-Token'] = token(config.params)
  }
  return config
},(error)=>{
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
  if(response.data.state === 12001){
    localStorage.clear();
    router.push('/user/login');
    return response.data;
  }else {
    return response.data;
  }
},error => {
  if(localStorage.getItem('token')){
    const status = error.status;
    if (status === 401) {
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return;
    }
    // environment should not be used
    if (status === 403) {
      router.push('/exception/403');
      return;
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      return;
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
    }
  }

  const errorText = codeMessage[error.response.status] || error.response.statusText;
  console.log(error);
  notification.error({
    message: `请求错误 ${error.response.status}: ${error.response.url}`,
    description: errorText,
  });
  const newError = new Error(errorText);
  newError.name = error.response.status;
  throw newError;
});

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    ...option,
  };

  if(options.method === 'POST'){
    return axios({
      method: 'post',
      url,
      data: options.body
    })
  }else if(options.method === 'GET'){
    return axios({
      method: 'get',
      url,
      params:options.payload
    })
  }
}
