<!-- 开关题12 -->
<template>
  <div  class="lv-inline">
    <div class="lv-item" :style="{'width':nodeWidth(el.style&&el.style.width)+'px','margin-left':(el.style.margin || 0) + 'px'}" v-for="(el,index_) in node.currNode.optionList">
      <div  class="btn-switch" v-bind:class="[el.switchType == 1 ? 'active':'']" v-if="isIdSelected(node.currNode,el.optionId)" @click="checkChangeRadio(el,index_)"  >
            <span></span>
      </div>
    <!-- <i class="i-error" v-if="hasSave&&validCheckType" :title="node.currNode.checkList&&node.currNode.checkList.length>0&&node.currNode.checkList[0].checkTypeMsg"></i> :style="{'width':nodeWidth(el.style.width)+'px'}"-->
    </div>
    <template v-for="(item,index) in node.currNode.optionList" >
        <selectT v-if="item.hasSubItem" :list="subQuestionList"  :chosed="{code:item.subQuestionType,name:''}" :index="index"  @complete="choseSubQuestion">
        </selectT>
        <template v-for="(relateNode,relateIndex) in item.hierarchyList">
            <questionNode :node='getRelatedNode(relateNode.childQuestionId)' :key="getKey(relateNode.childQuestionId)" :isLastNode="(relateIndex==(item.hierarchyList.length-1))?true:false"  :nodeIndex="relateIndex" :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1"></questionNode>
        </template>
    </template>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import { mapState } from 'vuex';
import selectT from "@/components/questionC/selectT.vue";
export default {
    name: 'mSwitch',
    data() {
        return {}
    },
    mixins: [questionNodeMixin],
    computed: {
        ...mapState([
            'userfulWidth'
        ]),
    },
    beforeCreate: function() {
        this.$options.components.questionNode = require('../questionNode');
    },
    methods: {
        // 开关题切换
        checkChangeRadio: function(items, index) {
            let flag = index == 1 ? 0 : 1;
            let item = this.node.currNode.optionList[flag];
            this.tree.$emit('seleteRadio', {
              node:this.node,
              item:item
            });
        },
        
        choseSubQuestion:function(obj,index){
          //debugger;
          if(obj.code&&this.activeQuestion&&this.activeQuestion.currNode){
            this.$set(this.activeQuestion.currNode.optionList[index], 'hasSubItem', false);
            bus.$emit('selectSubItem', this.activeQuestion.currNode.optionList[index],obj.code);
          }
        }
    },
    components: {
        'selectT':selectT
    },
}

</script>
