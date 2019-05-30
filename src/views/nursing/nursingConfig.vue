<template>
  <div>
    <menuTemplate ref="leftmenu"></menuTemplate>
    <div class="page-rcont page-rcont-second">
      <div class="hbox" style="display:block;">
        <div class="am-condition am-nmtlr-20">
          <div class="am-btn-rdo">
            <a :class="{active:sortByTime}" @click="orderByTime">按配置时间顺序</a>
            <a :class="{active:!sortByTime}" @click="orderByLetter">按问题首字母顺序</a>
          </div>
          <div class="cm-right">
            <a class="am-btn am-btn-plain-primary" @click="newDiagnoseConfig">新增配置</a>
          </div>
        </div>
        <div class="am-mt-20"></div>
        <div class="no-data" v-show="!isHasData">
          <div class="img"></div>
          <div class="responsive-txt">
            <div class="txt">请先新增配置</div>
          </div>
        </div>
        <div class="am-collapse-item-list">
          <!--am-collapse-item-->
          <div
            v-show="isHasData"
            v-for="(diagnoseConfig,diagnoseConfig_index) in diagnoseConfigs"
            class="am-collapse-item"
          >
            <div class="hd">
              <h3
                :class="{'active':diagnoseConfig_index==0,'clearActive':true}"
                @click="slide_fun($event)"
              >
                <i class="am-angle am-mr-10"></i>
                {{diagnoseConfig.catalogueName}}
                <!-- <span class="num">2</span> -->
              </h3>
              <div class="right">
                <ul class="menu-tool-list">
                  <li @mouseenter="displayMeasures($event)" @mouseleave="closeMeasures($event)">
                    <div class="config-measures">
                      <!-- {{diagnoseConfig.measures.length}} -->
                      <a
                        href="javascript:void(0)"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="true"
                      >
                        {{diagnoseConfig.measures.length}}项 护理措施
                        <i class="am-angle am-ml-10"></i>
                      </a>
                      <div class="am-dropdown" style="display:none">
                        <div class="inner clearfix">
                          <!-- v-show="isShowMeasure" -->
                          <!-- <p>1.通知医生。</p>
														<p>2.绝对卧床休息。【活动】</p>
                          <p>3.开通静脉通路。</p>-->
                          <p
                            v-for="(measure,measure_index) in diagnoseConfig.measures"
                          >{{measure_index + 1}}.{{measure.catalogueName}}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <a class="tool-upd" @click="viewDiagnoseConfig(diagnoseConfig)"></a>
                  </li>
                  <li>
                    <a class="tool-del" @click.stop="delDiagnoseConfig($event)"></a>
                    <a class="tool-confirm" @click.stop="sureDelDiagnoseConfig(diagnoseConfig)">确认删除</a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- \style="display: block;" -->
            <div class="bd slide_controll" v-show="diagnoseConfig_index==0">
              <div>
                <table class="am-tb-config">
                  <tr v-for="(component,component_index) in diagnoseConfig.groups">
                    <td class="first" style="width: 75px;">{{component.name}}</td>
                    <td>
                      <table class="am-tb-config-inner">
                        <tr>
                          <td v-for="(subset,subset_index) in component.subsets">
                            <!-- {{subset.items}} -->
                            <div class="am-span-rdo-radius">
                              <a
                                v-show="positive.catalogueName!=''"
                                class="active"
                                v-for="(positive,positive_index) in subset.items"
                              >{{positive.catalogueName}}</a>
                            </div>
                            <a class="i-plus" v-show="0<subset_index<component.subsets.length-1"></a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr v-if="catalogue=='CCC'&&diagnoseConfig.goals.length>0">
                    <td class="first" style="width: 75px;">目标</td>
                    <td>
                      <table class="am-tb-config-inner">
                        <tr>
                          <td>
                            <div class="am-span-rdo-radius">
                              <a
                                v-show="goal.catalogueName!=''"
                                class="active"
                                v-for="(goal,goal_index) in diagnoseConfig.goals"
                              >{{goal.catalogueName}}</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr v-if="catalogue=='CCC'&&diagnoseConfig.goals.length>0">
                    <td class="first" style="width: 75px;">评价</td>
                    <td>
                      <table class="am-tb-config-inner">
                        <tr>
                          <td>
                            <div class="am-span-rdo-radius">
                              <a
                                v-show="appraisals.catalogueName!=''"
                                class="active"
                                v-for="(appraisals,appraisals_index) in diagnoseConfig.appraisals"
                              >{{appraisals.catalogueName}}</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <!--am-collapse-item end-->
        </div>
      </div>
    </div>

    <div id="pop-content" style="display:none">
      <nursingConfigEdit ref="edit" @saveDiagnoseConfig="queryDiagnose" @showNav="showNav"></nursingConfigEdit>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// Vue.use(ElementUI);
