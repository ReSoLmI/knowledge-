<template>
  <div>
    <div class="header"></div>
    <menuTemplate ref="leftmenu" :currentPage="'assesmentTableSetting'"></menuTemplate>
    <div class="am-page-rcont bg-main">
      <div class="am-page-pd">
        <div class="book-top-cont">
          <div class="book-top-return">
            <a class="txt-return" @click.stop="returnBack()">返回</a>
            <div class="h5">
              <template v-if="!isEditAssesmentName">{{evaluationName}}
                <i class="i-link-upd am-ml-5" style="margin-top: -2px;" @click.stop="clickEditAssesment"></i>
              </template>
              <template v-if="isEditAssesmentName">
                <input type="text" class="input-text w180" v-model="evaluationName" id="inputAssesment" @blur="editAssesmentName" />
                <a @click.stop="editAssesmentName()">保存</a>
              </template>
            </div>
          </div>
          <div class="step-list-cont">
              <ul class="step-list" v-if="lastStepName == 'createNotificationPage'">
              <li class="active">
                <i class="num">1</i><span class="txt">新建或选择模版</span>
              </li>
              <li class="active">
                <i class="num">2</i><span class="txt">配置文书内容</span>
              </li>
              <li class="cur">
                <i class="num">3</i><span class="txt">列表设置</span>
              </li>
            </ul>          
            <ul class="step-list" v-else>
              <li class="active">
                <i class="num">1</i><span class="txt">新建或选择模版</span>
              </li>
              <li class="active">
                <i class="num">2</i><span class="txt">文书样式</span>
              </li>              
              <li class="active">
                <i class="num">3</i><span class="txt">配置文书内容</span>
              </li>
              <li class="cur">
                <i class="num">4</i><span class="txt">列表设置</span>
              </li>
              <li>
                <i class="num">5</i><span class="txt">科室设置</span>
              </li>
              <li>
                <i class="num">6</i><span class="txt">编辑域设置</span>
              </li>
            </ul>            
            <div class="right" v-show="tableFlag">
              <a class="am-btn am-btn-plain-info am-ml-10" @click.stop="cancleSetTableBox()">清空设置</a>
              <a class="am-btn am-btn-plain-info am-ml-10" v-if='lastStepName == "createNotificationPage"' @click.stop="returnHome()">返回首页</a>
              <!-- <a class="am-btn am-btn-plain-info am-ml-10" @click.stop="preShowTableSetting()">预览</a> -->
              <a class="am-btn am-btn-info am-ml-10" v-if='lastStepName != "createNotificationPage"' @click.stop="nextStep()">下一步</a>
            </div>
          </div>
        </div>
        <div class="fixed-contain-midden" v-if="!tableFlag">
          <div class="item-midden">
            <p>如果你想要的列表样式和录入样式一致，请跳过此步</p>
            <div style="margin-bottom: 10px;"><a @click.stop="setTable">开始设置</a></div>
            <p @click.stop="clickSkip()"><a class="am-btn am-btn-info">确认跳过</a></p>
          </div>
        </div>
        <div class="layout-fixed-contain" v-else>
          <div class="layout-lside">
            <ul class="layout-strip">
              <li :class="{'active':tableType==1}" @click.stop="changeTableType(1)">横向</li>
              <li :class="{'active':tableType==2}" @click.stop="changeTableType(2)">纵向</li>
            </ul>
            <div class="layout-thumbnail-cont" v-if="tableType==1">
              <div class="layout-thumbnail layer-style" id="10" @click.stop="clickAddMainColumn(10)"></div>
              <div class="layout-thumbnail layer-style thum-1" id="11" @click.stop="clickAddMainColumn(11)"><i></i></div>
              <div class="layout-thumbnail layer-style thum-2" id="12" @click.stop="clickAddMainColumn(12)"><i></i></div>
              <div class="layout-thumbnail layer-style thum-3" id="13" @click.stop="clickAddMainColumn(13)"><i></i></div>
              <div class="layout-thumbnail layer-style thum-4" id="14" @click.stop="clickAddMainColumn(14)"><i></i><i></i></div>
            </div>
            <div class="layout-thumbnail-cont" v-if="tableType==2">
              <div class="layout-v-thumbnail layer-style" id="10" @click.stop="clickAddMainColumn(10)"></div>
              <div class="layout-v-thumbnail thum-v-1 layer-style" id="11" @click.stop="clickAddMainColumn(11)"><i></i></div>
              <div class="layout-v-thumbnail thum-v-2 layer-style" id="12" @click.stop="clickAddMainColumn(12)"><i></i></div>
              <div class="layout-v-thumbnail thum-v-3 layer-style" id="13" @click.stop="clickAddMainColumn(13)"><i></i></div>
              <div class="layout-v-thumbnail thum-v-4 layer-style" id="14" @click.stop="clickAddMainColumn(14)"><i></i><i></i></div>
            </div>
          </div>
          <div class="topic-layout-rcont" style="width:100px;flex:1;height: 588px;overflow-y: auto;">
            <tableShow ref="tableShow" :columnListData.sync="columnList" :tableType="tableType" :activeColumn="activeColumn" @delMainColumn="delMainColumn" @changeColumn="selectColumn"></tableShow>
          </div>
          <div class="layout-right" v-if="activeColumn&&activeColumn.headId">
            <ul style="height:40px" class="topic-strip">
              <template>
                <li :class="{active:!isLogicSetting}" @click="isLogicSetting=false">单元设置</li>
                <li :class="{active:isLogicSetting}" @click="logicSetting()">全局设置</li>
              </template>
            </ul>
            <span v-show="!isLogicSetting">
              <rightColumnSetting :arrangementList="arrangementList" :currentColumn="activeColumn" :tableType="tableType" :dictArr="dictArr" :displayTypeDict="displayTypeDict" :readFlag="readFlag" :headTypeDict="headTypeDict" :parentColumn="activeColumn" :styleHierarchy="styleHierarchy"></rightColumnSetting>
            </span>
            <span v-show="isLogicSetting">
              <overall-setting :evaluationId="evaluationId" :currentColumn="activeColumn" :tableData="tableData"></overall-setting>
            </span>
          </div>
        </div>
      </div>
    </div>
    <addData id="addDataLayer" ref="addDatas" v-show="false"></addData>
    <confirmDelete id="deleteConfirm" style="display:none" :content="'确认删除该列？'" :layerIndex="layerDelIndex"></confirmDelete>
  </div>
