<template>
  <div>
    <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
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
                <input type="text" class="input-text w180" v-model="evaluationName" id="inputAssesment" @blur="editAssesmentName()" />
                <a @click.stop="editAssesmentName()">保存</a>
              </template>
            </div>
          </div>
          <div class="step-list-cont">
            <ul class="step-list">
              <li class="active">
                <i class="num">1</i>
                <span class="txt">新建或选择模版</span>
              </li>
              <li class="active">
                <i class="num">2</i>
                <span class="txt">文书样式</span>
              </li>              
              <li class="active">
                <i class="num">3</i>
                <span class="txt">配置文书内容</span>
              </li>
              <li class="active">
                <i class="num">4</i>
                <span class="txt">列表设置</span>
              </li>
              <li class="active">
                <i class="num">5</i>
                <span class="txt">科室设置</span>
              </li>
              <li class="cur">
                <i class="num">6</i>
                <span class="txt">编辑域设置</span>
              </li>
            </ul>
            <div class="right">
              <a class="am-btn am-btn-plain-info am-ml-10" @click="returnHome">回到首页</a>
              <a class="am-btn am-btn-plain-info am-ml-10" @click="returnBackHome">暂不设置</a>
              <a class="am-btn am-btn-info am-ml-10" @click="save">保存</a>
            </div>
          </div>
        </div>
        <div class="basic-senior">
          <ul class="title clearfix">
            <li @click="goBaseReactArea">
              <a href="javascript:void(0)">基础模式</a>
            </li>
            <li class="active">
              <a href="javascript:void(0)">高级模式</a>
            </li>
          </ul>
          <div class="con clearfix" v-show="isReactArea">
            <div class="side">
              <ul class="gj-title">
                <li @click="changeReact">编辑域</li>
                <li class="active">流程</li>
              </ul>
              <div class="bd">
                <div class="lc" v-for="(item,index) in routineStepList" :key=index>
                  <div :class="{'lc-item': true, 'li-edit-move': true, 'active': item.isActive}" @click.stop="changeNode(item, index)">
                    <input type="text" :disabled="item.isInputOpen" @blur="showDivNode(item, index)" v-model="item.stepName" class="input-text"/>
                    <div class="right">
                      <a class="i-move-upd"  @click.stop="editNode(item, index)">修改</a>
                      <a class="i-move-pre" @click.stop="up(index)">上移</a>
                      <a class="i-move-next" @click.stop="down(index)">下移</a>
                      <a class="i-move-del" @click.stop="delNode(item, index)">删除</a>
                    </div>
                  </div>
                  <div class="line"></div>
                </div>
              </div>
              <a href="javascript:void(0)" class="btn-menu-plus" @click.stop="add">＋流程节点</a>
            </div>
            <div class="main">
              <div class="tt clearfix">
                <span class="cm-left">{{ routineStepList[curNodeIndex].stepName }}</span>
                <a class="save" href="javascript:void(0)" @click.stop="save">保存</a>
              </div>
							<div class="lcjd">
								<ul>
									<li>
										<label>选择域</label>
										<div class="am-ctr-sel w120 control-item" :class="{ 'open': isAreaOpen }" @mouseleave="leaveArea">
											<a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"  @click="openArea"> {{ curAreaName }}</a>
											<div class="am-dropdown am-mr-10">
												<ul>
													<li :class="{active: item.isActive}" v-for="(item, index) in areaList" :key=index @click="selectArea(item, index)"><a>{{ item.title }}</a></li>
												</ul>
											</div>
										</div>
										<div :class="{'am-ctr-native-chk': true, 'active': routineStepList[curNodeIndex].repeatType || 0 }" @click="changeRepeat(curNodeIndex)">
											<span>循环</span>
										</div>
									</li>
                  <li>
                    <label>流转条件</label>
										<div :class="{'am-ctr-native-chk': true, 'active': routineStepList[curNodeIndex].passRule == 'ONE' || routineStepList[curNodeIndex].passRule == '' }" @click="changePassRule('ONE')">
											<span>任一人审核通过</span>
										</div>  
										<div style="margin-left:9px;" :class="{'am-ctr-native-chk': true, 'active': routineStepList[curNodeIndex].passRule == 'ALL' }" @click="changePassRule('ALL')">
											<span>全员审核通过</span>
										</div>                                       
                  </li>
									<li>
										<label>流程状态</label>
										<div class="am-ctr-sel w120 control-item" :class="{ 'open': isStatusdOpen }" @mouseleave="leaveStatusd">
											<a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click="openStatusd">{{ curStatusdName }}</a>
											<div class="am-dropdown am-mr-10">
												<ul>
													<li :class="{ 'active': item.isActive }" v-for="(item, index) in statusdList" :key=index @click="selectStatusd(item, index)"><a> {{ item.statusdName }} </a></li>
												</ul>
											</div>
										</div>
									</li>
									<li>
										<label>选择用户</label>
                    <limit-area ref="limit" :limitArea.sync="limitArea" :wardList.sync="wardList" :roleList.sync="roleList"></limit-area>
									</li>
								</ul>
							</div>
            </div>
          </div>
          <react-content :from="fromFlag" @closeReact="closeReact" v-show="!isReactArea" :reactHigh.sync="reactHigh"></react-content>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import common from "../../util/common.js";
