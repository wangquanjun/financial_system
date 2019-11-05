import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function register({email,password,verifycode}) {
	return axios.post('me_signup_2',{email,password,verifycode,en:'en'})
}
function forgetRegister({email,password,verifycode}) {
	return axios.post('me_getpass_2',{email,verifycode,password})
}


function getCode(payload){
	let language = localStorage.getItem('language');
	if(language == 'en-us'){
		language = 'en';
	}else if(language == 'ja'){
		language = 'jp';
	}else{
		language = 'en';
	}
	payload.language = language;
	return axios.post('me_signup_1',payload)
}
function getForgetCode(payload){
	let language = localStorage.getItem('language');
	if(language == 'en-us'){
		language = 'en';
	}else if(language == 'ja'){
		language = 'jp';
	}else{
		language = 'en';
	}
	payload.language = language;
	return axios.post('me_getpass_1',payload)
}
export default {
	namespace: 'register',
	state: {
		
	},
	effects: {
		* register({
			payload
		}, {
			call,
			put
		}) {
			const res = yield call(register, payload);
			if(!res.error){
				var data = res.data;
				localStorage.setItem("userinfo", JSON.stringify({email:data.email}))
				localStorage.setItem("token", data.token)
				yield put({ type: "user/init", payload: {email:data.email,isLogined:true} });
				message.success('注册成功');
				setTimeout(function(){
					router.push('/');
				},1000)
			}
		},
		* getCode({payload,callback},{call,put}){
			console.log(payload)
			const res = yield call(getCode,payload);
			// yield put({ type: 'add' });
			callback(res)
		},
		* forgetRegister({
			payload
		}, {
			call,
			put
		}) {
			const res = yield call(forgetRegister, payload)
			console.log(res);
			if(!res.error){
				var data = res.data;
				// localStorage.setItem("userinfo", JSON.stringify({email:data.email}))
				// localStorage.setItem("token", data.token)
				// yield put({ type: "user/init", payload: {email:data.email,isLogined:true} });
				message.success('找回密码成功');
				setTimeout(function(){
					router.push('/login');
				},1000)
			}
		},
		* getForgetCode({payload,callback},{call,put}){
			console.log(payload)
			const res = yield call(getForgetCode,payload);
			// yield put({ type: 'add' });
			callback(res)
		}
	},
	reducers: {
		add(state,action){
			state.code = '1234'
			return state;
		}
	}
}