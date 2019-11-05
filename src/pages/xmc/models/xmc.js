// 首先安装axios
import { paperList,delPaper} from '../../../services/api';
import router from "umi/router";
import { message } from 'antd';

export default {
  namespace: "xmc", // model的命名空间，区分多个model
 state: {
    list:[]
  },
  effects: {
    // 异步操作
    *getList(action,{ call, put }) {
        // const { code, testList } = yield call(paperList);
        const payload = yield call(paperList);
        yield put({ type: "initList", payload });
    
    },

  },
  reducers: {
    // 更新状态
     initList(state, {payload}) { 
      state.list = payload.testList;
      return {...state}
    },
  }
};
