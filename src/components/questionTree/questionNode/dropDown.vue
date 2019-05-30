<!-- 13 下拉题 -->
<template>
    <div class="placeholder-drag-panel" style="display:inline-block;margin-top:5px;">
        <div class="inline am-ctr-sel" :style="{'min-width':'100px','width': (node.currNode.optionList[0].style.width || 100) + 'px'}" :class="{'open':isComboOpen}" @click.stop="isComboOpen=true" @mouseleave="isComboOpen=false" v-if="pageFrom!='tableDataShow'">
            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{getComName}}</a>
            <div class="am-dropdown am-mr-10" v-show="isComboOpen">
              <ul>
                <li v-for="(item,index_) in node.currNode.optionList" @click="selectComboItem(item)"><a> {{item|showNodeName}}</a></li>
              </ul>
            </div>
        </div>
        <template v-for="(item,index) in node.currNode.optionList">
            <selectT v-if="item.hasSubItem" :list="subQuestionList"  :chosed="{code:item.subQuestionType,name:''}" :index="index"  @complete="choseSubQuestion">
            </selectT>
            <template v-for="(relateNode,relateIndex) in item.hierarchyList">
                <questionNode :node='getRelatedNode(relateNode.childQuestionId)' :key="getKey(relateNode.childQuestionId)" :isLastNode="(relateIndex==(item.hierarchyList.length-1))?true:false"  :nodeIndex="relateIndex"  :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1"></questionNode>
            </template>
        </template>
    </div>
</template>
<script>
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import selectT from "@/components/questionC/selectT.vue";
    export default{
        data(){
            return{
                isComboOpen:false,//下拉提是否打开
                cmbItem:{},//下拉框默认选项
            }
        },
        mixins: [questionNodeMixin],
        beforeCreate: function() {
            this.$options.components.questionNode = require('../questionNode');
        },
        components: {
            'selectT':selectT
        },
        computed:{
            getComName:function(){
              if(this.cmbItem.currNode){
                  let a= this.showNodeNames(this.cmbItem.currNode);
                  return a;
              }else{
                let a= this.showNodeNames(this.node.currNode.optionList[0]);
                return a;
                }
            },
        },
        methods:{
            showNodeNames: function(currNode) {
                //debugger;
                if (currNode.aliasType == 1) {
                    return currNode.aliasName;
                } else if (currNode.aliasType == 2) {
                    return currNode.catalogueName;
                } else {
                    return currNode.catalogueName;;
                }
            },
            selectComboItem:function(item){
              this.cmbItem=item;
              this.isComboOpen=false;
            },
            choseSubQuestion:function(obj,index){
              if(obj.code&&this.activeQuestion&&this.activeQuestion.currNode){
                    this.$set(this.activeQuestion.currNode.optionList[index], 'hasSubItem', false);
                    bus.$emit('selectSubItem', this.activeQuestion.currNode.optionList[index],obj.code);
                }
            }
        }
    }
</script>