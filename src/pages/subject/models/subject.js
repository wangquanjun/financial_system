import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function listApi(type) {
	return axios.post('/api/subject/list',{type})
}

function add(values) {
	return axios.post('/api/subject/add',values)
}

function update(values) {
	return axios.post('/api/subject/update',values)
}
function updateStatus(values) {
	return axios.post('/api/subject/updateStatus',values)
}
function deleteById(id) {
	return axios.post('/api/subject/delete',{id})
}

function newLoop(list,parent_id){
	let newList=[];
	list.forEach(item=>{
		if(item.parent_id == parent_id){
			item.children = newLoop(list,item.id);
			newList.push(item);
		}
	})
	return newList;
}

export default {
	namespace: 'subject',
	state: {
		listData:[],
		count:0
	},
	effects: {
		* list({au_type,callback}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {error,list,count} = yield call(listApi,au_type)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(!error){
				if(callback){
					callback(list)
				}else{
					yield put({type:'initData',payload:{list,count}});
				}
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
			listData = newLoop(listData,0);
			return {...state,listData,count};
		},
		addReducers(state,action){
			let item = action.payload;
			item.status = 1;
			item.auxiliaryTypes = item.auxiliaryList;
			state.listData.unshift(action.payload);
			let count = state.count++;
			state.listData = newLoop(state.listData,0);
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
			console.log(action.payload)
			let {id,code,name,category,direction,auxiliaryList,number_unit} = action.payload;
			state.listData.forEach(item => {
				if(item.id == id){
					item.code = code;
					item.name = name;
					item.category = category;
					item.direction = direction;
					item.auxiliaryTypes = auxiliaryList;
					item.number_unit = number_unit;
				}
			});
			let listData = [...state.listData];
			return {...state,listData};
		},
		updateStatusReducers(state,action){
			let {id,status} = action.payload;
			state.listData.forEach(item => {
				if(item.id == id){
					item.status = status;
				}
			});
			let listData = [...state.listData];
			return {...state,listData};
		}
	}
}