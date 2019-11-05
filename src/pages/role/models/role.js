import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function roleList() {
	return axios.post('/api/role/list')
}

function permissionMenuList() {
	return axios.post('/api/permission/listMenu')
}

function addRole(values) {
	return axios.post('/api/role/add',values)
}

function updateRole(values) {
	return axios.post('/api/role/updateById',values)
}

function queryById(id) {
	return axios.post('/api/role/queryById',{id})
}

function deleteById(id) {
	return axios.post('/api/role/delete',{id})
}

export default {
	namespace: 'role',
	state: {
		roleList:[],
		permissionMenuDataList:[]
	},
	effects: {
		* roleList({}, {
			call,
			put
		}) {
			const {error,list} = yield call(roleList)
			if(!error){
				yield put({type:'initData',payload:list});
			}
		},
		* permissionMenuList({callback}, {
			call,
			put
		}) {
			const {code,list} = yield call(permissionMenuList)
			if(code == 10000){
				callback(list)
			}
		},
		* addRole({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(addRole,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				message.success('添加成功');
				router.push('/crm/role');
			}
		},
		* updateRole({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(updateRole,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				message.success('修改成功');
				router.push('/crm/role');
			}
		},
		* queryById({id,callback}, {
			call,
			put
		}) {
			console.log(id)
			const {code,data} = yield call(queryById,id)
			if(code == 10000){
				callback(data)
			}else{
				callback({},"err")
			}
		},
		* deleteById({id,callback}, {
			call,
			put
		}) {
			console.log(id)
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code,data} = yield call(deleteById,id);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				message.success('删除成功');
				callback();
			}
		}
	},
	reducers: {
		initData(state,action){
			let roleList = action.payload;
			console.log(roleList)
			return {...state,roleList};
		},
		initMenuData(state,action){
			console.log(action)
			let permissionMenuDataList = action.payload;
			return {...state,permissionMenuDataList};
		},
		updateRoleList(state,action){
			let roleList = action.list;
			return {...state,roleList};
		}
	}
}