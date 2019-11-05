import axios from "axios";
import { notification } from "antd";
import router from "umi/router";

const codeMessage = {
  202: "一个请求已经进入后台排队（异步任务）。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  500: "服务器发生错误，请检查服务器。"
};
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config){
  let token = localStorage.getItem('token');
  if(token){
    config.data = {...config.data,token};
  }
  return config;
})
// 仅拦截异常状态响应
axios.interceptors.response.use(function(response){
  var data = response.data;
  if(data.code == 10025){
    notification.error({
      message: `登录超时`
    });
    localStorage.removeItem('token');
    router.push('/');
  }else if(data.code != 10000){
    notification.error({
      message: data.message
    });
  }
  return data;
}, ({ response }) => {
  if (codeMessage[response.status]) {
    notification.error({
      message: `请求错误 ${response.status}: ${response.config.url}`,
      description: codeMessage[response.status]
    });
  }
  return Promise.reject(err);
});
