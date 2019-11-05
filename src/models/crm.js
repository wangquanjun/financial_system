export default {
	namespace: 'crm',
	state: {
		isLoading:false
	},
	effects: {
		* effectSetLoading({isLoading}, {
			call,
			put
		}) {
			console.log(isLoading)
			yield put({type:'updateLoading',isLoading});
		},
	},
	reducers: {
		updateLoading(state, {isLoading}){
			return {...state,isLoading};
		}
	}
};