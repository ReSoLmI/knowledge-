<template>
  <div class="bd am-pd-20">
    <div class="control-item-list">
      <template v-for="(item,index) in questionArr">
        <div class="control-item" :key="index">
          <div class="am-ctr-native-chk" @click="checkCheckBox(item)" :class="{active:isIdSelected(item.currNode)}"><span>{{item.currNode|showNodeName}}</span></div>
        </div>
      </template>
    </div>
    <div class="am-btn-area last">
      <a class="am-pop-btn" @click.stop="cancle()">取消</a>
      <a class="am-pop-btn am-btn-confirm" @click="saveQuestion()">确定</a>
    </div>
  </div>
</template>
<script>
//常用对象组件
import common from "@/util/common.js";
export default {
  // props: ["activeQuestion"],
  data() {
    return {
      layerIndex: 0,
      questionArr: [],
      saveQuestionArr: [],
      evaluationId: 0,
      hasSave: false,
      activeQuestion: {}
    };
  },
  filters: {
    //显示节点的名称
    showNodeName: function(currNode) {
      if(currNode.aliasType == 3) {
        return ""
      }
      return currNode.aliasName || currNode.catalogueName;
    }
  },
  methods: {
    cancle: function() {
      layer.close(this.layerIndex);
    },
    //选中常用对象
    checkCheckBox(item) {
      let as = this.saveQuestionArr.find(al => {
        return item == al;
      });
      if (as) {
        this.saveQuestionArr.splice(this.saveQuestionArr.indexOf(item), 1);
      } else {
        this.saveQuestionArr.push(item);
      }
    },
    //初始化常用对象组件
    initLayer: function(layerId, typeObj, evaluationId, activeQuestion) {
      this.saveQuestionArr = [];
      this.questionArr = [];
      this.saveQuestionArr = [];
      this.activeQuestion = activeQuestion;
      this.hasSave = false;
      this.layerIndex = layerId;
      this.getAllNodes(typeObj);
      this.evaluationId = evaluationId;
    },
    //保存选中的常用对象
    saveQuestion() {
      debugger;
      let that = this;
      let arrs = [];
      this.saveQuestionArr.forEach(el => {
        arrs.push(el.currNode.questionId);
      });
      this.hasSave = true;
      let parentUniqueId = null;
      if(this.activeQuestion && this.activeQuestion.currNode && this.activeQuestion.currNode.uniqueId) { 
        parentUniqueId = this.activeQuestion.currNode.uniqueId 
      };
      let param = {
        evaluationId: this.evaluationId,
        questionIds: arrs,
        parentUniqueId: parentUniqueId,
      };
      let url = "knowledge-service/new/paper/save/common";
      common.ajax({
        url: url,
        type: "post",
        data: JSON.stringify(param),
        callback: function(data) {
          that.cancle();
        }
      });
    },
    //判断是否选中，用于设定样式
    isIdSelected: function(currNode) {
      if (
        !this.saveQuestionArr ||
        (this.saveQuestionArr && this.saveQuestionArr.length == 0)
      ) {
        return false;
      }
      return this.saveQuestionArr.find(cl => {
        return cl.currNode.questionId == currNode.questionId;
      });
    },
    //获取所有的节点信息
    getAllNodes: function(typeObj) {
      let that = this;
      common.ajax({
        url: "knowledge-service/new/common",
        dataType: "json",
        type: "get",
        data: { commonType: typeObj },
        callback: function(data) {
          that.questionArr = data;
        }
      });
    }
  }
};
</script>