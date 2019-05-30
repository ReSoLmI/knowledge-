<!-- 添加题 40-->
<template>
  <div class="lv-inline" v-if="node.currNode.optionList.find(op=>{
        return op.optionType == 61||op.optionType == 23||op.optionType == 63||op.optionType==62
    })">
    <div class="lv-item" v-if="!node.currNode.selfPropagationId&&node.currNode.optionList.find(op=>{
        return op.optionType == 61
    })">
      <!-- 添加 -->
      <span v-if="!node.currNode.selfPropagationId&&item.optionType == 61" v-for="item in node.currNode.optionList" @click.stop.prevent="addLogic(item,'add')">
          <a>{{item|showNodeName}}</a>
            </span>
    </div>
    <div class="lv-item" v-if="node.currNode.selfPropagationId&&node.currNode.optionList.find(op=>{
        return op.optionType == 23
    })">
      <!-- 头部引用 -->
      <span v-if="node.currNode.selfPropagationId&&item.optionType == 23" v-for="item in node.currNode.optionList">
          {{item|showNodeName}}
            </span>
    </div>
    <div class="lv-item" v-if="node.currNode.selfPropagationId&&node.currNode.optionList.find(op=>{
        return op.optionType == 62
    })">
      <!-- 删除 -->
      <span v-if="item.optionType == 62" v-for="item in node.currNode.optionList" @click.stop="deleteLogic()" style="position:absolute;z-index:9" :style="{'right':!(styleHierarchy==2)?'50px':'0'}">
                <a> {{item|showNodeName}}</a>
            </span>
    </div>
    <!-- 跟换 -->
    <div class="lv-item" v-if="node.currNode.selfPropagationId&&node.currNode.optionList.find(op=>{
        return op.optionType == 63
    })">
      <span v-if="node.currNode.selfPropagationId&&item.optionType == 63" v-for="item in node.currNode.optionList" @click.stop="addLogic(item,'change')" style="margin-left:10px;">
          <a>{{item|showNodeName}}</a>
            </span>
    </div>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
export default {
    name: 'add',
    data() {
        return {}
    },
    mixins: [questionNodeMixin],
    computed: {
        validAddedOption: function() {
            let that = this;
            if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0) {
                this.node.currNode.checkList[0].checkTypeMsg = "";
            }

            let validCType = this.addedOption.find(a => { return a.parentQuestionId == that.node.currNode.questionId });
            if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0 && this.node.currNode.checkList[0].checkType == '1' && !validCType && this.hasSave) {
                this.node.currNode.checkList[0].checkTypeMsg = "该题目为必填项，请选择!";
                return true;
            }
            return false;
        },
    },
    methods: {
        /*删除*/
        deleteLogic() {
            //item.questionCode = this.node.currNode.catalogueCode;
            this.tree.$emit('deleteNode', this.node);
        },
        // 新增或更换
        addLogic(item, type) {
            //debugger;
            var height = this.setHeight(event.currentTarget) - this.setHeight($('.model-drag-main')[0]) - 40 + 'px';
            this.tree.$emit('setPopHeight', height);
            this.tree.$emit('addNode', {
                item: item,
                node: this.node,
                type: type
            });
        },
        // 获取元素拒顶部高度
        setHeight(obj) {
            var parObj = obj;　　
            var top = obj.offsetTop;　　
            while (parObj = parObj.offsetParent) {　　
                top += parObj.offsetTop;　　
            }
            return top;
        },
    },
}

</script>
