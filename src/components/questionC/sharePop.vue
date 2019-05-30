<template>
  <div class="am-col-20" @click.stop="isShareInfo=true" @mouseleave="isShareInfo=false;">
    <div class="menus-op-sel" :class="{'open':isShareInfo}">
      <a class="caption" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{showShareName()}}</a>
      <div class="am-dropdown" v-show="isShareInfo">
        <div class="hd">项目名称
        </div>
        <div class="bd">
          <div class="lside">
            <div class="inner">
              <ul class="menu-first">
                <li v-for="(item,index) in allShareArr" :key="index" :class="{'editabled':item.isEdit,'active':item.pathId==activeOpenShare.pathId?true:false}" @click.stop="selectShareItem(item)">
                  <input type="text" v-model="item.name" v-if="item.isEdit" @input.stop="saveShare(item,'share')" />
                  <div class="txt" v-if="!item.isEdit">{{item.name}}</div>
                  <div class="right">
                    <i class="i-link-tick am-ml-5" @click.stop="editShareNameEnd(item)"></i>
                    <i class="i-link-upd am-ml-5" @click.stop="editShareName(item)"></i>
                    <i class="i-link-del am-ml-5" @click.stop="deleteShare(item,index)"></i>
                  </div>
                </li>
              </ul>
            </div>
            <a class="add" @click.stop="addShareName">+共享名称</a>
          </div>
          <div class="rcont">
            <div class="inner">
              <ul class="menu-first">
                <li v-for="(childItem,childIndex) in activeOpenShare.childList" :key="childIndex" :class="{'editabled':childItem.isChildEdit,'active':childItem.pathId==activeChildOpenShare.pathId?true:false}" @click.stop="selectShareItem(childItem,'childShare')">
                  <input type="text" v-model="childItem.name" v-if="childItem.isChildEdit" @input.stop="saveShare(childItem,'childShare')" />
                  <div class="txt" v-if="!childItem.isChildEdit">{{childItem.name}}</div>
                  <div class="right">
                    <i class="i-link-tick am-ml-5" @click.stop="editChildShareNameEnd(childItem)"></i>
                    <i class="i-link-upd am-ml-5" @click.stop="editChildShareName(childItem)"></i>
                    <i class="i-link-del am-ml-5" @click.stop="deleteChildShare(childItem,childIndex)"></i>
                  </div>
                </li>
              </ul>
            </div>
            <a class="item-add" @click.stop="addChildShare">+子项</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/util/common.js";
