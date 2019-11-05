import axios from 'axios';
import router from 'umi/router';
import {message} from 'antd';

function listApi(isFirst) {
	return axios.post('/api/voucher/list',{isFirst})
}

function searchQuery(query) {
	return axios.post('/api/voucher/searchQuery',query)
}

function initData(id) {
	return axios.post('/api/voucher/initData',{id})
}

function queryNumberByWordId(wordId) {
	return axios.post('/api/voucher/queryNumberByWordId',{wordId})
}

function cityList(tagId) {
	return axios.post('/api/ssjl/queryCity',{pid:tagId})
}

function countyList(tagId) {
	return axios.post('/api/ssjl/queryCounty',{pid:tagId})
}


function addVoucher(payload) {
	return axios.post('/api/voucher/add',payload)
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
	namespace: 'voucher',
	state: {
		wordList:[],
		voucherList:[],
		number:0,
		count:0,
		periodsList:[],
		defaultPeriod:0,
		wordsList:[],
		defaultWord:0,
		userList:[]
	},
	effects: {
		* list({isFirst}, {
			call,
			put
		}) {
			const {code,list,count,periods,words,users} = yield call(listApi,isFirst)
			if(code==10000){
				yield put({type:'initListData',payload:{list,count,periods,words,users,isFirst}});
			}
		},
		* searchQuery({query}, {
			call,
			put
		}) {
			const {code,list,count} = yield call(searchQuery,query)
			if(code==10000){
				yield put({type:'initListData',payload:{list,count}});
			}
		},
		* initData({}, {
			call,
			put,
			select
		}) {
			const {code,wordList,number} = yield call(initData)
			if(code == 10000){
				yield put({type:'initVoucherData',payload:{wordList,number}});
			}
		},
		* queryNumberByWordId({wordId}, {
			call,
			put
		}) {
			yield put({type:'crm/effectSetLoading',isLoading:true});
			const {code,number} = yield call(queryNumberByWordId,wordId)
			yield put({type:'crm/effectSetLoading',isLoading:false});
			if(code == 10000){
				yield put({type:'initNumberData',payload:{number}});
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
		* addVoucher({payload,isToList}, {
			call,
			put
		}) {
			const data = yield call(addVoucher,payload)
			if(data.code == 10000){
				message.success('添加成功');
				if(isToList){
					router.push('/crm/voucher/list');
				}else{
					yield put({type:'initAddNumberData'});
				}
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
		initListData(state,action){
			let {list:voucherList,count,periods:periodsList,isFirst,words:wordsList,users:userList} = action.payload;
			if(isFirst){
				let defaultPeriod = 0;
				if(periodsList && periodsList.length>0){
					defaultPeriod = periodsList[0].id
				}
				let defaultWord = 0;
				if(wordsList && wordsList.length > 0){
					wordsList.forEach(item=>{
						if(item.isDefault == 1){
							defaultWord = item.id
						}
					})
				}
				
				return {...state,voucherList,count,periodsList,defaultPeriod,wordsList,defaultWord,userList};
			}else{
				return {...state,voucherList,count};
			}
			
		},
		changeListData(state,action){
			let voucherList = action.voucherList;
			// console.log(action.payload)
			return {...state,voucherList};
		},
		initVoucherData(state,action){
			let {wordList,number} = action.payload;
			number++;
			return {...state,wordList,number};
		},
		initNumberData(state,action){
			let {number} = action.payload;
			number++;
			return {...state,number};
		},
		initAddNumberData(state){
			console.log(state);
			let number = state.number;
			number++;
			console.log(number)
			return {...state,number};
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