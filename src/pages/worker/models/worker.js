import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function workerList() {
	return axios.post('/api/worker/listWorker')
}

function queryDetailById(id) {
	return axios.post('/api/worker/queryDetailById',{id})
}

function cityList(tagId) {
	return axios.post('/api/ssjl/queryCity',{pid:tagId})
}

function countyList(tagId) {
	return axios.post('/api/ssjl/queryCounty',{pid:tagId})
}


function addWorker(payload) {
	return axios.post('/api/worker/add',payload)
}

function uploadFile(payload) {
	return axios.post('/api/upload/file',payload)
}

function listMajor() {
	return axios.post('/api/worker/listMajor')
}

function updateWorker(values) {
	return axios.post('/api/worker/updateById',values)
}
function deleteById(id) {
	return axios.post('/api/worker/delete',{id})
}

export default {
	namespace: 'worker',
	state: {
		provinceList:[],
		cityList:[],
		countyList:[],
		cityDefaultValue:'',
		countyDefaultValue:'',
		listMajorData:[],
		workerList:[],
		workerCount:0,
		majorList:[],
		workerDetail:{}
	},
	effects: {
		* workerListFunc({}, {
			call,
			put,
			select
		}) {
			const {code,list,count,majorList} = yield call(workerList)
			if(code == 10000){
				yield put({type:'initWorkerList',payload:{list,count,majorList}});
			}
		},
		* queryDetailById({workerId}, {
			call,
			put
		}) {
			const {code,majorList,provinceList,workerDetail} = yield call(queryDetailById,workerId)
			if(code == 10000){
				// const {code,list} = yield call(cityList,workerDetail.province_id)
				if(workerDetail.province_id){
					yield put({type:'cityListFunc',tagId:workerDetail.province_id,city_id:workerDetail.city_id});
				}
				yield put({type:'initDetail',payload:{majorList,provinceList,workerDetail}});
			}
		},
		* cityListFunc({tagId,city_id}, {
			call,
			put
		}) {
			console.log(tagId,city_id)
			const {code,list} = yield call(cityList,tagId)
			if(code == 10000){
				yield put({type:'initCityList',payload:list});

				const data = yield call(countyList,city_id || list[0].tag)
				if(data.code == 10000){
					yield put({type:'initCountyList',payload:data.list});
				}
			}
		},
		* countyListFunc({tagId}, {
			call,
			put
		}) {
			const data = yield call(countyList,tagId)
			if(data.code == 10000){
				yield put({type:'initCountyList',payload:data.list});
			}
		},
		* addWorker({payload}, {
			call,
			put
		}) {
			const data = yield call(addWorker,payload)
			if(data.code == 10000){
				message.success('添加成功');
				router.push('/crm/worker');
			}
		},
		* listMajorFunc({}, {
			call,
			put
		}) {
			const {code,list} = yield call(listMajor)
			if(code == 10000){
				yield put({type:'initListMajor',payload:list});
			}
		},
		* updateWorker({payload}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code} = yield call(updateWorker,payload)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				message.success('修改成功');
				router.push('/crm/worker');
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
				yield put({type:'initDeleteData',deleteIndex:index});
				message.success('删除成功');
			}
		}
	},
	reducers: {
		initWorkerList(state,action){
			let {list:workerList,count:workerCount,majorList} = action.payload;
			return {...state,workerList,workerCount,majorList};
		},
		initDetail(state,action){
			let {provinceList,majorList:listMajorData,workerDetail} = action.payload;
			workerDetail.culture = workerDetail.culture+"";
			workerDetail.province_id = workerDetail.province_id+"";
			workerDetail.city_id = workerDetail.city_id+"";
			workerDetail.county_id = workerDetail.county_id+"";
			return {...state,provinceList,listMajorData,workerDetail};
		},
		initCityList(state,action){
			let cityList = action.payload;
			let cityDefaultValue = cityList[0].tag;
			return {...state,cityList,cityDefaultValue};
		},
		initCountyList(state,action){
			let countyList = action.payload;
			let countyDefaultValue = countyList[0].tag;
			return {...state,countyList,countyDefaultValue};
		},
		updateWorkerList(state,action){
			let workerList = action.list;
			return {...state,workerList};
		},
		initDeleteData(state,action){
			state.workerList.splice(action.deleteIndex,1);
			let workerList = [...state.workerList]
			return {...state,workerList}
		}
	}
}