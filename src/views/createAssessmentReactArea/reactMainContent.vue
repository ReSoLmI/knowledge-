<template>
  <div class="con clearfix">
    <div class="side">
      <div class="inner-scroll-bar">
        <ul>
          <li :class="{ 'active': item.isActive }" v-for="(item, index) in routineAreaList" :key=index @click="selectCurrent(item, index)">
            <input type="text" v-model="item.title" disabled="disabled" @blur="blurEffect($event)" />
            <div class="menu-sort-tool-list clearfix">
              <i class="edit" @click.stop="edit($event)"></i>
              <i class="down" @click.stop="down(index)"></i>
              <i class="up" @click.stop="up(index)"></i>
              <i class="del" @click.stop="del(index)"></i>
            </div>
          </li>
        </ul>
      </div>
      <a href="javascript:void(0)" @click="addArea" class="btn-menu-plus">
        +编辑域
      </a>
    </div>
    <div class="main" style="main-height:530px;">
      <div class="tt clearfix">
        <span class="cm-left">{{ curReactName }}</span>
        <a class="save close" href="javascript:void(0)" @click="closeReact" v-show="!reactHigh">关闭</a>
        <a class="save" href="javascript:void(0)" @click="save">保存</a>
      </div>
      <div class="nr clearfix">
        <div class="item">
          <div class="t-title">问题</div>
          <div class="edit-domain">
            <div class="all-select">
              <div :class="{'am-ctr-native-chk':true, 'is-checked':isChecked, 'is-disabled': isDisabled }" @click.stop="allSelect($event)" v-show="isEditArea">
                <!-- <el-checkbox v-model="checked">备选项</el-checkbox> -->
                <span :class="{'el-checkbox__input':true, 'is-checked':isChecked, 'is-disabled': isDisabled }">
                  <span class="el-checkbox__inner"></span>
                  <input type="checkbox" :checked="isChecked" class="el-checkbox__original" value="">
                </span>
                <span>全选</span>
              </div>
              <!-- <a href="javascript:void(0)" @click="editStatic($event)" v-show="!isEditArea" class="clear">编辑</a> -->
              <a href="javascript:void(0)" @click="clearAllSelect($event)" v-show="isEditArea" class="clear">清空</a>
            </div>
            <div class="domain-list">
              <el-tree ref="tree" :data="questionList" :show-checkbox='isShowCheckbox' node-key="uniqueId" :check-on-click-node="false" :expand-on-click-node="true" :check-strictly="isCheckStrictly" :default-checked-keys="selectArr" @node-click="nodeClick" @check-change="checkChange" :props="defaultProps" :render-content="renderContent" @getCurrentNode="getCurrentNode">
              </el-tree>
            </div>
          </div>
        </div>
        <div class="item" style="height:400px" v-show="reactHigh">
          <div class="t-title">权限</div>
          <!-- <limit-area :limitArea.sync="roleArr" :currentAreaIndex.sync='currentAreaIndex' :limitRoleList.sync="roleList"></limit-area> -->
          <limit-area ref='limitArea'  :limitArea.sync="roleArr" :currentAreaIndex.sync='currentAreaIndex' :limitRoleList.sync="roleList"></limit-area>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mMenu from "../../components/menu.vue";
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import limitArea from "./limitArea.vue";
import { Tree } from "element-ui";
Vue.component(Tree.name, Tree);


