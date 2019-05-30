<template>
  <div class="am-ctr-sel am-mt-10" :class="{'open':isQuestionOpen}" style="width: 100%;height: auto;" @mouseleave="hidePanel">
    <div class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" v-if="questionArrs&&questionArrs.length>0" @click.stop="isQuestionOpen=true">
      <div class="caption-span-list">
        <span class="caption-span" v-for="(el,index) in questionArrs" :key="index">
          <em class="caption-txt">{{el.relateQuestionName}}</em><i class="i-close" @click.stop="deleteQues(index)"></i>
        </span>
      </div>
    </div>
    <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" v-if="!questionArrs||(questionArrs&&questionArrs.length==0)" @click.stop="isQuestionOpen=true">选择问题</a>
    <div class="am-dropdown am-mr-10" v-show="isQuestionOpen">
      <ul class="select2-option-list">
        <li :class="getClass(item)" v-for="(item,index) in questionList" :key="index" @click.stop="choseQuestion($event,item)" v-if="selectNode.questionId!=item.questionId"><a>{{item|convertName}} {{item|convertQuestionType}} {{item.questionRemark}}</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      questionArrs: this.questionArray,
      isQuestionOpen: false
    };
  },
  filters: {
    convertName(item) {
      return item.aliasName || item.catalogueName;
    },
    convertQuestionType(item) {
      let questionType = null;
      let num = item.questionType;
      switch (num) {
        case "10":
          questionType = "单选题";
          break;
        case "11":
          questionType = "单选题";
          break;
        case "20":
          questionType = "多选题";
          break;
        case "12":
          questionType = "开关题";
          break;
        case "30":
          questionType = "填空题";
          break;
        case "90":
          questionType = "时间题";
          break;
        case "40":
          questionType = "添加题";
          break;
        case "200":
          questionType = "标签题";
          break;
        case "13":
          questionType = "下拉题";
          break;
        case "90":
          questionType = "时间框题";
          break;
        case "110":
          questionType = "图片上传题";
          break;
        case "32":
          questionType = "自由文本";
          break;
        case "201":
          questionType = "说明文字";
          break;
        case "202":
          questionType = "导入题";
          break;
        case "41":
          questionType = "表格题";
          break;
        case "14":
          questionType = "下拉题";
          break;
        default:
          questionType = "";
      }
      return questionType;
    }
  },
  props: ["questionArray", "questionList", "selectNode"],
  methods: {
    choseQuestion: function(event, questionItem) {
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        this.questionArrs.push({
          relateQuestionId: questionItem.questionId,
          relateQuestionName: this.convertName(questionItem) || "标签题",
          relateHierarchyCode: questionItem.hierarchyCode
        });
      } else {
        this.questionArrs = this.questionArrs.filter(al => {
          return al.relateQuestionId != questionItem.questionId;
        });
      }
    },
    deleteQues: function(index) {
      this.$emit("deleteQues", index);
    },
    hidePanel: function() {
      if (!this.isQuestionOpen) {
        return;
      }
      this.isQuestionOpen = false;
      this.$emit("addConclustionQuestion", this.questionArrs);
    },
    convertName(item) {
      return item.aliasType == 3 ? "" : item.catalogueName || item.aliasName;
    },
    getClass: function(item) {
      if (
        this.questionArrs.some(al => {
          return al.relateQuestionId == item.questionId;
        })
      ) {
        return "active";
      } else {
        return "";
      }
    },
    clearCash() {
      this.questionArrs = [];
    }
  },
  mounted() {},
  watch: {
    questionArray: function() {
      this.questionArrs = this.questionArray;
    }
  }
};
</script>