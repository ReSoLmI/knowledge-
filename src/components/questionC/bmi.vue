<template>
    <div class="bd">
     <div class="hd">
      <h3>{{inputLayerObj.layerTitle}} </h3>
      <a class="i-close" @click="closeLayer()"></a>
    </div>
    <div class="main-con">
      <div class="con-left">
        <h3>节点选择</h3>
        <div style="width:380px;height:360px;border:1px solid #CCC;margin-top:10px;overflow-y:auto; ">
          <el-tree ref="tree" @node-click="nodeClick" :data="treeList" :check-on-click-node=false :props="defaultProps"></el-tree>
        </div>
      </div>
      <div class="con-right">
        <span style="margin-right:150px;">当前选中的选项唯一ID</span>
        <el-checkbox v-model="checked">输入模式</el-checkbox>
        <div style="width:380px;height:75px;font-sie:14px;color:#555;">
           <textarea v-model="curUniqueId" disabled name="" rows="2" maxlength="100" class="input-text input-textarea am-mt-10"></textarea>
        </div>   
        <div style="height:45px;padding-top:20px;">
          <span>类型选择:</span>
          <el-radio v-model="type" label="1" @change="changeType('1')">值</el-radio>
          <el-radio v-model="type" label="2" @change="changeType('2')">评分</el-radio>        
        </div>  
        <div style="height:50px;">
          <div v-if="this.type == 1" >
            <span>精确度配置(保留小数点后的位数值):</span>
            <input v-enter-number class="input-text" v-model="defaultDecimals" type="text" style="width: 100px;">
          </div>
        </div>   
        BMI公式
        <div style="width:380px;height:200px;font-sie:14px;color:#555;">
           <textarea v-model="curFormula" name="" rows="5" placeholder="请输入BMI公式" maxlength="100" class="input-text input-textarea am-mt-10"></textarea>
        </div>
      </div>
   </div>
    <div class="am-btn-bottom">
      <a class="am-btn am-btn-primary w120" @click="saveFoluma()">保存</a>
    </div>
  </div> 
</template>

<script>
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import { Tree, Checkbox, Radio } from "element-ui";
Vue.component(Tree.name, Tree);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Radio.name, Radio);
export default {
  props: ['inputLayerObj', 'treeList'],  
  data() {
    return {
      defaultProps: {
        children: "optionList",
        label: "showName"
      },
      checked: false,
      curUniqueId: '',
      curFormula: '',
      curFormulaList: [],
      type: '1' ,
      defaultDecimals: 2     
    }
  },
  mounted() {

  },
  watch: {
    inputLayerObj: function(curVal) {      
      this.inputLayerObj = curVal;
      this.curUniqueId = '';
      if(curVal.optionItem.formula) {
        this.curFormula = curVal.optionItem.formula.sFormula;
        this.type = curVal.optionItem.formula.type + '';
        this.defaultDecimals = curVal.optionItem.formula.decimals;
      } else {
        this.curFormula = '';
        this.type = '1';
        this.defaultDecimals = 2
      }
    }    
  },
  methods: {   
    changeType: function(num) {
      this.type = num;
    },
    nodeClick: function(data, node, self) {
      if(!data.optionList) {
        this.curUniqueId = '[' + data.uniqueId + ']';
        if(!this.checked) {
          this.curFormula += '[' + data.uniqueId + ']';
        }
      }
    },
    getUniqueId: function(formula) {
      let arr = [];
      formula.replace(/\[(.+?)\]/g, function (a, $1) {
          arr.push($1);
      });      
      this.curFormulaList = arr;
    },
    saveFoluma: function() {
      this.getUniqueId(this.curFormula);
      let savaData = {};
      let formula = null;
      if(this.curFormulaList.length > 0 && this.curFormulaList) { 
        this.curFormulaList.forEach((ele, i) => {
          this.treeList.forEach((element, index) => {
            if(element.optionList && element.optionList.length > 0) {
              element.optionList.forEach((item, n) => {
                if(ele == item.uniqueId) {
                  savaData[ele] = { 'hierarchyCode': item.hierarchyCode, 'optionId': item.optionId, 'questionId': item.questionId, 'uniqueId': item.uniqueId }                
                }              
              })
            }
          })                
        })
        formula = {
          'paramMap': savaData,
          'sFormula': this.curFormula,
          'type': this.type || '1',
          'decimals': this.type == 2 ? 0 : this.defaultDecimals 
        };
      }
      this.$set(this.inputLayerObj.activeQuestion.currNode.optionList[this.inputLayerObj.optionIndex], 'formula', formula)
      this.$emit('saveFormula', this.inputLayerObj.activeQuestion)
      layer.closeAll();
    },
    closeLayer() {
      layer.closeAll();
    },    
    initLayer() {
      console.log(this.inputLayerObj.activeQuestion)
    }
  }  
}
</script>

<style scoped>
  .con-left {
    float: left;
  }
  .con-right {
    float: right;
  }
  .main-con {
    padding: 10px;
  }
</style>


