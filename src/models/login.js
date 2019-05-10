import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { fakeAccountLogin, getFakeCaptcha, iotLogin, iotLogout,getUniqueToken, getLoginCode } from "@/services/api";
import { setAuthority } from "@/utils/authority";
// import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from "@/utils/Authorized";

export default {
  namespace: "login",

  state: {
    status: undefined,
    token: "",
    loginCode: ""
  },

  effects: {
    * userToken({ payload, callback }, { call, put }) {
      const response = yield call(getUniqueToken);
      yield put({
        type: "saveToken",
        payload: response.state === 1 ? response.data : null
      });
      callback(response);
    },
    * getLoginCode({ payload }, { call, put }) {
      const response = yield call(getLoginCode, payload);
      yield put({
        type: "saveLoginCode",
        payload: response.data || null
      });
    },
    * login({ payload, callback }, { call, put }) {
      const response = yield call(iotLogin, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      if (response.state !== 1) {
        callback(response);
      }

      if (response.state === 1) {

        localStorage.setItem("token", this.state.token);
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
        yield put(routerRedux.replace("/dashboard/analysis"));
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, { call, put }) {
      const response = yield call(iotLogout);
      if(response.state === 1){
        localStorage.removeItem('token');
        yield put(
          routerRedux.push({
            pathname: "/user/login",
            search: stringify({
              redirect: window.location.href
            })
          })
        );
      }
      // yield put({
      //   type: "changeLoginStatus",
      //   payload: {
      //     status: false,
      //     currentAuthority: "guest"
      //   }
      // });
      // reloadAuthorized();

    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      localStorage.removeItem("token");
      // setAuthority("admin");
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        token: null,
        status: payload.status,
        type: payload.type
      };
    },
    saveLoginCode(state, { payload }) {
      return {
        ...state,
        loginCode: payload
      };
    },
    saveToken(state, { payload }) {
      return {
        ...state,
        token: payload
      };
    }
  }
};
