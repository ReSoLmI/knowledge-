<template>
  <div class="lv-inline">
    <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3" :style="{'width':nodeWidth(node.currNode.style.width)+'px'}">
      {{node.currNode|showNodeName}}
    </div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList" v-if="node.currNode.childTemplateId == 'INCIDENT'">
        <div class="am-input-unit">
          <input type="text" v-if="!item.style||item.style.height != 2" class="input-text" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style&&item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" disabled="disabled">
        </div>
      </div>
      <div class="am-ctr-sel am-mt-10 lv-item" :class="{'open':isComboOpen}" @click.stop="showComboOpen" @mouseleave="isComboOpen=false" v-if="node.currNode.childTemplateId != 'INCIDENT'" :style="{'width':(node.currNode.optionList.length>0&&node.currNode.optionList[0].style.width)+'px','margin-left':(node.currNode.optionList[0].style.margin || 0) + 'px'}">
        <div class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" :class="{disabled:!isUnitAble}">
          <!--选择问题-->
          <div class="caption-span-list" style="text-overflow: ellipsis;overflow: hidden;">
            {{getValue}}
          </div>
        </div>
        <!--<a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">选择问题</a>-->
        <div class="am-dropdown am-mr-10">
          <ul class="select2-option-list">
            <li v-for="(item,index_) in selectList" @click.stop="checkValue(item)" :class="{active:isKeySelected(node.currNode,item.key)}"><a> {{item.value}}</a></li>
            <!-- <li>
              <div class="am-ctr-native-chk am-ml-10 active"><span>全选</span></div>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import bus from "@/bus.js"
