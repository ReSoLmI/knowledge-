<template>
  <div class="am-item-inline-list" style="padding-right:0;">
    <!-- <a class="i-item-link-del" title="删除" @click.stop="delOptionLogic"></a> -->
    <span style="margin-left:10px;color:#666666">如果</span>
    <div :class="[{'am-ctr-sel':true},{'w120':true},{'open':isFieldOpen}]" @click.stop="openField" @mouseleave="leaveField">
      <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{curOption.conditionOne.questionName}}</a>
      <div class="am-dropdown" v-show="isFieldOpen">
        <ul>
          <li v-for="item in questionArr" @click.stop="selectField(item)"><a>{{item|convertName}}</a></li>
        </ul>
      </div>
    </div>
    <div class="am-item-inline" style="display:block;pading-right:26px;">
      <!-- <a class="i-hd-link-plus" title="添加" @click.stop="addMergeOption" style="top:7px;color:#666666"></a> -->
      的
      <div :class="[{'am-ctr-sel':true},{'w120':true},{'open':isOpen}]" @click.stop="openPop" @mouseleave="leavePop">
        <a :class="[{'caption':true},{'input-error':curOption.conditionOne.validOption}]" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{curOption.conditionOne.optionName}}</a>
        <div class="am-dropdown" v-show="isOpen">
          <ul>
            <li v-for="(optionItem,optionIndex) in optionArr" @click.stop="selectOption(optionItem,optionIndex)" v-if="optionItem.optionType!=62"><a>{{convertName(optionItem,optionIndex)}}</a></li>
          </ul>
        </div>
      </div>

      <span style="margin:0 10px;color:#666666">为</span>
      <div :class="[{'am-ctr-sel':true},{'w120':true},{'open':isConditionTypeOpen}]" @click.stop="openConditionType" @mouseleave="leavePop">
        <a :class="[{'caption':true},{'input-error':curOption.conditionOne.validCondition}]" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{curOption.conditionOne|convertConditionType}}</a>
        <div class="am-dropdown" v-show="isConditionTypeOpen">
          <ul>
            <li v-for="item in conditionTypeArray" @click.stop="selectConditionType(item)"><a>{{item.name}}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- -->
    <div class="am-item-inline" style="width:200px" v-if="node&&node.questionType&&node.questionType==30&&curOption.conditionOne&&curOption.conditionOne.conditionType==5">
      <verifyMatchType ref="inputVerify" :matchItem="matchItem" :type="1" :nIndex="index" v-for="(matchItem,index) in matchArr" @delMatchType="deleteMatchType"></verifyMatchType>
      <a class="i-hd-link-plus" title="添加" style="color:#666666" @click.stop="addMacthType()"></a>
    </div>

    <merge-option :curObj="curOption" :optionObj="optionItem" :nIndex="oIndex" v-for="(optionItem,oIndex) in curOption.conditionOther" ref="option" @delMergeOption="deleteMergeOption"></merge-option>
    <div class="am-item-inline" style="padding-top:10px;color:#666666">
      <span style="padding-top:5px;display:inline-block;">则</span> <div :class="[{'am-ctr-sel':true},{'w90':true},{'open':islogicTypeOpen}]" @click.stop="openLogicType" @mouseleave="leavePop">
        <a :class="[{'caption':true},{'input-error':curOption.curObject.validLogicType}]" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{curOption.curObject.logicType|convertLogicType}}</a>
        <div class="am-dropdown" v-show="islogicTypeOpen">
          <ul>
            <li @click.stop="selectLogicType(item)" v-for="item in arrLogicType"><a>{{item.name}}</a></li>
          </ul>
        </div>
      </div>
    </div>

    <selectQuestionArr :questionArray="curOption.curObject.conclusionList" :selectNode="node" :questionList="questionArr" @addConclustionQuestion="addConclusion" @deleteQues="deleteQues"></selectQuestionArr>
    <!-- <search-issure ref='search'  @addSearchItem="addIssure" :Lobj="curOption"></search-issure> -->
    <div style="padding-left:10px;">
      <!-- <logic-table  ref='dragTable' :logic-array="curOption.curObject.conclusionList" :isValidate="curOption.validArrLogic"></logic-table> -->
      <div class="am-ft-item">
        <a class="am-btn am-btn-dashed-del" @click.stop="delOptionLogic">删除逻辑</a>
      </div>
    </div>
  </div>