import $ from "jquery";
import common from "../../util/common.js";
import nursingConfigEdit from "./nursingConfig_edit";
import menu from "../../components/menu.vue";
import { getCatalogue } from "@/util/util";

export default {
  name: "nursingConfig",
  props: {},
  watch: {
    // openPageClose(val){
    // 	if(val==true)
    // 	{
    // 		layer.close(this.openPageClose);
    // 	}
    // },
    $route(to, from) {
      if (to) {
      }
    },
    // routerName(router){
    // 	alert(router)
    // },

    valDiagnose(val) {
      this.valChange_diagnose(val);
    },
    valPostitive(val) {
      this.valChange_positive(val);
    },
    valMeasures(val) {
      this.valChange_measures(val);
    },
    watchDisplay(val) {
      alert(val);
    }
  },
  data() {
    return {
      watchDisplay: "",
      closeLayer: "",
      diaCatalogueNames: [],
      sortFlag: 0,
      clickTimes: 0,
      clickLetters: 0,
      sortByTime: "",
      ispop: false,
      // openPageClose:false,
      // 存放获取的护理诊断数值
      diagnoseConfigs: {},
      // 存放搜索值
      valDiagnose: "",
      valPostitive: "",
      valMeasures: "",

      // editMode:false,
      // 配置的模式新建或是修改
      configMode: "",
      // 是否显示更多图标
      isShow_plus: true,
      isShowMeasure: false,
      diagnosesDic: "",
      positiveDic: "",

      measuresDic: "",
      goalsDic: "",
      appraisalsDic: "",
      isHasData: "",
      routerName: this.$route.name,
      catalogue: ""
    };
  },
  methods: {
    fetchData() {
      alert(123);
    },
    showNav: function() {
      $(".ui-sys-bar").css("display", "block");
    },
    // 点击诊断和阳性项获得
    getDiagnose: function() {
      var that = this;
      common.ajax({
        url: "catalogue-service/code/special",
        dataType: "json",
        type: "get",
        async: true,
        data: { catalogueRule: this.catalogue, specialType: "4" },
        callback: function(diagnoses) {
          that.diagnosesDic = diagnoses;
        }
      });
    },
    getPositive: function() {
      var that = this;
      common.ajax({
        url: "catalogue-service/code/special",
        dataType: "json",
        type: "get",
        async: true,
        data: { catalogueRule: this.catalogue, specialType: "3" },
        callback: function(positives) {
          that.positiveDic = positives;
        }
      });
    },
    // 点击护理措施请求数据
    // 3常规 4危急
    // 5措施

    getMeasures: function() {
      var that = this;
      common.ajax({
        url: "catalogue-service/code/special",
        dataType: "json",
        type: "get",
        async: true,
        data: { catalogueRule: this.catalogue, specialType: "5" },
        callback: function(measures) {
          that.measuresDic = measures;
        }
      });
    },

    // 6 目标
    getGoals: function() {
      var that = this;
      common.ajax({
        url: "catalogue-service/code/special",
        dataType: "json",
        type: "get",
        async: true,
        data: { catalogueRule: this.catalogue, specialType: "6" },
        callback: function(goals) {
          that.goalsDic = goals;
        }
      });
    },

    // 7 评价
    getAppraisals: function() {
      var that = this;
      common.ajax({
        url: "catalogue-service/code/special",
        dataType: "json",
        type: "get",
        async: true,
        data: { catalogueRule: this.catalogue, specialType: "7" },
        callback: function(appraisals) {
          that.appraisalsDic = appraisals;
        }
      });
    },

    orderByTime: function() {
      this.sortByTime = true;

      if (this.clickTimes % 2 == 0) {
        // 0
        console.log("按照时间升序");
        this.sortFlag = 0;
      } else {
        // 1
        console.log("按照时间降序");
        this.sortFlag = 1;
      }
      this.clickTimes++;
      this.queryDiagnose();
    },
    orderByLetter: function() {
      this.sortByTime = false;
      if (this.clickLetters % 2 == 0) {
        // 2
        console.log("按照字母升序");
        this.sortFlag = 2;
      } else {
        // 3
        console.log("按照字母降序");
        this.sortFlag = 3;
      }
      this.clickLetters++;
      this.queryDiagnose();
    },
    displayMeasures: function(ev) {
      $(ev.target)
        .children(".config-measures")
        .children(".am-dropdown")
        .css("display", "block");
      // this.isShowMeasure=true;
    },
    closeMeasures: function(ev) {
      $(ev.target)
        .children(".config-measures")
        .children(".am-dropdown")
        .css("display", "none");
    },

    // 点击弹出诊断
    // click_editDiagnoseConfig:function(diagnoseConfig){
    // 	this.openPopConfig(diagnoseConfig);
    // },
    sureDelDiagnoseConfig: function(diagnoseConfig) {
      $(".tool-confirm").css("display", "none");
      for (var i = 0; i < this.diaCatalogueNames.length; i++) {
        // alert(i);
        if (this.diaCatalogueNames[i] == diagnoseConfig.catalogueName) {
          this.diaCatalogueNames.splice(i, 1);
        }
      }
      var that = this;
      common.ajax({
        // 老接口
        //url: "knowledge-service/diagnose/config/" + diagnoseConfig.id,
        // 新接口
        url: "knowledge-service/diagnosis/config/" + diagnoseConfig.id,
        dataType: "json",
        type: "delete",
        async: true,
        callback: function() {
          console.log("删除成功");
          that.queryDiagnose();
        },
        errorCallback: function() {}
      });
    },
    // 删除配制
    delDiagnoseConfig: function(ev) {
      $(ev.target)
        .siblings(".tool-confirm")
        .css("display", "block");
    },
    // 新增诊断配置
    newDiagnoseConfig: function() {
      // this.editMode=true;
      this.configMode = "create";
      var obj = {
        catalogueCode: "",
        catalogueName: "",
        catalogueRule: "",
        groups: [
          {
            name: "组合1",
            setCount: 0,
            sort: 0,
            subsets: [
              {
                items: [
                  {
                    catalogueCode: "",
                    catalogueName: "",
                    catalogueRule: "",
                    type: ""
                  }
                ]
              }
            ]
          }
        ],
        id: 0,
        measures: [
          {
            catalogueCode: "",
            catalogueName: "",
            catalogueRule: "",
            customizeId: "0",
            sort: 0,
            type: 0
          }
        ],
        goals: [],
        appraisals: []
      };
      this.$refs.edit.loadData(
        obj,
        "create",
        this.diaCatalogueNames,
        this.diagnosesDic,
        this.positiveDic,
        this.measuresDic,
        this.goalsDic,
        this.appraisalsDic
      );
      this.openPopConfig();
    },
    // 修改诊断配置
    viewDiagnoseConfig: function(diagnoseConfig) {
      // this.editMode=true;
      var that = this;
      common.ajax({
        // 老接口
        //url:"knowledge-service/diagnose/config/"+diagnoseConfig.id,
        // 新接口
        url: "knowledge-service/diagnosis/config/" + diagnoseConfig.id,
        dataType: "json",
        type: "get",
        async: false,
        callback: function(data) {
          that.configMode = "view";
          that.$refs.edit.loadData(
            data,
            "view",
            that.diaCatalogueNames,
            that.diagnosesDic,
            that.positiveDic,
            that.measuresDic,
            that.goalsDic,
            that.appraisalsDic
          );
          that.openPopConfig();
        }
      });
    },
    // 点击添加组合
    // click_addCombination:function(){
    // 	var newCombination={
    // 	      "id": 0,
    // 	      "name": "",
    // 	      "resultId": 0,
    // 	      "resultName": 0,
    // 	      "setCount": 0,
    // 	      "subsets": [
    // 	        {
    // 	          "groupId": 0,
    // 	          "id": 0,
    // 	          "items": [
    // 	            {
    // 	              "code": "",
    // 	              "id": 0,
    // 	              "name": "",
    // 	              "subsetId": 0
    // 	            }
    // 	          ]
    // 	        }
    // 	      ]
    // 	    };
    // 	this.diagnoseConfigs.groups.push(newCombination);
    // },

    // click_addDiagnoseConfig:function(){

    //     var diagnoseConfig={
    //     "code": "",
    //     "groups": [
    // 	    {
    // 	      "id": 0,
    // 	      "name": "",
    // 	      "resultId": 0,
    // 	      "resultName": 0,
    // 	      "setCount": 0,
    // 	      "subsets": [
    // 	        {
    // 	          "groupId": 0,
    // 	          "id": 0,
    // 	          "items": [
    // 	            {
    // 	              "code": "",
    // 	              "id": 0,
    // 	              "name": "",
    // 	              "subsetId": 0
    // 	            }
    // 	          ]
    // 	        }
    // 	      ]
    // 	    }
    // 	 ],
    //   	   "id": 0,
    // 	   "measures": [
    // 	    {
    // 	      "code": "",
    // 	      "id": 0,
    // 	      "name": "",
    // 	      "resultId": 0,
    // 	      "type": 0
    // 	    }
    // 	  ],
    // 	  "name": ""
    // 	}
    // 	this.openPopConfig(diagnoseConfig);
    // },
    // 护理诊断配置修改新增
    openPopConfig: function() {
      //禁用Body的滚动条
      $(document.body).css({
        "overflow-x": "hidden",
        "overflow-y": "hidden"
      });
      $(".ui-sys-bar").css("display", "none");
      // this.ispop=true;
      this.closeLayer = layer.open({
        type: 1,
        offset: "rb",
        shift: 5,
        title: false,
        // zIndex:99999999991,
        shadeClose: true,
        shade: 0.6,
        closeBtn: 1,
        area: ["770px", "100%"], //宽高
        content: $("#pop-content"), //iframe的url
        end: function() {}
      });
      this.closeShadow();
    },
    closeShadow: function() {
      var app = document.querySelector(".layui-layer-shade");
      app.addEventListener("click", function() {
        $(".ui-sys-bar").css("display", "block");
      });
    },

    // 获得诊断配置
    queryDiagnose: function() {
      // common.setUserInfo();
      // var sortFlag=0;
      let that = this;
      common.ajax({
        // 老接口
        //url: "knowledge-service/diagnose/config",
        // 新接口
        url: "knowledge-service/diagnosis/config",
        dataType: "json",
        noNeedUint: true,
        type: "get",
        data: { sortFlag: that.sortFlag },
        async: true,
        callback: function(data) {
          that.diagnoseConfigs = data;
          if (data.length != 0) {
            that.isHasData = true;
          } else {
            that.isHasData = false;
          }
          that.diaCatalogueNames = [];
          that.diagnoseConfigs.forEach(function(el, index, array) {
            that.diaCatalogueNames.push(el.catalogueName);
          });
        }
      });
    },
    slide_fun: function(ev) {
      $(".slide_controll").slideUp();
      $(".clearActive")
        .not(ev.target)
        .removeClass("active");
      if (!$(ev.target).hasClass("active")) {
        $(ev.target).addClass("active");
        $(ev.target)
          .parents(".am-collapse-item")
          .find(".bd")
          .stop(true, true)
          .slideDown();
      } else {
        $(ev.target)
          .parents(".am-collapse-item")
          .find(".bd")
          .stop(true, true)
          .slideUp();
        $(ev.target).removeClass("active");
      }
    },

    getCatalogueRule: function() {
      // console.log('111')
      let that = this;
      common.ajax({
        url: "knowledge-service/rule/config",
        dataType: "json",
        type: "get",
        async: true,
        callback: function(data) {
          // // console.log(123)
        }
      });
    }
  },
  mounted() {
    this.catalogue = getCatalogue();
    common.setUserInfo();
    this.sortByTime = true;
    this.sortFlag = 1;
    //取编码值
    // this.getCatalogueRule ();
    this.queryDiagnose();
    this.getPositive();
    this.getDiagnose();
    this.getMeasures();
    this.getGoals();
    this.getAppraisals();
    $(document).on("click", function() {
      $(".tool-confirm").css("display", "none");
    });
    // this.watchDisplay=$("#pop-content").css("display")
    let that = this;
    this.$nextTick(() => {
      that.$refs.leftmenu.selectClick("nursingConfig");
    });
    // this.routerName=this.$route.name;
  },
  components: {
    nursingConfigEdit: nursingConfigEdit,
    menuTemplate: menu
  }
};
</script>
