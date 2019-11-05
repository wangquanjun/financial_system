import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function getQRImg() {
	return axios.post('me_setauth_1')
}

function finishBindQR(payload) {
	return axios.post('me_setauth_2',payload)
}

function finishDisQR(googlecode) {
	return axios.post('me_removeauth',{googlecode})
}
export default {
	namespace: 'googleauth',
	state: {
		
	},
	effects: {
		* getQRImg({}, {
			call,
			put
		}) {
			const {error,data} = yield call(getQRImg)
			if(!error){
				yield put({type:'initData',payload:{code:data.key,pic:data.pic}});
			}
		},
		* finishBindQR({payload}, {
			call,
			put
		}) {
			const {error,data} = yield call(finishBindQR,payload)
			if(!error){
				// yield put({type:'updateStatus',payload:{isGoogleAuth:true}});
				localStorage.setItem('isNeedGoogleAuth',1);
				router.push('/account/center');
			}
		},
		* finishDisQR({googlecode}, {
			call,
			put
		}) {
			const {error,data} = yield call(finishDisQR,googlecode)
			if(!error){
				// yield put({type:'updateStatus',payload:{isGoogleAuth:true}});
				// const userinfo = JSON.parse(localStorage.getItem('userinfo'));
				// userinfo.isGoogleAuth = true;
				// localStorage.setItem('userinfo',JSON.stringify(userinfo));
				message.success('解绑成功');
				localStorage.setItem('isNeedGoogleAuth',0);
				router.push('/account/center')
			}
		},
		* getCode({payload,callback},{call,put}){
			console.log(payload)
			const res = yield call(getCode,payload);
			// yield put({ type: 'add' });
			callback(res)
		}
	},
	reducers: {
		initData(state,action){
			const {code,pic} = action.payload;
			return {...state,code,pic};
		}
		// ,
		// updateStatus(state,action){
		// 	const {isGoogleAuth} = action.payload;
		// 	return {...state,isGoogleAuth}
		// }
	}
}