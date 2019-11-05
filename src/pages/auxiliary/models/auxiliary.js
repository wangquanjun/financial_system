import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function listApi(type) {
	return axios.post('/api/auxiliary/list',{type})
}

function listTypesApi(types) {
	return axios.post('/api/auxiliary/queryListByTypes',{types})
}

function add(values) {
	return axios.post('/api/auxiliary/add',values)
}

function update(values) {
	return axios.post('/api/auxiliary/update',values)
}

function updateStatus(values) {
	return axios.post('/api/auxiliary/updateStatus',values)
}

function deleteById(id) {
	return axios.post('/api/auxiliary/delete',{id})
}

export default {
	namespace: 'auxiliary',
	state: {
		listData:[],
		listDataTypes:[],
		count:0
	},
	effects: {
		* list({au_type}, {
			call,
			put
		}) {
			console.log(au_type)
			const {error,list,count} = yield call(listApi,au_type)
			if(!error){
				yield put({type:'initData',payload:{list,count}});
			}
		},
		* listTypesApi({au_types}, {
			call,
			put
		}) {
			console.log(au_types)
			const {error,list} = yield call(listTypesApi,au_types)
			if(!error){
				yield put({type:'initDataTypes',payload:{list}});
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
				payload.status = 1;
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
			console.log(listData)
			console.log(count)
			return {...state,listData,count};
		},
		initDataTypes(state,action){
			let {list} = action.payload;
			let listDataTypes = [];
			let obj = {};
			list.forEach(item=>{
				if(obj['type'+item.type]){
					obj['type'+item.type].list.push(item);
				}else{
					obj['type'+item.type] = {
						type:item.type,
						list:[item],
						default:item.id
					}
				}
			})
			for(let key in obj){
				listDataTypes.push(obj[key])
			}
			console.log(listDataTypes);
			return {...state,listDataTypes};
		},
		addReducers(state,action){
			state.listData.unshift(action.payload);
			let count = state.count++;
			let listData = [...state.listData];
			return {...state,listData,count};
		},
		deleteReducers(state,action){
			console.log(action)
			state.listData.splice(action.index,1)
			let count = state.count--;
			let listData = [...state.listData];
			return {...state,listData,count};
		},
		updateReducers(state,action){
			let {id,code,name,specs,unit} = action.payload;
			state.listData.forEach(item => {
				if(item.id == id){
					item.code = code;
					item.name = name;
					item.specs = specs;
					item.unit = unit;
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