import Vue from "vue";
export default {
  data() {
    return {
      isShareInfo: false, //是否打开共享信息
      activeOpenShare: {}, //当前活动的共享
      activeChildOpenShare: {}
    };
  },
  props: ["shareItem", "allShareArr", "type"],
  methods: {
    //编辑共享名称
    editShareName: function(item) {
      Vue.set(item, "isEdit", true);
    },
    editShareNameEnd: function(item) {
      Vue.set(item, "isEdit", false);
    },
    editChildShareNameEnd: function(item) {
      Vue.set(item, "isChildEdit", false);
    },
    editChildShareName: function(item) {
      Vue.set(item, "isChildEdit", true);
    },
    openSharePop: function() {
      this.isShareInfo = true;
    },
    showShareName: function() {
      if (
        this.shareItem &&
        this.shareItem.sharePathName &&
        this.type == "sharePath"
      ) {
        return this.shareItem.sharePathName;
      } else if (
        this.shareItem &&
        this.shareItem.importPathName &&
        this.type == "importPath"
      ) {
        return this.shareItem.importPathName;
      } else {
        return "请选择共享项";
      }
    },
    //保存共享名称
    saveShare: function(item, type) {
      this.isShareInfo = true;
      let data = {};
      if (type == "share") {
        data = {
          level: item.level,
          name: item.name,
          pathId: item.pathId
        };
      } else {
        data = {
          level: item.level,
          name: item.name,
          pathId: item.pathId,
          parentId: this.activeOpenShare.pathId
        };
      }
      let that = this;
      common.ajax({
        url: "knowledge-service/shareInfo/path",
        type: "post",
        async: false,
        data: JSON.stringify(data),
        callback: function(data) {
          /* //debugger;*/
          item.pathId = data;
          Vue.nextTick(function() {
            that.isShareInfo = true;
          });
        }
      });
    },
    //选中的共享项目
    selectShareItem: function(item, selectType) {
      if (selectType == "childShare") {
        //选中子的共享项目
        /*//debugger;*/
        if (item != this.activeChildOpenShare) {
          /*Vue.set(this.activeChildOpenShare,'isChildEdit',false);*/
          this.activeOpenShare.isChildEdit = false;
        }
        /* //debugger;*/
        this.activeChildOpenShare = item;
        if (this.type == "sharePath") {
          this.shareItem.sharePathName = item.name;
          this.shareItem.sharePathId = item.pathId;
        } else if (this.type == "importPath") {
          this.shareItem.importPathName = item.name;
          this.shareItem.importPathId = item.pathId;
        }
      } else {
        if (item != this.activeOpenShare) {
          Vue.set(this.activeOpenShare, "isEdit", false);
        }
        this.activeOpenShare = item;
        this.activeChildOpenShare = {};
      }
    },
    //删除共享
    deleteShare: function(item, index) {
      let that = this;
      this.isShareInfo = true;
      common.ajax({
        url: "knowledge-service/shareInfo/path?pathId=" + item.pathId,
        type: "delete",
        callback: function(data) {
          //debugger;
          if (item.pathId == that.activeOpenShare.pathId) {
            that.activeOpenShare = {};
            that.activeChildOpenShare = {};
          }
          that.allShareArr.splice(index, 1);
          that.isShareInfo = true;
          common.tip_msg("已删除", 1000);
        }
      });
    },
    //删除共享子项
    deleteChildShare: function(childItem, childIndex) {
      let that = this;
      common.ajax({
        url: "knowledge-service/shareInfo/path?pathId=" + childItem.pathId,
        type: "delete",
        callback: function(data) {
          //debugger;
          that.activeOpenShare.childList.splice(childIndex, 1);
          that.isShareInfo = true;
          common.tip_msg("已删除", 1000);
        }
      });
    },
    //添加共享名称
    addShareName: function() {
      let obj = {
        childList: [],
        level: 1,
        name: ""
      };
      this.allShareArr.push(obj);
      this.activeOpenShare = obj;
      Vue.set(this.activeOpenShare, "isEdit", true);
    },
    //添加子项
    addChildShare: function() {
      let obj = {
        level: 2,
        name: this.activeOpenShare.name + "-",
        parentId: this.activeOpenShare.pathId,
        isChildEdit: true
      };
      /*Vue.set(this.activeOpenShare,'isEdit',true);*/
      this.activeOpenShare.childList.push(obj);
    }
  },
  mounted() {},
  watch: {
    type: function(curvalue, oldvalue) {
      this.type = curvalue;
      console.log("输出的值为");
      console.log(curvalue);
      /* this.selectShareItem();*/
    },
    allShareArr: function(curvalue, oldvalue) {
      //debugger;
      if (oldvalue.length != 0) {
        //由于在加载的时候，先加载里层的，外层的shareArr还没来得及传递过来，因此需要在第一次加载的时候设置选中项
        return;
      }
      let that = this;
      if (this.allShareArr.length > 0) {
        if (
          this.shareItem &&
          this.shareItem.sharePathId &&
          this.type == "sharePath"
        ) {
          this.allShareArr.forEach(al => {
            al.childList.forEach(cl => {
              //debugger;
              if (cl.pathId == that.shareItem.sharePathId) {
                that.activeOpenShare = al;
                that.activeChildOpenShare = cl;
                return;
              }
            });
          });
        } else if (
          this.shareItem &&
          this.shareItem.importPathId &&
          this.type == "importPath"
        ) {
          this.allShareArr.forEach(al => {
            al.childList.forEach(cl => {
              //debugger;
              if (cl.pathId == that.shareItem.importPathId) {
                that.activeOpenShare = al;
                that.activeChildOpenShare = cl;
                return;
              }
            });
          });
        } else {
          this.activeOpenShare = this.allShareArr[0];
        }
      }
    }
  }
};
</script>