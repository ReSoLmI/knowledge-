<!-- 判断单选题11 -->
<template>
  <div class="lv-inline">
    <div class="lv-item">
      <div class="btn-switch-text" :class="{disabled:isTreeDisabled}">
        <span v-for="item in node.currNode.optionList" :class="{active:isIdSelected(node.currNode,item.optionId)}" @click="checkRadio(item)">{{item|showNodeName}}</span>
      </div>
    </div>
    <!-- <i class="i-error" v-if="hasSave&&validCheckType" :title="node.currNode.checkList&&node.currNode.checkList.length>0&&node.currNode.checkList[0].checkTypeMsg"></i> -->
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
export default {
    name: 'radio-switch',
    data() {
        return {}
    },
    mixins: [questionNodeMixin],
    methods: {

        // 单选选中
        checkRadio(item) {
            if (this.isTreeDisabled) {
                return;
            }
            this.tree.$emit('seleteRadio', {
                node: this.node,
                item: item
            });
        }
    },
    watch: {}
}

</script>
