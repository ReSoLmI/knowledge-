<template>
    <div>
         <menuTemplate ref="leftmenu" :currentPage="currentPageName"></menuTemplate>
         <div class="am-page-rcont bg-main" @click.stop="closePop()">
            <div class="am-page-pd" >
                <div class="strip-top-cont">
                    <ul class="strip-top">
                        <li :class="{active:createQuestion}" @click.stop="changePage(true)"><a>创建问题</a></li>
                        <li :class="{active:!createQuestion}" @click.stop="changePage(false)"><a>问题模版</a></li>
                    </ul>
                </div>
                <div class="model-drag-cont">
                    <div class="topic-layout-lside model-drag-lside" >
                    <div style="width:100px" class="pin-lside">
                          <h4>问题类型</h4>
                          <ul class="topic-list">
                              <li id="menuItem" v-bind:class="[{'active':(questionType == 10||questionType==11)}]" @click="clickQuestionType(10)">
                              <div class="txt" id="10">单选题</div>
                                  <div class="placeholder-drag-panel">
                                    <div class="inline">单选</div>
                                    <div class="inline am-ctr-native-rdo"><span>选项1</span></div>
                                    <div class="inline am-ctr-native-rdo"><span>选项2</span></div>
                                  </div>
                              </li>
                              <li id="menuItem" v-bind:class="[{'active':questionType == 20}]" @click="clickQuestionType(20)"><div class="txt" id="20">多选题</div>
                                   <div class="placeholder-drag-panel">
                                    <div class="inline">多选</div>
                                    <div class="inline am-ctr-native-rdo"><span>选项1</span></div>
                                    <div class="inline am-ctr-native-rdo"><span>选项2</span></div>
                                  </div>
                              </li>
                              <li v-bind:class="[{'active':questionType == 12}]"  @click="clickQuestionType(12)"><div class="txt" id="12">开关题</div>
                                  <div class="placeholder-drag-panel">
                                    <div class="inline">开关</div>
                                    <div class="inline btn-switch-text">
                                      <span>无</span>
                                      <span class="active">有</span>
                                    </div>
                                  </div>
                              </li>
                              <li v-bind:class="[{'active':questionType == 30}]"  @click="clickQuestionType(30)"><div class="txt" id="30">填空题</div>
                                  <div class="placeholder-drag-panel">
                                    <div class="inline">输入框</div>
                                    <input type="text" class="input-text w200 inline">
                                  </div>
                              </li>
                              <li :class="{'active':questionType == 13}"  @click="clickQuestionType(13)"><div class="txt" id="13">下拉题</div>
                              <div class="placeholder-drag-panel">
                                  <div class="inline">输入框</div>
                                  <div class="inline am-ctr-sel w200">
                                    <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">按项目</a>
                                    <div class="am-dropdown am-mr-10" style="display:none">
                                      <ul>
                                        <li class="disabled"><a>选项不可用</a></li>
                                        <li class="active"><a>选项选中</a></li>
                                        <li><a>选项二</a></li>
                                        <li><a>选项三</a></li>
                                        <li><a>选项四</a></li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li v-bind:class="[{'active':questionType == 90}]"  @click="clickQuestionType(90)"><div class="txt" id="90">时间框</div>
                              <div class="placeholder-drag-panel">
                                <div class="inline">时间框</div>
                                <input type="text" class="inline input-text input-date w200">
                              </div>
                              </li>
                              <li :class="{'active':questionType == 110}"  @click="clickQuestionType(110)"><div class="txt" id="110">图片</div>
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
                              <li :class="{'active':questionType == 32}"  @click="clickQuestionType(32)"><div id="32" class="txt">自由文本</div>
                              <div class="placeholder-drag-panel">
                                <div class="inline">多行文本</div>
                                <div class="inline">
                                  <textarea name="" rows="4" cols="" class="input-text input-textarea w400"></textarea>
                                </div>
                              </div>
                              </li>
                              <li :class="{'active':questionType == 201}"  @click="clickQuestionType(201)"><div id="201" class="txt">说明文字</div>
                                  <div class="placeholder-drag-panel">
                                  <div class="inline">说明文字</div>
                                  <div class="inline am-txt-label">
                                    我是说明文字
                                  </div>
                                </div>
                              </li>
                              <li v-bind:class="[{'active':questionType == 40}]" @click="clickQuestionType(40)"><div class="txt" id="40">添加题</div>
                                  <div class="placeholder-drag-panel">
                                  <div class="inline">添加题</div>
                                  <div class="inline am-txt-label">
                                    添加题
                                  </div>
                                </div>
                              </li>
                              <li  v-bind:class="[{'active':questionType == 200}]" @click="clickQuestionType(200)"><div class="txt" id="200">标签</div>
                                  <div class="placeholder-drag-panel">
                                  <div class="inline">标签</div>
                                  <div class="inline am-txt-label">
                                    标签
                                  </div>
                                </div>
                              </li>
                              <li  v-bind:class="[{'active':questionType == 41}]" @click="clickQuestionType(41)"><div class="txt" id="41">表格题</div>
                                  <div class="placeholder-drag-panel">
                                  <div class="inline">表格题</div>
                                  <div class="inline am-txt-label">
                                    表格题
                                  </div>
                                </div>
                              </li>
                          </ul>
                          <!-- <h4>常用对象</h4>
                          <ul class="topic-list">
                              <li><div class="txt">患者信息</div></li>
                              <li><div class="txt">出入量统计</div></li>
                              <li><div class="txt">血压</div></li>
                          </ul> -->
                          </div>
                    </div>
                    <template v-if="createQuestion">
                        <div class="topic-layout-rcont model-drag-main" > 
                            <div class="am-condition text-right" style="border-bottom: none;margin-bottom: -20px;" v-show="questionList.length>0">
                            <a class="am-btn am-btn-plain-info" @click.stop="showPreShow('question')">预览</a>
                            <a class="am-btn am-btn-info am-ml-10" @click="saveQuestion">保存</a>
                            </div>
                            <questionTrees ref="questionTree" :questionList="questionList" mode='add' :initFlag="initFlag" :activeQuestion="activeQuestion" :pageFrom="'knowledge'" :treeId="''" :isShowCloseBtn='true'></questionTrees>
                           
                        </div>
                    </template>
                    <template v-else>
                    <!-- <a @click.stop="showPreShow()">预览</a> -->
                    <div class="am-flex-1 model-drag-main">
                    <div class="topic-mode-cont">
                        <div class="am-search-picker am-mt-20">
                            <input type="text" class="input-text" placeholder="关键词搜索" v-model="keyWords">
                            <i class="i-search"></i>
                        </div>
                        <questionTrees ref="questionTree" :questionList="questionList" mode='add' :initFlag="initFlag" :activeQuestion="activeQuestion" :pageFrom="'knowledge'" :treeId="''" :isShowCloseBtn='true'></questionTrees>
                    </div>
                    <uib-pagination v-if="totalItems>0" first-text="" next-text="" last-text="" previous-text=""  :total-items="totalItems" v-model="pagination" :max-size="maxSize" class="page" :boundary-links="true" :rotate="false" :items-per-page="perPage"  @change="pageChanged"></uib-pagination>
                    </div>
                    </template>
                    <div id="open" style="cursor:pointer;color:#FFF;text-align:center;width:20px;background:#009EF9;position:absolute;right:0px;top:0;z-index:9999;" @click="animate">
                      详细配置<span v-if="!isRightSetOpen"> << </span><span v-else> >> </span>
                    </div>                    
                    <div class="topic-layout-right model-drag-rside" id="rside" style="background:#FFF;">
                        <div style="background:#ffffff;height:5px;cursor:move;width:365px;" @mousemove.stop="mousemove($event)" @mousedown.stop="mousedown($event)"></div>
                        <!--觉得烦的话， am-mr-20 都改成 am-mr-10-->
                        <ul class="topic-strip" id="topicStrip">
                            <li  :class="{active:!isLogicSetting}" @click="isLogicSetting=false">设置</li>
                            <li :class="{active:isLogicSetting}" @click="logicSetting()">逻辑设置</li>
                        </ul>

                        <template v-if="!isLogicSetting&&activeQuestion.currNode">
                        <questionSetting :currentPage="currentPageName" ref="queMainSetting" :currentQuestion="activeQuestion" @activeQuestionChange="questionChange" @addGroupSentence="addGroup" @addHelp="addHelp"  @addRemark="addRemark" @addShare="addShare" :units="units" @addVerify="addVerify" @addTips="addTips" @addAttachQuestion="addAttachQuestion"></questionSetting>
                         <!-- 子项的部分 -->
                        <div class="bd-second">
                           <i class="i-child-angle"></i>
                           <template v-for="(item,index) in activeQuestion.currNode.optionList">
                           <template v-for="relateNode in item.hierarchyList" v-if="getRelatedNode(relateNode.childQuestionId)">

                          <div class="am-mt-10">{{item.catalogueName}} <span class="am-txt-muted">子项</span></div>
                          <questionSetting :currentPage="currentPageName" ref="queSetting" :currentQuestion="getRelatedNode(relateNode.childQuestionId)"  @activeQuestionChange="questionSubChange" :subRelateNode="relateNode" @addGroupSentence="addGroup"  @addHelp="addHelp" @addShare="addShare" @addRemark="addRemark" :units="units" @addVerify="addVerify" @addTips="addTips"></questionSetting>
                          </template>
                          </template>
                        </div>
                        </template>
                        <template v-if="isLogicSetting&&activeQuestion.currNode">
                         <!--  <h5 style="margin: 20px 15px 10px 15px;font-size: 16px;">开关</h5> -->
                          <div class="hd" style="padding-right: 15px;">
                            <logicOption  id="logicOption" ref="logicOption" @saveLogic="savelogic" :activeQuestion="activeQuestion" :isShow="'true'"></logicOption>
                          </div>
                        </template>                       
                    </div>
                </div>
            </div>
            <div id="inputLayer_" style="display:none">
              <inputLayer ref="inputLayer" @save="saveRemark" @cancel="cancelCheckOption" :inputLayerObj='inputLayerObj'></inputLayer>
            </div>
            <confirmMsg id="Confirm" :content="confirMsg" :layerIndex="layerDelIndex" :title="title"></confirmMsg>
            <inputImgLayer  ref="anputImgLayers"  @save="saveHelpContent" :inputLayerObj="inputLayerObj" id="ImageInputLayer_" v-show="false"></inputImgLayer>
            <groupSentence ref="addGroups" @saveGroup="saveGroup" :inputLayerObj="inputLayerObj" id="addGroup_" v-show="false"></groupSentence>
            <verifyLayer ref="verifyLayer" @save="saveVerify" id="verifyLayer" :inputLayerObj="inputLayerObj" v-show="false"></verifyLayer>
            <shareLayer ref="addShare" id="addShare"   v-show="false" @saveShare="saveShare"/>
        </div>
     
    </div>
