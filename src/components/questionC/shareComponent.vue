<template>
  <div class="am-panel-circle" style="margin-top: 0">
    <div class="hd">
      <span class="txt am-mr-10" style="line-height: 30px;">共享项</span>
      <div class="am-ctr-sel w120" v-if="activeQuestion&&activeQuestion.currNode" :class="{open:isShareQuestion}" @click.stop="isShareQuestion=true" @mouseleave="isShareQuestion=false">
        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{convertShare(shareItem)}}</a>
        <div class="am-dropdown am-mr-10" v-show="isShareQuestion">
          <ul>
            <li v-for="(item,index) in activeQuestion.currNode.optionList" :key="index" @click.stop="selectOption(item,shareItem)" :class="{active:shareItem.optionId==item.optionId?true:false}">
              <a>{{showNodeName(item,index)}}</a>
            </li>
          </ul>
        </div>
      </div>
      <i class="i-link-del cm-right" style="margin-top: 7px;" @click.stop="deleteMainShare()"></i>
    </div>
    <div class="bd">
      <div style="margin-top: 10px">
        <label class="am-ctr-chk am-ml-20 " @click.stop="openShare(shareItem)" :class="{active:shareItem.shareEnable==1?true:false}">
          <i></i>
          <span class="txt">开启共享</span>
        </label>
      </div>
      <div class="clearfix" v-show="shareItem.shareEnable==1?true:false">
        <div style="padding:10px 0px;color:#666;">
          <span style="padding-left:10px;">共享模式</span>
          <label style="margin-left:36px !important;" class="am-ctr-chk am-ml-20 " @click.stop="addSyncMode(shareItem)" :class="{active: shareItem.syncMode==1?true:false}">
            <i></i>
            <span class="txt">同源模式</span>
          </label>
        </div>
        <div class="am-col-4 am-form-label">加入共享路径</div>
        <sharePop :shareItem="shareItem" :allShareArr="allShareArr" :type="'sharePath'"></sharePop>
      </div>
      <div style="margin-top: 10px">
        <label class="am-ctr-chk am-ml-20 " @click.stop="importShare(shareItem)" :class="{active:shareItem.importShare==1?true:false}">
          <i></i>
          <span class="txt">引入共享</span>
        </label>
      </div>
      <div class="clearfix am-mt-10" v-show="shareItem.importShare==1?true:false">
        <div class="am-col-4 am-form-label">引入共享路径</div>
        <sharePop :shareItem="shareItem" :allShareArr="allShareArr" :type="'importPath'"></sharePop>
      </div>
      <div class="clearfix am-mt-10">
        <div class="am-col-4 am-form-label">共享性质</div>
        <div class="am-col-20">
          <div class="am-ctr-sel w200" :class="{'open':isShareNature}" @click.stop="isShareNature=true" @mouseleave="isShareNature=false">
            <a data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" class="caption">{{convertShareNature(shareItem)}}</a>
            <div class="am-dropdown am-mr-10" v-show="isShareNature">
              <ul>
                <li :class="{'active':natureItem.syncType==shareItem.syncType}" :key="index" v-for="(natureItem, index) in shareNatureArr" @click.stop="selectShareNature(natureItem,shareItem)">
                  <a>{{natureItem.shareNutureName}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix am-mt-10">
        <div class="am-col-4 am-form-label">共享类型</div>
        <div class="am-col-20">
          <div class="am-ctr-sel w200" :class="{'open':isShareType}" @click.stop="isShareType=true" @mouseleave="isShareType=false">
            <a data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" class="caption">{{convertShareType(shareItem)}}</a>
            <div class="am-dropdown am-mr-10" v-show="isShareType">
              <ul>
                <li :class="{'active':typeItem.dataType==shareItem.dataType}" v-for="(typeItem, index) in typeArr" :key="index" @click.stop="selectShareType(typeItem,shareItem)">
                  <a>{{typeItem.dataTypeName}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/util/common.js";
import sharePop from "./sharePop.vue";
import Vue from "vue";
export default {
  data() {
    return {
      isSynMode: false,
      isShareQuestion: false, //共享项
      shareQuestionArr: [], //共享问题数组
      isShareNature: false,
      shareNatureArr: [
        { shareNutureName: "选择共享性质", syncType: 0 },
        { shareNutureName: "自动同步", syncType: 2 },
        { shareNutureName: "手动同步", syncType: 1 }
      ],
      allShareArr: [],
      typeArr: [
        { dataTypeName: "选择共享类型", dataType: 0 },
        { dataTypeName: "一次性录入", dataType: 1 },
        { dataTypeName: "多次录入", dataType: 2 }
      ],
      isShareType: false
    };
  },
  props: ["activeQuestion", "shareItem", "shareIndex"],
  filters: {},
  methods: {
    /*获取所有的共享数组*/
    getAllShareArr() {
      //debugger;
      let that = this;
      common.ajax({
        url: "knowledge-service/shareInfo/all/path",
        type: "get",
        async: false,
        callback: function(data) {
          that.allShareArr = data;
        }
      });
    },
    showNodeName: function(currNode, index) {
      if (this.activeQuestion.currNode.questionType == 30) {
        return "输入框" + (index + 1);
      } else {
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
    addSyncMode: function(obj) {
      if (obj.syncMode == 1) {
        obj.syncMode = 2;
      } else {
        obj.syncMode = 1;
      }
    },
    //选中的共享项
    selectOption: function(option, shareItem) {
      //debugger;
      shareItem.optionId = option.optionId;
      this.isShareQuestion = false;
    },
    //选中共享性质
    selectShareNature: function(shareNature, shareItem) {
      //debugger;
      shareItem.syncType = shareNature.syncType;
      this.isShareNature = false;
    },
    selectShareType: function(shareType, shareItem) {
      shareItem.dataType = shareType.dataType;
      this.isShareType = false;
    },
    deleteMainShare: function() {
      //debugger;
      this.$emit("deleteMainShare", this.shareItem, this.shareIndex);
    },
    //开启共享
    openShare: function(shareItem) {
      if (shareItem.shareEnable == 1) {
        shareItem.shareEnable = 0;
      } else {
        shareItem.shareEnable = 1;
      }
    },
    //导入共享
    importShare: function(shareItem) {
      if (shareItem.importShare == 0) {
        shareItem.importShare = 1;
      } else {
        shareItem.importShare = 0;
      }
    },

    showName: function(currNode) {
      if (currNode.aliasType == 1) {
        return currNode.aliasName;
      } else if (currNode.aliasType == 2) {
        return currNode.catalogueName;
      } else if (currNode.aliasType == 3) {
        return "";
      } else {
        return currNode.catalogueName;
      }
    },
    //转化选择的optionId
    convertShare: function(item) {
      let that = this;
      if (item.optionId == 0) {
        if (this.activeQuestion.currNode.questionType == 30) {
          return "输入框1";
        } else {
          let obj = this.activeQuestion.currNode.optionList[0];
          return this.showName(obj);
        }
      } else {
        if (this.activeQuestion.currNode.questionType == 30) {
          let index = -1;
          for (
            var i = 0;
            i < this.activeQuestion.currNode.optionList.length;
            i++
          ) {
            let obj = this.activeQuestion.currNode.optionList[i];
            if (obj.optionId == item.optionId) {
              index = i;
              break;
            }
          }
          return "输入框" + (index + 1);
        } else {
          let obj = this.activeQuestion.currNode.optionList.find(al => {
            return al.optionId == item.optionId;
          });
          if (obj) {
            return this.showName(obj);
          }
        }
      }
    },
    //转化共享性质
    convertShareNature: function(item) {
      let as = this.shareNatureArr.find(al => {
        return al.syncType == item.syncType;
      });
      if (as) {
        return as.shareNutureName;
      } else {
        return "选择共享性质";
      }
    },
    //转化共享类型
    convertShareType: function(item) {
      let as = this.typeArr.find(al => {
        return al.dataType == item.dataType;
      });
      if (as) {
        return as.dataTypeName;
      } else {
        return "选择共享类型";
      }
    }
  },
  mounted() {
    // console.log(this.shareItem);
    this.getAllShareArr();
  },
  watch: {
    activeQuestion: function(curvalue, oldvalue) {
      this.activeQuestion = curvalue;
    }
  },
  components: {
    sharePop: sharePop
  }
};
</script>