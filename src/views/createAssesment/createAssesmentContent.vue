<template>
  <div onselectstart="return false">
    <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
    <div class="am-page-rcont bg-main" @click.stop="closeData()">
      <div class="am-page-pd">
        <div class="book-top-cont">
          <div class="book-top-return">
            <a class="txt-return" @click="returnBack()">返回</a>
            <div class="h5">创建
              <template v-if="!isEditAssesmentName">{{evaluation.evaluationName}}
                <i class="i-link-upd am-ml-5" style="margin-top: -2px;" @click.stop="clickEditAssesment"></i>
              </template>
              <template v-if="isEditAssesmentName">
                <input type="text" class="input-text w180" v-model="evaluation.evaluationName" @blur="editAssesmentName()" id="inputAssesment" />
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
              <li>
                <i class="num">2</i>
                <span class="txt">文书样式</span>
              </li>              
              <li class="cur">
                <i class="num">3</i>
                <span class="txt">配置文书内容</span>
              </li>
              <li>
                <i class="num">4</i>
                <span class="txt">列表设置</span>
              </li>
              <li>
                <i class="num">5</i>
                <span class="txt">科室设置</span>
              </li>
              <li>
                <i class="num">6</i>
                <span class="txt">编辑域设置</span>
              </li>
            </ul>
            <div class="right">
              <a class="am-btn am-btn-plain-info am-ml-10" @click.stop="addAssesmentLogic">+ 文书逻辑</a>
              <a class="am-btn am-btn-plain-info am-ml-10" @click.stop="preShowAssesment">预览</a>
              <a class="am-btn am-btn-info am-ml-10" @click.stop="nextStep()">下一步</a>
              <a class="am-btn am-btn-info am-ml-10" @click.stop="refresh()">刷新</a>              
            </div>
          </div>
        </div>
        <div class="model-drag-cont" style="top: 118px;">
          <template>
            <div class="topic-layout-lside model-drag-lside">
              <h4>问题类型</h4>
              <ul class="topic-list">
                <li id="menuItem" v-bind:class="[{'active':(questionType == 10||questionType==11)}]" @click="clickQuestionType(10)">
                  <div class="txt" id="10">单选题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">单选</div>
                    <div class="inline am-ctr-native-rdo">
                      <span>选项1</span>
                    </div>
                    <div class="inline am-ctr-native-rdo">
                      <span>选项2</span>
                    </div>
                  </div>
                </li>
                <li id="menuItem" v-bind:class="[{'active':questionType == 20}]" @click="clickQuestionType(20)">
                  <div class="txt" id="20">多选题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">多选</div>
                    <div class="inline am-ctr-native-rdo">
                      <span>选项1</span>
                    </div>
                    <div class="inline am-ctr-native-rdo">
                      <span>选项2</span>
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 12}]" @click="clickQuestionType(12)">
                  <div class="txt" id="12">开关题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">开关</div>
                    <div class="inline btn-switch-text">
                      <span>无</span>
                      <span class="active">有</span>
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 30}]" @click="clickQuestionType(30)">
                  <div class="txt" id="30">填空题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">输入框</div>
                    <input type="text" class="input-text w200 inline">
                  </div>
                </li>
                <li :class="{'active':questionType == 13}" @click="clickQuestionType(13)">
                  <div class="txt" id="13">下拉题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">输入框</div>
                    <div class="inline am-ctr-sel w200">
                      <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">按项目</a>
                      <div class="am-dropdown am-mr-10" style="display:none">
                        <ul>
                          <li class="disabled">
                            <a>选项不可用</a>
                          </li>
                          <li class="active">
                            <a>选项选中</a>
                          </li>
                          <li>
                            <a>选项二</a>
                          </li>
                          <li>
                            <a>选项三</a>
                          </li>
                          <li>
                            <a>选项四</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 90}]" @click="clickQuestionType(90)">
                  <div class="txt" id="90">时间框</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">时间框</div>
                    <input type="text" class="inline input-text input-date w200">
                  </div>
                </li>
                <li :class="{'active':questionType == 110}" @click="clickQuestionType(110)">
                  <div class="txt" id="110">图片</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">图片</div>
                    <div class="inline ">
                      <div class="am-file-a">
                        <input type="file">
                        <a>上传图片</a>
                      </div>
                      <span class="am-txt-muted">（文件大小500k）</span><br>
                    </div>
                  </div>
                </li>
                <li :class="{'active':questionType == 32}" @click="clickQuestionType(32)">
                  <div id="32" class="txt">自由文本</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">多行文本</div>
                    <div class="inline">
                      <textarea name="" rows="4" cols="" class="input-text input-textarea w400"></textarea>
                    </div>
                  </div>
                </li>
                <li :class="{'active':questionType == 201}" @click="clickQuestionType(201)">
                  <div id="201" class="txt">说明文字</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">说明文字</div>
                    <div class="inline am-txt-label">
                      我是说明文字
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 40}]" @click="clickQuestionType(40)">
                  <div class="txt" id="40">添加题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">添加题</div>
                    <div class="inline am-txt-label">
                      添加题
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 200}]" @click="clickQuestionType(200)">
                  <div class="txt" id="200">标签</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">标签</div>
                    <div class="inline am-txt-label">
                      标签
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 202}]" @click="clickQuestionType(202)">
                  <div class="txt" id="202">导入</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">导入</div>
                    <div class="inline am-txt-label">
                      导入
                    </div>
                  </div>
                </li>
                <li v-bind:class="[{'active':questionType == 41}]" @click="clickQuestionType(41)">
                  <div class="txt" id="41">表格题</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">表格题</div>
                    <div class="inline am-txt-label">
                      表格题
                    </div>
                  </div>
                </li>
              </ul>
              <h4>常用对象</h4>
              <ul class="topic-list">
                <li @click.stop="addGeneralObj('BASEINFO')">
                  <div class="txt">患者信息</div>
                </li>
                <li @click.stop="addGeneralObj('SIGNATURE')">
                  <div class="txt">签名</div>
                </li>
                <li @click.stop="clickQuestionType('IO')">
                  <div class="txt" id="IO">出入量统计</div>
                  <div class="placeholder-drag-panel">
                    <div class="inline">出入量统计</div>
                    <div class="inline am-txt-label">
                      出入量统计
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="topic-layout-rcont model-drag-main" :style="{ 'width':( evaluation.paperStyle.global.fullScreen || 1215) + 'px',}">
              <questionTrees ref="questionTree" :questionList="questionList" mode='add' :initFlag="initFlag" :activeQuestion="activeQuestion" :pageFrom="'knowledge'" :isShowCloseBtn='true' :treeId="evaluation.evaluationId"></questionTrees>
              <addQuestion @addQuestion="addQuestion" ref="addQues"></addQuestion>
            </div>
          </template>
          <div id="open" style="cursor:pointer;color:#FFF;text-align:center;width:20px;background:#009EF9;position:absolute;right:0px;top:0;z-index:9999;" @click="animate">
            详细配置<span v-if="!isRightSetOpen"> << </span><span v-else> >> </span>
          </div>
          <div class="topic-layout-right model-drag-rside" id="rside" style="background:#ffffff;">
            <div style="background:#ffffff;height:5px;cursor:move;width:365px;" @mousemove.stop="mousemove($event)" @mousedown.stop="mousedown($event)"></div>
            <!--觉得烦的话， am-mr-20 都改成 am-mr-10-->
            <ul style="height:40px" class="topic-strip" id="topicStrip">
              <template v-if="activeQuestion.currNode&&activeQuestion.currNode.paperTemplateId!='IO'">
                <li :class="{active:!isLogicSetting}" @click="isLogicSetting=false">设置</li>
                <li :class="{active:isLogicSetting}" @click="logicSetting()">逻辑设置</li>
              </template>
              <template v-if="activeQuestion.currNode&&activeQuestion.currNode.paperTemplateId=='IO'">
                <li>内容设置</li>
              </template>
            </ul>
            <template v-if="!isLogicSetting&&activeQuestion.currNode">
              <questionSetting
                :assessmentList="assessmentList" 
                :codingList="codingList" 
                :initPosition="evaluation.initPosition" 
                :linkFlagDict="linkFlagDict" 
                :specialFlagDict="specialFlagDict" 
                :currentQuestion="activeQuestion" 
                :statistiType="evaluation.statisticsType" 
                :detaType="evaluation.detailType"
                :isOnce = "evaluation.isOnce" 
                :tableFlag = "evaluation.tableFlag"
                :routineFlag = "evaluation.routineFlag"
                :dynamicFlag = "evaluation.dynamicFlag"
                @updateIOStatus="updateIOStatus" 
                @activeQuestionChange="questionChange" 
                @addHelp="addHelp" 
                @addNote="addNote" 
                @addBMI="addBMI" 
                @addGroupSentence="addGroup" 
                @addRemark="addRemark" 
                @addTips="addTips" 
                :units="units" 
                @addVerify="addVerify" 
                @addAttachQuestion="addAttachQuestion" 
                :pageFrom="'knowledge'" 
                ref="queMainSetting" 
                @addShare="addShare"
                @changeInitPosition="changeInitPosition" 
                @addInOutConfig="addInOutConfig"
                :mudList="mudList"
                :checkList="selectCheckList"
                :currentPage="currentPage"
               >
              </questionSetting>
              <!-- 子项的部分 -->
              <div class="bd-second">
                <i class="i-child-angle"></i>
                <template v-for="item in activeQuestion.currNode.optionList">
                  <template v-for="relateNode in item.hierarchyList" v-if="getRelatedNode(relateNode.childQuestionId)">
                    <div class="am-mt-10">{{item.catalogueName}}
                      <span class="am-txt-muted">子项</span>
                    </div>
                    <questionSetting
                      :assessmentList="assessmentList" 
                      :initPosition="evaluation.initPosition" 
                      :linkFlagDict="linkFlagDict" 
                      :specialFlagDict="specialFlagDict" 
                      :currentQuestion="getRelatedNode(relateNode.childQuestionId)" 
                      :statistiType="evaluation.statisticsType" 
                      :detaType="evaluation.detailType" 
                      :isOnce = "evaluation.isOnce" 
                      :tableFlag = "evaluation.tableFlag"
                      :routineFlag = "evaluation.routineFlag"   
                      :dynamicFlag = "evaluation.dynamicFlag"                   
                      @updateIOStatus="updateIOStatus" 
                      @activeQuestionChange="questionSubChange" 
                      @addGroupSentence="addGroup" 
                      :subRelateNode="relateNode" 
                      @addBMI="addBMI" 
                      @addHelp="addHelp" 
                      @addNote="addNote" 
                      @addRemark="addRemark" 
                      @addTips="addTips" 
                      :units="units" 
                      @addVerify="addVerify" 
                      ref="queSetting" 
                      @addShare="addShare" 
                      @changeInitPosition="changeInitPosition" 
                      @addInOutConfig="addInOutConfig"
                      :currentPage="currentPage">
                    </questionSetting>
                  </template>
                </template>
              </div>
            </template>
            <template v-if="isLogicSetting&&activeQuestion.currNode">
              <!--  <h5 style="margin: 20px 15px 10px 15px;font-size: 16px;">开关</h5> -->
              <div class="hd" style="padding-right: 15px;">
                <logicOption id="logicOption" ref="logicOption" @saveLogic="savelogic" :isShow="'true'" :activeQuestion="activeQuestion" :pageFrom="'evaluation'"></logicOption>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div id="inputLayer_" style="display:none">
        <inputLayer ref="inputLayer" @save="saveRemark" @cancel="cancelCheckOption" :inputLayerObj='inputLayerObj'></inputLayer>
      </div>
      <logicOption id="logicOptionOpen" ref="logicOptionOpen" :pageFrom="'evaluation'" v-show="false" :isShow="'false'" :activeQuestion="activeQuestion"></logicOption>

      <addNormalObj :activeQuestion="activeQuestion" ref="reAddNormalObj"  id="reAddNormalObj" v-show="false"></addNormalObj>
      <!--   <confirmMsg id="Confirm" :content="confirMsg" :layerIndex="layerDelIndex" :title="title"></confirmMsg> -->
      <groupSentence ref="addGroups" @saveGroup="saveGroup" :inputLayerObj="inputLayerObj" id="addGroup_" v-show="false"></groupSentence>
      <inputImgLayer ref="anputImgLayers" @save="saveHelpContent" :inputLayerObj="inputLayerObj" id="ImageInputLayer_" v-show="false"></inputImgLayer>
      <verifyLayer ref="verifyLayer" @save="saveVerify" id="verifyLayer" :inputLayerObj="inputLayerObj" v-show="false"></verifyLayer>
      <shareLayer ref="addShare" id="addShare" v-show="false" @saveShare="saveShare" :pageFrom="'assesment'" />
      <inOrOutConfig ref="addInOutConfig" id="addInOutConfig" v-show="false"></inOrOutConfig>
      <!-- addInOutConfig -->
      <confirmDelete id="deleteConfirm" style="display:none" :content="'确认删除该问题？'" :layerIndex="layerDelIndex"></confirmDelete>
      <bmi-window @saveFormula="saveFormula" id="bmi" ref="bmi" :treeList="treeList" :inputLayerObj="inputLayerObj" v-show="false"></bmi-window>
      <option-note ref="note" @saveOptionNote="saveOptionNote" id="note" :inputLayerObj="inputLayerObj" v-show="false"></option-note>
    </div>
  </div>
  
