<!-- 组合题70 -->
<template>
  <div>
    <div v-if="node.currNode.aliasType != 3">
      <h3 style="width:inherit">{{node.currNode|showNodeName}} 
      </h3>
    </div>
    <div :class="[,{'am-ml-0':node.currNode.aliasType == 3}]">
      <div :style="minHeight_bd">
        <div class="am-ctr-group-item am-panel-error">
          <span v-for="(it,index) in node.childList">
          <span>{{it.currNode|showNodeName}}</span>
          <div :class="{'am-panel-error':it.currNode.checkList[0]&&it.currNode.checkList[0].checkError}" style="display:inline-block">
            <div class="am-input-unit">
              <input type="text" class="input-text" :value="getOptionContent(it)" @input="checkInputUnit(it,$event)" :maxLength="it.currNode.maxLength" :class="getWidthClass(it.currNode.width)" :style="{'padding-right':it.currNode.unitCodes&&it.currNode.unitCodes.split(',').length>1?'0':showUnitName(it.currNode.unitCodes).length*12+10+'px'}">
              <i v-if="it.currNode.unitCodes&&it.currNode.unitCodes.split(',').length == 1">{{showUnitName(it.currNode.unitCodes)}}</i>
              <!-- <i>{{it.currNode.subTitle}}</i> -->
            </div>
            <i class="i-error" v-if="hasSave&&it.currNode.checkList[0]&&it.currNode.checkList[0].checkError" :title="it.currNode.checkList[0].checkMsg"></i>
          </div>
          <template v-if="it.currNode.unitCodes&&it.currNode.unitCodes.split(',').length>1">
            <div class="am-btn-rdo" v-if="it.currNode.unitCodes&&showUnit">
              <a v-for="(its,index) in it.currNode.unitCodes.split(',')" v-bind:class="{active:isUnitCodeSel(it.currNode,its)}" @click="checkRadioUnit(it,its)" style="padding:0 2px;min-width:10px">{{showUnitName(its)}}</a>
            </div>
          </template>
          <span class="am-txt-link" v-if="index!=node.childList.length-1">{{showLink(it)}}</span>
          </span>
          <i class="i-error" v-if="hasSave&&validTextCheckType" :title="node.currNode.checkList&&node.currNode.checkList.length>0&&node.currNode.checkList[0].checkTypeMsg"></i>
        </div>
      </div>
      <slot name="childNode"></slot>
    </div>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
export default {
    name: 'combina',
    data() {
        return {
            showUnit: true,
        }
    },
    mixins: [questionNodeMixin],
    methods: {
        checkInputUnit(node, event) { ////
            // this.changeInput(node, event);
            bus.$emit('seleteInput', {
                'node': node,
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
        // 根据code获取单位name
        showUnitName(code) {
            let str = "";
            if (!this.units) {
                return "";
            }
            this.units.forEach(function(el) {
                if (el.unitCode == code) {
                    str = el.unitName;
                }
            });
            return str;
        },
        /*单位是否被选中*/
        isUnitCodeSel: function(currNode, unitCode) { //
            if (!this.saveValue[currNode.uniqueId]) {
                return;
            }
            return this.saveValue[currNode.uniqueId].find(sv => {
                return sv.isShow && sv.unitCode == unitCode&&currNode.selfPropagationId == sv.selfPropagationId
            })
        },
        // 填空题单位
        checkRadioUnit(node, unitcode) {
            if (this.isUnitCodeSel(node.currNode, unitcode)) {
                return;
            }
            var that = this;
            that.showUnit = false;
            bus.$emit('seleteInput', {
                'node': node,
                'unitCode': unitcode,
                'type': 'radio',
            });
            setTimeout(function() { that.showUnit = true; }, 0)
        },
        // 显示分割线
        showLink(node) {
            if (node.currNode.link == 0) {
                return '';
            } else if (node.currNode.link == 1)
                return '/ ';
            else if (node.currNode.link == 2)
                return '* ';
        },
    },
}

</script>
<style scoped>
.bigger {
  width: 280px;
}

.normal {
  width: 150px;
}

.small {
  width: 80px;
}

</style>
