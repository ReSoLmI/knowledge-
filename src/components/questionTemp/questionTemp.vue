<template>
  <div>
    <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3">
      {{node.currNode|showNodeName}}
    </div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList">
        <div class="am-input-unit">
          <input type="text" v-if="!item.style||item.style.height == 1" class="input-text" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':item.style.width}">
          <textarea rows="4" v-if="item.style&&item.style.height == 2" class="input-text input-textarea" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style.maxLength||100" :style="{'padding-right':0,'width':item.style.width}">
          </textarea>
          <i v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
        </div>
        <template v-if="item.unitList.length>1">
          <div class="am-btn-rdo am-ml-10" v-if="showUnit">
            <a v-for="(it,index) in item.unitList" v-bind:class="{active:isUnitCodeSel(node.currNode,item,it.unitCode)}" @click="checkRadioUnit(node,item,it)">{{it.unitName}}</a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import bus from "@/bus.js"
export default {
    name: 'HelloWorld',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue', 'mode'],
    data() {
        return {
            isShowPop: this.node.currNode.paperTemplateId == 'WARD_CODE'
        }
    },
    mounted: function() {
        if (!this.saveValue[this.node.currNode.uniqueId]) {
            this.setInitData();
        }
    },
    computed: {
        ...mapState([
            'patient'
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
        setInitData: function() {
            let value;
            let currNode = $.extend(true, {}, this.node.currNode);
            if (currNode.paperTemplateId === 'ORGAN_CODE') {
                // this.tree.$emit('seleteInput', {
                //     'node': this.node,
                //     'item':this.node.currNode,
                //     'value': this.patient.hospitalName,
                // });
                value = 1 //getLocalStorage('_userHospName_');//this.patient.hospitalName;
                currNode.catalogueCode = 2 //getLocalStorage('_userHospId_');
            } else if (currNode.paperTemplateId === 'WARD_CODE') {
                value = 3 //getLocalStorage('_userUnitName_');;
                currNode.catalogueCode = 4 //getLocalStorage('_userUnitCode_');;
            } else if (currNode.paperTemplateId === 'USER_PATIENT') {
                if (currNode.childTemplateId === 'BED_NO') {
                    value = this.patient.bedNo;
                } else if (currNode.childTemplateId === 'MRN') {
                    value = this.patient.mrn;
                } else if (currNode.childTemplateId === 'PAT_INDEX_NO') {
                    value = this.patient.sysCode;
                } else if (currNode.childTemplateId === 'PATIENT_NAME') {
                    value = this.patient.name;
                }
            }

            this.tree.$emit('seleteInput', {
                'node': this.node,
                'item': currNode,
                'value': value
            });
        },
        showPop: function() {
            if (this.isShowPop) {
                this.tree.$emit('showHospitalPop', {
                    type: this.node.currNode.paperTemplateId === 'ORGAN_CODE' ? 'hospital' : 'department',
                    isShow: true,
                    currentData: this.isOptionSelected(this.node.currNode, this.node.currNode.uniqueId).optionCode,
                    node: this.node
                })
            }
        },
        checkInputUnit(node, event) { ////
            this.tree.$emit('seleteInput', {
                'node': node,
                'item': node.currNode,
                'value': event.currentTarget.value,
            });
        },
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
