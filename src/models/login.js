import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha ,iotLogin,getUniqueToken,getLoginCode} from '@/services/api';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    loginCode:'',
  },

  effects: {
    *userToken({payload,callback},{call,put}){
      const response = yield call(getUniqueToken);
      callback(response);
    },
    *getLoginCode({payload},{call,put}){
      const response = yield call(getLoginCode);
      yield put({
        type:'saveLoginCode',
        payload:response,
      })
    },
    *login({ payload }, { call, put }) {
      const response = yield call(iotLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 1) {
        reloadAuthorized();

        // const urlParams = new URL(window.location.href);
        //
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.replace('/dashboard/analysis'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveLoginCode(state,{payload}){
      return{
        ...state,
        loginCode:payload
      }
    }
  },
};