import { calculateAge, getUrlParam, ajaxAsync, getOrganCode } from '@/util/common_b';
import { Select, Option } from 'element-ui';
Vue.use(Select);
Vue.use(Option);
export default {
    name: 'consulation',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue', 'mode'],
    data() {
        return {
            wardCode: getUrlParam('wardCode'),
            isComboOpen: false, //下拉提是否打开
            selectedVal: [],
            selectList: [],
        }
    },
    mounted: async function() {
        this.setInitData();
        return;


        if (this.mode == 'add' && !this.isTreeDisabled) {
            this.setInitData();
        } else if (this.mode == 'edit' && !this.isTreeDisabled && (this.node.currNode.childTemplateId == 'CONSULTATION_WRDCODE' || this.node.currNode.childTemplateId == 'WARDCODE')) {
            await this.initWardCode();
            this.$nextTick(() => {
                //debugger;
                let sl = this.selectList.find(sl => {
                    return this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].find(sv => {
                        return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
                    }).optionKey == sl.key;
                })
                this.SET_WARDCODE(sl);
            })

        }
    },
    computed: {
        ...mapState([
            'patient', 'user', 'wardCode_apply', 'userfulWidth', 'assessmentStatus'
        ]),
        isUnitAble() {
            return (this.mode == 'add' || this.assessmentStatus == 'CONSULTATION_APPLY') && !this.isTreeDisabled
        },
        getValue: function() {
            let selectV = this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].filter(sv => {
                return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
            })
            if (this.selectList.length == 0 && this.mode == 'add') {
                return "请选择";
            }
            if (selectV) {
                // if(this.node.currNode.childTemplateId == 'WARDCODE'){
                //     let sel = selectV[0];
                //     this.SET_WARDCODE({ key: sel.optionKey, value: sel.optionContent});
                // }
                let res = selectV.reduce((pre, cur, index) => {
                    // let curItem = this.selectList.find(op => {
                    //     return op.key == cur.optionKey;
                    // });
                    return pre + (index ? '/' : '') + (cur.optionContent ? cur.optionContent : '');
                }, '')
                return res || '请选择';
            } else {
                return "请选择"
            }
        },
        isDisabled: function() {
            return this.node.currNode.childTemplateId === 'PAT_INDEX_NO' || this.node.currNode.paperTemplateId === 'ORGAN_CODE'
        }
    },
    methods: {
        ...mapActions([
            // 'SET_WARDCODE'
        ]),
        ...mapMutations([
            'SET_WARDCODE'
        ]),
        setInitData: async function() {
            let childTemplateId = this.node.currNode.childTemplateId;
            if (childTemplateId == 'INCIDENT' && this.mode == 'add' && !this.isTreeDisabled) {
                this.initIncident();
            } else if (childTemplateId == 'WARDCODE' && this.isUnitAble) {
                await this.initWardCode();
                this.$nextTick(() => {
                    let sl = this.selectList.find(sl => {
                        return this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].find(sv => {
                            return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
                        }).optionKey == sl.key;
                    })
                    if(sl){
                        this.SET_WARDCODE(sl);
                    }
                })
            }
        },
        /*初始化会诊事件*/
        initIncident: async function() {
            let value = await ajaxAsync({
                url: 'knowledge-service/new/incident',
                type: 'get',
                dataType: 'text',
                data: { evaluationType: getUrlParam('evaluationType') }
            });
            this.tree.$emit('seleteInput', {
                'node': this.node,
                'item': this.node.currNode.optionList[0],
                'value': value
            });
        },
        /*初始化科室*/
        initWardCode: async function() {
            this.SET_WARDCODE(undefined);
            let units = await ajaxAsync({
                url: "sys-service/sys/v1/units/withVirtual",
                dataType: "json",
                data: { organCode: getOrganCode() },
                type: "get"
            });
            let allUnits = [];
            Object.values(units).forEach(unit => {
                allUnits = allUnits.concat(unit);
            })

            this.selectList = allUnits.map(unit => {
                return { key: unit.wardCode, value: unit.wardName, isVirtual: unit.virtual }
            })
        },
        /*初始化会诊人*/
        initUser: async function(oldUnit) {
            if (!this.wardCode_apply) {
                return;
            }
            let saveValue = $.extend(true, [], this.saveValue[this.node.currNode.uniqueId]);
            saveValue && saveValue.forEach(sv => {
                console.log(666, sv);
                if (sv.isShow && oldUnit) {
                    this.checkCheckBox({
                        key: sv.optionKey,
                        value: sv.optionContent,
                    });
                }
            })

            let user = await ajaxAsync({
                url: "sys-service/sys/v1/unit/member/list",
                dataType: "json",
                data: { organCode: getOrganCode(), code: this.wardCode_apply.key, isVirtual: this.wardCode_apply.isVirtual },
                type: "get"
            });
            this.selectList = user.map(us => {
                return { key: us.loginName, value: us.staffName }
            })
        },
        showNodeNames: function(currNode) {
            if (!currNode) {
                return "";
            }
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else {
                return currNode.catalogueName;;
            }
        },
        checkValue(item) {
            let childTemplateId = this.node.currNode.childTemplateId;
            if (childTemplateId == 'WARDCODE') {
                this.checkRadio(item);
                this.SET_WARDCODE(item);
            } else if (childTemplateId == 'DOCTOR') {
                this.checkCheckBox(item);
            }
        },

        // 单选选中
        checkRadio(item) {
            this.isComboOpen = false;
            this.tree.$emit('seleteRadio', {
                node: this.node,
                item: {
                    optionKey: item.key,
                    optionContent: item.value,
                    selfPropagationId: this.node.currNode.selfPropagationId
                }
            });
        },
        // 多选选中
        checkCheckBox(item) {
            this.tree.$emit('seleteCheckBox', {
                item: {
                    optionKey: item.key,
                    optionContent: item.value,
                    selfPropagationId: this.node.currNode.selfPropagationId
                },
                node: this.node
            });
        },
        /*显示下拉框*/
        showComboOpen: function() {
            if (this.isUnitAble) {
                this.isComboOpen = true;
            }
        },
        isKeySelected: function(currNode, key) {
            if (!this.saveValue[currNode.uniqueId]) {
                return false;
            }
            let that = this;
            return this.saveValue[currNode.uniqueId].find(sv => {
                return sv.isShow && sv.optionKey == key && sv.selfPropagationId == currNode.selfPropagationId;
            })
        },
    },
    watch: {
        wardCode_apply: function(val, oldUnit) {
            let that = this;
            if (this.node.currNode.childTemplateId == 'DOCTOR' && this.isUnitAble) {
                this.initUser(oldUnit);
            }
        }
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.lv-inline: {
  font-size: 14px;
}

</style>
