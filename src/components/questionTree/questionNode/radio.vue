<!--  单选10 -->
<template>
  <div class="lv-inline">
    <!-- {{ activeQuestion }} -->
    <template v-for="(item,index) in node.currNode.optionList">
      <span id="lineFeed" v-if="item.lineFeed == 1">
        <br>
      </span>
    <template  v-if="pageFrom=='tableDataShow'">
        <!-- <span> {{item|showNodeName}}</span> -->
        <div @click.stop="setNodeData($event,item)" class="txt" :class="getActiveClass(item)"> {{item|showNodeName}}</div>
    </template>
    <template v-else>
        <div class="lv-item" @click="checkRadio(item)" :style="{'margin-left':(item.style.margin || 0) + 'px'}">
          <div class="am-ctr-native-rdo" :class="{active:isIdSelected(node.currNode,item.optionId),disabled:isTreeDisabled}">
            <span> {{item|showNodeName}}</span>
          </div>
        </div>
        <div class="am-ctr-group-item" style="position:relative;" v-if="item.optionType == 2" v-show="isIdSelected(node.currNode,item.optionId)">
            <input type="text" class="input-text w120" style="margin-top: 5px">
            <i class="unitName" v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
        </div>
        <selectT v-if="item.hasSubItem" :list="subQuestionList"  :chosed="{code:item.subQuestionType,name:''}" :index="index" @complete="choseSubQuestion">
        </selectT>
        <template v-for="(relateNode,relateIndex) in item.hierarchyList"> 
          <span id="lineFeed" v-if="relateNode.lineFeed == 1">
            <br>
          </span>
          <div class="lv-item" style="margin-top:0" v-if="isNodeShow(getRelatedNode(relateNode.childQuestionId))">
            <questionNode :node='getRelatedNode(relateNode.childQuestionId)' :key="getKey(relateNode.childQuestionId)" :isLastNode="(relateIndex==(item.hierarchyList.length-1))?true:false"  :nodeIndex="relateIndex"  :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1">
            </questionNode>
          </div>
        </template>
    </template>
    </template>
  </div>
</template>
<script>
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import selectT from "@/components/questionC/selectT.vue";
import { mapState } from 'vuex'

export default {
    name: 'radio',
    data() {
        return {}
    },
    mixins: [questionNodeMixin],
    beforeCreate: function() {
        this.$options.components.questionNode = require('../questionNode');
    },
    computed: {
        ...mapState([
            'userfulWidth'
        ]),
    },
    methods: {      
        getLineFeed(item){
          let flag = false;
          return flag;
          let uniqueId = item.childUniqueId;
          let questionId = item.childQuestionId;
          if(this.activeQuestion.childList.length>0) {
            this.activeQuestion.childList.forEach((ele, i) => {
              if(ele.currNode.uniqueId == uniqueId && ele.currNode.questionId == questionId) {
                if(ele.currNode.lineFeed == '1') {
                  flag = true;
                }
              }
            })
          }
          return flag;
        },
        // 单选选中
        checkRadio(item) {
            if (this.isTreeDisabled) {
                return;
            }
            // Object.assign(item, {
            //     hierarchyCode: this.node.currNode.hierarchyCode,
            //     questionCode: this.node.currNode.catalogueCode
            // })
            this.tree.$emit('seleteRadio', {
                node: this.node,
                item: item
            });
        },
        //文本框输入
        checkInput(item, event) { 
            this.tree.$emit('seleteInput', {
                'item': item,
                'node': this.node,
                'value': event.currentTarget.value
            });
        },
        choseSubQuestion:function(obj,index){
          if(obj.code&&this.activeQuestion&&this.activeQuestion.currNode){
            this.$set(this.activeQuestion.currNode.optionList[index], 'hasSubItem', false);
            bus.$emit('selectSubItem', this.activeQuestion.currNode.optionList[index],obj.code);
        }
      },
      setNodeData:function(event,item){
           let newNode=$.extend({},item,{uniqueId:this.node.currNode.uniqueId});
            let obj={
                node:{currNode:newNode},
                type:'add',
            }
            let acObj = $(event.currentTarget);
            
            if(acObj.hasClass('active')){
                obj.type='remove';
            }
            bus.$emit('selectAddData', obj);
        },
        getActiveClass:function(item){
            for(var i=0;i<this.activeQuestion.length;i++){
                let al=this.activeQuestion[i];
                if(al.currNode.uniqueId==this.node.currNode.uniqueId&&al.currNode.optionId&&al.currNode.optionId==item.optionId){
                    return 'active';
                }
            }
            return '';
        },
    },
    components:{
      'selectT':selectT
    }
}

</script>
<style scoped>
.am-ctr-group-item {
  margin-bottom: 0px;
}
.unitName {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -10px;
  line-height: 20px;
  padding: 0 10px;
  color: #A5A5A5;
  font-size: 12px;  
}
</style>
