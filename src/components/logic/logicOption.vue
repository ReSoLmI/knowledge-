<template>
  <div class="clearfix" style="margin-left: 7px;margin-top:4px">
    <div class="am-pbtb-10">
      <merge-temp v-for="(item,nindex) in optionLogicArray" :key="nindex" :curOption="item" @deleteOptionLogic="delOptionLogic" :sIndex="nindex" ref="opTemp" :questionArr="questionArr"></merge-temp>
    </div>
    <div class="text-center am-mt-10">
      <a class="am-btn am-btn-dashed-add" v-show="optionLogicArray.length>0" @click.stop="addOptionLogic">+添加</a>
      <a class="am-btn am-btn-dashed-add" v-show="optionLogicArray.length==0" @click.stop="addOptionLogic">+逻辑</a>
    </div>
    <div class="am-mt-10 text-center">
      <a class="am-btn am-btn-plain-primary am-mr-10" @click.stop="saveLogicOption">确认</a>
    </div>
  </div>
</template>
<script>
import mergeTemp from "./mergeTemp.vue";
import common from "../../util/common.js";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      curObject: {},
      optionLogicArray: [],
      logicOptionArr: [],
      questionArr: [],
      assesmentId: common.getUrlParam('assesmentId'),
      evaluationId: 0,
      isAssesmentLogic: false,
      layerIndex: 0
    };
  },
  props: ["activeQuestion", "pageFrom", "isShow"],
  computed: {
    ...mapState(['logicInterFrom'])
  },
  methods: {
    getAllNode: function(node) {
      let that = this;
      that.questionArr.push(node.currNode);
      node.childList.forEach(al => {
        that.getAllNode(al);
      });
    },
    getAllAssesmentNode(evaluationId) {
      this.evaluationId = evaluationId;
      let that = this;
      common.ajax({
        url: "knowledge-service/evaluation/paper2/" + evaluationId + "/detail",
        // url: "knowledge-service/evaluation/paper2/" + evaluationId + "/paper",
        dataType: "json",
        type: "get",
        async: true,
        callback: function(result) {
          result.questionList.forEach(ql => {
            that.getAllNode(ql);
          });
          let ss = that.questionArr;
        }
      });
    },
    getAllLogicByEvaluationId() {
      let that = this;
      common.ajax({
        // url: "knowledge-service/new/paper/logic",
        url: "knowledge-service/ext2/logic",
        type: "get",
        async: false,
        data: {
          evaluationId: this.assesmentId,
          rootUniqueId: this.curObject.currNode.uniqueId,
          paperLogic: true
        },
        callback: function(data) {
          that.convertData(data);
        }
      });
    },
    getAllLogicById: function() {
      let that = this;
      let url = "knowledge-service/ext2/logic";
      let data = {
          evaluationId: this.assesmentId,
          rootUniqueId: this.curObject.currNode.uniqueId        
      };
      if(this.logicInterFrom === 'createQuestion') {
        url = "knowledge-service/question/logic";
        data = {
          rootQuestion: this.curObject.currNode.questionId           
        }
      }
      common.ajax({
        url: url,
        type: "get",
        async: false,
        data: data,
        callback: function(data) {
          that.convertData(data);
        }
      });
    },
    convertData(data) {
      let arrQuestion = [];
      let that = this;
      data.forEach(logic => {
        let curObj = $.extend({}, logic, {
          validLogicType: false,
          conditionList: []
        });
        if (logic.conditionList.length > 1) {
          let arrTemp = logic.conditionList;
          for (let j = arrTemp.length - 1; j >= 0; j--) {
            if (j == 0) {
              arrTemp.joinType = "1";
            } else {
              arrTemp[j].joinType = arrTemp[j - 1].joinType;
            }
          }
          logic.conditionList = arrTemp;
        }

        if (logic.conditionList.length > 0) {
          let oneCondition = $.extend({}, logic.conditionList[0], {
            validOption: false,
            validCondition: false
          });

          //过滤掉第一个剩余的数组为其他的条件
          let otherCondition = [];
          logic.conditionList.forEach((conditionItem, index) => {
            if (index > 0) {
              let joinTypeName =
                conditionItem.joinType == "1" ? "并且" : "或者";
              let conditionName =
                conditionItem.conditionType == "1"
                  ? "选中"
                  : conditionItem.conditionType == "2"
                    ? "点击"
                    : "请选择";
              if (
                conditionItem.questionId &&
                arrQuestion.indexOf(conditionItem.questionId) == -1
              ) {
                arrQuestion.push(conditionItem.questionId); //获取所有的问题的id，一起查找
              }
              otherCondition.push(
                $.extend({}, conditionItem, {
                  joinTypeName: joinTypeName,
                  conditionName: conditionName,
                  validQuestion: false,
                  validOption: false,
                  validCondition: false
                })
              );
            }
          });
          that.optionLogicArray.push({
            curObject: curObj,
            conditionOne: oneCondition,
            conditionOther: otherCondition,
            sValue: "",
            validArrLogic: false
          });
        }
      });
      if (arrQuestion.length > 0) {
        that.getQuestionsByIds(arrQuestion);
      }
    },
    getQuestionsByIds(arrQuestion) {
      let that = this;
      common.ajax({
        url: "knowledge-service/evaluation/questions/name",
        dataType: "json",
        type: "get",
        async: true,
        data: { questionIds: arrQuestion.toString() },
        callback: function(data) {
          that.optionLogicArray.forEach(a => {
            a.arrQuestion = data;
          });
        }
      });
    },
    initCurObj() {
      let that = this;
      let curObj = {
        conclusionList: [],
        generalType: this.evaluationId != 0 ? 3 : 2,
        logicGroup: this.evaluationId != 0 ? this.evaluationId : "",
        logicType: "",
        reverseType: 0,
        questionId: this.curObject.currNode.questionId,
        sortNum: 1,
        validLogicType: false
      };
      return curObj;
    },
    initCondition() {
      //debugger;
      let oCondition = {
        conditionType: "",
        joinType: "1",
        optionId: 0,
        questionId: 0,
        questionName: "请选择问题",
        sortNum: 1,
        questionName: this.filterName(this.curObject.currNode),
        questionId: this.curObject.currNode.questionId,
        optionName: "请选择选项",
        conditionTypeName: "请选择",
        validCondition: false,
        validOption: false
      };
      return oCondition;
    },
    addOptionLogic: function() {
      let index = this.optionLogicArray.length;
      let iCurObj = this.initCurObj();
      let oCondition = this.initCondition();
      iCurObj.sortNum = index + 1;
      this.optionLogicArray.splice(index, 0, {
        curObject: iCurObj,
        conditionOne: oCondition,
        conditionOther: [],
        sValue: "",
        validArrLogic: false
      });
    },
    delOptionLogic: function(index) {
      this.optionLogicArray.splice(index, 1);
    },
    filterName(item) {
      return item.aliasName || item.catalogueName;
    },
    clearCach() {
      this.optionLogicArray = [];
      this.curObject = {};
      this.logicOptionArr = [];
      this.evaluationId = 0;
      this.questionArr = [];
      this.isAssesmentLogic = false;
    },
    saveLogicOption: function() {
      let that = this;
      let logicList = [];
      let type = "put";
      let list = this.$refs.opTemp;
      list.forEach(function(el) {
        let logicItem = el.saveMergeTemplate();
        if (logicItem != undefined && logicItem != null) {
          logicList.push(logicItem);
        }
      });
      if (logicList.length != list.length) {
        return;
      }
      this.logicOptionArr = logicList;
      
      let url = "knowledge-service/evaluation/save/logic";
      let param = logicList;
      if (this.pageFrom == "evaluation") {
        // url = "knowledge-service/new/paper/question/logic";        
        url = "knowledge-service/ext2/logic";
        param = {
          logicList: logicList,
          uniqueId: this.activeQuestion.currNode.uniqueId,
          evaluationId: this.assesmentId,
          generalType: 2
        };
      }
      if(this.logicInterFrom === 'createQuestion') {
        url = "knowledge-service/question/" +  this.activeQuestion.currNode.questionId + "/logic";
        param =  logicList;
        type = "POST"
      }      
      if (this.isAssesmentLogic) {
        param.generalType = 3
      }
      common.ajax({
        url: url,
        type: type,
        data: JSON.stringify(param),
        callback: function(data) {
          that.$emit("saveLogic", that.logicOptionArr, true);
          common.tip_msg('保存成功')
        }
      });
    },
    initAssesmentLogic: function(evaluationId, currNode, index) {
      this.clearCach();
      this.questionArr = [];
      this.curObject = currNode;
      this.evaluationId = evaluationId;
      this.getAllAssesmentNode(evaluationId);
      this.getAllLogicByEvaluationId();
      this.isAssesmentLogic = true;
      this.layerIndex = index;
    }
  },
  mounted() {
    //debugger;
    let that = this;
    this.curObject = this.activeQuestion;
    if (this.isShow == "true") {
      this.getAllNode(this.curObject);
      this.getAllLogicById();
    }
  },
  watch: {
    activeQuestion: function(curValue, oldValue) {
      //debugger;
      if (curValue == oldValue) {
        return;
      }
      this.clearCach();
      if (this.isShow == "true") {
        let that = this;
        if (curValue.currNode.questionId == "q-1") {
          return;
        }
        this.curObject = curValue;
        this.getAllNode(curValue);
        this.getAllLogicById();
      }
    }
  },
  components: {
    mergeTemp
  }
};
</script>
<style type="text/css">
.csleft {
  margin-left: 10px;
  margin-top: 10px;
}
</style>