</template>
<script>
import { ajaxAsync } from "@/util/common_b";
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import menuTemplate from "../../components/menu.vue";
import "@/css/level.css";
import inputLayer from "@/components/questionC/inputLayer.vue";
import { mapState, mapActions, mapMutations } from "vuex";
import logicOption from "@/components/logic/logicOption.vue";
import questionTrees from "@/components/questionTree/questionTree";
import confirmDelete from "@/components/confirm_delete.vue";
import inputImgLayer from "@/components/questionC/inputAndImageLayer.vue";
import bmiWindow from "@/components/questionC/bmi.vue";
import optionNote from "@/components/questionC/optionNote.vue";
import inOrOutConfig from "@/components/questionC/inOrOutConfig.vue";
import verifyLayer from "@/components/questionC/verifyLayer.vue";
import { getCatalogue } from "@/util/util";
import imageUpload from "@/components/questionC/imageUpload.vue";
import questionSetting from "@/components/questionC/questionSetting.vue";
import addQuestion from "@/components/questionC/addQuestion.vue";
import groupSentence from "@/components/questionC/groupSentence.vue";
import shareLayer from "@/components/questionC/shareLayer.vue";
import addNormalObj from "@/components/questionC/addNormalObj.vue";
export default {
  name: "createAssesmentContent",
  data() {
    return {
      currentPage: "createAssesmentContent",
      evaluationId: common.getUrlParam("assesmentId"),
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      evaluation: {},
      questionType: "",
      inputLayerObj: {
        layerTitle: "",
        placeholder: "",
        content: "",
        type: ""
      },
      layerTitle: "", //inputLayer弹出层的名字
      placeholder: "", //inputLayer弹出层中的输入框的默认值
      optionList: [], //选项列表
      questionTree: [], //供预览的问题树
      questionIdAll: 0, //动态增加的问题ID计数
      hierarchyList: [], //位置逻辑列表
      logicList: [], //选项逻辑列表
      initFlag: false,
      layerDelIndex: 0,
      confirMsg: "",
      title: "",
      notAddAttach: true, //表示否是增加的附属题,用于判断是新增附属题还是新增问题
      mode: "", //addQuestion 创建问题 editQuestion编辑问题  addLogic增加逻辑  editLogic修改逻辑
      activeQuestion: {},
      isLogicSetting: false,
      units: [], //单位数据字典列表
      sexs: [], //性别数据字典列表
      isEditAssesmentName: false,
      linkFlagDict: [],
      specialFlagDict: [],
      inOutTypeArr: [],
      inDetailArr: [],
      outDetailArr: [],
      codingList: [],
      x: 0,
      y: 0,
      isDown: false,
      isDrag: false,
      treeList: [],
      mQuestionList: [],
      assessmentList: [],
      mudList: [],
      isRightSetOpen: false,
      selectCheckList: [],
    };
  },
  computed: {
    questionList: function() {
      if (!this.questionTree) {
        return {};
      }
      let ac = {
        questionList: this.questionTree
      };
      return ac;
    }
  },
  methods: {
    ...mapMutations(["SET_PAPERSTYLE", "SET_USERFULWIDTH", "SET_LOGICINTER"]),
    // 缓存刷新接口调取
    refresh() {
      common.ajax({
        url: 'knowledge-service/evaluation/_refresh?evaluationId=' + this.evaluationId,
        type: 'get', 
        dataType:'json',
        callback: function(data) {
          common.tip_msgArea('刷新成功', 1000)          
        }
      });        
    }, 
    defaultPosition(flag) {
      if (flag == "open") {
        $("#open").css("left", "auto");
        $("#open").css("right", "365px");
        $("#open").css("top", "0px");
        $("#rside").css("right", "0px");
        $("#rside").css("left", "auto");
        $("#rside").css("top", "0px");
        this.isRightSetOpen = true;
      } else {
        $("#open").css("left", "auto");
        $("#open").css("right", "0");
        $("#open").css("top", "0");
        $("#rside").css("right", "-365px");
        $("#rside").css("left", "auto");
        $("#rside").css("top", "0");
        this.isRightSetOpen = false
      }
    },
    animate() {
      if ($("#rside").css("right") == "0px") {
        this.defaultPosition("close");
      } else {
        this.defaultPosition("open");
        $("#mainQuestion").focus();
      }

      if (this.isDrag) {
        this.defaultPosition();
        this.isDrag = false;
      }
    },
    // 右侧样式框拖拽
    mousedown: function() {
      this.isDown = true;
    },
    mousemove(e) {
      if (!this.isDown) {
        return;
      }
      const odiv = document.getElementById('rside');
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        this.isDrag = true;
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;

        // 拖拽四周界限设置
        if (left < 120) {
          left = 120;
        }

        if (left > 983) {
          left = 983;
        }

        if (top < 0) {
          top = 0;
        }

        if (top > 335) {
          top = 335;
        }
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";

        let nLeft = left - 20;
        $("#open").css("left", nLeft);
        $("#open").css("top", top + "px");
      };
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    mouseup() {
      this.isDown = false;
    },
    // 江苏省人民医院下拉题特色编码配置获取
    getEncodingList: function() {
      const that = this;
      common.ajax({
        url: "knowledge-service/dictionary/domain",
        type: "get",
        dataType: "json",
        callback: function(data) {
          let codingArray = [];
          that.codingList = data;
          that.codingList.forEach((ele, i) => {
            codingArray.push({
              codingVal: ele[0],
              codingNam: ele[1],
              isActive: false
            });
          });
          that.codingList = codingArray;
        }
      });
    },
    /*创建评估单问题*/
    addQuestion: function(questionId) {
      this.saveAddQuestion(questionId);
    },
    //创建搜索的附属问题
    addSearchQuestion: function(questionId) {
      this.saveAddQuestion(questionId, "attachQues");
    },
    //编辑评估单名称
    editAssesmentName: async function() {
      let data = {
        evaluationId: this.evaluationId,
        evaluationName: this.evaluation.evaluationName
      };
      await ajaxAsync({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data: JSON.stringify(data)
      });
      this.isEditAssesmentName = false;
      common.tip_msg("保存成功", 1000);
    },
    //点击编辑评估单
    clickEditAssesment: function() {
      this.isEditAssesmentName = true;
      Vue.nextTick(function() {
        $("#inputAssesment").focus();
      });
    },
    //添加常用对象
    addGeneralObj: function(typeObj) {
      let that = this;
      layer.open({
        type: 1,
        skin: "layui-layer-demo", //样式类名
        closeBtn: 1, //不显示关闭按钮
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        title: "+常用对象",
        shade: 0.6,
        area: ["500px", "220px"], //宽高
        content: $("#reAddNormalObj"), //iframe的url
        success: function(layero, index) {
          that.$refs.reAddNormalObj.initLayer(
            index,
            typeObj,
            that.evaluationId,
            that.activeQuestion
          );
        },
        end: function() {
          if (that.$refs.reAddNormalObj.hasSave) {
            that.getEvaluationById();
          }
        }
      });
    },
    //关闭数据
    closeData: function() {
      if (this.$refs.addQues) {
        this.$refs.addQues.closePop();
      }
      this.closePop();
    },
    async saveAddQuestion(questionId, type) {
      //debugger;
      let sortNum = this.activeQuestion.childList
        ? this.activeQuestion.childList.length
        : 0;
      let that = this;
      let url = "";
      if (type) {
        //保存附属题
        url =
          "knowledge-service/evaluation/paper2/question?questionId=" +
          questionId +
          "&evaluationId=" +
          this.evaluationId +
          "&parentUniqueId=" +
          this.activeQuestion.currNode.uniqueId +
          "&sortNum=" +
          sortNum;
      } else {
        url =
          "knowledge-service/evaluation/paper2/question?questionId=" +
          questionId +
          "&evaluationId=" +
          this.evaluationId;
      }
      let data = await ajaxAsync({
        url: url,
        dataType: "json",
        type: "post"
      });
      if (!type) {
        //保存评估单问题
        that.getQuestionByUniqIds(data, "setEvalutionQues");
      } else {
        that.getQuestionByUniqIds(
          that.activeQuestion.currNode.uniqueId,
          "setQuestion"
        );
      }
    },
    //保存出入量问题
    async saveInOrOutQuestion(node, type) {
      let sortNum = this.activeQuestion.childList
        ? this.activeQuestion.childList.length
        : 0;
      let url = "";
      if (type) {
        //保存附属题
        url =
          "knowledge-service/evaluation/paper2/question?questionId=" +
          node.currNode.questionId +
          "&evaluationId=" +
          this.evaluationId +
          "&parentUniqueId=" +
          this.activeQuestion.currNode.uniqueId +
          "&sortNum=" +
          sortNum;
      } else {
        url =
          "knowledge-service/evaluation/paper2/question?questionId=" +
          node.currNode.questionId +
          "&evaluationId=" +
          this.evaluationId;
      }
      let data = await ajaxAsync({
        url: url,
        dataType: "json",
        type: "post"
      });
      if (!type) {
        node.currNode.uniqueId = data;
        this.setInOrOutNode(node, this.questionTree.length);
      } else {
        this.getQuestionByUniqIds(
          this.activeQuestion.currNode.uniqueId,
          "setQuestion"
        );
      }
    },
    //改变文书初始位置
    changeInitPosition: async function(initPosition) {
      await ajaxAsync({
        url: "knowledge-service/evaluation/paper2/init",
        dataType: "json",
        type: "get",
        data: { initPosition: initPosition, evaluationId: this.evaluationId }
      });
      this.evaluation.initPosition = initPosition;
      common.tip_msg("已保存");
    },
    //设置评估单搜索的问题
    setEvalutionQues: function(problems) {
      this.questionTree.push(problems);
      this.refreshPreShow();
    },
    //预览评估单
    preShowAssesment: function() {
      let url = "/#/preShowAssesment?" + "&evaluationId=" + this.evaluationId;
      this.showQuestionLayer(url);
    },
    //添加文书逻辑
    addAssesmentLogic: function() {
      let that = this;
      layer.open({
        type: 1,
        title: "文书逻辑",
        shadeClose: true,
        shade: 0.6,
        closeBtn: 1,
        area: ["600px", "400px"],
        content: $("#logicOptionOpen"),
        end: function() {
          that.$refs.logicOptionOpen.clearCach();
        },
        success: function(layero, index) {
          that.$refs.logicOptionOpen.initAssesmentLogic(
            that.evaluationId,
            that.activeQuestion,
            index
          );
        }
      });
    },
    showQuestionLayer(url) {
      let that = this;
      $(".ui-sys-bar").css("display", "none");
      layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        // shade: [0],
        shadeClose: true,
        shade: 0.6,
        area: ["1200px", "100%"],
        offset: "rb", //右下角弹出*/
        content: [url, "no"], //iframe的url，no代表不显示滚动条
        end: function() {
          //此处用于演示
          $(".ui-sys-bar").css("display", "block");
        }
      });
    },
    //通过uniqId获取问题
    getQuestionByUniqIds: async function(uniQuestionId, funcName) {
      let that = this;
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/paper2/question/" + uniQuestionId,
        dataType: "json",
        type: "get",
        data: { evaluationId: this.evaluationId, uniqueId: uniQuestionId }
      });
      if (funcName == "setQuestion") {
        this.setQuestion(data);
      } else {
        this.setEvalutionQues(data);
      }
    },
    //通过评估单id获取评估单
    async getEvaluationById() {
      let that = this;
      let data = await ajaxAsync({
        url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/detail",
        type: "get"
      });
      this.evaluation = data;
      this.questionTree = data.questionList;
      this.setActiveQuestion();
    },
    //设置当前选择的问题
    setActiveQuestion: function() {
      let that = this;
      if (
        this.activeQuestion &&
        this.activeQuestion.currNode &&
        this.questionTree.length > 0
      ) {
        let obj = this.questionTree.find(al => {
          return al.currNode.uniqueId == that.activeQuestion.currNode.uniqueId;
        });
        if (obj) {
          this.activeQuestion = obj;
        } else {
          this.activeQuestion = { currNode: undefined };
        }
      } else if (this.questionTree.length > 0) {
        this.activeQuestion = this.questionTree[0];
      }
      this.refreshPreShow();
    },
    returnBack: function() {
      let { query } = this.$route;
      if (common.getUrlParam("typeFrom") == "createAsses") {
        // this.$router.push({ path: "/", query: query });
        this.$router.push({ path: "/styleSetting", query: query });
      } else {
        this.$router.push({ path: "/createAssesmentTitle", query: query });
      }
    },
    //保存选择的子项问题
    selectSubItem: function(option, questionType) {
      let that = this;
      let childItem = this.getQuestionByType(questionType);
      //根据选中的题目保存后台拼接好questionId和optionID之后返回
      let sortNum = this.activeQuestion.childList
        ? this.activeQuestion.childList.length
        : 0;
      this.saveChildTempQuestion(childItem, "childQuestion", sortNum, option);
    },
    //当前选中的问题改变而保存问题
    questionChange: function(curvalue) {
      this.activeQuestion = curvalue;
      this.saveQuestion(curvalue);
      this.refreshPreShow();
    },
    //添加子项，由于添加的子项optionId为空，则需要赋值为返回的数据，因此需要特殊处理
    addOption: function(optionIdAll, curvalue) {
      let optionId = "o-" + optionIdAll;
      let catalogueName = "选择选项";
      if (this.questionType == 30) {
        catalogueName = "";
      }
      curvalue.currNode.optionList.push({
        catalogueName: catalogueName,
        optionId: optionId,
        questionId: "q-0",
        logicList: [],
        hierarchyList: [],
        filePaths: [],
        helpContent: "",
        checkList: {
          checkContext: "",
          checkMark: "",
          checkType: "",
          inputType: "",
          scopeList: [],
          pictureCount: 0,
          pictureFormat: "",
          pictureSize: "",
          remindType: 0
        },
        style: {
          height: 1,
          link: 0,
          maxLength: 0,
          width: 220,
          margin: 10
        },
        unitList: []
      });

      this.saveOption(curvalue);
    },
    //添加添加题选项
    addAddOption: function(optionId, curvalue, value) {
      var op = this.activeQuestion.currNode.optionList.find(op => {
        return op.optionType == 61;
      });
      if (!op) {
        curvalue.currNode.optionList.push({
          aliasName: value,
          aliasType: 1,
          optionId: optionId,
          questionId: curvalue.currNode.questionId,
          logicList: [],
          checkList: {
            checkContext: ""
          },
          sentence: {},
          unitList: [],
          style: {},
          optionType: "61",
          hierarchyList: []
        });
      } else {
        op.aliasName = value;
      }
      this.saveOption(curvalue);
    },
    //添加添加题选项
    addQuestionOption: function(type, params, activeQuestion) {
      debugger
      let optionId = "o-" + params.optionIdAll;
      activeQuestion.currNode.optionList.push({
        aliasName: params.aliasName,
        aliasType: 1,
        optionId: optionId,
        questionId: activeQuestion.currNode.questionId,
        logicList: [],
        checkList: {
          checkContext: ""
        },
        style: {},
        optionType: params.optionType,
        hierarchyList: []
      });
      this.saveOption(activeQuestion);
    },
    //添加子项不需要保存
    addSubItem: function(optionItem) {
      Vue.set(optionItem, "hasSubItem", true);
      this.refreshPreShow();
    },
    //子项的问题改变则保存
    questionSubChange: function(curvalue) {
      this.saveQuestion(curvalue);
      this.refreshPreShow();
    },
    updateIOStatus: function(obj) {
      this.evaluation.statisticsType = obj.statisticsType;
      this.evaluation.detailType = obj.detailType;
    },
    //添加附属题
    addAttachQuestion: function() {
      this.addAttachQues();
    },
    initChildSortabble: function(qid) {
      let that = this;
      let id = "#topic-panel-childlist" + qid;
      let zindex = $(id).css("z-index");
      $(id).sortable({
        revert: true,
        delay: 200,
        zIndex: 9990,
        cursor: "move",
        stop: function(e, t) {
          var arr = $(id).sortable("toArray");
          let aindex = -1;
          arr.forEach((al, index) => {
            if (al == "") {
              aindex = index;
            }
          });
          if (aindex > -1) {
            if (that.questionType != "IO") {
              let childItem = that.getQuestionByType(that.questionType);
              //根据选中的题目保存后台拼接好questionId和optionID之后返回
              that.saveChildTempQuestion(childItem, "childQuestion", aindex);
            } else {
              that.getCommonObj("attachQues");
            }
          } else {
            var arr = $(id).sortable("toArray");
            that.sortDragtable(arr);
          }
          let aac = id + "> li:not(.topic-panel)";
          if ($(aac).length > 0) {
            $(aac).remove();
          }
          $(id).css("z-index", zindex);
        }
      });
    },
    //添加附属题
    addAttachQues: function() {
      let that = this;
      let qid = this.activeQuestion.currNode.uniqueId
        ? this.activeQuestion.currNode.uniqueId
        : this.activeQuestion.currNode.questionId;
      let id = "#topic-panel-childlist" + qid;
      let zindex = $(id).css("z-index");
      Vue.set(this.activeQuestion.currNode, "isAttach", true);
      this.selectAttachUniqId = qid;
      this.notAddAttach = false;
      $(".topic-list>li").draggable({
        connectToSortable: id,
        helper: "clone",
        revert: "invalid",
        stop: function(e, t) {
          let tempHtml = $(t.helper).html();
          that.questionType = $(tempHtml)
            .eq(0)
            .attr("id");
        }
      });
    },
    nextStep: function() {
      let { query } = this.$route;
      // this.$router.push({ path: "/styleSetting", query: query });
      this.$router.push({ path: "/assesmentTableSetting", query: query });
    },
    //获取关联节点
    getRelatedNode: function(id) {
      return this.activeQuestion.childList.find(childNode => {
        return childNode.currNode.questionId == id;
      });
    },
    /*根据问题id，获取所在问题的父节点*/
    getParentNodeById: function(uniqueId, node) {
      for (var i = 0; i < node.childList.length; i++) {
        if (node.childList[i].currNode.uniqueId == uniqueId) {
          return node;
        }
        let aNode = this.getParentNodeById(uniqueId, node.childList[i]);
        if (aNode) {
          return aNode;
        }
      }
    },
    //上移下移排序
    changeNodeIndex: function(obj) {
      let isMianQuestion = false;
      let findIndex = -1;
      for (var i = 0; i < this.questionTree.length; i++) {
        let node = this.questionTree[i];
        if (node.currNode.uniqueId == obj.node.currNode.uniqueId) {
          isMianQuestion = true;
          findIndex = i;
          break;
        }
      }
      if (isMianQuestion) {
        if (obj.type == "pre") {
          let i = findIndex - 1;
          let cur = this.questionTree[i]; //获取修改前当前索引的column
          cur.currNode.sortNum = findIndex + 1;
          obj.node.currNode.sortNum = findIndex - 1;
          this.questionTree[i] = obj.node; //将当前索引的位置修改为新的及诶单
          this.questionTree[findIndex] = cur;
        } else {
          let i = findIndex + 1;
          let cur = this.questionTree[i]; //获取修改前当前索引的column
          cur.currNode.sortNum = findIndex - 1;
          obj.node.currNode.sortNum = findIndex + 1;
          this.questionTree[i] = obj.node; //将当前索引的位置修改为新的及诶单
          this.questionTree[findIndex] = cur;
        }
        this.updateNextOrUpdate(
          obj.node.currNode.uniqueId,
          obj.type == "pre" ? -1 : 1,
          isMianQuestion
        );
      } else {
        let parentNode = this.fetchParentNode(obj.node.currNode.uniqueId);
        this.updateNextOrUpdate(
          obj.node.currNode.uniqueId,
          obj.type == "pre" ? -1 : 1,
          isMianQuestion,
          parentNode.currNode.uniqueId
        );
      }
      this.refreshPreShow();
    },
    //更新上移下移接口
    updateNextOrUpdate: async function(
      uniqueId,
      increment,
      isMianQuestion,
      parentUniqueId
    ) {
      let data = { uniqueId: uniqueId, increment: increment };
      let that = this;
      await ajaxAsync({
        url: "knowledge-service/new/update/location",
        type: "get",
        data: data
      });
      if (!isMianQuestion) {
        //附属题的上移下移
        that.getQuestionByUniqIds(parentUniqueId, "setQuestion");
      } else {
        //主题目直接保存
        common.tip_msg("已保存");
      }
    },
    fetchParentNode: function(uniqueId) {
      for (var i = 0; i < this.questionTree.length; i++) {
        let node = this.questionTree[i];
        let newNode = this.getParentNodeById(uniqueId, node);
        if (newNode) {
          return newNode;
        }
      }
    },
    //拖动排序所有问题
    sortMainQuestionDragtable: function(arrs) {
      let newSortArr = [];
      if(arrs && arrs.length > 0 && this.questionTree && this.questionTree.length > 0) {
        arrs.forEach((el, i) => {
          this.questionTree.forEach((element, index) => {
            if(el == element.currNode.uniqueId) {
              newSortArr.push(element)              
            }
          })
        })
      }

      this.questionTree = newSortArr;
      this.editHierarchy(newSortArr);
    },
    /*根据附属题新的id顺序进行排序*/
    sortDragtable: function(arrs) {
      let node = this.fetchParentNode(arrs[0]);
      let newSortArr = [];
      for (var i = 0; i < arrs.length; i++) {
        node.childList.forEach(al => {
          if (arrs[i] == al.currNode.uniqueId) {
            newSortArr.push(al);
          }
        });
      }
      this.editHierarchy(newSortArr, node);
    },
    //编辑位置逻辑
    editHierarchy: function(childList, node) {
      let that = this;
      let arr = [];
      childList.forEach((al, index) => {
        arr.push({
          uniqueId: al.currNode.uniqueId,
          parentUniqueId: node ? node.currNode.uniqueId : undefined,
          sortNum: index
        });
      });
      let param = {
        evaluationId: this.evaluationId,
        list: arr
      };
      ajaxAsync({
        url: "knowledge-service/new/paper/question/hierarchy",
        type: "put",
        data: JSON.stringify(param)
      });
      this.refreshPreShow();
    },
    //刷新预览
    refreshPreShow() {
      let that = this;
      Vue.nextTick(function() {
        //指定为横向显示
        let paperStyle = { arrangement: 2, line: 1 };
        that.SET_PAPERSTYLE(paperStyle);
        let questionList = $.extend(true, {}, that.questionList);
        that.$refs.questionTree.initData(questionList);
      });
    },
    logicSetting: function() {
      this.SET_LOGICINTER("createAssesmentContent");
      if (this.activeQuestion && this.activeQuestion.currNode) {
        let id = this.activeQuestion.currNode.questionId;
        if (String(id).indexOf("-") > -1) {
          common.tip_msg("请先添加问题", 2000);
          return;
        }
      }
      this.isLogicSetting = true;
    },
    savelogic: function(logicOptionArr, isSave) {
      if (isSave) {
        this.addLogic(logicOptionArr);
      }
    },
    //把选项设为普通选项
    cancelCheckOption(index) {
      if (
        this.questionType == 30 ||
        this.questionType == 80 ||
        this.questionType == 90
      ) {
        Vue.set(this.activeQuestion.currNode.checkList[0], "checkContext", "");
      } else if (this.questionType == 70) {
        Vue.set(this.activeQuestion.childList[index].currNode, "checkList", [
          {
            checkContext: ""
          }
        ]);
      } else {
        Vue.set(
          this.activeQuestion.currNode.optionList[index],
          "optionType",
          "1"
        );
        Vue.set(this.activeQuestion.currNode.optionList[index], "checkList", [
          {
            checkContext: ""
          }
        ]);
      }
      layer.closeAll();
      this.refreshPreShow();
    },
    openInputLayer(height, content, width) {
      let layerContent = "#inputLayer_";
      debugger;
      if (content) {
        layerContent = content;
      }
      let aWidth = "500px";
      if (width) {
        aWidth = width;
      }
      let that = this;
      layer.open({
        type: 1,
        skin: "layui-layer-demo", //样式类名
        closeBtn: 0, //不显示关闭按钮
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        title: false,
        shade: 0.6,
        // closeBtn: 1,
        area: [aWidth, height], //宽高
        content: $(layerContent), //iframe的url
        success: function(layero, index) {
          if (content == "#ImageInputLayer_") {
            that.$refs.anputImgLayers.initLayer(index);
          } else if (content == "#verifyLayer") {
            that.$refs.verifyLayer.initLayer(index);
          } else if (content == "#addGroup_") {
            that.$refs.addGroups.initLayer(index);
          } else if (content == "#addShare") {
            that.$refs.addShare.initLayer(index);
          } else if (content == "#addInOutConfig") {
            that.$refs.addInOutConfig.initLayer(index);
          } else if (content == "#bmi") {
            that.$refs.bmi.initLayer(index);
          }else {
            that.$refs.inputLayer.initLayer(index);
          }
        }
      });
    },
    //保存帮助内容
    saveHelpContent: function(textArea, filePaths, obj) {
      let node = this.fetchQuestionById(
        obj.activeQuestion.currNode.questionId,
        obj.activeQuestion.currNode.uniqueId
      );
      if (obj.type == "questionHelp") {
        Vue.set(node.currNode, "helpContent", textArea);
        Vue.set(node.currNode, "filePaths", filePaths);
      } else if (obj.type == "optionHelp") {
        Vue.set(node.currNode.optionList[obj.index], "helpContent", textArea);
        Vue.set(node.currNode.optionList[obj.index], "filePaths", filePaths);
      }

      if (obj.subRelateNode) {
        //如果是来自子项的保存帮组，则子项的题目需要保存
        this.saveQuestion(obj.activeQuestion);
      } else {
        this.saveQuestion(node);
        this.refreshPreShow();
      }
    },
    //保存组句
    saveGroup: function(sentence, obj) {
      let node = this.fetchQuestionById(
        obj.activeQuestion.currNode.questionId,
        obj.activeQuestion.currNode.uniqueId
      );
      if (obj.type == "questionGroup") {
        Vue.set(node.currNode, "sentence", sentence);
      } else if (obj.type == "optionGroup") {
        Vue.set(node.currNode.optionList[obj.index], "sentence", sentence);
      }
      this.saveQuestion(node);
    },
    // 添加选项备注
    addNote(optionIndex, optionItem, activeQuestion) {
      let that = this;
      this.inputLayerObj = {};
      $.extend(true, this.inputLayerObj, {
        layerTitle: "选项备注添加配置",
        'optionIndex': optionIndex,
        'optionItem': optionItem,
        'activeQuestion': activeQuestion,
      });
      that.openInputLayer("300px", "#note", "500px");
    },
    //添加帮助
    addHelp(helpType, optionIndex, optionItem, activeQuestion, subRelateNode) {
      this.inputLayerObj = {};
      if (!activeQuestion.currNode) {
        common.tip_msg("请先选择问题", null, null);
        return;
      }
      let str = "";
      let filePaths = [];
      if (helpType == "questionHelp") {
        str = activeQuestion.currNode.helpContent;
        filePaths = activeQuestion.currNode.filePaths;
      } else if (helpType == "optionHelp") {
        str = activeQuestion.currNode.optionList[optionIndex].helpContent;
        filePaths = activeQuestion.currNode.optionList[optionIndex].filePaths;
      }

      $.extend(true, this.inputLayerObj, {
        layerTitle: "帮助",
        placeholder: "请输入帮助内容",
        type: helpType,
        index: optionIndex
      });
      if (subRelateNode) {
        this.inputLayerObj.subRelateNode = subRelateNode;
      }
      this.inputLayerObj.activeQuestion = activeQuestion;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.anputImgLayers.init(str, filePaths);
      });
      that.openInputLayer("500px", "#ImageInputLayer_");
    },
    // 添加BMI公式配置
    addBMI(optionIndex, optionItem, obj) {
      let that = this;
      this.inputLayerObj = {};
      $.extend(true, this.inputLayerObj, {
        layerTitle: "BMI公式配置",
        'optionIndex': optionIndex,
        'optionItem': optionItem,
        'activeQuestion': obj,
      });
      that.openInputLayer("500px", "#bmi", "800px");
    },
    //保存备注
    saveRemark(content, obj) {
      if (obj.type == "remark") {
        Vue.set(obj.activeQuestion.currNode, "questionRemark", content);
      } else if (obj.type == "content") {
        Vue.set(obj.activeQuestion.currNode, "helpContent", content);
      } else if (obj.type == "tips") {
        //提示语
        Vue.set(
          obj.activeQuestion.currNode.optionList[obj.index],
          "placeHolder",
          content
        );
      }
      this.saveQuestion(obj.activeQuestion);
      layer.closeAll();
    },
    //添加备注
    addRemark(activeQuestion, subRelateNode) {
      this.inputLayerObj = {};
      let str = activeQuestion.currNode.questionRemark;
      $.extend(true, this.inputLayerObj, {
        layerTitle: "题目--备注",
        placeholder: "请输入备注",
        content: str,
        type: "remark",
        index: null
      });
      if (subRelateNode) {
        this.inputLayerObj.subRelateNode = subRelateNode;
      }
      this.inputLayerObj.activeQuestion = activeQuestion;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.inputLayer.init(str);
      });
      that.openInputLayer();
    },
    //添加共享
    addShare: function(activeQuestion, subRelateNode) {
      let layerObj = {};
      if (subRelateNode) {
        layerObj.subRelateNode = subRelateNode;
      }
      layerObj.activeQuestion = activeQuestion;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.addShare.init(layerObj);
      });

      this.openInputLayer("500px", "#addShare", "700px");
    },
    //添加出入量配置
    addInOutConfig: function(activeQuestion, subRelateNode) {
      let layerObj = {};
      if (subRelateNode) {
        layerObj.subRelateNode = subRelateNode;
      }
      layerObj.activeQuestion = activeQuestion;
      layerObj.inOutTypeArr = this.inOutTypeArr;
      layerObj.inDetailArr = this.inDetailArr;
      layerObj.outDetailArr = this.outDetailArr;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.addInOutConfig.init(layerObj);
      });
      this.openInputLayer("500px", "#addInOutConfig", "700px");
    },
    //保存共享
    saveShare: function(obj, isShare) {
      Vue.set(obj.activeQuestion.currNode, "isShare", isShare);
      // this.saveQuestion(obj.activeQuestion);
    },
    saveFormula: function(val) {
      this.activeQuestion = val;
      this.saveQuestion(val);
      // this.$set()
    },
    saveOptionNote: function(val) {
      this.activeQuestion = val;
      this.saveQuestion(val);
    },
    //添加组句
    addGroup: function(
      groupType,
      optionIndex,
      item,
      activeQuestion,
      subRelateNode
    ) {
      this.inputLayerObj = {};
      if (!activeQuestion.currNode) {
        common.tip_msg("请先选择问题", null, null);
        return;
      }
      let sentence = {};
      if (groupType == "questionGroup") {
        sentence = activeQuestion.currNode.sentence;
      } else if (groupType == "optionGroup") {
        sentence = activeQuestion.currNode.optionList[optionIndex].sentence;
      }

      $.extend(true, this.inputLayerObj, {
        layerTitle: "帮助",
        placeholder: "请输入帮助内容",
        type: groupType,
        index: optionIndex
      });
      if (subRelateNode) {
        this.inputLayerObj.subRelateNode = subRelateNode;
      }
      this.inputLayerObj.activeQuestion = activeQuestion;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.addGroups.init(sentence);
      });
      that.openInputLayer("300px", "#addGroup_");
    },
    //添加校验
    addVerify(index, item, activeQuestion, subRelateNode) {
      this.inputLayerObj = {};
      $.extend(true, this.inputLayerObj, {
        layerTitle: item.catalogueName + "--填空校验",
        placeholder: "请输入校验内容",
        content: item.checkList || null,
        checkListGroup: item.checkListGroup || [],
        type: "verify",
        index: index
      });
      if (subRelateNode) {
        this.inputLayerObj.subRelateNode = subRelateNode;
      }
      this.inputLayerObj.activeQuestion = activeQuestion;
      debugger;
      let that = this;
      Bus.$emit('sendVerifyLayer', this.inputLayerObj)
      that.openInputLayer("350px", "#verifyLayer");
    },
    //添加提示语
    addTips(index, item, activeQuestion, subRelateNode) {
      this.inputLayerObj = {};
      $.extend(true, this.inputLayerObj, {
        layerTitle: "选项--提示语",
        placeholder: "请输入提示语",
        content: item.placeHolder,
        type: "tips",
        index: index
      });
      if (subRelateNode) {
        this.inputLayerObj.subRelateNode = subRelateNode;
      }
      this.inputLayerObj.activeQuestion = activeQuestion;
      let that = this;
      Vue.nextTick(function() {
        that.$refs.inputLayer.init(item.placeHolder);
      });
      that.openInputLayer();
    },
    //保存校验
    saveVerify: function(obj) {
      // debugger
      if(obj.content.length > 0) {
        obj.activeQuestion.currNode.optionList[obj.index].checkList = obj.content[0];
      }

      Vue.set(
        obj.activeQuestion.currNode.optionList[obj.index],
        "checkListGroup",
        obj.content
      );      
      this.saveQuestion(obj.activeQuestion);
    },
    //保存临时问题
    saveTempQuestion(node, mainOrChild, sortNum, option) {
      node.currNode.mainType = 0;
      let param = {
        evaluationId: this.evaluationId,
        req: node.currNode,
        sortNum: sortNum
      };
      if (mainOrChild != "mainQuestion") {
        param.parentOptionId = option ? option.optionId : undefined;
        param.parentUniqueId = this.activeQuestion.currNode.uniqueId;
      }
      return ajaxAsync({
        url: "knowledge-service/new/paper/question",
        type: "post",
        data: JSON.stringify(param)
      });
    },
    //保存主问题
    async saveMainTempQuestion(node, mainOrChild, sortNum, option) {
      let data = await this.saveTempQuestion(
        node,
        mainOrChild,
        sortNum,
        option
      );
      this.setNewNode(data.req, sortNum);
    },
    //添加附属题
    async saveChildTempQuestion(node, mainOrChild, sortNum, option) {
      await this.saveTempQuestion(node, mainOrChild, sortNum, option);
      this.getQuestionByUniqIds(
        this.activeQuestion.currNode.uniqueId,
        "setQuestion"
      );
    },

    //保存问题
    async saveQuestion(activeQuestion) {
      debugger;
      //提交前需要进行校验  问题和选项均不能为空。
      let that = this;
      let obj = activeQuestion.currNode;
      //开关题
      if (activeQuestion.currNode.questionType == "12") {
        //开关题的 选项设成题目的编码
        obj.optionList.forEach(function(el) {
          el.catalogueName = obj.catalogueName;
          el.catalogueCode = obj.catalogueCode;
        });
      }
      obj.questionId = this.getSId(obj.questionId);
      obj.optionList.forEach(function(el) {
        el.questionId = that.getSId(el.questionId);
        el.optionId = that.getSId(el.optionId);
      });

      let param = {
        evaluationId: this.evaluationId,
        req: activeQuestion.currNode,
        uniqueId: activeQuestion.currNode.uniqueId
      };
      let url = "knowledge-service/new/paper/question";
      await ajaxAsync({
        url: url,
        type: "put",
        data: JSON.stringify(param)
      });
      // this.getEvaluationById();
      common.tip_msgArea("已保存", 1000);
    },
    //保存选项
    saveOption: async function(activeQuestion) {
      //提交前需要进行校验  问题和选项均不能为空。
      let that = this;
      let obj = activeQuestion.currNode;
      //开关题
      if (activeQuestion.currNode.questionType == "12") {
        //开关题的 选项设成题目的编码
        obj.optionList.forEach(function(el) {
          el.catalogueName = obj.catalogueName;
          el.catalogueCode = obj.catalogueCode;
        });
      }
      obj.questionId = this.getSId(obj.questionId);
      obj.optionList.forEach(function(el) {
        el.questionId = that.getSId(el.questionId);
        el.optionId = that.getSId(el.optionId);
      });
      let param = {
        evaluationId: this.evaluationId,
        req: activeQuestion.currNode,
        uniqueId: activeQuestion.currNode.uniqueId
      };
      let url = "knowledge-service/new/paper/question";
      await ajaxAsync({
        url: url,
        type: "put",
        data: JSON.stringify(param)
      });
      this.getQuestionByUniqIds(
        activeQuestion.currNode.uniqueId,
        "setQuestion"
      );
    },
    //重新组合id 如果含有o- q-则置成“”
    getSId(id) {
      let str = id;
      if (String(id).indexOf("-") > -1) {
        str = "";
      }
      return str;
    },
    //比较选项逻辑  位置逻辑
    mergeTree() {
      let logicList_ = [];
      let hierarchyList_ = [];
      this.logicList.forEach(function(el) {
        el.conclusionList.forEach(function(it) {
          if (logicList_.indexOf(it.relateQuestionId) == -1) {
            logicList_.push(it.relateQuestionId);
          }
        });
      });

      this.hierarchyList.forEach(function(el) {
        if (hierarchyList_.indexOf(el.childQuestionId) == -1) {
          hierarchyList_.push(String(el.childQuestionId));
        }
      });
    },

    //添加逻辑
    addLogic(obj) {
      this.logicList = obj;
      //组装logicList
      this.activeQuestion.currNode.optionList.forEach(function(el) {
        el.logicList = [];
        obj.forEach(function(it) {
          it.conditionList.forEach(function(cd) {
            if (cd.optionId == el.optionId && cd.questionId == el.questionId) {
              el.logicList.push(it);
            }
          });
        });
      });
      this.mergeTree();
      let that = this;
      setTimeout(function() {
        that.refreshPreShow();
      }, 50);
    },
    //通过点击问题类型获取问题节点
    getQuestionByType(questionType) {
      this.questionIdAll++;
      let questionId = "q-" + this.questionIdAll;

      if (questionType == 12) {
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            checkType: "2", // 是否必答
            questionId: questionId,
            aliasType: "2",
            catalogueRule: getCatalogue(),
            sexType: "10",
            hierarchyList: [],
            filePaths: [],
            helpContent: "",
            lineFeed: "0", // 是否换行
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5" // 边距
            },
            optionList: [
              {
                aliasName: "开",
                aliasType: 1,
                catalogueName: "开",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                switchType: 1,
                defaultType: "1",
                filePaths: [],
                helpContent: "",
                checkList: {},
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "10",
                  margin: "0" // 边距
                }
              },
              {
                aliasName: "关",
                aliasType: 1,
                catalogueName: "关",
                optionId: "o-1",
                questionId: questionId,
                switchType: 2,
                filePaths: [],
                helpContent: "",
                logicList: [],
                hierarchyList: [],
                defaultType: "2",
                checkList: {},
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "10",
                  margin: "0" // 边距
                }
              }
            ]
          },
          childList: []
        };
      } else if (questionType == 30) {
        //填空题
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: "2",
            hierarchyList: [],
            catalogueRule: getCatalogue(),
            sexType: "10",
            filePaths: [],
            helpContent: "",
            checkType: "2",
            lineFeed: "0", // 是否换行
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "20",
              margin: "5"
            },
            optionList: [
              {
                catalogueName: "选择选项",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                filePaths: [],
                helpContent: "",
                checkList: {
                  checkContext: "",
                  checkMark: "",
                  checkType: "",
                  inputType: "",
                  scopeList: [],
                  pictureCount: 0,
                  pictureFormat: "",
                  pictureSize: "",
                  remindType: 0,
                  checkLevel: 1,
                  markedWords: ""
                },
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "220",
                  margin: "0"
                },
                unitList: []
              }
            ]
          },
          childList: []
        };
      } else if (questionType == 15) {
        //加减题数字
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: "2",
            catalogueRule: getCatalogue(),
            hierarchyList: [],
            sexType: "10",
            filePaths: [],
            helpContent: "",
            checkType: "2",
            lineFeed: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            },
            optionList: [
              {
                catalogueName: "选择选项",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                filePaths: [],
                helpContent: "",
                defaultValue: "",
                quantity: "",
                lineFeed: "0",
                checkList: {
                  checkContext: "",
                  checkMark: "",
                  checkType: "",
                  inputType: "",
                  scopeList: [],
                  pictureCount: 0,
                  pictureFormat: "",
                  pictureSize: "",
                  remindType: 0
                },
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "10",
                  margin: "0"
                },
                unitList: []
              }
            ]
          },
          childList: []
        };
      } else if (questionType == 90) {
        //时间题
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: "2",
            sexType: "10",
            catalogueRule: getCatalogue(),
            filePaths: [],
            helpContent: "",
            lineFeed: "10",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "220",
              margin: "5"
            },
            hierarchyList: [],
            checkType: "2",
            optionList: [
              {
                catalogueName: "选择选项",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                checkList: {},
                addType: "",
                timeFormat: "yyyy-MM-dd hh:mm:ss",
                lineFeed: "0",
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "200",
                  margin: "0"
                }
              }
            ]
          },
          childList: []
        };
      } else if (questionType == 80) {
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: "2",
            sexType: "10",
            catalogueRule: getCatalogue(),
            hierarchyList: [],
            lineFeed: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: 10,
              margin: "5"
            },
            checkList: [
              {
                checkContext: "",
                checkMark: "",
                checkType: "1",
                sortNum: 1
              }
            ],
            optionList: [
              {
                catalogueName: "选择选项",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                defaultType: "1",
                checkList: {},
                lineFeed: "0",
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "10",
                  margin: "0"
                }
              }
            ]
          },
          childList: []
        };
      } else if (questionType == 40) {
        //添加题
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            checkType: "2",
            catalogueRule: getCatalogue(),
            aliasType: "2",
            sexType: "10",
            filePaths: [],
            helpContent: "",
            hierarchyList: [],
            lineFeed: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            },
            checkList: {
              checkContext: "",
              checkMark: "",
              checkType: "1",
              sortNum: 1
            },
            optionList: []
          },
          childList: []
        };
      } else if (questionType == 200) {
        return {
          currNode: {
            catalogueName: "标签内容",
            questionType: questionType,
            questionId: questionId,
            checkType: "2",
            aliasType: "2",
            sexType: "10",
            catalogueRule: getCatalogue(),
            filePaths: [],
            helpContent: "",
            hierarchyList: [],
            optionList: [],
            lineFeed: 0,
            navLocation: 0,
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            }
          },
          childList: []
        };
      } else if (questionType == 202) {
        return {
          currNode: {
            catalogueName: "导入内容",
            questionType: questionType,
            questionId: questionId,
            checkType: "2",
            aliasType: "2",
            sexType: "10",
            catalogueRule: getCatalogue(),
            filePaths: [],
            helpContent: "",
            hierarchyList: [],
            optionList: [],
            lineFeed: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            }
          },
          childList: []
        };
      } else if (questionType == 41) {
        return {
          currNode: {
            catalogueName: "表格题",
            questionType: questionType,
            questionId: questionId,
            checkType: "2",
            aliasType: "2",
            sexType: "10",
            catalogueRule: getCatalogue(),
            filePaths: [],
            helpContent: "",
            hierarchyList: [],
            optionList: [],
            lineFeed: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            }
          },
          childList: []
        };
      } else if (questionType == 110 || questionType == 32) {
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId:questionId,
            aliasType: '2',
            hierarchyList: [],
            checkType:'2',
            sexType: '10',
            catalogueRule: getCatalogue(),
            filePaths: [],
            helpContent: '',
            lineFeed: '0',
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: '5'
              },
            optionList: [{
              catalogueName: '',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              filePaths: [],
              helpContent: '',
              lineFeed: '0',
              checkList:
              {
                checkContext: '',
                checkMark: '',
                checkType: '',
                inputType:'',
                scopeList:[],
                pictureCount: 0,
                pictureFormat: '',
                pictureSize: '',
                remindType: 0
              },
              controlList: [],
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: 220,
              margin: '10'
            },
            unitList: []
            }],
          },
          childList: []
        };
      } else {
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: "2",
            sexType: "10",
            checkType: "2",
            catalogueRule: getCatalogue(),
            hierarchyList: [],
            filePaths: [],
            helpContent: "",
            lineFeed: "0",
            switchQuestion: "0",
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: "10",
              margin: "5"
            },
            optionList: [
              {
                catalogueName: "选择选项",
                optionId: "o-0",
                questionId: questionId,
                logicList: [],
                hierarchyList: [],
                filePaths: [],
                helpContent: "",
                defaultType: "2",
                checkList: {},
                lineFeed: "0",
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "110",
                  margin: "0"
                }
              },
              {
                catalogueName: "选择选项",
                optionId: "o-1",
                questionId: questionId,
                logicList: [],
                filePaths: [],
                helpContent: "",
                hierarchyList: [],
                defaultType: "2",
                checkList: {},
                lineFeed: "0",
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: "10",
                  margin: "0"
                }
              }
            ]
          },
          childList: []
        };
      }
    },
    //设置新的节点为当前选中节点
    setNewNode(node, index) {
      let data = { currNode: node, childList: [] };
      this.questionTree.splice(index, 0, data);
      common.tip_msgArea("已保存", 1000);
      this.activeQuestion = data;
      this.refreshPreShow();
    },
    //设置选中的出入量节点
    setInOrOutNode(node, index) {
      this.questionTree.splice(index, 0, node);
      common.tip_msgArea("已保存", 1000);
      this.activeQuestion = node;
      this.refreshPreShow();
    },
    //设置选中的问题
    setQuestion(data) {
      let findNode = this.fetchQuestionById(
        data.currNode.questionId,
        data.currNode.uniqueId
      );
      if (this.activeQuestion.currNode.isAttach) {
        data.currNode.isAttach = true;
      }
      findNode.childList = data.childList;
      findNode.currNode = data.currNode;
      common.tip_msgArea("已保存", 1000);
      this.activeQuestion = findNode;
      this.refreshPreShow();
    },
    //获取单位
    async getUnits() {
      let data = await ajaxAsync({
        url: "knowledge-service/unit/all",
        type: "get",
        async: false,
        data: {
          catalogueRule: getCatalogue()
        }
      });
      this.units = data;
      // console.log(this.units);
    },
    getTreeData: function() {
      Bus.$emit("backTreeData", [
        {
          questionList: this.questionTree
        }
      ]);
    },
    //初始化拖动
    initDraggable: function() {
      let that = this;
      let id = "#topic-panel-list";
      $("#topic-panel-list").sortable({
        revert: true,
        delay: 200,
        cursor: "move",
        zIndex: 9990,
        stop: function(e, t) {
          var arr = $(id).sortable("toArray");
          let aindex = -1;
          arr.forEach((al, index) => {
            if (al == "") {
              aindex = index;
            }
          });
          if (aindex > -1) {
            if (that.questionType != "IO") {
              //IO为出入量
              let node = that.getQuestionByType(that.questionType);
              that.saveMainTempQuestion(node, "mainQuestion", aindex);
            } else {
              that.getCommonObj(); //出入量拖动显示
            }
          } else {
            var arr = $(id).sortable("toArray");
            that.sortMainQuestionDragtable(arr);
          }
          if ($("#topic-panel-list> li:not(.topic-panel)").length > 0) {
            $("#topic-panel-list> li:not(.topic-panel)").remove();
          }
        }
      });
      $(".topic-list>li").draggable({
        connectToSortable: "#topic-panel-list",
        helper: "clone",
        revert: "invalid",
        drag: function(e, t) {
          t.helper.css({ height: "50px", width: "650px" });
        },
        stop: function(e, t) {
          let tempHtml = $(t.helper).html();
          that.questionType = $(tempHtml)
            .eq(0)
            .attr("id");
        }
      });
    },
    //通过questionId获取问题
    getQuestionByQuestionId(questionId, node, uniqueId) {
      if (
        node.currNode.questionId == questionId &&
        uniqueId == node.currNode.uniqueId
      ) {
        return node;
      }
      for (var i = 0; i < node.childList.length; i++) {
        let aNode = this.getQuestionByQuestionId(
          questionId,
          node.childList[i],
          uniqueId
        );
        if (aNode) {
          return aNode;
        }
      }
    },
    //通过questionId和uniqueId从questionTree中获取问题
    fetchQuestionById(questionId, uniqueId) {
      for (var i = 0; i < this.questionTree.length; i++) {
        let node = this.questionTree[i];
        let newNode = this.getQuestionByQuestionId(questionId, node, uniqueId);
        if (newNode) {
          return newNode;
        }
      }
    },
    //选中切换问题
    selectQuestion: function(obj) {
      let that = this;
      this.notAddAttach = true; //附属题置为初始值，只有在点击之后才能新增附属题
      let node = this.fetchQuestionById(
        obj.node.currNode.questionId,
        obj.node.currNode.uniqueId
      );
      node.currNode.styleHierarchy = obj.node.currNode.styleHierarchy;
      this.questionType = node.currNode.questionType;
      this.activeQuestion = node;
      if (this.activeQuestion.currNode.isAttach) {
        this.activeQuestion.currNode.isAttach = false;
      }
      //如果选中的题目和图层不是同一个，则不允许拖动，只有先点击附属题才能拖动
      let qid = this.activeQuestion.currNode.uniqueId
        ? this.activeQuestion.currNode.uniqueId
        : this.activeQuestion.currNode.questionId;
      if (this.selectAttachUniqId != qid) {
        this.initDraggable();
      }


    },
    //关闭弹窗
    closePop: function() {
      if (this.$refs.queMainSetting) {
        this.$refs.queMainSetting.closePop();
      }
      if (this.$refs.queSetting && this.$refs.queSetting.length > 0) {
        this.$refs.queSetting.forEach(qs => {
          qs.closePop();
        });
      }
    },
    //删除问题
    deleteQuestion: function(node, type) {
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
          that.deleteQuesAjax(node, index);
        }
      });
    },
    //删除问题
    deleteQuesAjax: async function(node, index) {
      await ajaxAsync({
        url:
          "knowledge-service/evaluation/paper2/delquestion?uniqueId=" +
          node.currNode.uniqueId +
          "&evaluationId=" +
          this.evaluationId,
        type: "delete"
      });
      this.getEvaluationById();
      layer.close(index);
    },
    //获取常用对象
    getCommonObj: async function(type) {
      debugger;
      let that = this;
      let data = await ajaxAsync({
        url: "knowledge-service/new/common",
        type: "get",
        data: { commonType: "IO" }
      });
      if (data.length > 0) {
        that.saveInOrOutQuestion(data[0], type);
      }
    },
    //获取相应的字典数据
    getDict: async function() {
      let data = await ajaxAsync({
        url: "knowledge-service/dictionary/query",
        dataType: "json",
        type: "post",
        data: JSON.stringify([
          "LINK_FLAG",
          "SPECIAL_FLAG",
          "IOLIQUID",
          "IOLIQUID_INTAKE",
          "IOLIQUID_OUTPUT",
          "MUD",
          "IOLIQUID_CHECK_LIST"
        ])
      });
      this.linkFlagDict = data.LINK_FLAG;
      this.inDetailArr = data.IOLIQUID_INTAKE;
      this.outDetailArr = data.IOLIQUID_OUTPUT;
      this.mudList = data.MUD;
      this.selectCheckList = data.IOLIQUID_CHECK_LIST;
      if(this.selectCheckList) {
        this.selectCheckList[0].label = '白班';
        this.selectCheckList[1].label = '夜班';
        this.selectCheckList[2].label = '晚班';
        this.selectCheckList[3].label = '总量';
      }
      if(this.mudList) {
        this.mudList.forEach(ele=> {
          if(ele.dicItemKey.indexOf('-') > -1) {
            ele.dicItemKey = ele.dicItemKey.split('-')[0]
          }
          this.$set(ele, 'isActive', false)
        })
      }
      if (data.IOLIQUID && data.IOLIQUID.length > 0) {
        data.IOLIQUID.splice(0, 0, { dicItemValue: "请选择" });
        this.inOutTypeArr = data.IOLIQUID;
      }
      if (data.SPECIAL_FLAG && data.SPECIAL_FLAG.length > 0) {
        data.SPECIAL_FLAG.splice(0, 0, { dicItemValue: "请选择" });
        this.specialFlagDict = data.SPECIAL_FLAG;
      }
    },
    //左侧菜单点击切换问题类型
    clickQuestionType: function(questionType) {
      this.questionType = questionType;
      this.questionTypeChange();
    },
    questionTypeChange: function() {
      // debugger
      if (this.notAddAttach) {
        //直接是新增问题
        if (this.questionType != "IO") {
          let node = this.getQuestionByType(this.questionType);
          //根据选中的题目保存后台拼接好questionId和optionID之后返回
          this.saveMainTempQuestion(
            node,
            "mainQuestion",
            this.questionTree.length
          );
        } else {
          this.getCommonObj();
        }
      } else if (!this.notAddAttach) {
        //点击过附属题之后新增成为附属题
        if (this.questionType != "IO") {
          let childItem = this.getQuestionByType(this.questionType);
          let sortNum = this.activeQuestion.childList
            ? this.activeQuestion.childList.length
            : 0;
          //根据选中的题目保存后台拼接好questionId和optionID之后返回
          this.saveChildTempQuestion(childItem, "childQuestion", sortNum);
        } else {
          this.getCommonObj("attachQues");
        }
      }
    },
    getQuestionTree() {
      const that = this;
      if(this.evaluationId) {
        common.ajax({
          url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/sketch",
          dataType: "json",
          type: "get",
          async: false,
          callback: function(res) {
            that.mQuestionList = res.questionList;
            that.treeList = [];
            that.getQuestionList(that.mQuestionList);
          }
        });
      }
    },
    getQuestionList: function(obj) {
      obj.forEach((ele) => {
        if(ele.childList && ele.childList.length > 0) {
          if(ele.questionType == 30) {
            this.treeList.push({ 'uniqueId': ele.uniqueId, 'hierarchyCode': ele.hierarchyCode, 'showName': ele.aliasName, 'optionList': ele.optionList }) 
          }
          this.getQuestionList(ele.childList)        
        } else {
          if(ele.questionType == 30) {
            this.treeList.push({ 'uniqueId': ele.uniqueId, 'hierarchyCode': ele.hierarchyCode, 'showName': ele.aliasName, 'optionList': ele.optionList })
          }
        }
      })
    },
    getEvaluationList: function() {
      const that = this;
      if(this.organCode) {
        common.ajax({
          url: "knowledge-service/evaluation/evaluationType?organCode=" + this.organCode,
          dataType: "json",
          type: "get",
          async: true,
          callback: function(res) {
            that.assessmentList = res
            if(that.assessmentList && that.assessmentList.length > 0) {
              that.assessmentList.forEach((ele, index) => {
                that.$set(ele, 'isActive', false)
              })
            }
          }
        });
      }      
    }    
  },
  created: function() {
    Bus.$off("selectQuestion");
    Bus.$on("selectQuestion", this.selectQuestion);
    Bus.$off("selectSubItem");
    Bus.$on("selectSubItem", this.selectSubItem);
    Bus.$off("refreshPreShow");
    Bus.$on("refreshPreShow", this.refreshPreShow);
    Bus.$off("deleteQuestion");
    Bus.$on("deleteQuestion", this.deleteQuestion);
    Bus.$off("changeNodeIndex");
    Bus.$on("changeNodeIndex", this.changeNodeIndex);

    Bus.$off("addSearchQuestion");
    Bus.$on("addSearchQuestion", this.addSearchQuestion);
    Bus.$off("addOption");
    Bus.$on("addOption", this.addOption);

    Bus.$off("addAddOption");
    Bus.$on("addAddOption", this.addAddOption);
    Bus.$off("addQuestionOption");
    Bus.$on("addQuestionOption", this.addQuestionOption);

    Bus.$off("addSubItem");
    Bus.$on("addSubItem", this.addSubItem); //添加子项
    Bus.$off("initChildSortabble");
    Bus.$on("initChildSortabble", this.initChildSortabble);
    Bus.$off("closePop");
    Bus.$on("closePop", this.closePop);
  },
  mounted() {
    this.getUnits();
    this.mode = "addQuestion";
    this.getDict();
    this.initDraggable();
    this.getEvaluationById();
    this.SET_USERFULWIDTH(900);
    this.getEncodingList();
    this.getQuestionTree();
    this.getEvaluationList();

    window.addEventListener('mouseup', this.mouseup);

  },
  watch: {
    questionTree: {
      handler: function(val, oldVal) {
        this.questionTree = val;
        if (this.questionTree.length == 0) {
          this.notAddAttach = true;
          this.initDraggable();
        }
      },
      deep: true
    },
    activeQuestion: {
      handler: function(val, oldVal) {
        this.activeQuestion = val;
      },
      deep: true
    }
  },
  components: {
    inputLayer: inputLayer,
    logicOption: logicOption,
    inputImgLayer: inputImgLayer,
    verifyLayer: verifyLayer,
    questionTrees: questionTrees,
    confirmDelete: confirmDelete,
    menuTemplate: menuTemplate,
    imageUpload: imageUpload,
    questionSetting: questionSetting,
    addQuestion: addQuestion,
    groupSentence: groupSentence,
    shareLayer: shareLayer,
    addNormalObj: addNormalObj,
    inOrOutConfig: inOrOutConfig,
    bmiWindow: bmiWindow,
    optionNote: optionNote
  }
};
</script>
<style type="text/css">
.ms-padding {
  padding-left: 10px;
}
</style>