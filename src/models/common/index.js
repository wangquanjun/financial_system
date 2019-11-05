import axios from "axios";
import router from "umi/router";

import util from "../../util";
function getSiStatus() {
  return axios.post("si_status");
}
function getMeStatus() {
  return axios.post("me_status", {
    language: localStorage.getItem("language") || "en"
  });
}
function getLanguageCommon() {
  return util.getLanguage("common.js");
}
function getLanguageHome() {
  return util.getLanguage("home.js");
}
function getLanguageHXmc() {
  return util.getLanguage("xmc.js");
}
export default {
  namespace: "common",
  state: {
    username: "common",
    commonLanguage: {},
    homeLanguage: {},
    xmcLanguage: {},
    isLoading:false
  },
  effects: {
    *getSiStatus({ callback }, { call, put }) {
      const res = yield call(getSiStatus);
      callback(res);
    },
    *getMeStatus({}, { call, put }) {
      const res = yield call(getMeStatus);
      if(res.data && res.data.token){
        localStorage.setItem('token',res.data.token);
      }
      
    },
    *getLanguageCommon(url, { call, put }) {
      const res = yield call(getLanguageCommon);
      yield put({ type: "initLanguage", payload: res });
    },
    *getLanguageHome(url, { call, put }) {
      const res = yield call(getLanguageHome);
      yield put({ type: "initLanguage1", payload: res });
    },
    *getLanguageHXmc(url, { call, put }) {
      const res = yield call(getLanguageHXmc);
      yield put({ type: "initLanguage2", payload: res });
    }
  },
  reducers: {
    add(state, action) {
      state.code = "1234";
      return state;
    },
    init(state, action) {
      return action.payload;
    },
    initLanguage(state, { payload }) {
      state.commonLanguage = payload.data;
      return { ...state };
    },
    initLanguage1(state, { payload }) {
      state.homeLanguage = payload.data;
      return { ...state };
    },
    initLanguage2(state, { payload }) {
      state.xmcLanguage = payload.data;
      return { ...state };
    },
    loading(state,action){
      state.isLoading = action.isShow;
      return { ...state };
    }
  }
};
