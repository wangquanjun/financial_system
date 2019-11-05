import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function listApi(type) {
	return axios.post('/api/voucherWord/list',{type})
}

function add(values) {
	return axios.post('/api/voucherWord/add',values)
}

function update(values) {
	return axios.post('/api/voucherWord/update',values)
}

function deleteById(id) {
	return axios.post('/api/voucherWord/delete',{id})
}

export default {
	namespace: 'voucher_word',
	state: {
		listData:[],
		count:0
	},
	effects: {
		* list({}, {
			call,
			put
		}) {
			const {error,list,count} = yield call(listApi)
			if(!error){
				yield put({type:'initData',payload:{list,count}});
			}
		},
		* add({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code,id} = yield call(add,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				payload.id = id;
				yield put({type:'addReducers',payload});
				message.success('添加成功');
			}
		},
		* update({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(update,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				yield put({type:'updateReducers',payload});
				message.success('修改成功');
			}
		},
		* updateStatus({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(updateStatus,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				yield put({type:'updateStatusReducers',payload});
				message.success('修改成功');
			}
		},
		* deleteById({id,index}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(deleteById,id);
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				message.success('删除成功');
				yield put({type:'deleteReducers',index});
			}
		}
	},
	reducers: {
		initData(state,action){
			let {list:listData,count} = action.payload;
			return {...state,listData,count};
		},
		addReducers(state,action){
			let item = action.payload;
			if(item.isDefault == 1){
				state.listData.forEach(item=>{
					item.isDefault = 2;
				})
			}
			state.listData.unshift(action.payload);
			let count = state.count++;
			let listData = [...state.listData];
			return {...state,listData,count};
		},
		deleteReducers(state,action){
			state.listData.splice(action.index,1)
			let count = state.count--;
			let listData = [...state.listData];
			return {...state,listData,count};
		},
		updateReducers(state,action){
			let {id,title,print_title,isDefault} = action.payload;
			state.listData.forEach(item => {
				if(item.id == id){
					item.title = title;
					item.print_title = print_title;
					item.isDefault = isDefault;
				}else if(isDefault == 1){
					item.isDefault = 2;
				}
			});
			let listData = [...state.listData];
			return {...state,listData};
		}
	}
}