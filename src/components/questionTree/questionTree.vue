<template>
  <div :class="[paperStyle.arrangement==1?'lvh-cont lvh-cont-remove-line':'lv-cont']" :id="treeId">
    <div
      class="topic-panel-list"
      id="topic-panel-list"
      :class="{'topic-empty':(pageFrom=='tableDataShow'||hasTreeData||!isShowCloseBtn)?false:true}"
    >
      <template v-for="(cels,celsIndex) in treeData.questionList">
        <span id="linedFeed" v-if="cels.currNode.lineFeed == 1">
          <br>
        </span>
        <template v-if="pageFrom!='tableDataShow'">
          <template v-if="cels.currNode.questionType==300" v-for="(cel,celIndex) in cels.childList">
            <template v-if="cel.currNode.paperTemplateId!='BOTTOM'">
              <questionNode
                :node="cel"
                :showNodeID="showNodeID"
                :rootNode="cels"
                :nodeIndex="celIndex"
                :isLastNode="(celIndex==(cels.childList.length-1))?true:false"
                :activeQuestion="activeQuestion"
                :isShowCloseBtn="isShowCloseBtn"
                :hideNode="hideNode"
                :styleHierarchy="styleHierarchy"
                :saveValue="saveValue"
                :tempSaveValue="tempSaveValue"
                :units="units"
                :operationNode="operation.node"
                :newScoreHierarchyCode="newScoreHierarchyCode"
                :hasSave="hasSave"
                :tempSaveValueComplete="tempSaveValueComplete"
                :addedOption="addedOption"
                :columnWidth="columnWidth"
                :isTreeDisabled="isTreeDisabled"
                :mode="mode"
                :treeId="treeId"
              ></questionNode>
            </template>
            <template v-if="cel.currNode.paperTemplateId=='BOTTOM'">
              <div class="am-legend-ft">
                <div style="margin-top:-20px;position:relative">
                  <template v-for="(ce,ceIndex) in cel.childList">
                    <questionNode
                      :node="ce"
                      :showNodeID="showNodeID"
                      :nodeIndex="celIndex"
                      :isLastNode="(ceIndex==(cel.childList.length-1))?true:false"
                      :rootNode="cel"
                      :activeQuestion="activeQuestion"
                      :isShowCloseBtn="isShowCloseBtn"
                      :hideNode="hideNode"
                      :styleHierarchy="styleHierarchy"
                      :saveValue="saveValue"
                      :tempSaveValue="tempSaveValue"
                      :units="units"
                      :operationNode="operation.node"
                      :newScoreHierarchyCode="newScoreHierarchyCode"
                      :hasSave="hasSave"
                      :tempSaveValueComplete="tempSaveValueComplete"
                      :addedOption="addedOption"
                      :columnWidth="columnWidth"
                      :isTreeDisabled="isTreeDisabled"
                      :mode="mode"
                      :treeId="treeId"
                    ></questionNode>
                  </template>
                </div>
              </div>
            </template>
          </template>

          <!-- 预览效果，标签题附属题当做一级来显示 -->
          <template v-if="!isShowCloseBtn">
            <template v-if="!(cels.currNode.questionType == 200 && cels.currNode.aliasType == 3)">
              <span id="lineFeed" v-if="cels.currNode.lineFeed == 1">
                <br>
              </span>
              <questionNode
                :node="cels"
                :rootNode="cels"
                :isLastNode="(celsIndex==(treeData.questionList.length-1))?true:false"
                :nodeIndex="celsIndex"
                :activeQuestion="activeQuestion"
                :isShowCloseBtn="isShowCloseBtn"
                :showNodeID="showNodeID"
                :hideNode="hideNode"
                :styleHierarchy="styleHierarchy"
                :saveValue="saveValue"
                :tempSaveValue="tempSaveValue"
                :units="units"
                :operationNode="operation.node"
                :newScoreHierarchyCode="newScoreHierarchyCode"
                :hasSave="hasSave"
                :tempSaveValueComplete="tempSaveValueComplete"
                :addedOption="addedOption"
                :columnWidth="columnWidth"
                :isTreeDisabled="isTreeDisabled"
                :mode="mode"
                :treeId="treeId"
                v-if="cels.currNode.questionType!=300"
                :key="'tree'+cels.currNode.uniqueId+cels.currNode.selfPropagationId+cels.currNode.questionType"
                ref="questionNode"
              ></questionNode>
            </template>
            <template
              v-if="cels.currNode.questionType == 200 && cels.currNode.aliasType == 3"
              v-for="(cell,cellIndex) in cels.childList"
            >
              <span id="lineFeed" v-if="cell.currNode.lineFeed == 1 || cels.currNode.lineFeed == 1">
                <br>
              </span>
              <questionNode
                :node="cell"
                :rootNode="cels"
                :isLastNode="(cellIndex==(cels.childList.length-1))?true:false"
                :nodeIndex="cellIndex"
                :activeQuestion="activeQuestion"
                :isShowCloseBtn="isShowCloseBtn"
                :showNodeID="showNodeID"
                :hideNode="hideNode"
                :styleHierarchy="styleHierarchy"
                :saveValue="saveValue"
                :tempSaveValue="tempSaveValue"
                :units="units"
                :operationNode="operation.node"
                :newScoreHierarchyCode="newScoreHierarchyCode"
                :hasSave="hasSave"
                :tempSaveValueComplete="tempSaveValueComplete"
                :addedOption="addedOption"
                :columnWidth="columnWidth"
                :isTreeDisabled="isTreeDisabled"
                :mode="mode"
                :treeId="treeId"
                v-if="cels.currNode.questionType!=300"
                :key="'tree'+cell.currNode.uniqueId+cell.currNode.selfPropagationId+cell.currNode.questionType"
                ref="questionNode"
              ></questionNode>
            </template>
          </template>
          <!-- 配置界面效果isShowCloseBtn&& -->
          <template v-if="isShowCloseBtn&&cels.currNode.questionType!=300">
            <questionNode
              :node="cels"
              v-if="cels.currNode.questionType!=300"
              :rootNode="cels"
              :isLastNode="(celsIndex==(treeData.questionList.length-1))?true:false"
              :nodeIndex="celsIndex"
              :activeQuestion="activeQuestion"
              :isShowCloseBtn="isShowCloseBtn"
              :showNodeID="showNodeID"
              :hideNode="hideNode"
              :styleHierarchy="styleHierarchy"
              :saveValue="saveValue"
              :tempSaveValue="tempSaveValue"
              :units="units"
              :operationNode="operation.node"
              :newScoreHierarchyCode="newScoreHierarchyCode"
              :hasSave="hasSave"
              :tempSaveValueComplete="tempSaveValueComplete"
              :addedOption="addedOption"
              :columnWidth="columnWidth"
              :isTreeDisabled="isTreeDisabled"
              :mode="mode"
              :treeId="treeId"
              :key="'tree'+cels.currNode.uniqueId+cels.currNode.selfPropagationId+cels.currNode.questionType"
              ref="questionNode"
            ></questionNode>
          </template>
        </template>
        <template v-else>
          <questionNodeS
            :key="cels.currNode.uniqueId"
            :node="cels"
            :pageFrom="pageFrom"
            :rootNode="cels"
            :activeQuestion="activeQuestion"
            :showNodeID="showNodeID"
            :hideNode="hideNode"
            :styleHierarchy="styleHierarchy"
            :saveValue="saveValue"
            :tempSaveValue="tempSaveValue"
            :units="units"
            :operationNode="operation.node"
            :newScoreHierarchyCode="newScoreHierarchyCode"
            :hasSave="hasSave"
            :tempSaveValueComplete="tempSaveValueComplete"
            :addedOption="addedOption"
            :isShowCloseBtn="isShowCloseBtn"
          ></questionNodeS>
        </template>
      </template>

      <div class="no-data" v-if="!hasTreeData&&pageFrom!='knowledge'">
        <img src="../../image/no-data/no-data-notice.png">
        <div class="responsive-txt">
          <div class="txt">无评估项</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import questionNode from "./questionNode";
