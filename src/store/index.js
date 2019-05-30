import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
    patient:{},
    user:{},
    paperStyle:{},
    wardCode_apply:'',//申请科室
    userfulWidth:'',
    assessmentStatus:'',

    logicInterFrom: 'createAssesmentContent'
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})