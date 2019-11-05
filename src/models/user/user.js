import axios from "axios";
import router from "umi/router";
import { Login,UserLogout,svgcode,List,AddUser,Updatesvgcode,AddUserRole,UpdatePassword } from '../../services/api';
import {message,Modal} from 'antd';

// 初始状态：本地缓存或空值对象
const isLogined = !localStorage.getItem('token');

export default {
	namespace: 'user',
	state: {
		isLogined:!isLogined,
		isShowGoogleAuthDialog:false,
		// smsData:{},
		smsCode:'',
		smsId:'',
		userDataList:[],
		permissionList:[],
		userType:2
	},
	effects: {
		*svgcode({ payload }, { call, put }) {
			const res = yield call(svgcode, payload);
			if(res.code==10000){
				yield put({ type: "updateState", payload: res.data });
			}
		},
		*login({ payload }, { call, put }) {
			const res = yield call(Login, payload);
			if(res.code==10000){
				let data = res.data;
				localStorage.setItem("userinfo", JSON.stringify({email:payload.email}))
				localStorage.setItem("token", data.token);
				if(data.permission){
					let permissionList = data.permission.map(ele=>{
						return ele.url;
					})
					localStorage.setItem("permissionList", JSON.stringify(permissionList));
				}
				
				localStorage.setItem("nickname", data.nickname);
				localStorage.setItem("userType", data.userType);
				message.success('登录成功');
				setTimeout(function(){
					router.push('/crm/dashboard');
				},1000)
			}
		},
		*userLogout({ payload }, { call, put }) {
			const res = yield call(UserLogout);
			console.log(res);
			yield put({ type: "init", payload });
		},
		*userList({ payload }, { call, put }) {
			const {code,list} = yield call(List, payload);
			if(code==10000){
				yield put({ type: "userListFunc", payload: list });
			}
		},
		*addUser({ payload }, { call, put }) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const res = yield call(AddUser, payload);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(res.code==10000){
				message.success('添加成功');
				router.push('/crm/user');
			}
		},
		*updatesvgcode({ id }, { call, put }) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const res = yield call(Updatesvgcode, id);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(res.code==10000){
				yield put({ type: "updateState", payload: res.data });
			}
		},
		*disUserRole({ payload,callback}, { call, put }) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const res = yield call(AddUserRole, payload);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(res.code==10000){
				callback();
				message.success('分配成功');
			}
		},
		*updatePassword({ payload}, { call, put }) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const res = yield call(UpdatePassword, payload);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(res.code==10000){
				message.success('修改成功');
			}
		}
	},
	reducers: {
		init(state, action) {
			console.log(action);
			return action.payload
		},
		showGoogleAuthDialog(state, action){
			const {isShowGoogleAuthDialog} = action.payload;
			console.log(action)
			return {...state,isShowGoogleAuthDialog};
		},
		updateState(state,action){
			let payload = action.payload;
			let smsCode = payload.img;
			let smsId = payload.id;
			if(smsId){
				return {...state,smsCode,smsId};
			}else{
				return {...state,smsCode};
			}
			
		},
		userListFunc(state,action){
			let userDataList = action.payload;
			return {...state,userDataList};
		},
		userSyncListFunc(state,action){
			let userDataList = action.payload;
			console.log(userDataList)
			return {...state,userDataList};
		}
	}
};