export default {
  props: ["reactHigh", "from"],
  data() {
    return {
      isChecked: false,
      isCheckStrictly: true,
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      currentPage: "createAssessmentReactArea",
      evaluationId: common.getUrlParam("assesmentId"),
      routineFlag: 0, // 当前文书存在哪个流程的标志
      evaluationName: common.getUrlParam("evaluationName"),
      isEditAssesmentName: false,
      isShowCheckbox: true,
      isEditArea: true,
      questionList: [],
      roleList: [], // 角色列表
      currentAreaId: 1, // 当前选中的编辑域ID
      currentAreaIndex: 0, // 当前选中的编辑域在编辑域数组里的索引
      currentWard: [], // 当前选中的病区
      uniqueArr: [], // 问题Id的对应JSON树
      routineStepList: [], // 基础模式接口获取当前模式所有数据
      routineAreaList: [], // 基础模式接口获取当前模式编辑域和权限数据
      staticWardList: [],
      selectArr: [], // 问题树默认勾选的问题数组
      isEdit: false,
      arrUniqueTree: [], // 问题的uniqueId构造的zTree
      currNode: null, // 
      parentNode: null,
      areaList: [],
      isDisabled: true,
      // parUniqueId: [],
      defaultProps: {
        children: "childList",
        label: "aliasName",
        disabled: "disabled",
      },
    };
  },
  watch: {
    routineStepList: {
      deep: true,
      handler: function(nVal, oVal) {
        this.routineStepList = nVal;
        this.isEdit = true;
      }
    },
    routineAreaList: {
      deep: true,
      handler: function(nVal, oVal) {
        this.routineAreaList = nVal;
        if(nVal && nVal.length > 0 && this.isDisabled) {
          this.isDisabled = false;
        }
        if(nVal && nVal.length == 0 && !this.isDisabled) {
          this.isDisabled = true;
        }
      }
    },
    // isDisabled: function(nVal, oVal) {
    //   this.isDisabled = nVal;
    //   if(nVal) {
    //     this.defaultAddDisabled(this.questionList, true)
    //   } else {
    //     this.defaultAddDisabled(this.questionList, false)
    //   }
    // }
  },
  computed: {
    curReactName: function() {
      if (
        this.routineAreaList &&
        this.routineAreaList.length > 0 &&
        this.routineAreaList[this.currentAreaIndex].authorityList
      ) {
        return this.routineAreaList[this.currentAreaIndex].title;
      } else {
        return "";
      }
    },
    roleArr: function() {
      if (
        this.routineAreaList &&
        this.routineAreaList.length > 0 &&
        this.routineAreaList[this.currentAreaIndex].authorityList
      ) {
        return this.routineAreaList[this.currentAreaIndex].authorityList;
      } else {
        return [];
      }
    }
  },
  methods: {
    editStatic: function() {
      this.isEditArea = true;
      this.isShowCheckbox = true;
    },
    closeReact: function() {
      this.$emit("closeReact");
    },
    saveAllArea: function() {
      console.log(this.routineAreaList);
      // this.routineAreaList
      let allAreaData = [];
      this.routineAreaList.forEach((ele, i) => {
        allAreaData.push({
          areaId: ele.areaId,
          authorityList: [],
          sort: ele.sort, 
          title: ele.title, 
          uniqueStr: ele.uniqueIdStr, 
          rootUniqueId: ele.rootUniqueId
        });
      });

      this.routineAreaList.forEach((ele, i) => {
        if (
          this.routineAreaList[i].authorityList &&
          this.routineAreaList[i].authorityList.length > 0
        ) {
          this.routineAreaList[i].authorityList.forEach((element, index) => {
            allAreaData[i].authorityList.push({
              authority: element.authority,
              organCode: this.organCode, 
              userRole: element.userRole, 
              wardCodeStr: element.wardCodeStr 
            });
          });
        }
      });

      allAreaData.forEach((ele, i) => {
        if (ele.uniqueStr && ele.uniqueStr.indexOf("null") > -1) {
          ele.uniqueStr = ele.uniqueStr.slice(5);
        }
        if (ele.rootUniqueId && ele.rootUniqueId.indexOf("null") > -1) {
          ele.rootUniqueId = ele.rootUniqueId.slice(5);
        }
        if (ele.authorityList.length == 0) {
          ele.authorityList = null;
        }
      });
      common.ajax({
        url: "knowledge-service/routine/area/auth/" + this.evaluationId,
        type: "put",
        data: JSON.stringify(allAreaData),
        dataType: "json",
        callback: result => {
          common.tip_msg("保存成功", 1000);
        }
      });
    },
    clickSkip: function() {
      this.$router.push({ path: "/" });
    },
    returnBack: function() {
      let { query } = this.$route;
      this.$router.push({ path: "/assesmentTableSetting", query: query });
    },
    goHightArea: function() {
      let { query } = this.$route;
      this.$router.push({ path: "/assessmentHightArea", query: query });
    },
    // 更新编辑域设置状态
    changeAssesmentStatus: function() {
      this.routineFlag = 1;
      let data = {
        evaluationId: this.evaluationId,
        routineFlag: this.routineFlag
      };
      common.ajax({
        url: "knowledge-service/evaluation/updateRoutineFlag",
        type: "get",
        data: data,
        dataType: "json"
      });
    },
    edit: function(ev) {
      ev.target.parentElement.previousElementSibling.disabled = false;
    },
    blurEffect: function(ev) {
      ev.target.disabled = true;
    },
    up: function(index) {
      let length = this.routineAreaList.length;
      if (index == 0) {
        this.routineAreaList.splice(length, 0, this.routineAreaList[index]);
        this.routineAreaList.splice(index, 1);
        return;
      }
      this.routineAreaList.splice(index - 1, 0, this.routineAreaList[index]);
      this.routineAreaList.splice(index + 1, 1);
    },
    down: function(index) {
      let length = this.routineAreaList.length;
      if (index == length - 1) {
        this.routineAreaList.splice(0, 0, this.routineAreaList[index]);
        this.routineAreaList.splice(length, 1);
        return;
      }
      this.routineAreaList.splice(index + 2, 0, this.routineAreaList[index]);
      this.routineAreaList.splice(index, 1);
    },
    del: function(index) {
      this.routineAreaList.splice(index, 1);
      let saveArea = {
        areas: [],
        evaluationId: this.evaluationId
      };

      this.routineAreaList.forEach((ele, i) => {
        if (ele.uniqueIdStr && ele.uniqueIdStr.indexOf("null") > -1) {
          ele.uniqueIdStr = ele.uniqueIdStr.slice(5);
        }
        if (ele.rootUniqueId && ele.rootUniqueId.indexOf("null") > -1) {
          ele.rootUniqueId = ele.rootUniqueId.slice(5);
        }
        saveArea.areas.push({
          id: ele.areaId,
          title: ele.title,
          uniqueIds: ele.uniqueIdStr,
          rootUniqueIds: ele.rootUniqueId
        });
      });
      this.saveArea(saveArea, "del");
    },
    selectCurrent: function(item, index) {

      this.currentAreaIndex = index;
      this.currentAreaId = item.areaId;
      // 编辑域不匹配禁止编辑
      this.changeDisabled(this.questionList, this.currentAreaId);
      this.routineAreaList.forEach((ele, i) => {
        ele.isActive = false;
      })
      this.routineAreaList[index].isActive = true;
    },
    saveArea: function(data, flag) {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/area/save",
        type: "put",
        data: JSON.stringify(data),
        dataType: "json",
        callback: result => {
          console.log(result);
          if(flag == "add" && that.from == 'highAreact' && that.routineAreaList) {
            let newAreaId = null;
            if (result.length > 0) {
              newAreaId = result[result.length - 1].id;
            }
            // 新增添加默认的权限的编辑域名,初始值为null，存在初始值且为最后一项
            that.routineAreaList.push({
              areaId: newAreaId,
              authorityList: [
                {
                  authority: "1",
                  currentRole: "评估单配置员",
                  deptCodeNum: 0,
                  isOpen: false,
                  organCode: that.organCode,
                  static: "只读",
                  userRole: "ASSESSMENT_CONF",
                  wardCodeStr: ""
                }
              ],
              isActive: false,
              rootUniqueId: "",
              sort: 0,
              title: "",
              uniqueIdStr: ""               
            })          
          }
          // 新增获取最后一项id去匹配evaluation接口返回的所对应的编辑域
          if ((flag == "add" && that.from == "baseAreact") || (flag == "add" && that.from == 'highAreact' && !that.routineAreaList)) {
            debugger
            // 高级模式添加编辑域，需要切回基础模式
            that.changeAssesmentStatus(1);
            that.getAllBaseInfo();

            if (
              that.routineStepList &&
              that.routineStepList[0].areaAuthorityList &&
              that.routineStepList[0].areaAuthorityList.length == 1
            ) {
              that.routineAreaList[0].authorityList = [
                {
                  authority: "1",
                  currentRole: "评估单配置员",
                  deptCodeNum: 0,
                  isOpen: false,
                  organCode: that.organCode,
                  static: "只读",
                  userRole: "ASSESSMENT_CONF",
                  wardCodeStr: ""
                }
              ];
            } else {
              let newAreaId = null;
              if (result.length > 0) {
                newAreaId = result[result.length - 1].id;
              }
              // 新增添加默认的权限的编辑域名,初始值为null，存在初始值且为最后一项
              if(!that.routineAreaList) {
                that.routineAreaList = [{
                  areaId: newAreaId,
                  authorityList: [
                    {
                      authority: "1",
                      currentRole: "评估单配置员",
                      deptCodeNum: 0,
                      isOpen: false,
                      organCode: that.organCode,
                      static: "只读",
                      userRole: "ASSESSMENT_CONF",
                      wardCodeStr: ""
                    }
                  ],
                  isActive: false,
                  rootUniqueId: "",
                  sort: 0,
                  title: "",
                  uniqueIdStr: ""                  
                }]
              } else {
                that.routineAreaList.forEach((ele, i) => {
                  if (ele.areaId == newAreaId) {
                    ele.authorityList = [
                      {
                        authority: "1",
                        currentRole: "评估单配置员",
                        deptCodeNum: 0,
                        isOpen: false,
                        organCode: that.organCode,
                        static: "只读",
                        userRole: "ASSESSMENT_CONF",
                        wardCodeStr: ""
                      }
                    ];
                  }
                });
              }
            }
          }
          if (flag == "del") {
            that.getAllBaseInfo();
          }          
          if(flag == 'save') {
            common.tip_msg('当前编辑域保存成功', 1000)
          }
        }
      });
    },
    addArea: function() {
      this.$refs.limitArea.default();
      let saveArea = {
        areas: [],
        evaluationId: this.evaluationId
      };
      if (!this.routineAreaList) {
        saveArea.areas.push({
          id: "",
          title: "",
          uniqueIds: "",
          rootUniqueIds: ""
        });
      } else {
        let len = this.routineAreaList.length + 1;
        for (let i = 0; i < len; i++) {
          if (i == len - 1) {
            saveArea.areas.push({
              id: "",
              title: "",
              uniqueIds: "",
              rootUniqueIds: ""
            });
          } else {
            // 初始数据为null，提交时裁切掉字符串添加的null
            if (
              this.routineAreaList[i].uniqueIdStr &&
              this.routineAreaList[i].uniqueIdStr.indexOf("null") > -1
            ) {
              this.routineAreaList[i].uniqueIdStr = this.routineAreaList[i].uniqueIdStr.slice(5);
            }
            if (
              this.routineAreaList[i].rootUniqueId &&
              this.routineAreaList[i].rootUniqueId.indexOf("null") > -1
            ) {
              this.routineAreaList[i].rootUniqueId = this.routineAreaList[i].rootUniqueId.slice(5);
            }
            saveArea.areas.push({
              id: this.routineAreaList[i].areaId,
              title: this.routineAreaList[i].title,
              uniqueIds: this.routineAreaList[i].uniqueIdStr,
              rootUniqueIds: this.routineAreaList[i].rootUniqueId
            });
          }
        }
      }
      this.saveArea(saveArea, "add");
    },
    selectRole: function(item) {},
    selectEffect: function() {
      $(".layout-thumbnail-cont>.layout-thumbnail").draggable({
        connectToSortable: "#topic-panel-list",
        helper: "clone",
        revert: "invalid",
        drag: function(e, t) {
          t.helper.css({
            "min-width": "400px",
            width: "auto",
            "min-height": "70px"
          });
        },
        stop: function(e, t) {}
      });

      initCollapseMenu();
      $(window).resize(function() {
        initCollapseMenu();
      });
      function initCollapseMenu() {
        $(".basic-senior .con").height(
          $(".am-page-rcont").height() -
            $(".book-top-cont").height() -
            $(".basic-senior .title").height() -
            80
        );
      }
    },
    //编辑评估单名称
    editAssesmentName: function() {
      let that = this;
      let data = {
        evaluationId: this.evaluationId,
        evaluationName: this.evaluationName
      };
      common.ajax({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data: JSON.stringify(data),
        callback: function(problems) {
          that.isEditAssesmentName = false;
          common.tip_msg("保存成功", 1000);
        }
      });
    },
    clickEditAssesment: function() {
      this.isEditAssesmentName = true;
      Vue.nextTick(function() {
        $("#inputAssesment").focus();
      });
    },
    getQuestionList: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/sketch?needEditArea=1",
        dataType: "text",
        type: "get",
        async: false,
        callback: function(res) {
          const data = JSON.parse(res);
          that.questionList = data.questionList;
          that.getUniqueIdTree(that.questionList, that.uniqueArr);
          that.getSelectArr(that.questionList, that.selectArr);
          that.addDisabled(that.questionList, that.currentAreaId);

          that.selectArr = that.unique(that.selectArr);
          that.uniqueArr = that.unique(that.uniqueArr);         
          // console.log(that.selectArr)
        }
      });
    },
    getReactAreaList: function() {
      const that = this;
      let data = { evaluationId: this.evaluationId };
      common.ajax({
        url: "knowledge-service/routine/area",
        dataType: "text",
        type: "get",
        data: data,
        async: false,
        callback: function(res) {
          // debugger
          if (JSON.parse(res).length == 0) {
            return;
          }
          if (!JSON.parse(res)[0].id) {
            return;
          }
          that.currentAreaId = JSON.parse(res)[0].id;
          that.areaList = JSON.parse(res)
        }
      });
    },
    getRole: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/roles",
        dataType: "text",
        type: "get",
        async: false,
        callback: function(res) {
          that.roleList = JSON.parse(res);
          that.roleList.forEach((ele, i) => {
            that.$set(ele, "isActive", false);
          });
        }
      });
    },
    returnRole: function(code) {
      let currentRole = "";
      this.roleList.forEach((ele, index) => {
        if (ele.code == code) {
          currentRole = ele.name;
        }
      });
      return currentRole;
    },
    returnAuthority: function(authority) {
      if (authority == 2) {
        return "编辑";
      }
      if (authority == 1) {
        return "只读";
      }
    },
    returnDeptCodeNum: function(str) {
      // this.staticWardList = str.split(',');
      if(!str) {
        return 0;
      } else {
        let arrDeptNum = str.split(',');
        arrDeptNum.forEach((ele, i) => {
          if(!ele) {
            arrDeptNum.splice(i, 1)
          }
        })      
        return arrDeptNum.length;
      }
    },
    addUniqueId: function(val, currentAreaId) {
      // console.log(val, currentAreaId);
      // 添加新的问题到编辑域
      let newUniqueStr = this.routineAreaList[this.currentAreaIndex].uniqueIdStr + "," + val.uniqueId;
      console.log(newUniqueStr.split(',')[0])
      if(newUniqueStr.split(',') && newUniqueStr.split(',')[0] == '') {
        newUniqueStr = newUniqueStr.slice(1)    
      }
      this.routineAreaList[this.currentAreaIndex].uniqueIdStr = newUniqueStr;
      val.areaName = this.routineAreaList[this.currentAreaIndex].title;
      val.areaId = currentAreaId;
      console.log("当前编辑域的所挂载的问题id");
      console.log(this.routineAreaList[this.currentAreaIndex].uniqueIdStr);
    },
    delUniqueId: function(val) {
      // 删除编辑域的题
      let uniqueIdArr = this.routineAreaList[
        this.currentAreaIndex
      ].uniqueIdStr.split(",");
      uniqueIdArr.forEach((element, index) => {
        if (element == val.uniqueId) {
          uniqueIdArr.splice(index, 1);
        }
      });
      this.routineAreaList[
        this.currentAreaIndex
      ].uniqueIdStr = uniqueIdArr.join(",");
      val.areaName = "";
      val.areaId = null;
      // console.log(this.routineAreaList[this.currentAreaIndex])
    },
    allSelect: function(ev) {
      if(this.isDisabled) { return; }
      this.isChecked = !this.isChecked;

      if(!this.isChecked) {
        this.clearAllSelect()
      } else {     
        let strAllUnique = "";
        this.routineAreaList.forEach((ele, i) => {
          strAllUnique += ele.uniqueIdStr;
        });
        // 当前所有编辑域所对应的问题id数组
        let arrAllUnique = strAllUnique.split(",");
        // 当前问题所对于的问题id数组
        if (
          this.routineAreaList &&
          this.routineAreaList[this.currentAreaIndex].uniqueIdStr &&
          this.routineAreaList[this.currentAreaIndex].uniqueIdStr.indexOf(",") >
            -1
        ) {
          let curArrUniqueId = this.routineAreaList[
            this.currentAreaIndex
          ].uniqueIdStr.split(",");
        }
        console.log(this.routineAreaList[this.currentAreaIndex].uniqueIdStr);
        // 所有问题id所构成的数组 this.arrUniqueTree

        // 全问题数组删除已属编辑域的数组
        arrAllUnique.forEach((ele, i) => {
          var index = this.arrUniqueTree.indexOf(ele);
          if (index > -1) {
            this.arrUniqueTree.splice(index, 1);
          }
        });
        this.$refs.tree.setCheckedKeys(this.arrUniqueTree);
      }
    },
    clearAllSelect: function() {
      if(this.isDisabled) { return; }
      this.isChecked = false;
      let curArrUniqueId = null;
      if (
        this.routineAreaList &&
        this.routineAreaList[this.currentAreaIndex].uniqueIdStr &&
        this.routineAreaList[this.currentAreaIndex].uniqueIdStr.indexOf(",") >
          -1
      ) {
        curArrUniqueId = this.routineAreaList[
          this.currentAreaIndex
        ].uniqueIdStr.split(",");
        if (curArrUniqueId[0] == "null") {
          curArrUniqueId.splice(0, 1);
        }
      }

      // 当前选中的问题的uniqueId的所对应的数组
      let curAreaUnique = this.$refs.tree.getCheckedKeys();

      curArrUniqueId.forEach((ele, i) => {
        var index = curAreaUnique.indexOf(parseInt(ele));
        if (index > -1) {
          curAreaUnique.splice(index, 1);
        }
      });
      this.$refs.tree.setCheckedKeys(curAreaUnique);
    },
    getAllBaseInfo: function() {
      // 基础模式和高级模式切换时，更新单子状态
      // if(this.from == 'baseAreact') {
      //   this.changeAssesmentStatus(1);
      // } else {
      //   this.changeAssesmentStatus(2);        
      // }

      debugger
      const that = this;
      that.routineStepList = [];
      // 进入基础模式时，获取页面所有数据
      common.ajax({
        url:"knowledge-service/routine/evaluation?evaluationId=" + this.evaluationId,
        type: "get",
        async: false,
        dataType: "json",
        callback: result => {
          var array = [];
          that.getQuestionList();
          that.routineStepList = result.routineStepList;
          if(that.routineStepList && that.routineStepList[0] && that.routineStepList[0].areaAuthorityList) {
            that.routineAreaList = that.routineStepList[0].areaAuthorityList;
          }
          if(!result.routineStepList || !that.routineAreaList || (that.routineAreaList&&that.routineAreaList.length ==0)) {
            that.defaultAddDisabled(that.questionList, true)    
            console.log(that.questionList)    
          }
          // 高级模式切换增删编辑域或高级模式切换基础模式
          if(that.from && that.from == 'highAreact' && that.routineAreaList) {
            that.routineStepList.forEach((ele, i) => {
              array.push(ele.areaAuthorityList[0])
            })            
            // 一个编辑域对应多个流程节点，获取时，编辑域数组去重
            var hash = {};
            array = array.reduce(function(item, next) {
                hash[next.areaId] ? '' : hash[next.areaId] = true && item.push(next);
                return item
            }, [])
            that.routineAreaList = array;
          }
          if (!that.routineAreaList) { return;}
          that.routineAreaList.forEach((ele, index) => {
            if (ele.authorityList && Array.isArray(ele.authorityList)) {
              that.$set(ele, 'isActive', false)
              ele.authorityList.forEach((val, i) => {
                that.$set(val, "currentRole", that.returnRole(val.userRole));
                that.$set(val, "static", that.returnAuthority(val.authority));
                that.$set(val, "deptCodeNum",that.returnDeptCodeNum(val.wardCodeStr));
                that.$set(val, "isOpen", false);
              });
            }
          });

          if(that.routineAreaList[0]) {
            that.selectCurrent(that.routineAreaList[0], 0)
          }

        }
      });
    },
    save: function() {
      let saveArea = {
        areas: [],
        evaluationId: this.evaluationId
      };

      this.routineAreaList.forEach((ele, i) => {
        if (ele.uniqueIdStr && ele.uniqueIdStr.indexOf("null") > -1) {
          ele.uniqueIdStr = ele.uniqueIdStr.slice(5);
        }
        if (ele.rootUniqueId && ele.rootUniqueId.indexOf("null") > -1) {
          ele.rootUniqueId = ele.rootUniqueId.slice(5);
        }

        saveArea.areas.push({
          id: ele.areaId,
          title: ele.title,
          uniqueIds: ele.uniqueIdStr,
          rootUniqueIds: ele.rootUniqueId
        });
      });
      this.saveArea(saveArea, "save");

    },
    getSelectArr: function(arr, selectArr) {
      // 唯一问题id获取，默认Tree的选中样式逻辑
      arr.forEach((element, i) => {
        if (element.childList && element.childList.length > 0) {
          if (element.areaId) {
            selectArr.push(element.uniqueId);
          }
          this.getSelectArr(element.childList, this.selectArr);
        } else {
          if (element.areaId) {
            selectArr.push(element.uniqueId);
          }
        }
      });

    },
    getUniqueIdTree: function(arr, uniqueArr) {
      // unique 所构造的zTree树
      arr.forEach((element, i) => {
        if (element.childList && element.childList.length > 0) {
          uniqueArr.push({ unique: element.uniqueId, children: [] });
          this.getUniqueIdTree(element.childList, uniqueArr[i].children);
        } else {
          uniqueArr.push({ unique: element.uniqueId });
        }
      });
    },
    addDisabled: function(arr, currentAreaId) {
      // 编辑域不同时添加的disabled属性
      arr.forEach((element, i) => {
        if (element.childList && element.childList.length > 0) {
          if (element.areaId != currentAreaId && element.areaId) {
            this.$set(element, "disabled", true);
          } else {
            this.$set(element, "disabled", false);
          }
          this.addDisabled(element.childList, currentAreaId);
        } else {
          if (element.areaId != currentAreaId && element.areaId) {
            this.$set(element, "disabled", true);
          } else {
            this.$set(element, "disabled", false);
          }
        }
      });
    },
    defaultAddDisabled: function(arr, boolean) {
      // 初始时添加全局的disabled属性
      arr.forEach((element, i) => {
        if (element.childList && element.childList.length > 0) {
          this.$set(element, "disabled", boolean);
          this.defaultAddDisabled(element.childList, boolean);
        } else {
          this.$set(element, "disabled", boolean);
        }
      });
    },
    changeDisabled: function(arr, currentAreaId) {
      arr.forEach((element, i) => {
        if (element.childList && element.childList.length > 0) {
          if (element.areaId != currentAreaId && element.areaId) {
            element.disabled = true;
          } else {
            element.disabled = false;
          }
          this.addDisabled(element.childList, currentAreaId);
        } else {
          if (element.areaId != currentAreaId && element.areaId) {
            element.disabled = true;
          } else {
            element.disabled = false;
          }
        }
      });
    },
    delDisabled: function(arr) {
      arr.forEach((ele, i) => {
        if (ele.childList && ele.childList.length > 0) {
          if (ele.disabled) {
            delete ele.disabled;
          }
          this.delDisabled(ele.childList);
        } else {
          if (ele.disabled) {
            delete ele.disabled;
          }
        }
      });
    },
    nodeClick: function(data, node, tem) {
      // console.log(this.$refs.tree.getCheckedNodes());
    },
    checkChange: function(data, curflag, childFlag) {
      // 当前问题是否已属于某一编辑域
      // 如果选中的编辑域和当前选择的问题所在域是否匹配，当前域不能编辑
      // 是添加，还是删除
      // curflag为真，点击选中， false取消选中
      debugger
      if (data.areaId) {
        if (data.areaId != this.currentAreaId) {
          common.tip_msg("编辑域不匹配", 1000);
          return;
        } else {
          if (curflag) {
            console.log("编辑域匹配下的增");
            this.addUniqueId(data, this.currentAreaId);
          } else {
            console.log("编辑域匹配下的增");
            this.delUniqueId(data);
          }
        }
      } else {
        // console.log('增加问题id')
        this.addUniqueId(data, this.currentAreaId);
      }

      // console.log('问题树构建出的问题uniqueId树')
      // console.log(JSON.stringify(this.uniqueArr))
      // const currSelectUnique = this.$refs.tree.getCheckedKeys();
      // console.log('当前勾选中的问题所对应的uniqueID的组成的数组')
      // console.log(currSelectUnique)
      console.log("当前点击的问题uniqueID");
      console.log(data.uniqueId);

      this.getRootUnique();

      // 当前节点和子节点的id组成选中的列表
      // let setCheckedKeysArr = [];
      // this.setCheckedKeys(oParUnique.node, setCheckedKeysArr)
      // console.log(setCheckedKeysArr)
      // let curSelectArr = this.repeat(setCheckedKeysArr.concat(setCheckedKeysArr));
      // console.log(curSelectArr)
      // this.$refs.tree.setCheckedKeys(curSelectArr);
    },
    setCheckedKeys: function(curNode, setCheckedKeysArr) {
      setCheckedKeysArr.push(curNode.unique);
      if (curNode.children && curNode.children.length > 0) {
        curNode.children.forEach((ele, i) => {
          this.setCheckedKeys(ele, setCheckedKeysArr);
        });
      }
    },
    repeat: function(arr) {
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) == i) {
          ret.push(arr[i]);
        }
      }
      return ret;
    },
    getCurrentNode: function(node) {},
    getNode: function(json, nodeId) {
      // 指定zTree点，查找只系父节点和当前节点
      for (var i = 0; i < json.length; i++) {
        if (this.currNode) {
          break;
        }
        var obj = json[i];
        if (!obj || !obj.unique) {
          break;
        }
        if (obj.unique == nodeId) {
          this.currNode = obj;
          continue;
        } else {
          if (obj.children) {
            this.parentNode = obj;
            this.getNode(obj.children, nodeId);
          } else {
            continue;
          }
        }
      }
      if (!this.currNode) {
        this.parentNode = null;
      }
      return {
        parentNode: this.parentNode,
        node: this.currNode
      };
    },
    renderContent(h, { node, data, store }) {
      // 渲染当前问题所对应的编辑域的名称
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span
            class="area"
            style="display:inline-block;float:right;margin-right:20px;"
          >
            {data.areaName}
          </span>
        </span>
      );
    },
    unique: function(array) {
      // 数组去重
      var temp = [];
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    getArrUniqueId: function(arr) {
      arr.forEach((element, index) => {
        if (element.children && element.children.length > 0) {
          this.arrUniqueTree.push(element.unique);
          this.getArrUniqueId(element.children);
        } else {
          this.arrUniqueTree.push(element.unique);
        }
      });
    },
    // 更新编辑域设置状态
    changeAssesmentStatus: function(n) {
      this.routineFlag = n;
      let data={evaluationId:this.evaluationId,routineFlag:this.routineFlag};
      common.ajax({
        url: 'knowledge-service/evaluation/updateRoutineFlag',
        type: 'get',
        data:data,
        dataType:'json',
      });   
    },    
    getRootUnique: function() {
      let rootUniqueArr = [];
      let curSelectUniqueArr = this.routineAreaList[this.currentAreaIndex].uniqueIdStr.split(',');
      if(curSelectUniqueArr && curSelectUniqueArr.length>0 && curSelectUniqueArr[0] == 'null') {
        curSelectUniqueArr.splice(0, 1)
      }

      // const currSelectUnique = this.$refs.tree.getCheckedKeys();
      // debugger
      curSelectUniqueArr.forEach((ele, i) => {
        this.currNode = null;
        this.parentNode = null; 
        let rootParUnique = this.getNode(this.uniqueArr, ele)    

        // 当前节点的父节点为null，当前节点为顶节点，为跟节点
        if(!rootParUnique.parentNode) {
          rootUniqueArr.push(ele)                          
        } else {
          // 存在父节点，判断当前选中的节点的父节点是否被选中，为选中，则当前节点为根节点，选中继续查找当前选中的父节点
          let strParUniqueNode = rootParUnique.parentNode.unique + '';
          if(rootParUnique.parentNode && rootParUnique.parentNode.unique && curSelectUniqueArr.indexOf(strParUniqueNode) < 0) {
            rootUniqueArr.push(ele)            
          }
        }          
      })   
      
      this.routineAreaList[this.currentAreaIndex].rootUniqueId = rootUniqueArr.join(',')
      console.log(this.routineAreaList[this.currentAreaIndex].rootUniqueId)
      
    }
  },
  mounted() {

    this.getRole();
    this.getQuestionList();
    this.getArrUniqueId(this.uniqueArr);
    this.getReactAreaList();
    this.selectEffect();
    this.getAllBaseInfo();
  },
  components: {
    menuTemplate: mMenu,
    limitArea: limitArea
  }
};
</script>

<style scoped>

.am-ctr-native-chk {
  background: none;
}
.basic-senior .con .main .domain-list {
  padding: 0px;
}
.basic-senior .con .main .edit-domain .all-select {
  padding: 0px 0px 10px 0px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.area {
  margin-left: 200px;
}
.el-tree {
  border: none;
  min-height: 435px;
}
input[disabled] {
  color: #111 !important;
  background-color: #fff !important;
}
.basic-senior .con .side .inner-scroll-bar li.active input,
.basic-senior .con .side .inner-scroll-bar li.active:hover input {
  color: #fff !important;
}
.basic-senior .con .side .inner-scroll-bar li.active input {
  background: none !important;
}
.basic-senior .con .side .inner-scroll-bar li.hover input[disabled] {
  background: #fff !important;
}
.close {
  margin-left: 10px;
}
.el-checkbox__input [type="checkbox"] {
  vertical-align: 0px;
}
</style>
