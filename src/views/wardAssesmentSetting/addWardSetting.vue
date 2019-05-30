<template>
  <div class="tips-multiple-menu dir-right dir-top">
    <div class="bd">
      <div class="lmenu">
        <ul>
          <li :class="{'active': classifyId==item.dicItemKey}" :key="index" v-for="(item, index) in assesmentClassifyList" @click.stop="selectAssesmentClassify(item)">{{item.dicItemValue}}</li>
        </ul>
      </div>
      <div class="rcont">
        <div class="am-search-picker am-mr-10" style="width:355px;padding-top:5px;height:43px;margin-left:15px;border-bottom:1px solid #E5E5E5;">
          <input type="text" class="input-text" placeholder="关键词搜索" v-model="key" @input="reGetRecordList">
          <i class="i-search" style="top:6px;right:102px;"></i>
        </div>
        <ul>
          <li v-for="assesmentItem in assesmentList">
            <div class="am-ctr-native-chk" @click="checkCheckBox(assesmentItem,$event)" :class="{active:isIdSelected(assesmentItem)}"><span>{{assesmentItem.evaluationName}}</span></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="ft">
      已选<span class="num">{{saveConfigList.length}}</span>
      <a class="right am-btn am-btn-info" @click.stop="saveAssesment()">确定</a>
    </div>
  </div>
</template>
<script>
import common from "@/util/common.js";
export default {
  data() {
    return {
      assesmentClassifyList: [],
      layerIndex: 0,
      loadAssesArr: [],
      wardCode: "",
      organCode: "",
      classifyId: 0,
      assesmentList: [],
      saveConfigList: [],
      key: "",
      evaluationClassify: ""
    };
  },
  props: ["ward", "isShow"],
  mounted() {},
  methods: {
    getAssesmentClassify: function() {
      let that = this;
      common.ajax({
        url: "knowledge-service/dictionary/EVALUATION_LIST_CLASSIFY",
        type: "get",
        async: false,
        callback: function(data) {
          that.assesmentClassifyList = data;
          that.classifyId = data[0].dicItemKey;
          that.evaluationClassify = data[0].dicItemKey;
          that.getPaperList();
        }
      });
    },
    checkCheckBox: function(item, event) {
      let obj = $(event.currentTarget);
      if (obj.hasClass("active")) {
        this.saveConfigList = this.saveConfigList.filter(al => {
          return al != item.evaluationId;
        });
      } else {
        this.saveConfigList.push(item.evaluationId);
      }
    },
    isIdSelected: function(item) {
      let obj = this.saveConfigList.find(al => {
        return al == item.evaluationId;
      });
      if (obj) {
        return true;
      } else {
        return false;
      }
    },
    selectAssesmentClassify: function(item) {
      this.classifyId = item.dicItemKey;
      this.evaluationClassify = item.dicItemKey;
      this.getPaperList();
    },
    //获取文书列表
    getPaperList() {
      let that = this;
      let param = {
        evaluationClassify: this.evaluationClassify,
        organCode: this.organCode,
        pageNumber: 0,
        pageSize: 100,
        keywords: $.trim(this.key)
      };
      common.ajax({
        url: "knowledge-service/evaluation/paper2/list",
        dataType: "json",
        type: "get",
        async: false,
        data: param,
        callback: function(data) {
          that.assesmentList = data.content;
        }
      });
    },
    reGetRecordList: function() {
      this.getPaperList();
    },
    initLayer: function(layerIndex, loadAssesArr, wardCode, organCode) {
      this.dispose();
      this.layerIndex = layerIndex;
      let that = this;
      debugger;
      this.loadAssesArr = loadAssesArr;
      this.wardCode = wardCode;
      this.organCode = organCode;
      if (this.loadAssesArr && this.loadAssesArr.length > 0) {
        this.loadAssesArr.forEach(al => {
          if (al.evaluationId) {
            that.saveConfigList.push(al.evaluationId);
          }
        });
      }
      this.getAssesmentClassify();
    },
    dispose: function() {
      this.assesmentClassifyList = [];
      this.loadAssesArr = [];
      this.organCode = "";
      this.classifyId = 0;
      this.assesmentList = [];
      this.saveConfigList = [];
    },
    closeLayer() {
      this.dispose();
      layer.close(this.layerIndex);
    },
    saveAssesment: function() {
      //debugger;
      let that = this;
      let param = {
        evaluationList: this.saveConfigList,
        organCode: this.organCode,
        wardCode: this.wardCode
      };
      common.ajax({
        url: "knowledge-service/evaluation/config",
        type: "post",
        data: JSON.stringify(param),
        dataType: "text",
        callback: function(data) {
          //debugger;
          that.closeLayer();
        }
      });
    }
  },
  watch: {}
};
</script>