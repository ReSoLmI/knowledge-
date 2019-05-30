<!-- 多选20 -->
<template>
  <div class="lv-inline"> 
    <template v-for="(item,index) in node.currNode.optionList">
    <template  v-if="pageFrom=='tableDataShow'">
        <div @click.stop="setNodeData($event,item)" class="txt" :class="getActiveClass(item)"> {{item|showNodeName}}</div>
    </template>
    <template v-else>
        <span id="lineFeed" v-if="item.lineFeed == 1">
          </br>
        </span>
        <div class="lv-item" :style="{'width':nodeWidth(item.style&&item.style.width)+'px','margin-left':(item.style.margin || 0) + 'px'}">
            <div class="am-ctr-native-chk" @click="checkCheckBox(item)" :class="{active:isIdSelected(node.currNode,item.optionId),disabled:isTreeDisabled}"><span>{{item|showNodeName}}</span></div>
        </div>
        <div class="am-ctr-group-item" style="position:relative;margin-bottom:0px;" v-if="item.optionType == 2" v-show="isIdSelected(node.currNode,item.optionId)">
            <input type="text" class="input-text w120" style="margin-top: 5px">
            <i class="unitName" v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
        </div>
        <selectT v-if="item.hasSubItem" :list="subQuestionList"  :chosed="{code:item.subQuestionType,name:''}" :index="index" @complete="choseSubQuestion">
        </selectT>
        <template v-for="(relateNode,relateIndex) in item.hierarchyList">
          <span id="lineFeed" v-if="relateNode.lineFeed == 1">
            </br>
          </span>          
          <div class="lv-item" style="margin-top:0">
            <questionNode :node='getRelatedNode(relateNode.childQuestionId)' :key="getKey(relateNode.childQuestionId)" :isLastNode="(relateIndex==(item.hierarchyList.length-1))?true:false"  :nodeIndex="relateIndex"  :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1"></questionNode>
          </div>
        </template>
    </template>
      <!-- <i class="i-error" v-if="hasSave&&validCheckType" :title="node.currNode.checkList&&node.currNode.checkList.length>0&&node.currNode.checkList[0].checkTypeMsg"></i> -->
    </template>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import selectT from "@/components/questionC/selectT.vue";
import { mapState } from 'vuex'
// import questionNode from '@/components/questionTree/questionNode';
export default {
    name: 'checkBox',
    data() {
        return {}
    },
    mixins: [questionNodeMixin],
    beforeCreate: function() {
        this.$options.components.questionNode = require('../questionNode');
    },
    components: {
        'selectT':selectT
    },
    computed: {
        ...mapState([
            'userfulWidth'
        ]),
    },
    methods: {
        // 多选选中
        checkCheckBox(item) {
            if (this.isTreeDisabled) {
                return;
            }
            this.tree.$emit('seleteCheckBox', {
                item: item,
                node: this.node
            });
        },
        //文本框输入
        checkInput(item, event) { ////
            this.tree.$emit('seleteInput', {
                'item': item,
                'node': this.node.currNode,
                'value': event.currentTarget.value,
            });
        },
         choseSubQuestion:function(obj,index){
          //debugger;
          if(obj.code&&this.activeQuestion&&this.activeQuestion.currNode){
            this.$set(this.activeQuestion.currNode.optionList[index], 'hasSubItem', false);
            bus.$emit('selectSubItem', this.activeQuestion.currNode.optionList[index],obj.code);
          }
        },
        setNodeData:function(event,item){
        //debugger;
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
    watch: {}
}

</script>

<style scoped>
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