</template>
<script>
import menuTemplate from "../../components/menu.vue";
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import tableShow from "./tableConfigShow.vue";
import rightColumnSetting from "./rightColumnSetting.vue";
import { getCatalogue } from "@/util/util";
import addData from "./addData.vue";
import confirmDelete from "@/components/confirm_delete.vue";
import { ajaxAsync } from "@/util/common_b";
import overallSetting from "./overallSetting";

export default {
  data() {
    return {
      tableType: 1, //1横，2树
      columnType: 10, //列样式定义
      tableFlag: 0, //定义是否有列表，没有显示开始设置界面，有的话直接跳转
      routineFlag: 0, //编辑域配置标志变量
      evaluationId: common.getUrlParam("assesmentId"),
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      columnList: [], //列数组
      activeColumn: {}, //当前选中的column
      evaluationClass: common.getUrlParam("dicItemKey"),
      tableId: 0,
      styleHierarchy: 1, //表示层级
      dynamic: 0,
      layerDelIndex: 0,

      addCodeColumn: {}, //绑定数据的列
      activeQuestionArr: [],
      isEditAssesmentName: false,
      evaluationName: '',
      dictArr: [],
      displayTypeDict: [],
      headTypeDict: [],
      readFlag: [],
      arrangementList: [],
      lastStepName: '',
      curParentColumn: null,
      isLogicSetting: false,
      tableData: null,
    };
  },
  created: function() {
    Bus.$off("activeColumnChange");
    Bus.$on("activeColumnChange", this.activeColumnChange);
    Bus.$off("addCodeData");
    Bus.$on("addCodeData", this.addCodeData);
    Bus.$off("selectAddData");
    Bus.$on("selectAddData", this.selectAddData);
    Bus.$off("clickExpand");
    Bus.$on("clickExpand", this.clickExpand);
    Bus.$off("changeColumnIndex");
    Bus.$on("changeColumnIndex", this.changeColumnIndex);
  },
  methods: {
    logicSetting: function() {
      this.isLogicSetting = true;
    },
    returnHome: function() {
      this.$router.push({ path: "/"});
    },
    //跳过下一步
    clickSkip: function() {
      let { query } = this.$route;
      query.dynamic = this.dynamic;
      query.routineFlag = this.routineFlag;
      this.$router.push({ path: "/createAssesmentByDept", query: query });
    },
    //编辑评估单名称
    editAssesmentName: function() {
      let that = this;
      let data = {
        evaluationId: this.evaluationId,
        evaluationName: this.evaluationName
      };
      ajaxAsync({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data: JSON.stringify(data)
      });
      this.isEditAssesmentName = false;
      common.tip_msg("保存成功", 1000);
    },
    //获取字典
    async getDict() {
      let that = this;
      let data = await ajaxAsync({
        url: "knowledge-service/dictionary/query",
        dataType: "json",
        type: "post",
        data: JSON.stringify([
          "TABLE_DISPLAY_TYPE",
          "TABLE_HEAD_TYPE",
          "TABLE_LIST_KEYWORD",
          "TABLE_READ_FLAG",
          "ALIGN_TYPE",
          "IOLIQUID_CHECK_LIST"
        ])
      });
      this.displayTypeDict = data.TABLE_DISPLAY_TYPE;
      this.headTypeDict = data.TABLE_HEAD_TYPE;
      this.readFlag = data.TABLE_READ_FLAG;
      this.arrangementList = data.ALIGN_TYPE;
      let arr = data.TABLE_LIST_KEYWORD;
      arr.splice(0, 0, { dicItemKey: "0", dicItemValue: "请选择" });
      this.dictArr = arr;
    },
    //更改表格设置状态，改为已经设置
    changeTableStatus: function() {
      ajaxAsync({
        url:
          "knowledge-service/evaluation/updateTableFlag/" + this.evaluationId,
        type: "get",
        dataType: "json"
      });
      this.tableFlag = 1;
    },
    //绑定选中的数据
    addCodeData: function(activeColumn) {
      debugger
      this.addCodeColumn = activeColumn;
      this.activeQuestionArr = [];
      let that = this;
      activeColumn.headBindingList.forEach(al => {
        if (
          !that.activeQuestionArr.find(ak => {
            return (
              ak.currNode.uniqueId == al.uniqueId &&
              ak.currNode.optionId == al.optionId
            );
          })
        ) {
          let uniqueId = al.dataType == 1 ? al.uniqueId : "";
          that.activeQuestionArr.push({
            currNode: {
              uniqueId: uniqueId,
              optionId: al.optionId ? al.optionId : undefined
            },
            childList: []
          });
        }
      });
      this.openInputLayer();
    },
    getCurColumn: function(arr, id) {
      arr.some((Element, Index) => {
        if(Element.childs && Element.childs.length > 0) {
          if(Element.headId == id) {
            this.curParentColumn = Element;
            return true;
          }
          this.getCurColumn(Element.childs, id)
        } else {
          if(Element.headId == id) {
            this.curParentColumn = Element;
            return true;
          }
        }
      })
    },    
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    //改变索引的位置
    changeColumnIndex: function(obj) {
      // 当移动二级列表时。可移动条件：hierarchyNum ！= 1 且 不存在childs
      let parentId = obj.item.parentHeadId;
      let sortNum = obj.item.sortNum;
      let changeNum = sortNum-1;
      let hierarchyNum = obj.item.hierarchyNum;
      if(obj.mode == 'next') {
        changeNum = sortNum+1;
      } 
      // debugger
      if(parentId) {
        // console.log(parentId)
        this.getCurColumn(this.columnList, parentId)
        // console.log('当前节点的父级对象')
        // console.log(this.curParentColumn)
        if((sortNum == 0&&obj.mode == 'pre') || (hierarchyNum != 1 && obj.item.childs.length > 0) || (sortNum == this.curParentColumn.childs.length - 1 && obj.mode == 'next')) {
          common.tip_msg("当前表格位置不支持向当前选择方向移动")
          return;
        }
        this.curParentColumn.childs = this.swapArray(this.curParentColumn.childs, changeNum, sortNum);
        this.curParentColumn.childs.forEach((ele, i) => {
          ele.sortNum = i;
        })
      } else {
        let index = -1;
        this.columnList.forEach((al, aindex) => {
          if (al.headId == obj.item.headId) {
            index = aindex;
            return;
          }
        });
        if (index > -1) {
          let i = 0;
          if (obj.mode == "pre") {
            i = parseInt(index) - 1;
          } else if (obj.mode == "next") {
            i = parseInt(index) + 1;
          } else if (obj.mode == "first") {
            i = 0;
          } else if (obj.mode == "end") {
            i = this.columnList.length - 1;
          }
          let cur = this.columnList[i];
          this.columnList[i] = obj.item;
          this.columnList[index] = cur;
        }
      }
      this.sortMainColumnDragtable();
      common.tip_msg("已保存", 1000);
    },
    //打开弹出层
    openInputLayer() {
      let that = this;
      layer.open({
        type: 1,
        skin: "layui-layer-demo", //样式类名
        closeBtn: 1, //不显示关闭按钮
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        title: "+数据",
        shade: 0.6,
        // closeBtn: 1,
        area: ["500px", "500px"], //宽高
        content: $("#addDataLayer"), //iframe的url
        success: function(layero, index) {
          that.$refs.addDatas.initLayer(index, that.activeQuestionArr);
        }
      });
    },
    //编辑评估单名称
    clickEditAssesment: function() {
      this.isEditAssesmentName = true;
      Vue.nextTick(function() {
        $("#inputAssesment").focus();
      });
    },
    //点击展开
    clickExpand: function(activeColumn) {
      if (activeColumn.isExpand) {
        Vue.set(activeColumn, "isExpand", false);
      } else {
        Vue.set(activeColumn, "isExpand", true);
      }
    },
    getNodeByHeadId: function(headId, node) {
      let that = this;
      if (node.headId == headId) {
        return node;
      }
      for (var i = 0; i < node.childs.length; i++) {
        let aNode = this.getNodeByHeadId(headId, node.childs[i]);
        if (aNode) {
          return aNode;
        }
      }
    },
    //点击+数据后选择绑定的数据
    selectAddData: function(obj) {
      let that = this;
      this.activeColumn = this.columnList.find(al => {
        return al.headId == that.activeColumn.headId;
      });

      let headBinding = {
        dataKeyWord: "",
        dataType: 1,
        uniqueId: obj.node.currNode.uniqueId,
        evaluationId: this.evaluationId,
        questionName: this.showNodeName(obj.node.currNode),
        optionId: obj.node.currNode.optionId
      };
      //debugger;
      let addCodeNode = this.getNodeByHeadId(
        this.addCodeColumn.headId,
        this.activeColumn
      );
      if (obj.type == "add") {
        this.activeQuestionArr.push(obj.node);
        addCodeNode.headBindingList.push(headBinding);

        addCodeNode.headBindingList.forEach((ele, i) => {
          ele.sortNum = i
        })
        this.activeColumnChange(addCodeNode);
      } else {
        let newArr = [];
        for (var i = 0; i < this.activeQuestionArr.length; i++) {
          let al = this.activeQuestionArr[i];
          if (
            al.currNode.uniqueId != obj.node.currNode.uniqueId ||
            al.currNode.optionId != obj.node.currNode.optionId
          ) {
            newArr.push(al);
          }
        }
        this.activeQuestionArr = newArr;
        let headBinding = addCodeNode.headBindingList.filter(al => {
          return (
            al.uniqueId == obj.node.currNode.uniqueId &&
            al.optionId == obj.node.currNode.optionId
          );
        });

        let param = {
          headBinding: headBinding[0],
          headRootId: this.activeColumn.headId,
          headId: this.addCodeColumn.headId,
          tableId: this.activeColumn.tableId
        };
        this.deleteQuestion(param, obj.node);
      }

      this.$refs.addDatas.close();
    },
    //显示数据节点名字
    showNodeName: function(currNode) {
      if (currNode.aliasType == 1) {
        return currNode.aliasName;
      } else if (currNode.aliasType == 2) {
        return currNode.catalogueName;
      } else if (currNode.aliasType == 3) {
        return currNode.aliasName || currNode.catalogueName;
      } else {
        return currNode.catalogueName;
      }
    },
    //删除+数据里面选中的问题
    deleteQuestion: async function(param, node) {
      let that = this;
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/deleteHeadBing",
        type: "post",
        data: JSON.stringify(param),
        dataType: "json"
      });
      common.tip_msg("已保存", 1000);
      that.findEditColumn(that.activeColumn, data.headTree);
    },
    //表格类型切换
    changeTableType: function(type) {
      this.tableType = type;
      this.columnList = [];
      this.updateTableType();
      this.getAllTablRefresh();
      this.$refs.tableShow.initTableShow();
      this.activeColumn = this.getColumnNodeByType(10, this.columnList.length);
    },
    //更新横向竖向类型
    updateTableType: function() {
      let that = this;
      let data = { tableId: this.tableId };
      ajaxAsync({
        url: "knowledge-service/evaluation/update/" + this.tableType,
        type: "get",
        data: data,
        dataType: "text"
      });
    },
    //刷新表格
    refreshTableShow() {
      let that = this;
      Vue.nextTick(function() {
        let data = $.extend(true, [], that.columnList);
        that.$refs.tableShow.initTableColumn(data);
      });
    },
    //查询数据
    selectData: function() {
      if (this.$refs.tableShow) {
        this.getAllTablRefresh();
        this.$refs.tableShow.getDataByParam(this.columnList);
      }
    },
    //下一步
    nextStep: function() {
      //debugger;
      let { query } = this.$route;
      query.dynamic = this.dynamic;
      query.routineFlag = this.routineFlag;
      this.$router.push({ path: "/createAssesmentByDept", query: query });
    },
    //获取表头数据
    getTableData: async function() {
      let param = {
        evaluationClassify: this.evaluationClass,
        evaluationId: this.evaluationId,
        tableType: "1"
      };
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/newTable",
        type: "post",
        data: JSON.stringify(param)
      });
      this.tableData = data;
      this.tableId = data.tableId;
      this.tableFlag = data.tableFlag;
      this.columnList = data.headTreeList;
      this.tableType = data.tableType;
      this.dynamic = data.dynamic;
      this.routineFlag = data.routineFlag;
      this.refreshTableShow();
    },
    //列名拖动位置排序
    sortMainColumnDragtable: async function() {
      let newSortArr = [];
      //获取所有的已经排序好的列
      this.columnList.forEach((al, index) => {
        if (al) {
          al.sortNum = index;
          newSortArr.push(al);
        }
      });
      //调用更换列位置接口
      let param = {
        headTreeList: newSortArr,
        evaluationClassify: this.evaluationClass,
        evaluationId: this.evaluationId,
        tableId: this.tableId,
        tableType: this.tableType
      };
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/exchangeTableStep",
        type: "post",
        data: JSON.stringify(param),
        dataType: "text"
      });
      this.getAllTablRefresh();
    },
    //通过columnType获取节点
    getColumnNodeByType(columnType, sortNum) {
      if (columnType == 10) {
        return {
          headLine: 1,
          headName: "01",
          headType: 1,
          hierarchyNum: 1,
          parentHeadId: 0,
          sortNum: sortNum,
          tableId: this.tableId,
          width: 80,
          catalogueRule: getCatalogue(),
          childs: [],
          columnType: "10",
          headBindingList: [],
          headExcList: []
        };
      } else if (columnType == 11 || columnType == 12) {
        return {
          headLine: 1,
          headName: "01",
          headType: 1,
          hierarchyNum: 1,
          sortNum: sortNum,
          tableId: this.tableId,
          width: 80,
          catalogueRule: getCatalogue(),
          childs: [],
          columnType: columnType,
          parentHeadId: 0,
          headBindingList: [],
          headExcList: [
            {
              headLine: 2,
              headName: "02",
              headType: 1,
              hierarchyNum: 2,
              sortNum: 1,
              tableId: this.tableId,
              parentHeadId: 0,
              width: 80,
              catalogueRule: getCatalogue(),
              childs: []
            }
          ]
        };
      } else if (columnType == 13) {
        return {
          headLine: 1,
          headName: "01",
          hierarchyNum: 1,
          sortNum: sortNum,
          tableId: this.tableId,
          width: 80,
          parentHeadId: 0,
          catalogueRule: getCatalogue(),
          childs: [
            {
              headLine: 2,
              headName: "02",
              hierarchyNum: 2,
              sortNum: 1,
              parentHeadId: 0,
              tableId: this.tableId,
              width: 80,
              catalogueRule: getCatalogue(),
              childs: [],
              columnType: columnType,
              headBindingList: [],
              headExcList: []
            }
          ],
          columnType: columnType,
          headBindingList: [],
          headExcList: []
        };
      } else if (columnType == 14) {
        return {
          headLine: 1,
          headName: "01",
          hierarchyNum: 1,
          sortNum: sortNum,
          tableId: this.tableId,
          width: 80,
          parentHeadId: 0,
          catalogueRule: getCatalogue(),
          childs: [
            {
              headLine: 2,
              headName: "02",
              hierarchyNum: 2,
              parentHeadId: 0,
              sortNum: 1,
              tableId: this.tableId,
              width: 80,
              catalogueRule: getCatalogue(),
              childs: [
                {
                  headLine: 3,
                  headName: "03",
                  hierarchyNum: 3,
                  sortNum: sortNum,
                  parentHeadId: 0,
                  tableId: this.tableId,
                  width: 80,
                  catalogueRule: getCatalogue(),
                  childs: [],
                  columnType: columnType,
                  headBindingList: [],
                  headExcList: []
                }
              ],
              columnType: columnType,
              headBindingList: [],
              headExcList: []
            }
          ],
          columnType: columnType,
          headBindingList: [],
          headExcList: []
        };
      }
    },
    //设置列表
    setTable: function(argument) {
      this.changeTableStatus();
      let that = this;
      this.activeColumn = this.getColumnNodeByType(10);
    },
    //表头headId排序
    sortHeadId: function(curColumn) {
      let that = this;
      curColumn.childs.forEach((al, index) => {
        if (al.sortNum != index) {
          al.sortNum = index;
        }
        that.sortHeadId(al);
      });
    },
    //通过id获取列
    getColumnById: function(column, curColumn) {
      for (var i = 0; i < column.childs.length; i++) {
        if (column.childs[i].headId == curColumn.headId) {
          column.childs[i] = curColumn;
          return true;
        }
        let aNode = this.getColumnById(column.childs[i], curColumn);
        if (aNode) {
          return true;
        }
      }
    },
    //获取指定列
    getTargetColumn(curColumn) {
      let newColumnList = $.extend([], this.columnList, []);
      for (var i = 0; i < newColumnList.length; i++) {
        let column = newColumnList[i];
        if (column.headId == curColumn.headId) {
          column = curColumn;
          return column;
        } else {
          let newNode = this.getColumnById(column, curColumn);
          if (newNode) {
            return column;
          }
        }
      }
    },
    //当前选中的列的设置改变
    activeColumnChange: function(curColumn) {
      debugger;
      let column = this.getTargetColumn(curColumn);
      this.sortHeadId(column);
      this.editColumnSetting(column);
    },
    //编辑列
    async editColumnSetting(activeColumn) {
      let param = $.extend(
        true,
        {
          evaluationClassify: this.evaluationClass,
          evaluationId: this.evaluationId,
          tableId: this.tableId,
          tableType: this.tableType
        },
        { headTree: activeColumn }
      );
      let url = "knowledge-service/evaluation/updateTableStep";
      let data = await ajaxAsync({
        url: url,
        type: "post",
        data: JSON.stringify(param)
      });
      common.tip_msg("已保存", 1000);
      data.evaluationClassify = this.evaluationClass;
      data.evaluationId = this.evaluationId;
      this.findEditColumn(activeColumn, data.headTree);
    },
    //返回
    returnBack: function() {
      let { query } = this.$route;
      if(this.lastStepName == 'createNotificationPage') {
        this.$router.push({ path: "/createNotification", query: query }); 
        return;       
      }
      this.$router.push({ path: "/createAssesmentContent", query: query });
    },
    //找到编辑的列替换
    findEditColumn: function(activeColumn, newActiveColumn) {
      let that = this;
      let cl = this.columnList.find(al => {
        return al.headId == activeColumn.headId;
      });
      this.columnList.splice(this.columnList.indexOf(cl), 1, newActiveColumn);
      this.activeColumn = newActiveColumn;
      this.refreshTableShow();
    },
    //通过headId找到指定节点
    findNodeByHeadId: function(node, obj) {
      for (var i = 0; i < node.childs.length; i++) {
        if (node.childs[i].headId == obj.headId) {
          return node;
        }
        let aNode = this.findNodeByHeadId(node.childs[i], obj);
        if (aNode) {
          return aNode;
        }
      }
    },
    //通过评估单id查询table
    getAllTablRefresh: async function() {
      let that = this;
      let param = {
        evaluationClassify: this.evaluationClass,
        organCode: this.organCode,
        evaluationIdList: [this.evaluationId]
      };
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/queryList",
        type: "post",
        data: JSON.stringify(param)
      });
      this.columnList = data.headTreeList;
      this.dynamic = data.dynamic;
      this.refreshTableShow();
    },
    //点击增加列
    clickAddMainColumn: async function(columnType) {
      this.columnType = columnType;
      let columnData = this.getColumnNodeByType(
        this.columnType,
        this.columnList.length
      );

      let param = {
        headTree: columnData,
        tableId: this.tableId,
        tableType: this.tableType,
        evaluationClassify: this.evaluationClass,
        evaluationId: this.evaluationId
      };
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/savaTableStep",
        type: "post",
        data: JSON.stringify(param)
      });
      let aindex = this.columnList.length;
      this.columnList.splice(aindex, 0, data.headTree);
      this.activeColumn = this.columnList[aindex];
      common.tip_msg("已保存", 1000);
      this.refreshTableShow();
    },
    //删除主要列
    delMainColumn: function(column) {
      let that = this;
      this.layerDelIndex = layer.open({
        type: 1,
        shift: 5,
        title: "",
        btn: ["确定", "取消"],
        shadeClose: true,
        shade: 0.6,
        closeBtn: 0,
        area: ["460px", "200px"],
        content: $("#deleteConfirm"),
        success: function(layero) {
          var btn = layero.find(".layui-layer-btn");
          btn.css({ padding: "0", "margin-top": "-10px" });
        },
        yes: function(index) {
          that.delColumn(column, index);
        }
      });
    },
    //删除列
    delColumn: async function(column, index) {
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/" + column.headId,
        type: "delete",
        dataType: "text"
      });
      common.tip_msg("已删除", 1000);
      this.getAllTablRefresh();
      layer.close(index);
    },
    //点击选中其他column
    selectColumn: function(column) {
      this.activeColumn = column;
    },
    //预览表格设置
    preShowTableSetting: function() {
      debugger
      let url =
        "/#/preShowTableSetting?" +
        "evaluationId=" +
        this.evaluationId +
        "&evaluationClass=" +
        this.evaluationClass;
      let that = this;
      $(".ui-sys-bar").css("display", "none");
      layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        // shade: [0],
        shadeClose: true,
        shade: 0.6,
        area: ["800px", "100%"],
        offset: "rb", //右下角弹出
        content: [url, "no"], //iframe的url，no代表不显示滚动条
        end: function() {
          $(".ui-sys-bar").css("display", "block");
        }
      });
    },
    // 列表设置后状态取消
    cancleSetTableBox: function() {
      let that = this;
      let text = '是否清除列表配置？'
      const confirmBox = layer.confirm(text, {
        btn: ['是','否'] 
      },function(){
        that.cancleSetTable()
      });      
    },
    cancleSetTable: function() {
      const that = this;
      let param = {
        evaluationId: this.evaluationId,
        type: 1
      };
      common.ajax({
        url: "knowledge-service/evaluation/paper2/reset",
        type: "get",
        data: param,
        callback: function() {
          common.tip_msg("重置成功", 1000);
          that.tableFlag = false;
        }
      });
    }
  },
  mounted() {
    this.getDict();
    this.getTableData();
    this.lastStepName = this.$route.query.lastStepName;
    this.evaluationName = this.$route.query.evaluationName || common.getUrlParam("evaluationName");
  },
  components: {
    menuTemplate: menuTemplate,
    tableShow: tableShow,
    rightColumnSetting: rightColumnSetting,
    addData: addData,
    confirmDelete: confirmDelete,
    overallSetting: overallSetting
  }
};
</script>