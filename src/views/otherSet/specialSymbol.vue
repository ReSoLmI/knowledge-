<template>
  <div class="symbolWrap">
    <div class="panel-ws panel-tag" :class="{'active': isPanelActive}">
      <div class="hd">特殊符号
        <a class="right-link" data-view-btn @click="editSymbol">编辑</a>
        <div class="right-link" data-edit-btn>
          <a @click.stop="savaSymbol">保存</a>
          <a @click.stop="cancleSymbol" class="am-ml-10">取消</a>
        </div>
      </div>
      <div class="bd">
        <div class="inner">
          <el-tag v-for="(item, index) in symbolList" :closable="isClose" :key='index' :disable-transitions="false" @close="handleClose(item)">{{item}}</el-tag>
          <el-input :class="{'input-new-tag': true, 'pT10': inputVisible}" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tag, Button, Input } from "element-ui";
import common from "@/util/common.js";
Vue.component(Tag.name, Tag);
Vue.component(Button.name, Button);
Vue.component(Input.name, Input);
export default {
  data() {
    return {
      symbolList: [],
      isPanelActive: false,
      isClose: false,
      noSymbol: false,
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    savaSymbol: function() {
      const that = this;
      let strSymbols = this.symbolList.join(",");
      common.ajax({
        url: 'knowledge-service/configdata/specialchar',
        type: "POST",
        dataType: "text",
        data: strSymbols,
        callback: function(res) {
          common.tip_msg("保存成功", 1000);
          that.isPanelActive = false;
          that.isClose = false;
        }
      });
    },
    cancleSymbol: function() {
      this.isPanelActive = false;
      this.isClose = false;
    },
    editSymbol: function() {
      this.isPanelActive = true;
      this.isClose = true;
    },
    handleClose: function(val) {
      this.symbolList.splice(this.symbolList.indexOf(val), 1);
      common.ajax({
        url: "knowledge-service/configdata/specialchar",
        type: "put",
        dataType: "text",
        data: val,
        callback: function(res) {
          common.tip_msg("删除成功", 1000);
        }
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.symbolList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    getSymbols: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/configdata/specialchar",
        type: "get",
        dataType: "text",
        callback: function(res) {
          if (res) {
            let arrSymbol = res.split(",");
            that.symbolList = arrSymbol;
          } else {
            // 初始值没有任何符号
            that.noSymbol = true;
            that.isClose = true;
            that.isPanelActive = true;
          }
        }
      });
    }
  },
  mounted() {
    this.getSymbols();
  }
};
</script>


<style scoped>
.symbolWrap {
  padding: 10px 20px;
}
.right-link {
  float: right;
  font-size: 14px;
  font-weight: 400;
}
.panel-tag .inner {
  font-size: 0;
  margin: -10px -10px 0 0;
}
.panel-tag .el-tag,
.panel-tag .el-button {
  margin: 10px 10px 0 0;
}
.panel-tag.active [data-edit-btn] {
  display: block;
}
.panel-tag.active .el-tag__close,
.panel-tag.active .button-new-tag {
  display: inline-block;
}
.panel-tag [data-edit-btn],
.panel-tag.active [data-view-btn],
.panel-tag .el-tag__close,
.panel-tag .button-new-tag {
  display: none;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.pT10 {
  margin-top: 10px;
}
</style>