import menuTemplate from "../../components/menu.vue";
import MugenScroll from "vue-mugen-scroll";
import { getCatalogue } from "@/util/util";
import "@/css/pagination.css";
import limitArea from "./limitHightArea";
import reactContent from "../createAssessmentReactArea/reactMainContent";
export default {
  name: "assessmentHightArea",
  components: {
    menuTemplate,
    limitArea,
    reactContent
  },
  data: function() {
    return {
      fromFlag: 'highAreact',
      curNodeName: '<虚拟节点>',
      curAreaName: '请选择',
      curStatusdName: '发起',
      isInputOpen: true,
      isAreaOpen: false,
      isStatusdOpen: false,
      reactHigh: false,
      routineStepList: [],
      isReactArea: true,
      wardList: [],
      roleList: [],
      areaAuthorityList: [],
      areaList: [],
      routineFlag: 0,
      curNodeIndex: 0,
      statusdList: [
        { 'statusdName':'发起', 'isActive': true },
        { 'statusdName':'审核', 'isActive': false },
      ],
      currentPage:'assessmentHightArea',
      evaluationName: "",
      isEditAssesmentName: false,
      evaluationId: common.getUrlParam("assesmentId"),
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
    }
  },
  computed: {
    limitArea: function() {
      return this.routineStepList[this.curNodeIndex].areaAuthorityList[0].authorityList
    },
  },
  methods: {
    returnHome() {
      this.$router.push({ path: "/" });
    },
    changeNode(item, index) {
      console.log(item)
      this.curNodeName = item.stepName;
      item.isActive = true;
      this.curNodeIndex = index;
      if(this.routineStepList) {
        this.routineStepList.forEach((ele, i) => {
          ele.isActive = false;
        })
        this.routineStepList[index].isActive = true;
      }
      // 刷新获取数据时，改变编辑域的默认值
      // debugger
      if(this.routineStepList && this.routineStepList[0] && this.routineStepList[0].areaAuthorityList) {
        this.curAreaName = item.areaAuthorityList[0].title || '请选择';
        this.areaList.forEach((ele, i) => {
          if(ele.title == item.areaAuthorityList[0].title) {
            ele.isActive = true
          } else {
            ele.isActive = false
          }
        })
      } 
    },
    showDivNode (item, index) {
      item.isInputOpen = true;
    },
    editNode(item, index) {
      console.log(item)
      item.isInputOpen = !item.isInputOpen;
    }, 
    addNode() {

    },
    delNode(item, index) {
      this.routineStepList.splice(index, 1); 
      
      let i = 0;
      if(index > 0) { i = index -1 } 
      this.changeNode(this.routineStepList[i], 0)   

      this.save('delete')
    },
    changeRepeat(curNodeIndex) {
      if(this.routineStepList[curNodeIndex].repeatType) {
        this.routineStepList[curNodeIndex].repeatType = 0;
      } else {
        this.routineStepList[curNodeIndex].repeatType = 1
      }
    },
    selectArea(item, index) {
      // console.log(item)
      this.curAreaName = item.title;
      this.areaList.forEach((ele, i) => {
        ele.isActive = false
      })
      this.areaList[index].isActive = true;

      this.isAreaOpen = false;  
      // console.log(this.routineStepList[this.curNodeIndex].areaAuthorityList[0])   
      let firstAreaLimit = this.routineStepList[this.curNodeIndex].areaAuthorityList[0];   
      firstAreaLimit.areaId = item.id;
      firstAreaLimit.isActive = item.isActive;
      firstAreaLimit.rootUniqueId = item.rootUniqueId;
      firstAreaLimit.sort = item.sort;
      firstAreaLimit.title = item.title;
      firstAreaLimit.uniqueIdStr = item.uniqueIdStr;

    },
    openArea() {
      this.isAreaOpen = !this.isAreaOpen;
    },
    leaveArea() {
      this.isAreaOpen = false;
    },
    leaveStatusd() {
      this.isStatusdOpen = false;      
    },
    openStatusd() {
      this.isStatusdOpen = !this.isStatusdOpen;
    },
    selectStatusd(item, i) {
      console.log(item)
      this.curStatusdName = item.statusdName;
      this.statusdList.forEach(element => {
        element.isActive = false;        
      });
      this.statusdList[i].isActive = true;
      this.isStatusdOpen = false;

      if(this.curStatusdName == '发起') {
        this.routineStepList[this.curNodeIndex].status = 0;
      } else {
        this.routineStepList[this.curNodeIndex].status = 1;
      }
       
    },
    changePassRule(str) {
      let currPassRule = this.routineStepList[this.curNodeIndex].passRule
      if(currPassRule != str) {
        this.routineStepList[this.curNodeIndex].passRule = str;         
      }
    },
    closeReact() {
      this.getRoutineArea();
      this.isReactArea = true;
    },    
    changeReact() {
      this.isReactArea = !this.isReactArea;
    },
    up: function(index) {
      let length = this.routineStepList.length;
      if (index == 0) {
        this.routineStepList.splice(length, 0, this.routineStepList[index]);
        this.routineStepList.splice(index, 1);
        return;
      }
      this.routineStepList.splice(index - 1, 0, this.routineStepList[index]);
      this.routineStepList.splice(index + 1, 1);
    },
    down: function(index) {
      let length = this.routineStepList.length;
      if (index == length - 1) {
        this.routineStepList.splice(0, 0, this.routineStepList[index]);
        this.routineStepList.splice(length, 1);
        return;
      }
      this.routineStepList.splice(index + 2, 0, this.routineStepList[index]);
      this.routineStepList.splice(index, 1);
    },    
    returnDeptCodeNum: function(str) {
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
    // 更新编辑域设置状态
    changeAssesmentStatus: function(n) {
      this.routineFlag = n;
      let data={evaluationId:this.evaluationId,routineFlag:this.routineFlag};
      common.ajax({
        url: 'knowledge-service/evaluation/updateRoutineFlag',
        type: 'get',
        data: data,
        dataType:'json',
      });   
    },    
    //返回
    returnBack: function() {
      let { query } = this.$route;
      this.$router.push({ path: "/assesmentTableSetting", query: query });
    },  
    clickEditAssesment:function(){
      this.isEditAssesmentName=true;
      Vue.nextTick(function(){
          $('#inputAssesment').focus();
      })
    },   
    editAssesmentName:function(){
        let that=this;
        let data={evaluationId:this.evaluationId,evaluationName:this.evaluationName};
        common.ajax({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data:JSON.stringify(data),
        callback: function(problems) {
            that.isEditAssesmentName=false;
            common.tip_msg("保存成功",1000);
        }
      });
    },
    returnBackHome:function() {
      const that = this;
      let param = {
        'evaluationId': this.evaluationId,
        'type': 2
      }
      common.ajax({
        url: 'knowledge-service/evaluation/paper2/reset',
        type: 'get',
        data: param,  
        callback: function() {
          common.tip_msg('重置成功', 1000)
        }         
      })      
      this.$router.push({ path: "/" });
    },
    goBaseReactArea: function() {
      common.tip_msg('高级模式下禁止模式切换！', 1000)
      return;
      let { query } = this.$route;
      query.routineFlag = 1;
      this.$router.push({ path: "/createAssessmentReactArea", query: query });
    },
    initCollapseMenu: function() {
      $(".basic-senior .con").height(
        $(".am-page-rcont").height() -
          $(".book-top-cont").height() -
          $(".basic-senior .title").height() - 54
      );
    },    
    add: function() {
      this.$refs.limit.default();
      // 一个流程节点的json格式
      let nodeJsonTemp = {
          "id": 0, 
          "status": 0, 
          "stepName": "虚拟节点", 
          "repeatType": 0, 
          "passRule": "ONE", 
          "areaAuthorityList": [
            {
              "areaId": '', 
              "title": "请选择", 
              "uniqueIdStr": "", 
              "rootUniqueId": "", 
              "sort": 0, 
              "authorityList": [
                {
                  "authority": "1", 
                  "currentRole": "评估单配置员", 
                  "deptCodeNum": 0, 
                  "isOpen": false, 
                  "organCode": this.organCode, 
                  "static": "只读", 
                  "userRole": "ASSESSMENT_CONF", 
                  "wardCodeStr": ""
                }
              ]
            }
          ], 
          "routineList": null, 
          "isInputOpen": true
        }
        this.routineStepList.push(nodeJsonTemp)
    },
    getevaluation: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/evaluation",
        dataType: "json",
        type: "get",
        async: false,
        data: { evaluationId: this.evaluationId },
        callback: function(res) {
          if(res.routineStepList && res.routineStepList[0].areaAuthorityList) {
            // 初始单子没有任何流程节点
            that.routineStepList = res.routineStepList;
            that.routineStepList.forEach((ele, i) => {
              that.$set(ele, 'isInputOpen', true);
              that.$set(ele, 'isActive', false);   
              ele.areaAuthorityList.forEach((element, index) => {
                that.$set(element, 'isActive', false);
                element.authorityList.forEach((val, num) => {
                  that.$set(val, "currentRole", that.returnRole(val.userRole));
                  that.$set(val, "static", that.returnAuthority(val.authority));
                  that.$set(val, "deptCodeNum",that.returnDeptCodeNum(val.wardCodeStr));
                  that.$set(val, "isOpen", false);
                })
              })           
            })
          } else {
            that.routineStepList = res.routineStepList;
            that.routineStepList[0];
            that.$set(that.routineStepList[0], 'isInputOpen', true);
            that.$set(that.routineStepList[0], 'isActive', false);
            that.routineStepList[0].areaAuthorityList = 
            [{  
              areaId:'',
              isActive:false,
              authorityList:[{
                authority: "1",
                currentRole: "评估单配置员",
                deptCodeNum: 0,
                isOpen: false,
                organCode: that.organCode,
                static: "只读",
                userRole: "ASSESSMENT_CONF",
                wardCodeStr: ""                 
              }],
              rootUniqueId: "",
              sort: 0,
              title: "",
              uniqueIdStr:""              
            }]
            // console.log(that.routineStepList)
          }        
        }
      })
    },
    getRoleList: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/roles",
        dataType: "text",
        type: "get",
        async: false,
        callback: function(res) {
          if(res) {
            that.roleList = JSON.parse(res)
          }
        }
      });
    },  
    queryAllWards: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/wards",
        type: "get",
        async: false,
        dataType: "json",
        data: { organCode: that.organCode },
        callback: function(res) {
          that.wardList = res; 
          that.wardList.forEach((ele, i) => {
            that.$set(ele, 'isActive', false)
          })
        }
      });  
    },
    getRoutineArea: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/routine/area",
        dataType: "json",
        async: false,
        type: "get",
        data: { evaluationId: that.evaluationId },
        callback: (res) => {
          that.areaList = res;
          that.areaList.forEach((ele, i) => {
            that.$set(ele, 'isActive', false)
          })
        }
      });
    },    
    save: function(logic) {
      console.log(this.routineStepList)
      let saveHeighData = [];
      this.routineStepList.forEach((ele, i) => {
        saveHeighData.push(
          {
            "areaId": ele.areaAuthorityList[0].areaId,
            "authorityList": [],
            "evaluationId": this.evaluationId,
            "id": ele.id,
            "passRule": ele.passRule,
            "repeatType": ele.repeatType,
            "status": ele.status,
            "stepName": ele.stepName
          }          
        )
      })
      this.routineStepList.forEach((ele, i) => {
        ele.areaAuthorityList[0].authorityList.forEach((element, index) => {
          saveHeighData[i].authorityList.push({
            "authority": element.authority,
            "organCode": this.organCode,
            "role": element.userRole,
            "wardCodes": element.wardCodeStr             
          })    
        })
      })
      common.ajax({
        url: "knowledge-service/routine/save",
        dataType: "json",
        type: "put",
        async: false,
        data: JSON.stringify(saveHeighData),
        callback: function(res) {
          if(logic == 'delete') {
            common.tip_msg('删除成功', 1000)            
          } else {
            common.tip_msg('保存成功', 1000)
          }
          console.log(res)
        }
      });
      console.log(saveHeighData)
    }
  },
  mounted() {

    // 高级模式刷新流程状态
    this.changeAssesmentStatus(2);
    // 自动获取高度
    this.initCollapseMenu();  
    this.getRoutineArea();
    this.queryAllWards();
    this.getRoleList();
    this.getevaluation();
    this.changeNode(this.routineStepList[0], 0)

    this.evaluationName = this.$route.query.evaluationName || common.getUrlParam("evaluationName");
    console.log(common.getUrlParam("evaluationName"))


  }  
}
</script>

<style scoped>
.basic-senior .con .side .lc .lc-item {
  width: 170px;
  border: 1px solid #009EF9 !important;
  color: #fff; 
}
.basic-senior .con .side .lc .lc-item.active {
  border: 1px solid #00AE58 !important;
  color: #fff;  
}
input[disabled] {
  background-color: #009EF9 !important;
  color: #fff !important;
}
.basic-senior .con .side .lc .lc-item.active input {
  background: #00AE58 !important;
}
</style>


