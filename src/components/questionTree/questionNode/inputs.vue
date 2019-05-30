<!-- 单位填空30 -->
<template>
  <div class="lv-inline">
    <div class="lv-item" v-for="(item,index) in node.currNode.optionList" v-if="pageFrom!='tableDataShow'">
      <div class="am-input-unit">
        <input type="text" v-if="!item.style||item.style.height != 2" :class="[item.implantStyle==1?'input-text-bottom':'input-text']" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="getMaxLength(item)" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px','min-width':'155px'}" :disabled="isTreeDisabled" @click="openPop(node,item)" @keydown.stop="keydownEvent" :placeHolder='item.placeHolder||""'>
        <textarea rows="4" v-if="item.style&&item.style.height == 2" class="input-text input-textarea" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="getMaxLength(item)" :style="{'padding-right':0,'width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" :disabled="isTreeDisabled">
        </textarea>
        <i v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
      </div>
      <span v-if="showPrintCode">{{item.optionId}}</span>
      <template v-if="item.unitList.length>1">
        <div class="am-btn-rdo am-ml-10" v-if="showUnit">
          <a v-for="(it,index) in item.unitList" v-bind:class="{active:isUnitCodeSel(node.currNode,item,it.unitCode)}" @click="checkRadioUnit(node,item,it)">{{it.unitName}}</a>
        </div>
      </template>
      <div class="lv-inner" :class="[item.checkList&&(item.checkList.checkLevel==1||item.checkList.checkLevel===undefined)?'txt-danger':'txt-warn']" :ttt="node.currNode.uniqueId" v-if="hasSave&&!validInput(getValueById(item,node),item.checkList).result" :errorInfo="showNodeNames(node.currNode)+(item.checkList&&item.checkList.markedWords)||validInput(getValueById(item,node),item.checkList).tips">{{(item.checkList&&item.checkList.markedWords)||validInput(getValueById(item,node),item.checkList).tips}}</div>
      <span class="am-txt-link" v-if="index!=node.currNode.optionList.length-1">{{showLink()}}</span>
    </div>
  </div>
</template>
<script>
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import { mapState } from 'vuex'
export default {
    name: 'inputs',
    data() {
        return {
            showUnit: true,
            errorInfo: '输入项'
        }
    },
    mixins: [questionNodeMixin],
    computed: {
        ...mapState([
            'userfulWidth', 'showPrintCode'
        ])
    },
    methods: {
        checkInputUnit(item, node, event) { ////
            //this.changeInput(node.currNode, event);
            if (this.isTreeDisabled) {
                return;
            }
            //return;
            this.tree.$emit('seleteInput', {
                'node': node,
                'item': item,
                'value': event.currentTarget.value,
            });
        },
        // 填空宽度
        getWidthClass(width) {
            //width  宽度 0：默认 1：加宽 2：更窄
            if (width == 0) {
                return "normal";
            } else if (width == 1) {
                return "bigger";
            } else if (width == 2) {
                return "small";
            } else {
                return "";
            }
        },
        // 填空题单位
        checkRadioUnit(node, item, unitcode) {
            if (this.isUnitCodeSel(node.currNode, item, unitcode)) {
                return;
            }
            var that = this;
            that.showUnit = false;
            this.tree.$emit('seleteInput', {
                'node': node,
                'item': item,
                'unitCode': unitcode,
                'type': 'radio',
            });
            setTimeout(function() { that.showUnit = true; }, 0)
        },
        /*点击弹出*/
        openPop: function(node, item) {
            if (item.logicList.length > 0 && item.logicList.find(log => {
                    return log.logicType == 6;
                })) {
                this.tree.$emit('showPopLogic', {
                    'node': node,
                    'item': item,
                });
            }
            let that = this;
            if (item.specialShareRes) {
                $('#second-assessment-pop-val').val('');
                let query = this.$route.query;
                let sv = this.getOptionSaveValue(item, node.currNode.uniqueId);
                query.evaluationType = item.specialShareRes.relateType;
                query.isOnce = item.specialShareRes.isOnce;
                query.dynamicFlag = item.specialShareRes.isDynamic;
                query.isSecondAssessment = true;
                delete query.evaluationId;
                if (!sv || !sv.optionKey) {
                    query.mode = 'new';
                } else {
                    query.mode = 'edit';
                    query.assessmentId = sv.optionKey;
                }
                let pathQuery = "";
                for (let i in query) {
                    pathQuery += `${i}=${query[i]}&`;
                }
                let url = `/#/assessment?${pathQuery}`;
                console.log(url);
                layer.open({
                    type: 2,
                    shade: 0.3,
                    title: false,
                    closeBtn: 0,
                    maxmin: false,
                    shadeClose: true,
                    area: ['780px', '100%'],
                    content: url,
                    zIndex: layer.zIndex, //重点1
                    success: function(layero) {
                        layer.setTop(layero); //重点2
                    },
                    end: function() {
                        let val = $('#second-assessment-pop-val').val();
                        if (val) {
                            val = JSON.parse(val);
                            item.optionKey = val.assessmentId;
                            that.tree.$emit('seleteInput', {
                                'node': that.node,
                                'item': item,
                                'value': val.result
                            });
                        }
                    }
                });
            }
        },
        keydownEvent: function(event) {
            if (event.keyCode == 13 && event.srcElement.type != 'button' && event.srcElement.type != 'submit' && event.srcElement.type != 'reset' && event.srcElement.type != 'textarea' && event.srcElement.type != '') {
                this.goNextInput(event);
            }
        },
        goNextInput: function() {
            var inputs = $('#' + this.treeId + " input:text"); // 获取表单中的所有输入框  
            var idx = inputs.index($(event.currentTarget)); // 获取当前焦点输入框所处的位置  
            if (idx < inputs.length - 1) { // 判断是否是最后一个输入框  
                inputs[idx + 1].focus(); // 设置焦点  
                inputs[idx + 1].select(); // 选中文字  
            }
            return false; // 取消默认的提交行为  
        },
        // 显示分割线
        showLink() {
            if (this.node.currNode.style.link == 0) {
                return '';
            } else if (this.node.currNode.style.link == 1)
                return '/ ';
            else if (this.node.currNode.style.link == 2)
                return '* ';
        },

    },
}

</script>
<style scoped>
.bigger {
  width: 250px;
}

.normal {
  width: 120px;
}

.small {
  width: 50px;
}

</style>
