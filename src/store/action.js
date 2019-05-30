import {
  GET_PATIENTINFO,
  SET_USERINFO
} from './mutation_types.js';
import common, { ajaxAsync } from '@/util/common';


export default {
  /*设置病人信息*/
  async getPatientInfo({
    commit,
    state
  }, obj) {
    let res = await ajaxAsync({
      url: "baseinfo2.0/inpatients/inpatients",
      dataType: "json",
      data: obj,
      type: "get"
    });
    if (res && res.length > 0) {
      commit(GET_PATIENTINFO, res);
    } else {
      common.openLayer("请先选择病人！");
    }
  },

   /*设置急诊病人信息*/
  async setEmcPatientInfo({
    commit,
    state
  }, obj) {
    let res = await ajaxAsync({
      url: "baseinfo2.0/emc/patinet",
      dataType: "json",
      data: obj,
      type: "get"
    });
    if (res && res.length > 0) {
      commit(GET_PATIENTINFO, res);
    } else {
      common.openLayer("请先选择病人！");
    }
  },

  /*设置用户信息*/
  async setUserInfo({
    commit,
    state
  }, obj) {
    let res = await ajaxAsync({
      url: "user-service/userdetail",
      dataType: "json",
      type: "get"
    });
    if (res) {
      commit(SET_USERINFO, res);
    } else {
      common.openLayer("获取用户信息出错！");
    }
  },


    /*设置病区信息*/
  async getUnitInfo({
    commit,
    state
  }, obj) {
    let res = await ajaxAsync({
      url: "sys-service/sys/v1/units/withVirtual",
      dataType: "json",
      data: obj,
      type: "get"
    });
    if (res) {
      commit(SET_USERINFO, res);
    } else {
      common.openLayer("获取单位信息出错！");
    }
  },
}
