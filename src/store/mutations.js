import {
  GET_PATIENTINFO,
  SET_PAPERSTYLE,
  SET_USERINFO,
  SET_WARDCODE,
  SET_USERFULWIDTH,
  SET_ASSESSMENTSTATUS,
  SET_LOGICINTER,
} from './mutation_types.js'



export default {

  //获取用户信息存入vuex
  [GET_PATIENTINFO](state, info) {
    if (info && info.length > 0) {
      state.patient = info[0];
    } else {
      state.patient = null;
    }
  },

  //设置全局样式
  [SET_PAPERSTYLE](state, info) {
    state.paperStyle = info;
  },

  //设置用户信息
  [SET_USERINFO](state, info) {
    state.user = info;
  },

    //设置科室
  [SET_WARDCODE](state, info) {
    state.wardCode_apply = info;
  },
  
  /*设置屏幕有效宽度*/
  [SET_USERFULWIDTH](state, info) {
    state.userfulWidth = info;
  },

    /*设置屏幕有效宽度*/
  [SET_ASSESSMENTSTATUS](state, info) {
    state.assessmentStatus = info;
  },
  
  [SET_LOGICINTER](state, info) {
    state.logicInterFrom = info
  },

}