import common, { ajaxAsync } from "@/util/common";
import bus from "@/bus.js";
import { mapState } from "vuex";
import questionMixin from "./questionMixin";
import { getCatalogue } from "@/util/util";
import questionNodeS from "./questionNodeS";

export default {
  name: "questionTree",
  data() {
    return {
      saveValue: {},
      showNodeID: [],
      styleHierarchy: 1,
      logicNode: [],
      operation: {},
      popHeight: 0,
      units: [],
      dic: [],
      hideNode: [], //更换按钮隐藏ID
      allNode: [],
      addedNode: [], //题外增加的节点
      groupLogic: [],
      addedOption: [],
      catherNode: [],
      selfPropagationId: 1,
      usedSelfId: [],
      treeData: {}, //$.extend(true, [], this.questionList),
      isInAdd: false,
      tempSaveValue: {},
      tempSaveValueComplete: {},
      localMode: this.mode,
      newScoreHierarchyCode: "",
      hasSave: false,
      isTree: true,
      columnWidth: "300px"
      // isTreeDisabled:false
    };
  },
  mixins: [questionMixin],
  props: [
    "mode",
    "initFlag",
    "isTreeDisabled",
    "treeId",
    "activeQuestion",
    "pageFrom",
    "isShowCloseBtn"
  ],
  created: function() {
    this.localMode = this.mode;
    if (this.localMode != "show") {
      // bus.$off('seleteRadio');
      // bus.$off('seleteCheckBox');
      // bus.$off('seleteInput');
      // bus.$off('addNode');
      // bus.$off('closeFixed');
      // bus.$off('deleteNode');
      // bus.$off('setTempSaveValue');
      // bus.$off('clearTemplate');
      // bus.$off('clearNewScore');
      // bus.$off('setTempSave');
      // bus.$off('closeFixPop');
      // bus.$off('setPopHeight');
      this.$on("closeFixPop", this.closeFixPop);
      this.$on("setPopHeight", this.setPopHeight);
      this.$on("seleteRadio", this.seleteRadio);
      this.$on("seleteCheckBox", this.seleteCheckBox);
      this.$on("seleteInput", this.seleteInput);
      this.$on("addNode", this.addNode);
      this.$on("closeFixed", this.closeFixed);
      this.$on("deleteNode", this.deleteNode);

      this.$on("setTempSave", this.setTempSave);
      this.$on("setTempSaveValue", this.setTempSaveValue);
      this.$on("clearNewScore", this.clearNewScore);
      this.$on("clearTemplate", this.clearTemplate);
      this.$on("setAddNode", this.setAddNode);
      this.$on("showPopLogic", this.showPopLogic);
    }
    if (this.mode == "again") {
      this.localMode = "add";
    }
    this.columnWidth = ($(".amp-confirm-scroll").width() - 100) / 2 + "px";
  },
  mounted: function() {},
  computed: {
    ...mapState(["patient", "paperStyle"]),
    hasTreeData: function() {
      return (
        this.treeData &&
        this.treeData.questionList &&
        this.treeData.questionList.length > 0
      );
    }
  },
  methods: {
    setPopHeight: function(height) {
      this.popHeight = height;
    },
    /*初始化树结构*/
    initData: function(treeData) {
      /*this.treeData={};*/
      if (!treeData.questionList) {
        return;
      }
      //debugger;
      let ss = this.activeQuestion;
      this.localMode = this.mode;
      if (this.mode == "again") {
        this.localMode = "add";
      }
      this.showNodeID = [];
      this.addedOption = [];
      this.allNode = [];
      this.logicNode = [];
      this.setNodeInfo(treeData.questionList);
      this.treeData = Object.seal(treeData);
      var that = this;
      this.treeData.questionList.forEach(data => {
        if (data.currNode.paperTemplateId == "NEWS") {
          that.newScoreHierarchyCode =
            data.currNode.hierarchyCode + "" + data.currNode.questionId;
        }
      });
      //this.initCatheter();
      this.saveValue = {};
      if (this.localMode == "add") {
        // this.treeData.questionList.forEach(data_n => {
        //     that.getValidNode(data_n, 'add');
        // })
        this.treeData.questionList.forEach((data_n, index) => {
          that.getValidNode(data_n, "add");
        });
      }
    },
    // 新增问题
    addQuestion: async function(que, evaluationId) {
      let fatherNode = this.treeData.questionList.find(ql => {
        return ql.currNode.uniqueId == que.parentUniqueId;
      });
      let uniqueId = "";
      let childNodes = [];

      if (!que.parentUniqueId) {
        uniqueId = que.uniqueId;
        childNodes = this.treeData.questionList;
      } else if (fatherNode) {
        uniqueId = que.uniqueId;
        childNodes = fatherNode.childList;
      } else {
        uniqueId = que.parentUniqueId;
        childNodes = this.treeData.questionList;
      }

      let question = await ajaxAsync({
        url: "knowledge-service/evaluation/paper2/question/" + uniqueId,
        dataType: "json",
        type: "get",
        data: {
          evaluationId: evaluationId
        }
      });

      /*查二级带出一级时删除其他二级*/
      if (que.parentUniqueId && !fatherNode) {
        question.childList = question.childList.filter(cl => {
          return cl.currNode.uniqueId == que.uniqueId;
        });
      }

      this.setNodeInfo(question);
      childNodes.push(question);
      this.getValidNode(question, "add");
      if (fatherNode) {
        this.$refs["questionNode"][
          this.treeData.questionList.indexOf(fatherNode)
        ].$forceUpdate();
      }

      let addedChildNode = [];
      if (!que.parentUniqueId) {
        addedChildNode = question.childList.map(cl => {
          return cl.uniqueId;
        });
      }
      return addedChildNode;
    },
    //添加节点
    addNodeById: function(qnode, type, optionId, aliasName) {
      var that = this;
      var questionId = qnode.currNode.questionId;
      this.selfPropagationId = this.selfPropagationId + 1;
      while (this.usedSelfId.indexOf(this.selfPropagationId + "") > -1) {
        this.selfPropagationId = this.selfPropagationId + 1;
      }
      var temSelfPropagationId =
        new Date().format("yyyyMMddhhmmss") + this.selfPropagationId;
      if (type == "show") {
        temSelfPropagationId = optionId;
      }
      // that.treeData.forEach(td => {
      //     if (td.moduleId == qnode.moduleId) {
      var node = that.getFatherNodeById(qnode.currNode.hierarchyCode);
      var fNode = that.getFatherNodeById(node.currNode.hierarchyCode);
      var copyNode = $.extend(true, {}, node);
      copyNode.childList = [$.extend(true, {}, qnode)];
      copyNode.currNode.optionList = copyNode.currNode.optionList.filter(ol => {
        return ol.optionType != 61;
      });
      copyNode.currNode.optionList.forEach(op => {
        if (op.optionType == 23) {
          op.aliasName = aliasName;
        }
      });

      var tNode;
      if (fNode.constructor === Array) {
        tNode = fNode;
      } else {
        tNode = fNode.childList;
      }
      if (type == "show") {
        var tem = tNode.find(nd => {
          return (
            nd.currNode.questionId == node.currNode.questionId &&
            nd.currNode.selfPropagationId == temSelfPropagationId
          );
        });
        // if (tem && that.operation.node.optionType == 61) {
        //   common.tip_msg('请不要重复添加！');
        //   return;
        // }
      }
      //debugger;
      that.addedOption.push({
        //optionCode: item.catalogueCode,
        optionId: optionId,
        questionId: questionId,
        selfAddQuestions: "addedNode",
        hierarchyCode: qnode.currNode.hierarchyCode,
        optionContent: aliasName,
        //logicList: item.logicList,
        selfPropagationId: temSelfPropagationId,
        parentQuestionId: node.currNode.questionId
      });

      //fNode.childList = node;
      var template;
      var flag = 0;
      that.addSelfPropagationId(copyNode, temSelfPropagationId);
      if (
        that.hideNode.find(hn => {
          return (
            hn.uniqueId == copyNode.currNode.uniqueId &&
            hn.selfPropagationId == temSelfPropagationId
          );
        })
      ) {
        var tem = tNode.find(nd => {
          return (
            nd.currNode.questionId == copyNode.currNode.questionId &&
            nd.currNode.selfPropagationId == temSelfPropagationId
          );
        });
        // template = $.extend(true, {}, tem);

        tNode.splice(tNode.indexOf(tem), 1);
        that.hideNode = that.hideNode.filter(hn => {
          return !(
            hn.uniqueId == copyNode.currNode.uniqueId &&
            hn.selfPropagationId == temSelfPropagationId
          );
        });
      }

      for (let i = 0; i < tNode.length; i++) {
        let childNode = tNode[i];
        if (
          childNode.currNode.questionId == node.currNode.questionId &&
          childNode.currNode.selfPropagationId == undefined &&
          that.operation.node.optionType == 61
        ) {
          flag = i;
        } else if (
          childNode.currNode.questionId == that.operation.node.questionId &&
          childNode.currNode.selfPropagationId ==
            that.operation.node.selfPropagationId &&
          that.operation.node.optionType == 63
        ) {
          flag = i;
        }
      }
      //if (template) {
      if (that.operation.node.optionType == 63) {
        that.hideNode.push({
          uniqueId: tNode[flag].currNode.uniqueId,
          selfPropagationId: tNode[flag].currNode.selfPropagationId
        });
        // that.addedOption = that.addedOption.filter(ao => {
        //   return !node.childList.find(cl => {
        //     return cl.currNode.questionId == ao.questionId &&
        //       cl.currNode.selfPropagationId == ao.selfPropagationId && cl.currNode.hierarchyCode == ao.hierarchyCode
        //   })
        // })

        that.addedOption = that.addedOption.filter(ao => {
          return !(
            tNode[flag].childList.length > 0 &&
            tNode[flag].childList[0].currNode.hierarchyCode ==
              ao.hierarchyCode &&
            tNode[flag].currNode.selfPropagationId == ao.selfPropagationId
          );
        });
        tNode[flag].childList.forEach(cj => {
          that.getValidNode(cj, "nextRemove");
        });
      }

      tNode.splice(flag, 0, copyNode);
      copyNode.childList.forEach(cl => {
        that.getValidNode(cl, "add");
      });
      that.getValidNode(copyNode, "add");
      //that.getSelectedNode(qnode,copyNode.moduleId);
      let optionIndex = 1;
      tNode.forEach(tn => {
        if (
          tn.currNode.questionId == copyNode.currNode.questionId &&
          tn.currNode.optionId == copyNode.currNode.optionId &&
          tn.currNode.selfPropagationId &&
          !that.hideNode.find(hn => {
            return (
              hn.uniqueId == tn.currNode.uniqueId &&
              hn.selfPropagationId == tn.currNode.selfPropagationId
            );
          })
        ) {
          tn.currNode.optionList.forEach(ol => {
            if (ol.optionType == 24) {
              ol.aliasName = optionIndex;
              optionIndex++;
            }
          });
        }
      });
      //     }
      // })
    },
    /*删除节点*/
    deleteNode: function(node) {
      var that = this;
      // 添加题需同时吧父节点添加题删除
      var fnode = that.getFatherNodeById(
        node.currNode.hierarchyCode,
        node.currNode.selfPropagationId
      );
      let tNode;
      if (fnode.constructor == Array) {
        tNode = fnode;
      } else {
        tNode = fnode.childList;
      }
      // tNode.splice(0,1);
      var flag;
      var floatNode;
      tNode.forEach((cl, index) => {
        if (
          cl.currNode.uniqueId == node.currNode.uniqueId &&
          cl.currNode.selfPropagationId == node.currNode.selfPropagationId
        ) {
          flag = index;
        }
        if (cl.currNode.questionType == "60") {
          floatNode = cl;
        }
      });
      if (floatNode) {
        that.tempSaveValue[
          floatNode.currNode.hierarchyCode + floatNode.currNode.questionId
        ] = that.tempSaveValue[
          floatNode.currNode.hierarchyCode + floatNode.currNode.questionId
        ].filter(ts => {
          return !(
            ts.optionId == node.currNode.selfPropagationId &&
            ts.questionId == floatNode.currNode.questionId
          );
        });
      }
      that.addedOption = that.addedOption.filter(ao => {
        return !node.childList.find(cl => {
          return (
            cl.currNode.questionId == ao.questionId &&
            cl.currNode.selfPropagationId == ao.selfPropagationId &&
            cl.currNode.hierarchyCode == ao.hierarchyCode
          );
        });
      });
      that.getValidNode(tNode[flag], "nextRemove");
      tNode.splice(flag, 1);
      let optionIndex = 1;
      tNode.forEach(tn => {
        if (
          tn.currNode.questionId == node.currNode.questionId &&
          tn.currNode.optionId == node.currNode.optionId &&
          tn.currNode.hierarchyCode == node.currNode.hierarchyCode &&
          tn.currNode.selfPropagationId &&
          !that.hideNode.find(hn => {
            return (
              hn.uniqueId == tn.currNode.uniqueId &&
              hn.selfPropagationId == tn.currNode.selfPropagationId
            );
          })
        ) {
          tn.currNode.optionList.forEach(ol => {
            if (ol.optionType == 24) {
              ol.aliasName = optionIndex;
              optionIndex++;
            }
          });
        }
      });
    },
    // 单选选中
    seleteRadio: function(obj) {
      let uniqueId = obj.node.currNode.uniqueId;
      let item = obj.item;
      if (!this.saveValue[uniqueId]) {
        this.$set(this.saveValue, uniqueId, []);
      }
      let nowSv = this.saveValue[uniqueId].find(value => {
        return (
          ((!!value.optionId && item.optionId == value.optionId) ||
            (!value.optionId && value.optionKey == item.optionKey)) &&
          value.isShow &&
          value.selfPropagationId == obj.node.currNode.selfPropagationId
        );
      });
      // 点击已选中节点直接返回
      if (nowSv) {
        if (obj.isCancel) {
          this.findNodeByOption(nowSv, obj.node, "remove");
        }
        return;
      }
      var radioItem = this.saveValue[uniqueId].find(value => {
        return (
          value.isShow &&
          value.selfPropagationId == obj.node.currNode.selfPropagationId
        );
      });
      // 去除原有选中选项
      if (radioItem) {
        //
        this.findNodeByOption(radioItem, obj.node, "remove");
      }
      // 选中
      this.findNodeByOption(this.getQesSvObj(item, obj.node), obj.node, "add");
    },

    /*弹出逻辑处理*/
    showPopLogic: function(obj) {
      let item = obj.item;
      this.loginDeal(
        this.getQesSvObj(item, obj.node),
        obj.node,
        "add",
        "clickLogic"
      );
      this.$nextTick(() => {
        // layer.open(obj.item.logicList[0].conclusionList[0])
      });
    },
    /*批量录入添加项*/
    setAddNode: function(addOption) {
      if (!this.saveValue[addOption.uniqueId]) {
        this.$set(this.saveValue, addOption.uniqueId, []);
      }
      this.saveValue[addOption.uniqueId].push(addOption);
    },
    // 多选选中
    seleteCheckBox: function(obj) {
      let item = obj.item;
      let uniqueId = obj.node.currNode.uniqueId;
      if (!this.saveValue[uniqueId]) {
        this.$set(this.saveValue, uniqueId, []);
      }
      // 点击已选中节点取消选中
      let checkItem = this.saveValue[uniqueId].find(value => {
        return (
          value.isShow &&
          ((!!value.optionId && value.optionId == obj.item.optionId) ||
            (!value.optionId && value.optionKey == obj.item.optionKey)) &&
          value.selfPropagationId == obj.node.currNode.selfPropagationId
        );
      });
      if (checkItem) {
        this.findNodeByOption(checkItem, obj.node, "remove");
        return;
      }
      let currNode = obj.node.currNode;
      this.findNodeByOption(this.getQesSvObj(item, obj.node), obj.node, "add");
    },
    /*文本框保存 单位保存*/
    seleteInput: function(obj) {
      let uniqueId = obj.node.currNode.uniqueId;

      if (!this.saveValue[uniqueId]) {
        this.$set(this.saveValue, uniqueId, []);
      }
      let svObj;
      let index;
      this.saveValue[uniqueId].forEach((sv, ind) => {
        if (
          sv.isShow &&
          (!obj.item ||
            (!!obj.item.optionId && sv.optionId == obj.item.optionId) ||
            (!obj.item.optionId && obj.item.optionKey == sv.optionKey)) &&
          sv.selfPropagationId == obj.node.currNode.selfPropagationId
        ) {
          index = ind;
          svObj = sv;
        }
      });
      if (!svObj) {
        svObj = this.getQesSvObj(obj.item, obj.node, {});
        this.saveValue[uniqueId].push(svObj);
        index = this.saveValue[uniqueId].length - 1;
      }
      if (obj.type == "radio") {
        svObj.unit = obj.unitCode;
      } else {
        svObj.optionKey = obj.item.optionKey;
        svObj.optionContent = obj.value;
        svObj.checkList = obj.node.currNode.checkList;
      }
      this.saveValue[uniqueId].splice(index, 1, svObj);
    },
    // 添加按钮点击
    addNode: function(obj) {
      var that = this;
      // 反正点击按钮被连续点击多次
      // if (!window.isInAdd) {
      //     window.isInAdd = true;
      //     setTimeout(function() {
      //         window.isInAdd = false;
      //     }, 100)
      // } else {
      //     return;
      // }
      // // 不知什么原因 有时treeData数据会取不到
      // if (this.treeData.length == 0 || this.treeData[0].questionList.length == 0) {
      //     this.treeData = window.treeData;
      //     setTimeout(function() {
      //         window.isInAdd = false;
      //         that.addNode(item);
      //     }, 100)
      //     return;
      // }
      let item = Object.assign(obj.item, {
        uniqueId: obj.node.currNode.uniqueId,
        hierarchyCode: obj.node.currNode.hierarchyCode
      });
      this.findNodeByOption(item, obj.node, "click");
    },

    // 浮动题触发添加
    closeFixed: function(objs) {
      var that = this;
      let item = objs.item;
      var obj = {
        optionCode: item.catalogueCode,
        optionId: item.optionId,
        questionId: item.questionId,
        questionCode: item.questionCode,
        logicList: item.logicList,
        selfPropagationId: item.selfPropagationId,
        hierarchyCode: item.hierarchyCode,
        catheterRecordId: item.catheterRecordId,
        optionKey: item.optionKey,
        uniqueId: item.uniqueId,
        isShow: true
      };
      this.findNodeByOption(obj, objs.node, "addSelf");
      return;
    },
    /*关闭弹出层*/
    closeFixPop: function(node) {
      let sIndex = this.showNodeID.indexOf(this.getShowNodeUniqeId(node));
      if (sIndex > -1) {
        this.showNodeID.splice(sIndex, 1);
      }
    },

    // 返回树结构 保存模板用
    getTreeData: function() {
      var that = this;
      var treeData = $.extend(true, {}, this.treeData);
      // treeData = $.extend(true, [], treeData);
      treeData.questionList = treeData.questionList.filter(tq => {
        return (
          that.addedNode.indexOf(tq.currNode.questionId) < 0 &&
          that.catherNode.indexOf(tq.currNode.questionId) < 0
        );
      });

      treeData.questionList = treeData.questionList.map(ql => {
        return { questionId: ql.currNode.questionId };
      });

      return $.extend(true, [], [treeData]);
    },
    // 返回保存对象
    getSaveValue: function() {
      var that = this;
      this.hasSave = true;
      //this.getAssessmentName();
      return new Promise((reslove, reject) => {
        var tempSaveValue = [];
        //var that = this;
        for (var key in that.tempSaveValue) {
          if (that.tempSaveValue[key].length > 0) {
            for (let j = 0; j < that.tempSaveValue[key].length; j++) {
              var selfPropagationId =
                that.tempSaveValue[key][j].selfPropagationId || "99999";
              var tempQuestionId = that.tempSaveValue[key][j].tempQuestionId;
              if (
                that.tempSaveValueComplete[key] &&
                !that.tempSaveValueComplete[key][selfPropagationId] &&
                that.showNodeID.includes(tempQuestionId)
              ) {
                // TODO&& that.showNodeID[moduleID].find(sn => {
                //     return sn.questionId == tempQuestionId
                // })
                var id = ("#" + tempQuestionId).replace(
                  new RegExp("\\|", "g"),
                  "\\|"
                );
                layer.msg("请完善评估内容", { time: 1000 });
                // $('#mainScroll').scrollTop(that.setHeight($(id)[0]));
                $(".amp-confirm-scroll").animate(
                  {
                    scrollTop: that.setHeight($(id)[0]) - 70
                  },
                  200
                );
                return reslove(false);
              }
            }
            var sv = that.tempSaveValue[key][0];
            console.log(
              sv.tempQuestionId,
              ":",
              that.showNodeID.includes(sv.tempQuestionId)
            );
            if (
              that.showNodeID.includes(sv.tempQuestionId) ||
              sv.paperTemplateId == "PainSite"
            ) {
              console.log(key, ":", that.tempSaveValue[key].length);
              tempSaveValue = tempSaveValue.concat(that.tempSaveValue[key]);
            }
          }
        }

        for (var item in that.saveValue) {
          for (var key in that.saveValue[item]) {
            if (
              that.saveValue[item][key].checkList &&
              that.saveValue[item][key].checkList.length > 0 &&
              that.saveValue[item][key].checkList[0].checkError &&
              that.saveValue[item][key].isShow
            ) {
              var tempQuestionId = that.saveValue[item][key].uniqueId;
              var id = ("#" + tempQuestionId).replace(
                new RegExp("\\|", "g"),
                "\\|"
              );
              layer.msg("校验错误,请修改！", { time: 1000 });
              // $('#mainScroll').scrollTop(that.setHeight($(id)[0]));
              $(".amp-confirm-scroll").animate(
                {
                  scrollTop: that.setHeight($(id)[0]) - 70
                },
                200
              );
              return reslove(false);
            }
          }
        }
        that.$nextTick(() => {
          if ($(".txt-danger").length != 0) {
            layer.msg("必填项验证错误,请修改！", { time: 1000 });
            let container = $(".txt-danger")[0];
            // $('#mainScroll').scrollTop(that.setHeight(container) - 30);
            $(".amp-confirm-scroll").animate(
              {
                scrollTop: that.setHeight(container) - 70
              },
              200
            );
            return reslove(false);
          }
          var saveValue = [];
          for (var i in that.saveValue) {
            saveValue = saveValue.concat(that.saveValue[i]);
          }
          return reslove(
            $.extend(
              true,
              [],
              saveValue
                .filter(sv => {
                  return sv.isShow;
                })
                .concat(tempSaveValue)
                .concat(that.addedOption)
            )
          );
        });
      });
    },
    setHeight(obj) {
      //var obj = event.currentTarget;
      var parObj = obj;
      var top = obj.offsetTop;
      while ((parObj = parObj.offsetParent)) {
        top += parObj.offsetTop;
      }
      return top;
    },

    /*导管id*/
    initCatheterId: function(node, id) {
      var that = this;
      this.$set(node.currNode, "catheterRecordId", id);
      node.currNode.optionList.forEach(op => {
        that.$set(op, "catheterRecordId", id);
      });
      node.childList.forEach(cl => {
        that.initCatheterId(cl, id);
      });
    },
    setTempSave(item) {
      if (!this.tempSaveValueComplete[item.tempHierarchyCode]) {
        this.$set(this.tempSaveValueComplete, item.tempHierarchyCode, {});
      }
      var selfPropagationId = item.selfPropagationId || "99999";
      this.tempSaveValueComplete[item.tempHierarchyCode][selfPropagationId] =
        item.isCompeleted;
    },
    // 模板选中
    setTempSaveValue(item) {
      if (!this.tempSaveValue[item.tempHierarchyCode]) {
        this.$set(this.tempSaveValue, item.tempHierarchyCode, []);
      }
      let k = -1;
      for (
        let i = 0;
        i < this.tempSaveValue[item.tempHierarchyCode].length;
        i++
      ) {
        if (
          item.paperTemplateId == "SiteMatrixMap" ||
          item.paperTemplateId == "PainSite"
        ) {
          //部位矩阵图是多选，用parentQuestionId来区分
          if (
            this.tempSaveValue[item.tempHierarchyCode][i].parentQuestionId ==
              item.parentQuestionId &&
            this.tempSaveValue[item.tempHierarchyCode][i].selfPropagationId ==
              item.selfPropagationId
          ) {
            k = i;
          }
        } else {
          if (
            this.tempSaveValue[item.tempHierarchyCode][i].questionId ==
              item.questionId &&
            this.tempSaveValue[item.tempHierarchyCode][i].selfPropagationId ==
              item.selfPropagationId
          ) {
            k = i;
          }
        }
      }

      if (k > -1) {
        if (
          item.optionContent != undefined &&
          $.trim(item.optionContent) == "" &&
          !item.paperTemplateId == "HumanFigure"
        ) {
          this.tempSaveValue[item.tempHierarchyCode].splice(k, 1);
        } else {
          this.tempSaveValue[item.tempHierarchyCode].splice(k, 1, item);
        }
      } else {
        this.tempSaveValue[item.tempHierarchyCode].push(item);
      }
      //console.log(this.tempSaveValue);
      bus.$emit("getCompleted" + item.tempHierarchyCode, {
        tempHierarchyCode: item.tempHierarchyCode,
        selfPropagationId: item.selfPropagationId
      });
    },
    clearTemplate(obj) {
      let tempHierarchyCode = obj.tempHierarchyCode;
      let type = obj.clearType;
      if (
        obj.source == "bodyPart" ||
        obj.source == "nonCatheter" ||
        obj.source == "painScoreTool" ||
        obj.source == "stockData"
      ) {
        if (
          this.tempSaveValue[tempHierarchyCode] &&
          this.tempSaveValue[tempHierarchyCode].length > 0
        ) {
          let arr = this.tempSaveValue[tempHierarchyCode];
          this.tempSaveValue[tempHierarchyCode] = this.tempSaveValue[
            tempHierarchyCode
          ].filter(ak => {
            return ak.selfPropagationId != obj.selfPropagationId;
          });
        }
      } else {
        if (
          this.tempSaveValue[tempHierarchyCode] &&
          this.tempSaveValue[tempHierarchyCode].length > 0
        ) {
          if (obj.source == "fall") {
            this.tempSaveValue[tempHierarchyCode] = this.tempSaveValue[
              tempHierarchyCode
            ].filter(a => {
              return (
                a.parentQuestionId == type &&
                a.selfPropagationId == obj.selfPropagationId
              );
            });
          }
        }
      }
    },
    clearNewScore(tempHierarchyCode, curChildList) {
      if (this.tempSaveValue[tempHierarchyCode]) {
        for (let i = 0; i < curChildList.length - 1; i++) {
          for (
            let k = this.tempSaveValue[tempHierarchyCode].length - 1;
            k >= 0;
            k--
          ) {
            if (
              this.tempSaveValue[tempHierarchyCode][k].questionId ==
              curChildList[i].currNode.questionId
            ) {
              this.tempSaveValue[tempHierarchyCode].splice(k, 1);
            }
          }
        }
      }
    },
    /*返回动态项id*/
    getDynamicList: function() {
      let uniqueIds = [];
      this.treeData.questionList.forEach(ql => {
        if (ql.childList.length == 0) {
          uniqueIds.push(ql.currNode.uniqueId);
          return;
        }
        ql.childList.forEach(cl => {
          uniqueIds.push(cl.currNode.uniqueId);
        });
      });
      return uniqueIds;
    },
    /*获取前两层层级code*/
    getTopDynamicList: function() {
      let uniqueIds = [];
      this.treeData.questionList.forEach(ql => {
        uniqueIds.push(ql.currNode.uniqueId);
        ql.childList.forEach(cl => {
          uniqueIds.push(cl.currNode.uniqueId);
        });
      });
      return uniqueIds;
    }
  },
  components: {
    questionNode: questionNode,
    questionNodeS: questionNodeS
  },
  watch: {
    initFlag: function() {
      var that = this;
      Vue.nextTick(function() {
        that.initData();
      });
    }
  }
};
</script>
<style scoped>
</style>
