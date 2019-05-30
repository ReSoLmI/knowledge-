<!-- 嵌入题 230 -->
<template>
    <div class="lv-inline lv-title ql-snow" v-if="node.currNode.aliasType != 3" :style="{'width':nodeWidth(node.currNode.style&&node.currNode.style.width)+'px','margin-left':(node.currNode.style.margin || 0) + 'px'}">
      <div class="ql-editor">
        <!-- <template v-for="(item,index) in titles" >
          <span class="lv-item" v-html="item" style="font-size: 14px;margin: 10px 10px 0 0;vertical-align: top;line-height: 30px;">
          </span>
          <template v-if="index <titles.length-1">
                <questionNode :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1" :node="node.childList[index]"></questionNode>
            </template>

        </template> -->
        <test v-if="isShow" v-bind="$props" ></test>
    </div>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import '@/css/quill/quill.core.css'
import '@/css/quill/quill.snow.css'
import '@/css/quill/quill.bubble.css'
import loading from '@/components/common/loading.vue';
import Vue from 'vue';

import { mapState } from 'vuex'
export default {
    name: 'embedds',
    data() {
        return {
            titles: [],
            isShow:false
        }
    },
    mixins: [questionNodeMixin],
    beforeCreate: function() {
        this.$options.components.questionNode = require('../questionNode')
    },
    computed: {
        ...mapState([
            'userfulWidth'
        ])
    },
    methods: {

    },
    mounted: function() {
        // this.titles = '';
        // if(this.node.currNode.aliasType!=4){
        //     this.titles =  this.showNodeNames(this.node.currNode).split('<>');
        // }else{
        //     this.titles =  this.showNodeNames(this.node.currNode).split('<<<>>>');
        // }
        let indexQ = 0;
        debugger;
        console.log(this.showNodeNames(this.node.currNode));
        let titles = this.showNodeNames(this.node.currNode).replace(/(<>)|(<<<>>>)/g, function(){
            let result =  `<questionNode :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1" :node="node.childList[${indexQ}]"></questionNode>`;
            indexQ++;
            return result;
        });
        console.log('44444445');
        debugger;
        console.log(this.titles);
        this.$options.components.test = Vue.extend({
            template: `<div style="font-size:14px" class="qilledit">${titles}</div>`,
            props:['node', "saveValue", 'mode', 'popNode', 'treeId', 'columnWidth', 'isTreeDisabled', 'showNodeID', 'hideNode', 'styleHierarchy', 'tempSaveValue', 'units', 'operationNode', 'newScoreHierarchyCode', 'hasSave', 'tempSaveValueComplete', 'addedOption', 'fatherHide'],
            components: {'questionNode': require('../questionNode')},
            mixins: [questionNodeMixin],

        });
        this.isShow = true;
    },
    components: {
        'loading': loading,
        'test': {
            template: '<div><span>333</span></div>',
        }
    },
}

</script>
<style >
.ql-editor strong {
  font-weight: bold;
}
.ql-editor i{
    font-style: italic;
}
.lvh-cont .qilledit  .lv-item {
    margin: -5px 0 0 0;
    display: inline-block;
    vertical-align: top;
    line-height: 30px;
    font-size: 14px;
}

</style>