</template>
<script>
import searchIssure from "./searchIssure.vue";
import mergeOption from "./mergeOption.vue";
import selectQuestionArr from "./selectQuestionArr.vue";
import verifyMatchType from "../questionC/verifyMatchType.vue";
export default {
  data() {
    return {
      conditionTypeArray: [],
      isOpen: false,
      isConditionTypeOpen: false,
      islogicTypeOpen: false,
      isFieldOpen: false,
      arrLogicType: [
        { name: "请选择", id: "" },
        { name: "显示", id: "1" },
        { name: "添加", id: "2" },
        { name: "弹出", id: "6" }
      ],
      nonOption: false,
      nonCondition: false,
      nonLogicType: false,
      fieldArray: [{ name: "题目", id: "1" }, { name: "全局", id: "0" }],
      optionArr: [],
      node: {},
      matchArr: []
    };
  },
  filters: {
    convertName(item) {
      return item.aliasName || item.catalogueName;
    },
    convertConditionType(item) {
      if (item.conditionType == "1") {
        return "选中";
      } else if (item.conditionType == "2") {
        return "点击";
      // } else if (item.conditionType == "4") {
      //   return "未选中";
      } else if (item.conditionType == "5") {
        return "输入";
      } else {
        return "请选择";
      }
    },
    convertLogicType(item) {
      if (item == "1") {
        return "显示";
      } else if (item == "2") {
        return "添加";
      } else if (item == "3") {
        return "值传输";
      } else if (item == "4") {
        return "变更模块";
      } else if (item == "5") {
        return "隐藏";
      } else if (item == "6") {
        return "弹出";
      }
      return "请选择";
    }
  },
  props: ["curOption", "questionArr", "sIndex"],
  methods: {
    openField: function() {
      this.isFieldOpen = true;
    },
    leaveField: function() {
      this.isFieldOpen = false;
    },
    selectField: function(item, index) {
      debugger;
      this.curOption.conditionOne.questionName = this.convertName(item);
      this.curOption.conditionOne.questionId = item.questionId;
      this.node = item;

      this.getOptionArrByQuestion(item); //清理选择项
      this.curOption.conditionOne.optionName = "请选择";
      this.curOption.conditionOne.optionId = 0;

      //清理事件类型
      this.curOption.conditionOne.conditionType = 0;
      //清理显示方式
      this.curOption.curObject.logicType = 0;
      //清理结果出参
      this.curOption.curObject.conclusionList = [];
      this.isFieldOpen = false;
    },
    addConclusion: function(arrs) {
      this.curOption.curObject.conclusionList = arrs;
    },
    leavePop: function() {
      this.isOpen = false;
      this.isConditionTypeOpen = false;
      this.islogicTypeOpen = false;
    },
    selectOption: function(item, index) {
      debugger;

      this.curOption.conditionOne.optionName = this.convertName(item, index);
      this.curOption.conditionOne.optionId = item.optionId;
      this.curOption.conditionOne.validOption = false;
      this.isOpen = false;
    },
    selectConditionType: function(item) {
      //debugger;
      this.curOption.conditionOne.conditionTypeName = item.name;
      this.curOption.conditionOne.conditionType = item.id;
      this.curOption.conditionOne.validCondition = false;
      this.isConditionTypeOpen = false;
      if (item.id == "5") {
        this.matchArr.push({ mathType: 0, scope: "" });
      } else {
        this.matchArr = [];
      }
    },
    selectLogicType: function(item) {
      this.curOption.curObject.logicType = item.id;
      this.curOption.curObject.validLogicType = false;
      this.islogicTypeOpen = false;
    },

    openPop: function() {
      this.isOpen = true;
    },
    openConditionType: function() {
      this.isConditionTypeOpen = true;
    },
    openLogicType: function() {
      this.islogicTypeOpen = true;
    },
    delOptionLogic: function() {
      this.$emit("deleteOptionLogic", this.sIndex);
    },
    addMergeOption: function() {
      let index = this.curOption.conditionOther.length + 2;
      this.curOption.conditionOther.push({
        conditionType: "",
        joinType: "1",
        optionId: 0,
        questionId: 0,
        joinTypeName: "并且",
        questionName: "",
        optionName: "请选择选项",
        conditionName: "请选择",
        sortNum: index,
        validQuestion: false,
        validOption: false,
        validCondition: false
      });
    },
    deleteMergeOption: function(nIndex) {
      this.curOption.conditionOther.splice(nIndex, 1);
    },
    validMsg() {
      if (
        this.curOption.conditionOne.optionId == 0 ||
        this.curOption.conditionOne.optionName == ""
      ) {
        this.curOption.conditionOne.validOption = true;
      } else {
        this.curOption.conditionOne.validOption = false;
      }

      if (this.curOption.conditionOne.conditionType == "") {
        this.curOption.conditionOne.validCondition = true;
      } else {
        this.curOption.conditionOne.validCondition = false;
      }

      if (this.curOption.curObject.logicType == "") {
        this.curOption.curObject.validLogicType = true;
      } else {
        this.curOption.curObject.validLogicType = false;
      }

      this.curOption.conditionOther.forEach(function(el) {
        if (el.questionId == 0 || el.questionId == undefined) {
          el.validQuestion = true;
        } else {
          el.validQuestion = false;
        }

        if (
          el.optionId == 0 ||
          el.optionId == undefined ||
          el.optionName == "请选择选项"
        ) {
          el.validOption = true;
        } else {
          el.validOption = false;
        }

        if (el.conditionType == "") {
          el.validCondition = true;
        } else {
          el.validCondition = false;
        }
      });

      if (this.curOption.arrLogic.length == 0) {
        this.curOption.validArrLogic = true;
      } else {
        this.curOption.validArrLogic = false;
      }
    },
    validate() {
      this.validMsg();
      if (
        this.curOption.conditionOne.optionId == 0 ||
        this.curOption.conditionOne.conditionType == "" ||
        this.curOption.conditionOne.optionName == ""
      ) {
        return false;
      }
      let isSave = true;
      this.curOption.conditionOther.forEach(function(el) {
        if (
          el.conditionType == "" ||
          el.optionName == "请选择选项" ||
          el.questionId == 0 ||
          el.optionId == 0 ||
          el.questionId == undefined ||
          el.optionId == undefined
        ) {
          isSave = false;
        }
      });
      if (!isSave) {
        return false;
      }

      if (
        this.curOption.arrLogic.length == 0 ||
        this.curOption.curObject.logicType == ""
      ) {
        return false;
      }
      return true;
    },
    saveMergeTemplate() {
      /*if(!this.validate()){
					return null;
				}*/
      let conditionList = [];
      //debugger;
      conditionList.push({
        conditionType: this.curOption.conditionOne.conditionType,
        joinType: null,
        optionId: this.curOption.conditionOne.optionId,
        questionId: this.curOption.conditionOne.questionId,
        sortNum: 1,
        questionName: this.curOption.conditionOne.questionName,
        optionName: this.curOption.conditionOne.optionName,
        scopeList: this.matchArr
      });

      let sIndex = 1;
      this.curOption.conditionOther.forEach(function(el) {
        sIndex++;
        let optionName = el.optionName == "请选择选项" ? "" : el.optionName;
        conditionList.push({
          conditionType: el.conditionType,
          joinType: el.joinType,
          optionId: el.optionId,
          questionId: el.questionId,
          sortNum: sIndex,
          questionName: el.questionName,
          optionName: optionName
        });
      });
      let length = conditionList.length;
      if (length > 0) {
        for (let i = 0; i < conditionList.length; i++) {
          if (i == conditionList.length - 1) {
            conditionList[i].joinType = null;
          } else {
            conditionList[i].joinType = conditionList[i + 1].joinType;
          }
        }
      }
      //debugger;

      this.curOption.curObject.conditionList = conditionList;
      console.log(this.curOption.curObject);
      console.log("保存");

      if(this.matchArr.length > 0 && this.matchArr[0].mathType !=0) {
        this.$set(this.curOption.curObject, 'logicMode', 2)
      } else {
        this.$set(this.curOption.curObject, 'logicMode', 1)
      }

      return this.curOption.curObject;
    },
    convertName(item, index) {
      if (this.node.questionType == 30 && index && index != 0) {
        return "输入框" + index;
      } else {
        return  item.aliasName || item.catalogueName;
      }
    },
    getOptionArrByQuestion(node) {
      let questionOptionArr = [];
      this.node = node;
      node.optionList.forEach(function(el, index) {
        questionOptionArr.push($.extend({}, el, {}));
      });
      //debugger;
      questionOptionArr.splice(0, 0, {
        aliasType: 1,
        aliasName: this.node.questionType == 30 ? "请选择填空" : "请选择选项",
        optionId: 0
      });
      this.optionArr = questionOptionArr;
    },
    deleteMatchType: function(index, type) {
      this.matchArr.splice(index, 1);
    },
    addMacthType: function() {
      //debugger;
      this.matchArr.push({
        mathType: 0,
        scope: ""
      });
    },
    deleteQues: function(index) {
      this.curOption.curObject.conclusionList.splice(index, 1);
    },
    initData() {
      this.optionArr = [];
      let that = this;
      debugger;
      if (
        this.questionArr.length > 0 &&
        !this.curOption.conditionOne.questionId
      ) {
        this.getOptionArrByQuestion(this.questionArr[0]);
      } else {
        let selectQuestion = this.questionArr.find(al => {
          return al.questionId == this.curOption.conditionOne.questionId;
        });
        this.getOptionArrByQuestion(selectQuestion);
        if (selectQuestion.questionType == 30) {
          selectQuestion.optionList.forEach((op, index) => {
            if (op.optionId == that.curOption.conditionOne.optionId) {
              that.curOption.conditionOne.optionName = "输入框" + (index + 1);
            }
          });
        }
      }
      //debugger;
      if (this.node.questionType == 30) {
        this.conditionTypeArray = [
          { name: "请选择", id: "" },
          { name: "点击", id: "2" },
          { name: "输入", id: "5" }
        ];
      } else {
        this.conditionTypeArray = [
          { name: "请选择", id: "" },
          { name: "选中", id: "1" },
          // { name: "未选中", id: "4" },
          { name: "点击", id: "2" },
          // { name: "输入", id: "5" },
        ];
      }

      this.matchArr = [];
      this.curOption.conditionOne.scopeList.forEach(scope => {
        that.matchArr.push($.extend({}, scope, {}));
      });
    }
  },
  mounted() {
    console.log("初始化逻辑");
    this.initData();
  },
  watch: {
    curOption: function(curValue) {
      this.initData();
    },
    questionArr: function(curValue) {
      this.initData();
    }
  },

  components: {
    searchIssure,
    mergeOption,
    selectQuestionArr,
    verifyMatchType
  }
};
</script>
<style scoped>
.am-item-inline-list .i-hd-link-plus, .am-item-inline-list .i-hd-link-minus {
  top: 24px;
}
</style>