</template>
<script>
import Bus from '@/bus.js';
import Vue from 'vue';
import common from '@/util/common.js';
import "@/css/level.css";
import menuTemplate from '../../components/menu.vue';
import inputLayer from "@/components/questionC/inputLayer.vue";
import search from "@/components/questionC/search.vue";
import selectT from "@/components/questionC/selectT.vue";
import logicOption from '@/components/logic/logicOption.vue';
import questionTrees from '@/components/questionTree/questionTree';
import confirmMsg from '@/components/confirm_delete.vue';
import inputImgLayer from '@/components/questionC/inputAndImageLayer.vue';
import verifyLayer from '@/components/questionC/verifyLayer.vue';
import { getCatalogue } from '@/util/util';
import draggable from 'vuedraggable';
import imageUpload from '@/components/questionC/imageUpload.vue';
import questionSetting from '@/components/questionC/questionSetting.vue';
import groupSentence from '@/components/questionC/groupSentence.vue';
import shareLayer from '@/components/questionC/shareLayer.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { ajaxAsync } from '@/util/common_b';
export default{
    data(){
        return{
            currentPageName:'createQuestion',
            questionType: "10",
            inputLayerObj: {
                layerTitle: '',
                placeholder: '',
                content: '',
                type: ''
              },
              layerTitle: '', //inputLayer弹出层的名字
              placeholder: '', //inputLayer弹出层中的输入框的默认值
              content: "",
              createQuestion:true,//在创建问题以及问题模板之间切换
              optionList: [], //选项列表
              questionTree: [], //供预览的问题树         
              questionIdAll:0,//动态增加的问题ID计数
              hierarchyList: [], //位置逻辑列表
              logicList: [], //选项逻辑列表
              initFlag: false,
              layerDelIndex: 0,
              confirMsg: '',
              title:'',
              notAddAttach:true,//表示否是增加的附属题,用于判断是新增附属题还是新增问题
              mode: "", //addQuestion 创建问题 editQuestion编辑问题  addLogic增加逻辑  editLogic修改逻辑
              activeQuestion:{},
              isLogicSetting:false,
              units: [], //单位数据字典列表
              sexs: [], //性别数据字典列表
              keyWords:'',//搜索关键字
              isDisabledDraggable:false,//是否允许拖动
              selectAttachUniqId:'',//选中的图层id

              totalItems:0,
              maxSize:5,
              perPage:12,
              layerDelIndex:'',
              pagination: {currentPage:1},
              x: 0,
              y: 0,
              isDown: false,
              isDrag: false,
              isRightSetOpen: false,
              rootNodeQuestionId: ''              
        }
    },
    computed: {
        ...mapState(['curActiveQuestion']),
        questionList:  {
            get:function(){
                if (!this.questionTree) {
                    return {};
                }
                let ac={
                    "questionList": this.questionTree
                };
                return ac;
            },
            set: function (cur) {
                this.questionTree=cur;
            }
        },
    },
    methods: {
        ...mapMutations([
            'SET_PAPERSTYLE', 'SET_USERFULWIDTH', 'SET_LOGICINTER'
        ]),
     defaulyPosition(flag) {
      if (flag == "open") {
        $("#open").css("left", "auto");
        $("#open").css("right", "365px");
        $("#open").css("top", "0px");
        $("#rside").css("right", "0px");
        $("#rside").css("left", "auto");
        $("#rside").css("top", "0px");
        this.isRightSetOpen = true
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
      debugger;
      if ($("#rside").css("right") == "0px") {
        this.defaulyPosition("close");
      } else {
        this.defaulyPosition("open");
        $("#mainQuestion").focus();
      }

      if (this.isDrag) {
        this.defaulyPosition();
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
    mouseup(e) {
      this.isDown = false;
    },       
    //选择子项保存
    selectSubItem:function(option,questionType){
        debugger
        let that=this;
        let childItem=this.getQuestionByType(questionType);
        //根据选中的题目保存后台拼接好questionId和optionID之后返回
        let sortNum=this.activeQuestion.childList?this.activeQuestion.childList.length:0;
        this.saveChildTemplateQuestion(childItem,'childQuestion',sortNum,option);
    },
    //问题属性改变保存问题
    questionChange:function(curvalue){
        this.activeQuestion=curvalue;
        this.saveQuestion(curvalue);
        this.refreshPreShow();
    },
    //添加子项，由于添加的子项optionId为空，则需要赋值为返回的数据，因此需要特殊处理
    addOption:function(optionIdAll,curvalue){
        let optionId = "o-" + optionIdAll;
        let catalogueName='选择选项';
        if(this.questionType==30){
            catalogueName='';
        }
        curvalue.currNode.optionList.push(
        {
            catalogueName: catalogueName,
            optionId: optionId,
            questionId: "q-0",
            logicList: [],
            hierarchyList: [],
            filePaths: [],
            helpContent: '',
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
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: 10,
            margin: 10
          },
            unitList: []
        });
        this.saveOption(curvalue);
    },
    //添加添加题选项
    addAddOption:function(optionId,curvalue,value){
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
            unitList:[],
            style:{},
            optionType: "61",
            hierarchyList: []
            });
        } else {
            op.aliasName =value;
        }
        this.saveOption(curvalue);
    },
    //添加添加题选项
    addQuestionOption:function(type,params,activeQuestion){
        //debugger;
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
            style:{},
            optionType: params.optionType,
            hierarchyList: []
        });
        this.saveOption(activeQuestion);
    },
    //添加子项不需要保存
    addSubItem:function(optionItem){
        Vue.set(optionItem,'hasSubItem',true);
        this.refreshPreShow();
    },
    //子项的问题改变则保存
    questionSubChange:function(curvalue){
        this.saveQuestion(curvalue);
        this.refreshPreShow();
    },
    pageChanged: function() {
        this.getQuestions();
    },
    //初始化子问题拖动
    initChildSortabble:function(qid){
        let that=this;
        let id="#topic-panel-childlist"+qid;
        let zindex=$(id).css('z-index');
        $(id).sortable({
            revert: true,
            delay:200,
            zIndex: 9990,
            cursor: "move",
            stop: function(e, t){
              var arr = $(id).sortable('toArray');
              let aindex=-1;
              arr.forEach((al,index)=>{
                  if(al==''){
                      aindex=index;
                  }
              })
              if(aindex>-1){
                  let childItem=that.getQuestionByType(that.questionType);
                  //根据选中的题目保存后台拼接好questionId和optionID之后返回
                  that.saveChildTemplateQuestion(childItem,'childQuestion',aindex);
              }else{
                  var arr = $(id).sortable('toArray');
                  that.sortDragtable(arr);
              }
              let aac=id+"> li:not(.topic-panel)";
              if($(aac).length>0){
                  $(aac).remove();
              }
              $(id).css("z-index",zindex);
            }
        });
    },
    //添加附属题
    addAttachQuestion:function(){
        this.isDisabledDraggable=false;
        this.addAttachQues();
    },
    addAttachQues:function(){
        let that=this;
        let qid=this.activeQuestion.currNode.uniqueId?this.activeQuestion.currNode.uniqueId:this.activeQuestion.currNode.questionId;
        let id="#topic-panel-childlist"+qid;
        let zindex=$(id).css('z-index');
        if(!this.isDisabledDraggable){
            this.notAddAttach=false;
            Vue.set(this.activeQuestion.currNode,'isAttach',true);
            //选中的添加附属题的节点
             this.selectAttachUniqId=qid;
            $(id).css("z-index",999999999999);
        }
        $( ".topic-list>li" ).draggable({
            connectToSortable: id,
            helper: "clone",
            revert: "invalid",
            disabled:that.isDisabledDraggable,
            stop: function(e,t) {
             	let tempHtml=$(t.helper).html();
              	that.questionType=$(tempHtml).eq(0).attr("id");
            }
        });
    },
    //预览问题
    showPreShow:function(pageFrom){
        let questionId='';
        if(pageFrom=='question'){
            questionId=this.questionTree[0].currNode.questionId;
        }else{
            if(!this.activeQuestion||(this.activeQuestion&&!this.activeQuestion.currNode.questionId)){
              return;
            }
            questionId=this.activeQuestion.currNode.questionId;
        }
        let url = "/#/preQuestion?"+"&questionId="+questionId;
        this.showQuestionLayer(url);
    },
    showQuestionLayer(url){
        let that = this;
        $(".ui-sys-bar").css("display","none");
        layer.open({
            type: 2,
            title: false,
            closeBtn: 0, //不显示关闭按钮
            shadeClose: true,
            shade: 0.6,
            area: ['800px', '100%'],
            offset: 'rb', //右下角弹出
            content: [url, 'no'], //iframe的url，no代表不显示滚动条
            end: function(){ //此处用于演示
                $(".ui-sys-bar").css("display","block");
            }
        });
    },
    //获取关联节点
    getRelatedNode: function(id) {
        return this.activeQuestion.childList.find(childNode => {
            return childNode.currNode.questionId == id;
        });
    },
    /*根据问题id，获取所在问题的父节点*/
    getParentNodeById:function(questionId,node){
      for(var i=0;i<node.childList.length;i++){
        if(node.childList[i].currNode.questionId==questionId){
          return node;
        }
        let aNode=this.getParentNodeById(questionId,node.childList[i]);
        if(aNode){
          return aNode;
        }
      }
    },
    //提取父节点
    fetchParentNode:function(questionId){
      for(var i=0;i<this.questionTree.length;i++){
        let node=this.questionTree[i];
        let newNode=this.getParentNodeById(questionId,node)
        if(newNode){
            return newNode; 
        }
      }
    },
    /*根据附属题新的id顺序进行排序*/
    sortDragtable:function (arrs) {
      let node=this.fetchParentNode(arrs[0]);
      let newSortArr=[];
      for(var i=0;i<arrs.length;i++){
        node.childList.forEach(al=>{
          if(arrs[i]==al.currNode.questionId){
            newSortArr.push(al);
          }
        });
      }
      this.editHierarchy(newSortArr,node);
    },
    /*在创建问题和问题模板之间切换*/
    changePage:function(type){
        let that=this;
        this.createQuestion=type;
        if(type){//创建问题页面
            this.questionList={};
            this.questionTree=[];
            this.notAddAttach=true;
            this.isLogicSetting=false;
            this.isDisabledDraggable=false;
            this.activeQuestion={};
            this.questionType=10;
            Vue.nextTick(function(){
                that.initDraggable();
            })
        }else{//问题模板页面
            this.isDisabledDraggable=true;
            this.questionTree=[];
            this.initDraggable();
            this.getQuestions();
        }
    },
    //获取所有问题
    async getQuestions(){
        let data=await ajaxAsync({
            url: 'knowledge-service/new/question',
            type: 'get',
            data: {
                keywords:$.trim(this.keyWords),
                pageNumber:this.pagination.currentPage-1,
                pageSize:this.perPage
            }
        });
        this.questionTree=data.content;
        this.totalItems = data.totalElements;
        if(this.questionTree&&this.questionTree.length>0){
            this.activeQuestion=this.questionTree[0];
        }
        this.refreshPreShow();
    },
    //编辑逻辑
    editHierarchy:function(childList,node){
        let hierarchyId=node.currNode.styleHierarchy?node.currNode.styleHierarchy:0;
        let that=this;
        let arr=[];
        childList.forEach((al,index)=>{
            arr.push({
                childQuestionId:al.currNode.questionId,
                questionId: node.currNode.questionId,
                sortNum:index,
            })
        });
        let data={
            hierarchyList: arr,
            hierarchyType: hierarchyId,
            rootQuestionId: node.currNode.rootNodeQuestionId,
        }
        ajaxAsync({
            url: 'knowledge-service/new/question/hierarchy',
            type: 'put',
            data:JSON.stringify(data),
        });
    },
    //刷新预览
    refreshPreShow() {
        let that = this;
        Vue.nextTick(function() {
            let paperStyle={arrangement:2,line:1};
            that.SET_PAPERSTYLE(paperStyle);
            let questionList = $.extend(true, {}, that.questionList); 
            that.$refs.questionTree.initData(questionList);
        })
    },
    //逻辑设置提示
    logicSetting:function(){
        this.SET_LOGICINTER('createQuestion');

        if(this.activeQuestion.currNode){
            let id=this.activeQuestion.currNode.questionId;
            if (String(id).indexOf("-") > -1) {
                common.tip_msg("请先添加问题",2000);
                return;
            }
        }
        this.isLogicSetting=true;
    },
    //保存逻辑
    savelogic:function(logicOptionArr,isSave){
        if (isSave) {
            this.addLogic(logicOptionArr);
        }
    },
    //把选项设为普通选项
    cancelCheckOption(index) {
        if (this.questionType == 30 || this.questionType == 80 || this.questionType == 90) {
            Vue.set(this.activeQuestion.currNode.checkList[0], "checkContext", '');
        } else if (this.questionType == 70) {
            Vue.set(this.activeQuestion.childList[index].currNode, "checkList", [{
                checkContext: ""
            }]);
        } else {
            Vue.set(this.activeQuestion.currNode.optionList[index], "optionType", '1');
            Vue.set(this.activeQuestion.currNode.optionList[index], "checkList", [{
                checkContext: ""
            }]);
        }
        layer.closeAll();
        this.refreshPreShow();
    },
    //打开弹框
    openInputLayer(height,content,width, mark) {
      if(!mark || mark != 'remark') {
        return;
      }
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
    //保存帮助
    saveHelpContent:function(textArea,filePaths,obj){
        let node=this.fetchQuestionById(obj.activeQuestion.currNode.questionId);
        if(obj.type=="questionHelp"){
            Vue.set(node.currNode, "helpContent", textArea);
            Vue.set(node.currNode, "filePaths", filePaths);
        }else if(obj.type=="optionHelp"){
            Vue.set(node.currNode.optionList[obj.index], "helpContent", textArea);
            Vue.set(node.currNode.optionList[obj.index], "filePaths", filePaths);
        }
        this.saveQuestion(obj.activeQuestion);
    },
    //保存组句
    saveGroup:function(sentence,obj){
        let node=this.fetchQuestionById(obj.activeQuestion.currNode.questionId);
        if(obj.type=='questionGroup'){
           Vue.set(node.currNode,'sentence',sentence);
        }else if(obj.type=="optionGroup"){
            Vue.set(node.currNode.optionList[obj.index],'sentence',sentence);
        }
        this.saveQuestion(node);
    },
    //添加帮助
    addHelp(helpType,optionIndex,optionItem,activeQuestion,subRelateNode){
        this.inputLayerObj={};
        if(!activeQuestion.currNode){
            common.tip_msg("请先选择问题", null, null);
            return;
        }
        let str='';
        let filePaths=[];
        if(helpType=='questionHelp'){
            str = activeQuestion.currNode.helpContent;
            filePaths=activeQuestion.currNode.filePaths;
        }else if(helpType=='optionHelp'){
            str=activeQuestion.currNode.optionList[optionIndex].helpContent;
            filePaths=activeQuestion.currNode.optionList[optionIndex].filePaths;
        }
        $.extend(
            true,
            this.inputLayerObj, {
                layerTitle: '帮助',
                placeholder: '请输入帮助内容',
                type: helpType,
                index: optionIndex,
            }
        )
        if(subRelateNode){
            this.inputLayerObj.subRelateNode=subRelateNode;
        }
        this.inputLayerObj.activeQuestion=activeQuestion;
        let that = this;
        Vue.nextTick(function() {
            that.$refs.anputImgLayers.init(str,filePaths);
        });
        that.openInputLayer('500px','#ImageInputLayer_');
    },
    //保存备注
    saveRemark(content, obj) {
        if (obj.type == "help") {
            Vue.set(obj.activeQuestion.currNode.optionList[obj.index], "helpContent", content);
        } else if (obj.type == "remark") {
            Vue.set(obj.activeQuestion.currNode, "questionRemark", content);
        }else if(obj.type=="content"){
            Vue.set(obj.activeQuestion.currNode, "helpContent", content);
        }else if(obj.type=='tips'){
            Vue.set(obj.activeQuestion.currNode.optionList[obj.index], "placeHolder",content);
        }
        this.saveQuestion(obj.activeQuestion);
        layer.closeAll();
    },
    //添加备注
    addRemark(activeQuestion,subRelateNode) {
        debugger
        this.inputLayerObj={};
        let str = activeQuestion.currNode.questionRemark;
        $.extend(
        true,
        this.inputLayerObj, {
            layerTitle: '题目--备注',
            placeholder: '请输入备注',
            content: str,
            type: 'remark',
            index: null
        });
        if(subRelateNode){
            this.inputLayerObj.subRelateNode=subRelateNode;
        }
        this.inputLayerObj.activeQuestion=activeQuestion;
        let that = this;
        Vue.nextTick(function() {
            that.$refs.inputLayer.init(str);
        });
        that.openInputLayer('300px', '#inputLayer_', '500px', 'remark');
    },
    //添加共享
    addShare:function(activeQuestion,subRelateNode){
        let layerObj={};
        if(subRelateNode){
            layerObj.subRelateNode=subRelateNode;
        }
        layerObj.activeQuestion=activeQuestion;
        let that = this;
        Vue.nextTick(function() {
            that.$refs.addShare.init(layerObj);
        });
        this.openInputLayer('500px','#addShare','700px');
    },
    //添加组句
    addGroup:function(groupType,optionIndex,item,activeQuestion,subRelateNode){
        this.inputLayerObj={};
        if(!activeQuestion.currNode){
            common.tip_msg("请先选择问题", null, null);
            return;
        }
        let sentence={};
        if(groupType=='questionGroup'){
            sentence=activeQuestion.currNode.sentence;
        }else if(groupType=='optionGroup'){
            sentence=activeQuestion.currNode.optionList[optionIndex].sentence;
        }

        $.extend(
        true,
        this.inputLayerObj, {
            layerTitle: '帮助',
            placeholder: '请输入帮助内容',
            type: groupType,
            index: optionIndex,
        })
        if(subRelateNode){
            this.inputLayerObj.subRelateNode=subRelateNode;
        }
        this.inputLayerObj.activeQuestion=activeQuestion;
        let that = this;
        Vue.nextTick(function() {
            that.$refs.addGroups.init(sentence);
        });
        that.openInputLayer('300px','#addGroup_');
    },
    //添加校验
    addVerify(index, item,activeQuestion,subRelateNode){
        this.inputLayerObj={};   
        $.extend(
            true,
            this.inputLayerObj, {
              layerTitle: item.catalogueName + '--填空校验',
              placeholder: '请输入校验内容',
              content:item.checkList||{},
              type: 'verify',
              index: index
            }
        );
        if(subRelateNode){
            this.inputLayerObj.subRelateNode=subRelateNode;
        }
        this.inputLayerObj.activeQuestion=activeQuestion;
        this.openInputLayer("350px","#verifyLayer");
    },
    //添加提示
    addTips(index,item,activeQuestion,subRelateNode){
        this.inputLayerObj={};
        $.extend(
        true,
        this.inputLayerObj, {
            layerTitle: '选项--提示语',
            placeholder: '请输入提示语',
            content: item.placeHolder ,
            type: 'tips',
            index: index
        });
        if(subRelateNode){
            this.inputLayerObj.subRelateNode=subRelateNode;
        }
        this.inputLayerObj.activeQuestion=activeQuestion;
        let that = this;
        Vue.nextTick(function() {
            that.$refs.inputLayer.init(item.placeHolder );
        });
        that.openInputLayer();
    },
    //保存校验
    saveVerify:function(obj){
        Vue.set(obj.activeQuestion.currNode.optionList[obj.index], "checkList",obj.content);
        this.saveQuestion(obj.activeQuestion);
    },
    //保存共享
    saveShare:function(obj,isShare){
        Vue.set(obj.activeQuestion.currNode, "isShare",isShare);
        this.saveQuestion(obj.activeQuestion);
    },
    //保存位置逻辑
    saveHierarchy:function(curQuestionId,parentQuestionId,rootQuestionId,hierarchyType,sortNum,optionId){
        let data={
          hierarchyList: [{
          childQuestionId: curQuestionId,
              hierarchyType: hierarchyType,
              questionId: parentQuestionId,
              optionId:optionId,
              sortNum:sortNum,
          }],
          rootQuestionId: rootQuestionId
        };
        this.rootNodeQuestionId = rootQuestionId;
        return ajaxAsync({
            url: 'knowledge-service/new/question/hierarchy',
            type: 'post',
            data:JSON.stringify(data),
        });
    },
    //保存问题
    async saveQuestion(activeQuestion) {
        //提交前需要进行校验  问题和选项均不能为空。

        let that = this;
        let obj =activeQuestion.currNode;
        obj.questionId = this.getSId(obj.questionId);
        obj.optionList.forEach(function(el) {
            el.questionId = that.getSId(el.questionId);
            el.optionId = that.getSId(el.optionId);
            if (el.logicList) {
                el.logicList.forEach(function(it) {
                el.generalType = "2";
                el.logicGroup = 0;
                it.conditionList.forEach(function(cd) {
                    cd.questionId = that.getSId(cd.questionId);
                    cd.optionId = that.getSId(cd.optionId);
                });
            });
        }
        if (el.hierarchyList) {
                el.hierarchyList.forEach(function(hl) {
                    hl.optionId = that.getSId(hl.optionId);
                })
            }
        });
        let url = 'knowledge-service/new/question';
        await ajaxAsync({
            url: url,
            type: 'put',
            data: JSON.stringify(activeQuestion.currNode)
        });
        common.tip_msgArea("已保存", 1000);
    },
    //保存选项
    saveOption:async function(activeQuestion){
        //提交前需要进行校验  问题和选项均不能为空。
        let that = this;
        let obj =activeQuestion.currNode;
     
        obj.questionId = this.getSId(obj.questionId);
        obj.optionList.forEach(function(el) {
        el.questionId = that.getSId(el.questionId);
        el.optionId = that.getSId(el.optionId);
        if (el.logicList) {
            el.logicList.forEach(function(it) {
                el.generalType = "2";
                el.logicGroup = 0;
                it.conditionList.forEach(function(cd) {
                    cd.questionId = that.getSId(cd.questionId);
                    cd.optionId = that.getSId(cd.optionId);
                });
            });
        }
        if (el.hierarchyList) {
                el.hierarchyList.forEach(function(hl) {
                    hl.optionId = that.getSId(hl.optionId);
                })
            }
        });
        await ajaxAsync({
            url: 'knowledge-service/new/question',
            type: 'put',
            data: JSON.stringify(activeQuestion.currNode),
        });
        this.getQuestionById(activeQuestion.currNode.questionId);
        common.tip_msgArea("已保存", 1000);
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
    closePop:function(){
        if(this.$refs.queMainSetting){
            this.$refs.queMainSetting.closePop();
        }
        if(this.$refs.queSetting&&this.$refs.queSetting.length>0){
            this.$refs.queSetting.forEach(qs=>{
                qs.closePop();
            })
        }
    },
    //添加逻辑
    addLogic(obj) {
        this.logicList = obj;
        //组装logicList ,组装的逻辑应该直接刷新就好
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
        //比较选项逻辑  位置逻辑  
        this.mergeTree();
        let that=this;
        setTimeout(function() {
            that.refreshPreShow();
        }, 50);
    },
    //获取问题类型
    getQuestionByType(questionType){
        this.questionIdAll++;
        let questionId="q-"+this.questionIdAll;
     
        if (questionType == 12) {
          return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            checkType:'2',
            questionId: questionId,
            catalogueRule: getCatalogue(),
            aliasType: '2',
            sexType: '10',
            hierarchyList: [],
            filePaths: [],
            helpContent: '',
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
            },
            optionList: [{
              aliasName:'开',
              aliasType:1,
              catalogueName: '开',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              switchType: 1,
              defaultType: "1",
              filePaths: [],
              helpContent: '',
              checkList: {},
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            }, {
              aliasName:'关',
              aliasType:1,
              catalogueName: '关',
              optionId: 'o-1',
              questionId: questionId,
              switchType: 2,
              filePaths: [],
              helpContent: '',
              logicList: [],
              hierarchyList: [],
              defaultType: "2",
              checkList: {},
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            }],
          },
          childList: []
        };
      } else if (questionType == 30) {
        //填空题
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId:questionId,
            aliasType: '2',
            hierarchyList: [],
            checkType:'2',
            catalogueRule: getCatalogue(),
            sexType: '10',
            filePaths: [],
            helpContent: '',
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            optionList: [{
              catalogueName: '',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              filePaths: [],
              helpContent: '',
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
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '20',
              margin: 10
              },
            unitList: []
            }],
          },
          childList: []
        };

      } else if(questionType==15){
        //加减题数字
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: '2',
            hierarchyList: [],
            sexType: '10',
            filePaths: [],
            catalogueRule: getCatalogue(),
            helpContent: '',
            checkType: "2",
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: '10',
            margin: 10
            },
            optionList: [{
              catalogueName: '',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              filePaths: [],
              helpContent: '',
              defaultValue:'',
              quantity:'',
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
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: 10,
              margin: 10
            },
            unitList: []
            }],
          },
          childList: []
        };
      }else if (questionType == '70') {

      }else if (questionType == 90) { //时间题
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: '2',
            catalogueRule: getCatalogue(),
            sexType: '10',
            filePaths: [],
            helpContent: '',
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: '10',
            margin: 10
            },
            hierarchyList: [],
            checkType: "2",
            optionList: [{
              catalogueName: '',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              checkList: {},
              addType:'',
              timeFormat:'yyyy-MM-dd hh:mm:ss',
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },

            }],
          },
          childList: []
        };
      } else if (questionType == 80) {
       
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: '2',
            sexType: '10',
            hierarchyList: [],
            catalogueRule: getCatalogue(),
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: 10,
            margin: 10
            },
            checkList: [{
              checkContext: "",
              checkMark: "",
              checkType: "1",
              sortNum: 1
            }],
            optionList: [{
                catalogueName: '选择选项',
                optionId: 'o-0',
                questionId:questionId,
                logicList: [],
                hierarchyList: [],
                defaultType: "1",
                checkList:{},
                style: {
                  height: 1,
                  link: 0,
                  maxLength: 0,
                  width: '10',
                  margin: 10
                  },
              },
            ],
          },
          childList: []
        };
      } else if (questionType == 40) { //添加题
        return {
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId:questionId,
            checkType:'2',
            aliasType: '2',
            catalogueRule: getCatalogue(),
            sexType: '10',
            filePaths: [],
            helpContent: '',
            hierarchyList: [],
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: '10',
            margin: 10
            },
            checkList: {
              checkContext: "",
              checkMark: "",
              checkType: "1",
              sortNum: 1
            },
            optionList: [],
          },
          childList: []
        };
      } else if(questionType==200){
        return{
          currNode: {
            catalogueName: "标签内容",
            questionType: questionType,
            questionId: questionId,
            checkType:'2',
            catalogueRule: getCatalogue(),
            aliasType: '2',
            sexType: '10',
            filePaths: [],
            helpContent: '',
            hierarchyList: [],
            optionList: [],
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: '10',
            margin: 10
            },
          },
          childList: []
        };
      }else if(questionType==110||questionType==32){
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId:questionId,
            aliasType: '2',
            catalogueRule: getCatalogue(),
            hierarchyList: [],
            checkType:'2',
            sexType: '10',
            filePaths: [],
            helpContent: '',
            style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            optionList: [{
              catalogueName: '',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              filePaths: [],
              helpContent: '',
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
              width: 10,
              margin: 10
            },
            unitList: []
            }],
          },
          childList: []
        };
      }else {
        return{
          currNode: {
            catalogueName: "选择题目",
            questionType: questionType,
            questionId: questionId,
            aliasType: '2',
            sexType: '10',
            catalogueRule: getCatalogue(),
            checkType: "2",
            hierarchyList: [],
            filePaths: [],
            helpContent: '',
            style: {
            height: 1,
            link: 0,
            maxLength: 0,
            width: '10',
            margin: 10
            },
            optionList: [{
              catalogueName: '选择选项',
              optionId: 'o-0',
              questionId: questionId,
              logicList: [],
              hierarchyList: [],
              filePaths: [],
              helpContent: '',
              defaultType: "2",
              checkList: {},
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            },
            {
              catalogueName: '选择选项',
              optionId: 'o-1',
              questionId: questionId,
              logicList: [],
              filePaths: [],
              helpContent: '',
              hierarchyList: [],
              defaultType: "2",
              checkList: {},
              style: {
              height: 1,
              link: 0,
              maxLength: 0,
              width: '10',
              margin: 10
              },
            }],
          },
          childList: []
        };
      }
    },
    //初始化问题树
    initQuestionTree() {
        this.questionTree = [];
        this.logicList = [];
        this.hierarchyList = [];
        let node=this.getQuestionByType(this.questionType);
        //根据选中的题目保存后台拼接好questionId和optionID之后返回
        this.saveMainTemplateQuestion(node,'mainQuestion');
    },
    //点击或者拖动保存主问题
    async saveMainTemplateQuestion(node,mainOrQuestion){
        let data=await this.saveTempQuestion(node,mainOrQuestion);
        this.setNewNode(data);
    },
    //点击或者拖动问题保存附属题
    async saveChildTemplateQuestion(node,mainOrQuestion,sortNum,option){
        //保存临时问题
        let data=await this.saveTempQuestion(node,mainOrQuestion);
        let hierarchyId=this.activeQuestion.currNode.styleHierarchy?this.activeQuestion.currNode.styleHierarchy:0;
        let optionId=undefined;
        if(option&&option.optionId){
            optionId=option.optionId;
        }
        //保存位置逻辑
        //依次传入的是当前附属题的问题id，上一节点的问题id，根节点的问题id，所在的位置层级，附属题新增到指定位置，以及选项id
        await this.saveHierarchy(data.questionId,this.activeQuestion.currNode.questionId,this.activeQuestion.currNode.rootNodeQuestionId,hierarchyId,sortNum,optionId);
        let id = this.rootNodeQuestionId || this.activeQuestion.currNode.questionId;
        this.getQuestionById(id);
    },
    //保存临时问题
    saveTempQuestion(node,mainOrQuestion){
        node.currNode.mainType=(mainOrQuestion=='mainQuestion'?1:0);
        let data= JSON.stringify(node.currNode)
        return ajaxAsync({
            url: 'knowledge-service/new/question',
            type: 'post',
            data:data,
        });
    },
    //设置新的节点
    setNewNode(node){
        let data={currNode:node,childList:[]};
        this.questionTree.push(data);
        this.activeQuestion=data;
        common.tip_msgArea("已保存", 1000);
        this.refreshPreShow();
    },
    //根据question获取问题树
    async getQuestionById(id) {
        let data=await ajaxAsync({
            url: 'knowledge-service/evaluation/questions/dynamic',
            type: 'get',
            async: false,
            data: {
                catalogueRule: getCatalogue(),
                questionIds: id
            }
        });
        this.setQuestion(data,id);
    },
    clearOptionLogic() {
        this.activeQuestion.currNode.optionList.forEach(function(el) {
            el.logicList = [];
        });
    },
    //上移下移排序
    changeNodeIndex: function(obj) {
      const that = this;
      let increment = -1;
      let rootQuestionId = obj.node.currNode.rootUniqueId;
      let questionId = obj.node.currNode.questionId;
      if(questionId === rootQuestionId) {
        return;
      };
      if(obj.type === "next") {
        increment = 1;
      };
      let params = {
        increment: increment,
        rootQuestionId: rootQuestionId,
        questionId: questionId
      }
      common.ajax({
        url: 'knowledge-service/question/update/location',
        type: 'get', 
        dataType:'json',
        data: params,
        callback: function(data) { 
          that.getQuestionById(rootQuestionId)        
        }
      });   

    },    
    //保存问题
    setQuestion(data,id) {
        let findNode=this.fetchQuestionById(id);
        Vue.set(findNode,'childList',data[0].childList);
        Vue.set(findNode,'currNode',data[0].currNode);
        common.tip_msgArea("已保存", 1000);
        this.activeQuestion=findNode;
        this.refreshPreShow();
    },
    //获取单位
    async getUnits() {
        let data=await ajaxAsync({
            url: 'knowledge-service/unit/all',
            type: 'get',
            async: false,
            data: {
                catalogueRule: getCatalogue()
            }
        });
        this.units = data;
    },
    //初始化拖动
    initDraggable:function(){
      let that=this;
      $( "#topic-panel-list").sortable({
        revert: true,
        delay:200,
        zIndex: 9990,
        cursor: "move",
          start( event, t ){
            $( "#topic-panel-list .topic-panel").removeClass("active");
            $(t.item).addClass("active");
          },
          stop: function(e, t){
            if($("#topic-panel-list> li:not(.topic-panel)").length>0){
                $("#topic-panel-list> li:not(.topic-panel)").remove();
            }
            that.initQuestionTree();
            Vue.nextTick(function(){
              $("#topic-panel-list>li").eq(0).addClass("active");
            });
          }
      });
      $(".topic-list>li" ).draggable({
          connectToSortable: "#topic-panel-list",
          helper: "clone",
          revert: "invalid",
          disabled:!that.createQuestion,
          stop: function(e,t) {
          let tempHtml=$(t.helper).html();
            that.questionType=$(tempHtml).eq(0).attr("id");
          }  
      });
        },
        getQuestionByQuestionId(questionId,node){
          if(node.currNode.questionId==questionId){
              return node;
          }
          for(var i=0;i<node.childList.length;i++){
            let aNode= this.getQuestionByQuestionId(questionId,node.childList[i]);
            if(aNode){
              return aNode;
            }
          }
        },
        fetchQuestionById(questionId){
          for(var i=0;i<this.questionTree.length;i++){
            let node=this.questionTree[i];
            let newNode=this.getQuestionByQuestionId(questionId,node);
            if(newNode){
              return newNode; 
            }
          }
        },
        //选择当前活动问题
        selectQuestion:function(obj){
          let that=this;
          this.notAddAttach=true; //附属题置为初始值，只有在点击之后才能新增附属题
          let node=this.fetchQuestionById(obj.node.currNode.questionId);
          node.currNode.styleHierarchy=obj.node.currNode.styleHierarchy;
          this.activeQuestion=node;
          if(this.activeQuestion.currNode.isAttach){
              this.activeQuestion.currNode.isAttach=false;
          }
          this.questionType=node.currNode.questionType;
          let qid=this.activeQuestion.currNode.uniqueId?this.activeQuestion.currNode.uniqueId:this.activeQuestion.currNode.questionId;
          if((this.selectAttachUniqId!=qid&&this.createQuestion)||!this.createQuestion){
              this.isDisabledDraggable=true;
              this.addAttachQues();
          }
        },
        //删除问题
        deleteQuestion:async function(node,type){
            await ajaxAsync({
                url: 'knowledge-service/new/question?rootQuestionId='+node.currNode.rootNodeQuestionId+'&questionId='+node.currNode.questionId,
                type: 'delete',
            });
            if(node.currNode.rootNodeQuestionId!=node.currNode.questionId){
                this.getQuestionById(node.currNode.rootNodeQuestionId);
            }else{
              this.questionTree=[];
              if(this.createQuestion){
                  this.refreshPreShow();
              }else{
                  this.getQuestions();
              }
            }
        },
        //左侧菜单点击切换问题类型
        clickQuestionType:function(questionType){
          if(!this.isDisabledDraggable){
            this.questionType=questionType;
            this.questionTypeChange();
          }else{
            common.tip_msg("请先点击添加附属题", 2000);
          }
        },
        questionTypeChange:function(){
          if (this.notAddAttach) {//直接是新增问题
            this.initQuestionTree();
          }else if(!this.notAddAttach){ //点击过附属题之后新增成为附属题
            let childItem=this.getQuestionByType(this.questionType);
            //根据选中的题目保存后台拼接好questionId和optionID之后返回
            this.saveChildTemplateQuestion(childItem,'childQuestion',this.activeQuestion.childList.length);
          }
        },
        //搜索问题
        searchQuestionKey:function(){
          if(this.pagination.currentPage==1) {
            this.getQuestions();
          }else{
            this.pagination.currentPage=1;
          }
        },
    },
    created: function() {
      Bus.$off('selectQuestion');
      Bus.$on('selectQuestion', this.selectQuestion);
      Bus.$off('selectSubItem');
      Bus.$on('selectSubItem',this.selectSubItem);
      Bus.$off('deleteQuestion');
      Bus.$on('deleteQuestion',this.deleteQuestion);
      Bus.$off('addOption');
      Bus.$on('addOption',this.addOption);
      Bus.$off('addAddOption');
      Bus.$on('addAddOption',this.addAddOption);
      Bus.$off('addQuestionOption');
      Bus.$on('addQuestionOption',this.addQuestionOption);
      Bus.$off('addSubItem');
      Bus.$on('addSubItem',this.addSubItem);
      Bus.$off('initChildSortabble');
      Bus.$on('initChildSortabble',this.initChildSortabble);
      Bus.$off('closePop');
      Bus.$on('closePop',this.closePop);
    },
    mounted() {
      this.questionList={};
      this.getUnits();
      this.mode = 'addQuestion';
      this.initDraggable();
      this.SET_USERFULWIDTH($('.topic-mode-cont').width() - 100);
      window.addEventListener('mouseup', this.mouseup);
      Bus.$on("changeNodeIndex", this.changeNodeIndex)
    },
    watch: {
        questionTree: {
          //这里如果是界面上的元素删除，或者是从问题模板切换到创建问题界面两种情况
          handler: function(val, oldVal) {
            if(this.questionTree.length==0){
              this.isDisabledDraggable=false;
              if(!this.createQuestion) {
                this.isDisabledDraggable=true;
              }
              this.notAddAttach=true;
              this.initDraggable();
              this.refreshPreShow();
            }
          },
          deep: true
        },
        keyWords: function() {
          if(this.keyWords) {
            this.searchQuestionKey();
          } else {
            this.keyWords = '';
            this.searchQuestionKey();
          }
        }         
    },
  components: {
    'inputLayer': inputLayer,
    'search': search,
    'logicOption': logicOption,
    'inputImgLayer':inputImgLayer,
    'verifyLayer':verifyLayer,
    'selectT': selectT,
    'questionTrees': questionTrees,
    'confirmMsg': confirmMsg,
    'menuTemplate':menuTemplate,
    draggable,
    'imageUpload':imageUpload,
    'questionSetting':questionSetting,
    'groupSentence':groupSentence,
    'shareLayer':shareLayer,
  }
}
</script>
<style scoped>
.model-drag-rside {
  /* right: 0; */
}
</style>
