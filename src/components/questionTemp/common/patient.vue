<template>
  <div class="lv-inline">
    <div class="lv-item lv-title ttt" v-if="node.currNode.aliasType != 3" :style="{'width':nodeWidth(node.currNode.style.width)+'px','margin-left':'5px'}">{{node.currNode|showNodeName}}<span v-if="showPrintCode" style="color:red" :title="node.currNode.uniqueId">{{node.currNode.uniqueId}}</span>
    </div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList">
        <template>
          <template v-if="node.currNode.questionType!=10">
            <div class="am-input-unit">
              <template v-if="item.implantStyle != 1">
                <input type="text" v-if="!item.style||item.style.height != 2" class="input-text" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style&&item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px','min-width':'220px'}" disabled='disabled'>
                <textarea rows="4" v-if="item.style&&item.style.height == 2" class="input-text input-textarea" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style&&item.style.maxLength||100" :style="{'padding-right':0,'width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px',}" :disabled="isTreeDisabled">
                </textarea>
              </template>
              <template v-if="item.implantStyle == 1">
                <span :style="{'margin-left':(item.style.margin || 0) + 'px','width':(item.style&&item.style.width || 220)+'px','text-decoration':'underline'}">{{getValueById(item,node)}}</span>
              </template>
              <i v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
            </div>
            <template v-if="item.unitList.length>1">
              <div class="am-btn-rdo am-ml-10" v-if="showUnit">
                <a v-for="(it,index) in item.unitList" v-bind:class="{active:isUnitCodeSel(node.currNode,item,it.unitCode)}" @click="checkRadioUnit(node,item,it)">{{it.unitName}}</a>
              </div>
            </template>
          </template>
          <template v-if="node.currNode.questionType==10">
            <div @click="checkRadio(item)" :style="{'width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px',}">
              <div class="am-ctr-native-rdo" :class="{active:isIdSelected(node.currNode,item.optionId),disabled:isTreeDisabled}">
                <span> {{item|showNodeName}}</span>
              </div>
            </div>
          </template>
          <span v-if="showPrintCode" :title="item.optionId">{{item.optionId}}</span>
        </template>
        <!-- 查看 -->
        <!-- <template v-if="mode=='pageShow'">
          <span :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':nodeWidth(item.style.width)+'px'}">{{getValueById(item,node)}}</span>
        </template> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import bus from "@/bus.js"
import { calculateAge, ajaxAsync,getUrlParam } from '@/util/common_b';
import { DIAGTYPE } from '@/util/config';

export default {
    name: 'patient',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue', 'mode'],
    data() {
        return {}
    },
    mounted: function() {
        if (!this.saveValue[this.node.currNode.uniqueId] && !(this.mode == 'add' && this.isTreeDisabled)) {
            if (this.node.currNode.questionType != 10) {
                this.setInitData();
            } else {
                this.setInitRadio();
            }
        }
    },
    computed: {
        ...mapState([
            'patient', 'userfulWidth', 'showPrintCode'
        ]),
        /*获取单选、多选的扩展文本框内容*/
        getValue: function() {
            let node = this.node;
            let uniqueId = node.currNode.uniqueId;
            let svl = this.saveValue[uniqueId] && this.saveValue[uniqueId].find(sv => {
                return sv.isShow && sv.selfPropagationId == node.currNode.selfPropagationId;
            })
            if (svl) {
                return svl.optionContent;
            } else {
                if (node.currNode.questionType == 90) {
                    return new Date().format(item.timeFormat);
                } else {
                    return "";
                }
            }
        },
        isDisabled: function() {
            return this.node.currNode.childTemplateId === 'PAT_INDEX_NO' || this.node.currNode.paperTemplateId === 'ORGAN_CODE'
        }
    },
    methods: {
        /*初始化填空题值*/
        setInitData: async function() {
            let value;
            let currNode = this.node.currNode;
            let map = {
                BED_NO: 'bedNo',
                MRN: 'mrn',
                PAT_INDEX_NO: 'patIndexNo',
                PATIENT_NAME: 'name',
                SEX: 'physiSexName',
                //DIAGNOSE: 'diagnosisName',
                WARD_CODE: 'wardName',
                DEPT_CODE: 'deptName',
                ADMISSTION_TIME: 'admissionTime',
                BIRTHYDAY: 'birthDate',
                VISIT_CARD_NO: 'visitCardNo',
                EMC_PATIENT_NAME: 'patientName',
                EMC_DIAGNOSE: 'diagnosis',
                DOCTOR_RECEPTION_TIME: 'receptTreatDrTime'
            }
            if (currNode.childTemplateId === 'AGE') {
                let age = calculateAge(this.patient.ageHis);
                if (age.noAgeHis) {
                    value = this.patient.age;
                } else {
                    value = age.age;
                }

            } else if (currNode.childTemplateId === 'NURSING_CLASS') {
                value = this.calculateNursingClass(this.patient.nursingClass);
            } else if (currNode.childTemplateId === 'NURSING_CLASS') {
                value = this.patient[map[currNode.childTemplateId]] || new Date().format('yyyy-MM-dd hh:mm:ss');
            } /*else if (currNode.childTemplateId === 'DIAGNOSE') {
                value = await this.getDiagnosis();
            } */else {
                value = this.patient[map[currNode.childTemplateId]] || '';
            }
            this.tree.$emit('seleteInput', {
                'node': this.node,
                'item': currNode.optionList[0],
                'value': value
            });
        },
        /*获取入院诊断信息*/
        getDiagnosis: async function() {
            let resultsArr =  await ajaxAsync({
                url: "baseinfo2.0/inhospdiagnosis/inhospdiagnosis",
                dataType: "json",
                type: "get",
                data: {
                    diagTypeCodeList: DIAGTYPE.AD,
                    organCode: getUrlParam("organCode"),
                    patIndexNo:this.patient.patIndexNo
                }
            });
            let result = "";
            resultsArr&&resultsArr.forEach((res,index)=>{
                result += (index?',':'') + res.diagName
            })
            return result;
        },
        /*选项型默认值*/
        setInitRadio: function() {
            let currNode = this.node.currNode;
            let map = {
                ADMITION_WAY: 'admitWayCode',
                CLASSIFICATION: 'triageLevel'
            }
            let selOp = this.node.currNode.optionList.find(op => {
                return op.relateValue == this.patient[map[currNode.childTemplateId]]
            })
            if (selOp) {
                this.checkRadio(selOp);
            }
        },
        // 单选选中
        checkRadio(item) {
            if (this.isTreeDisabled) {
                return;
            }
            this.tree.$emit('seleteRadio', {
                node: this.node,
                item: item
            });
        },
        checkInputUnit(node, event) {
            this.tree.$emit('seleteInput', {
                'node': node,
                'item': node.currNode,
                'value': event.currentTarget.value,
            });
        },
        /*护理等级特殊处理*/
        calculateNursingClass: function(nursingClass) {
            let nursingInfo = '';
            if (nursingClass == 0) {
                nursingInfo = "特级护理";
            } else if (nursingClass == 1) {
                nursingInfo = "一级护理";
            } else if (nursingClass == 2) {
                nursingInfo = "二级护理";
            } else if (nursingClass == 3) {
                nursingInfo = "三级护理";
            }
            return nursingInfo;
        }
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
