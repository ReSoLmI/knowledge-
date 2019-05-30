<template>
  <div class="lv-inline">
    <div
      class="lv-item lv-title"
      v-if="node.currNode.aliasType != 3"
      :style="{'margin-left':'5px','width':nodeWidth(node.currNode.style.width)+'px'}"
    >{{node.currNode|showNodeName}}</div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList">
        <template v-if="mode!=='pageShow'">
          <div class="am-input-unit">
            <input
              type="text"
              v-if="!item.style||item.style.height == 1"
              class="input-text"
              :value="getValueOp"
              @input="checkInputUnit(item,node,$event)"
              :maxLength="item.style.maxLength||100"
              :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px','min-width':'220px'}"
              disabled="disabled"
            >
            <textarea
              rows="4"
              v-if="item.style&&item.style.height == 2"
              class="input-text input-textarea"
              :value="getValueById(item,node)"
              @input="checkInputUnit(item,node,$event)"
              :maxLength="item.style.maxLength||100"
              :style="{'padding-right':0,'width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}"
              :disabled="isTreeDisabled"
            ></textarea>
            <i v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
          </div>
          <template v-if="item.unitList.length>1">
            <div class="am-btn-rdo am-ml-10" v-if="showUnit">
              <a
                v-for="(it,index) in item.unitList"
                v-bind:class="{active:isUnitCodeSel(node.currNode,item,it.unitCode)}"
                @click="checkRadioUnit(node,item,it)"
              >{{it.unitName}}</a>
            </div>
          </template>
        </template>
        <template v-if="mode=='pageShow'">
          <span
            :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':nodeWidth(item.style.width)+'px','margin-left':(item.style.margin || 0) + 'px'}"
          >{{getValueOp}}</span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import questionNodeMixin from "@/components/questionTree/questionNode/questionNodeMix";
import bus from "@/bus.js";
import { calculateAge, getUrlParam } from "@/util/common_b";
export default {
  name: "user",
  mixins: [questionNodeMixin],
  props: ["node", "saveValue", "mode"],
  data() {
    return {
      wardCode: getUrlParam("wardCode"),
      contentValue: ""
    };
  },
  mounted: async function() {
    if (!this.user.loginName) {
      await this.setUserInfo();
    }
    if (
      !this.saveValue[this.node.currNode.uniqueId] &&
      !(this.mode == "add" && this.isTreeDisabled)
    ) {
      this.setInitData();
    }
  },
  computed: {
    ...mapState(["patient", "user", "wardCode_apply", "userfulWidth"]),
    /*获取单选、多选的扩展文本框内容*/
    getValue: function() {
      let node = this.node;
      let uniqueId = node.currNode.uniqueId;
      let svl =
        this.saveValue[uniqueId] &&
        this.saveValue[uniqueId].find(sv => {
          return (
            sv.isShow && sv.selfPropagationId == node.currNode.selfPropagationId
          );
        });
      if (svl) {
        return svl.optionContent;
      } else {
        if (node.currNode.questionType == 90) {
          return new Date().format(item.timeFormat);
        } else {
          return "";
        }
      }
    },
    getValueOp: function() {
      if (this.mode == "add" && this.isTreeDisabled) {
        return "";
      }
      if (
        this.node.currNode.childTemplateId == "CONSULTATION_WARDCODE" &&
        this.mode == "add"
      ) {
        return this.wardCode_apply.value;
      }
      let uniqueId = this.node.currNode.uniqueId;
      let item = this.node.currNode.optionList[0];
      let svl =
        this.saveValue[uniqueId] &&
        this.saveValue[uniqueId].find(sv => {
          return (
            sv.isShow &&
            sv.optionId == item.optionId &&
            sv.selfPropagationId == this.node.currNode.selfPropagationId
          );
        });
      if (svl) {
        return svl.optionContent;
      } else {
        if (this.node.currNode.questionType == 90) {
          return ""; //new Date().format(item.timeFormat);
        } else {
          return "";
        }
      }
    },
    isDisabled: function() {
      return (
        this.node.currNode.childTemplateId === "PAT_INDEX_NO" ||
        this.node.currNode.paperTemplateId === "ORGAN_CODE"
      );
    }
  },
  methods: {
    ...mapActions(["setUserInfo"]),
    setInitData: function() {
      let that = this;
      let value;
      let currNode = this.node.currNode;
      let optionKey = "";
      if (currNode.childTemplateId === "APPLY_WARDCODE") {
        value = this.user.bindedUnits.find(unit => {
          return unit.wardCode == this.wardCode;
        }).wardName;
        optionKey = this.wardCode;
      } else if (currNode.childTemplateId === "APLLY_SIGNATURE") {
        value = this.user.staffName;
        optionKey = this.user.loginName;
      } else if (currNode.childTemplateId === "WARDCODE") {
        value = this.user.bindedUnits.find(unit => {
          return unit.wardCode == this.wardCode;
        }).wardName;
        optionKey = this.wardCode;
      } else if (
        currNode.childTemplateId === "SIGNATURE" ||
        currNode.childTemplateId === "RECORDER"
      ) {
        value = this.user.staffName;
        optionKey = this.user.loginName;
      } else if (currNode.childTemplateId === "CONSULTATION_WARDCODE") {
        value = this.wardCode_apply.value;
        optionKey = this.wardCode_apply.key;
      }
      let obj = {
        node: this.node,
        item: currNode.optionList[0],
        value: value
      };
      obj.item.optionKey = optionKey;
      this.tree.$emit("seleteInput", obj);
    },
    checkInputUnit(node, event) {
      ////
      this.tree.$emit("seleteInput", {
        node: node,
        item: node.currNode,
        value: event.currentTarget.value
      });
    }
  },
  watch: {
    wardCode_apply: function() {
      if (
        this.node.currNode.childTemplateId == "CONSULTATION_WARDCODE" &&
        this.mode == "add" &&
        this.wardCode_apply &&
        !this.isTreeDisabled
      ) {
        this.setInitData();
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
