<template>
  <div class="bd">
    <div class="hd">
      <h3>加共享 </h3>
      <a class="i-close" @click="closeLayer()"></a>
    </div>
    <div class="config-bd-pd">
      <template v-for="(shareItem,shareIndex) in shareArr">
        <shareComponent :activeQuestion="activeQuestion" :key="shareIndex" :shareItem="shareItem" :shareIndex="shareIndex" @deleteMainShare="deleteMainShare"></shareComponent>
      </template>
      <div>
        <a class="am-btn am-btn-plain-primary " style="margin-top:20px" @click.stop="addShareInfo()">+ 共享</a>
      </div>
      <div class="am-btn-area" style="margin-top: 50px">
        <a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/util/common.js";
import shareComponent from "./shareComponent.vue";
import Vue from "vue";
export default {
  data() {
    return {
      layerIndex: 0,
      evaluationId: common.getUrlParam("assesmentId"),
      shareArr: [], //共享项
      activeQuestion: {},
      layerObj: {}
    };
  },
  props: ["pageFrom"],
  filters: {
    showNodeName: function(currNode) {
      if (currNode.aliasType == 1) {
        return currNode.aliasName;
      } else if (currNode.aliasType == 2) {
        return currNode.catalogueName;
      } else if (currNode.aliasType == 3) {
        return "";
      } else {
        return currNode.catalogueName;
      }
    }
  },
  methods: {
    initLayer: function(index) {
      this.layerIndex = index;
    },
    init: function(obj) {
      this.layerObj = obj;
      this.activeQuestion = obj.activeQuestion;
      this.getAllShareInfo();
    },
    //添加共享
    addShareInfo: function() {
      let optionId = 0;
      if (
        this.activeQuestion.currNode.optionList &&
        this.activeQuestion.currNode.optionList.length > 0
      ) {
        optionId = this.activeQuestion.currNode.optionList[0].optionId;
      }
      let obj = {
        evaluationId: this.evaluationId ? this.evaluationId : undefined,
        dataType: 0,
        importPathId: 0,
        importShare: 0,
        optionId: optionId,
        questionId: this.activeQuestion.currNode.questionId,
        shareEnable: 0,
        sharePathId: 0,
        syncType: 0,
        syncMode: 2
      };
      this.shareArr.push(obj);
    },
    //保存
    save_: function() {
      let that = this;
      let data = [];
      this.shareArr.forEach(al => {
        data.push(al);
      });
      let isShare = 0;
      if (this.shareArr.length > 0) {
        isShare = 1;
      }
      this.$emit("saveShare", this.layerObj, isShare);
      let url = "knowledge-service/shareInfo/save";
      let dataNew = data;
      if (this.pageFrom == "assesment") {
        url = "knowledge-service/shareInfo/save/paper";
        dataNew = {};
        dataNew = {
          shareInfoList: data,
          uniqueId: this.activeQuestion.currNode.uniqueId
        };
      }
      common.ajax({
        url: url,
        type: "post",
        data: JSON.stringify(dataNew),
        callback: function(data) {
          common.tip_msg("已保存", 1000);
          that.closeLayer();
        }
      });
    },
    //删除共享信息
    deleteMainShare: function(shareItem, index) {
      let that = this;
      if(!shareItem.id) {
        this.shareArr.splice(index, 1);
        return;
      }
      common.ajax({
        url: "knowledge-service/shareInfo/delete?shareId=" + shareItem.id,
        type: "delete",
        callback: function(data) {
          that.shareArr.splice(index, 1);
          let isShare = 0;
          if (that.shareArr.length > 0) {
            isShare = 1;
          }
          that.$emit("saveShare", that.layerObj, isShare);
          common.tip_msg("已删除", 1000);
        }
      });
    },
    //获取所有的共享信息
    getAllShareInfo: function() {
      let that = this;
      common.ajax({
        url: "knowledge-service/shareInfo/search",
        type: "get",
        data: {
          questionId: this.activeQuestion.currNode.questionId,
          evaluationId: this.evaluationId
        },
        callback: function(data) {
          that.shareArr = data;
          // 兼容老数据手动添加syncMode默认值2
          if (that.shareArr && that.shareArr.length > 0) {
            that.shareArr.forEach(ele => {
              if (!ele.syncMode) {
                that.$set(ele, "syncMode", 2);
              }
            });
          }
        }
      });
    },
    //关闭图层
    closeLayer() {
      this.shareArr = [];
      layer.close(this.layerIndex);
    }
  },
  mounted() {},
  watch: {
    activeQuestion: function(curvalue, oldvalue) {
      this.activeQuestion = curvalue;
    }
  },
  components: {
    shareComponent: shareComponent
  }
};
</script>