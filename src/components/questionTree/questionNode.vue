<!-- 其他 -->
<template>
    <div :id="(node.currNode.uniqueId?node.currNode.uniqueId:node.currNode.questionId)"  @click.stop="setClass(node)"  :class="getActiveClass(node)" :style="{'padding-right':(node.currNode.questionType==200) ? '10px':'5px','margin-left': (node.currNode.style.margin || 5) + 'px','min-width':(node.currNode.questionType==200 || node.currNode.questionType==40)?'400px':'auto', 'width': 'auto', 'min-height': '25px'}"   :key="(node.currNode.uniqueId?node.currNode.uniqueId:node.currNode.questionId)+(node.currNode.selfPropagationId?node.currNode.selfPropagationId:'')" :selfPropagationid="node.currNode.selfPropagationId" :uniqueid="node.currNode.uniqueId" v-if="isShowNode&&isShowBraden">
     <div class="th-tool-list-v" v-if="isShowCloseBtn">
        <i class="i-pre" @click.stop="changeNodeIndex('pre',$event)" :class="{disabled:nodeIndex==0?true:false}"></i>
        <i class="i-next" @click.stop="changeNodeIndex('next',$event)" :class="{disabled:isLastNode?true:false}"></i>
        <i class="i-close" @click.stop="deleteNodes(node)" ></i>
    </div>
    <template v-if='(node.currNode.templateType == 0 || node.currNode.templateType == undefined)&&node.currNode.questionType!=230'>
      <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3 && node.currNode.questionType != 202" :style="{'margin-left':'5px','min-width':'75px','font-weight':(node.currNode.questionType==200)?'bold':'normal'}">
        {{node.currNode|showNodeName}}
      </div>      

      <!-- 导入题配置样式 -->
      <div class="lv-item lv-title" v-if="node.currNode.questionType==202" :style="{'margin-left':(node.currNode.style.margin || 0) + 'px','width':nodeWidth(node.currNode.style&&node.currNode.style.width)+'px','font-weight':node.currNode.questionType==200?'bold':'normal'}">      
        <a class="am-btn am-btn-primary" style="margin-top:-1px;padding:3px 12px;"> {{node.currNode|showNodeName}}</a>
      </div>

      <!-- 内容 -->
      <component v-bind:is="currentComponent" v-bind="$props" :key="node.currNode.uniqueId+node.currNode.selfPropagationId+node.currNode.questionType" :questionType="node.currNode.questionType"></component>      
      <span id="lineFeed" v-if="paperStyle.arrangement==1&&node.childList.length>0&&node.currNode.hierarchyList.length>0&&node.childList.find(cl=>{return isNodeShow(cl)})">
        <br />
      </span>
      <!-- 取子集 -->
      <ul v-show="isShowChild" class="topic-panel-list" :class="{'topic-empty-child':isShowAttachTip}" :id="'topic-panel-childlist-'+(node.currNode.uniqueId?node.currNode.uniqueId:'')">
        <template v-for='(cel,celllIndex) in node.childList' v-if="(nextChild.indexOf(cel.currNode.questionId)>-1)&&!(node.currNode.questionType == '40'&&!node.currNode.selfPropagationId)&&node.currNode.questionType!='70'" >
        <span id="lineFeed" v-if="cel.currNode.lineFeed == 1">
          <br />
        </span>
        <template v-if="isShowCloseBtn!=false">
          <span id="lineFeed" v-if="cel.currNode.lineFeed == 1">
            <br />
          </span>          
          <questionNode :node='cel' :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated='2' :isLastNode="(celllIndex==(node.childList.length-1))?true:false"  :nodeIndex="celllIndex" :key="'node'+cel.currNode.uniqueId+cel.currNode.selfPropagationId+cel.currNode.questionType"></questionNode>
        </template>
        <template v-else>
            <template v-if="cel.currNode.questionType == 200 && cel.currNode.aliasType == 3" v-for="(cell,cellIndex) in cel.childList">
                <span id="lineFeed" v-if="cel.currNode.lineFeed == 1">
                  <br />
                </span>
                <questionNode :node='cell' :styleHierarchy='styleHierarchy+1' v-bind="$props"  :isLastNode="(cellIndex==(cel.childList.length-1))?true:false" :nodeIndex="cellIndex" hasrelated='2' :key="'node'+cell.currNode.uniqueId+cell.currNode.selfPropagationId+cell.currNode.questionType"></questionNode>
            </template> 
            <template v-if="!(cel.currNode.questionType == 200 && cel.currNode.aliasType == 3)">
                <span id="lineFeed" v-if="cel.currNode.lineFeed == 1">
                  <br />
                </span>              
                <questionNode :node='cel' :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated='2' :isLastNode="(celllIndex==(node.childList.length-1))?true:false"  :nodeIndex="celllIndex" :key="'node'+cel.currNode.uniqueId+cel.currNode.selfPropagationId+cel.currNode.questionType"></questionNode>
            </template>
        </template>
        </template>
      </ul>
    </template>
    <!-- 模板 -->
    <template v-if='node.currNode&&node.currNode.templateType == 1'>
      <!-- <questionTemp :node='node' :saveValue='saveValue' :key="node.currNode.uniqueId"></questionTemp> -->
      <component v-bind:is="tempComponent" v-bind="$props"></component>
    </template>
    <!-- 嵌入题单独处理 -->
    <template v-if="node.currNode.templateType == 0&&node.currNode.questionType==230">
      <embedNode v-bind="$props"></embedNode>
    </template>
    <!-- </div> -->
    <div class="lv-item txt-danger" v-if="hasSave&&isNodeSel" :ttt="node.currNode.uniqueId">必填</div>
    <addQuestion @addQuestion="addQuestion" v-if="isShowAddQuestion"></addQuestion>
    </div>
</template>
<script>
import bus from '@/bus.js';
import common, { ajaxAsync } from '@/util/common.js';
import { mapState } from 'vuex'
import questionNodeMix from './questionNode/questionNodeMix'
import { TempaltePath } from '@/components/questionTemp'
import { QuestionType } from '@/components/questionTree/questionNode/index'
import embedNode from '@/components/questionTree/questionNode/embed'
import addQuestion from '@/components/questionC/addQuestion.vue';
import radio from '@/components/questionTree/questionNode/radio';
import radioSwitch from '@/components/questionTree/questionNode/radio-switch';
import checkBox from '@/components/questionTree/questionNode/checkBox';
import switchQ from '@/components/questionTree/questionNode/switch';
import inputsQ from '@/components/questionTree/questionNode/inputs';
import optional from '@/components/questionTree/questionNode/optional';
import timeText from '@/components/questionTree/questionNode/timeText';
import combina from '@/components/questionTree/questionNode/combina';
import addQ from '@/components/questionTree/questionNode/add';
import dropDown from '@/components/questionTree/questionNode/dropDown.vue';
import picture from '@/components/questionTree/questionNode/picture';
import freeText from '@/components/questionTree/questionNode/freeText';
import comment from '@/components/questionTree/questionNode/comment';
import labelQ from '@/components/questionTree/questionNode/labelQ';
import guideInto from '@/components/questionTree/questionNode/guideInto';

export default {
    name: 'questionNode',
    data() {
        return {
            showNode: {},
            nextChild: [], //向下扩展子集
            questionId: this.node.currNode.questionId,
            adminationDate: (new Date()).format('yyyy-MM-dd'),
            hasMinValid: false,
            maxDate: (new Date()).format('yyyy-MM-dd'),
            hasClickTemplate: false,
            currentComponent: '',
            tempComponent: '',
            activeGroup: 1,
        }
    },
    mixins: [questionNodeMix],
    props: ['node', "saveValue", 'styleHierarchy', 'tempSaveValue', 'units', 'operationNode', 'newScoreHierarchyCode', 'hasSave', 'tempSaveValueComplete', 'addedOption', 'showNodeID', 'hideNode', 'hasrelated', 'isTreeDisabled','activeQuestion','rootNode','isShowCloseBtn','nodeIndex','isLastNode'],
    filters: {
        showNodeName: function(currNode, title) {
          if(currNode.aliasType == 3) { return ''; }
          if(currNode.aliasType == 2) { return  currNode.catalogueName }
          return currNode.aliasName;
        },
    },
    components: {
        'embedNode': embedNode,
        'addQuestion': addQuestion,
    },
    mounted: async function() {
        let that=this;
        if (false && this.paperStyle.arrangement == 1 && this.paperStyle.line > 0) {
          setTimeout(function() {
            let allWidth = that.userfulWidth - (that.styleHierarchy - 1) * 15;
            let columnWidth = allWidth / parseInt(that.paperStyle.line);
            let columnNum = parseInt(allWidth * that.node.currNode.maxWidth / 100 / columnWidth) + 1;
            if (columnNum > that.paperStyle.line) {
                columnNum = that.paperStyle.line;
            }
            let minWidth = columnNum * columnWidth;
            if(that.treeId){
                $('#' + that.treeId + ' #' + that.node.currNode.uniqueId).last().css('min-width', minWidth + 'px')
            }else{
                $(' #' + that.node.currNode.uniqueId?that.node.currNode.uniqueId:that.node.currNode.questionId).last().css('min-width', minWidth + 'px')
            }
          }, 0);
        }

        let templateType = this.node.currNode.templateType;
        if (templateType == '0' || !templateType) {
            this.setComponent();
        } else if (templateType == '1') {
            this.setTempComponent();
        }

        bus.$on("clickCurQuestion", (val) => {
          this.setClass(val)
        })
    },
    computed: {
        ...mapState([
            'patient', 'paperStyle', 'userfulWidth'
        ]),
        getColumnWidth() {
            return this.columnWidth
        },
        isShowAddQuestion(){
          if(common.getUrlParam('assesmentId')&&this.activeQuestion&&this.activeQuestion.currNode&&this.activeQuestion.currNode.questionId==this.node.currNode.questionId&&this.activeQuestion.currNode.uniqueId==this.node.currNode.uniqueId&&this.activeQuestion.currNode.isAttach){
            return true;
          }else{  
            return false;
          }
        },
        isShowChild:function(){
          let that=this;
          let isReturn=false;
          if(this.node.childList.length == 0) {
            return false;
          }
          this.node.childList.forEach(cel=>{
            var isShow = (that.showNodeID.includes(that.getShowNodeUniqeId(cel)) || (cel.currNode.questionType == 40 && that.showNodeID.includes(cel.currNode.uniqueId))) && !that.hideNode.find(hn => {
              return hn.uniqueId == cel.currNode.uniqueId && hn.selfPropagationId == cel.currNode.selfPropagationId;
            })
            if(isShow){
                isReturn=true;
            }
          });
          if(this.isShowAttachTip||isReturn){
            this.initChildQuesSortable();
            return true;
          }
          return false;
        },
        isShowAttachTip(){
            //debugger;
            if(!this.activeQuestion||!this.activeQuestion.currNode){
                return;
            }
            let id=this.activeQuestion.currNode.uniqueId?this.activeQuestion.currNode.uniqueId:this.activeQuestion.currNode.questionId;
            if(this.node.currNode.uniqueId==id&&this.activeQuestion.currNode.isAttach){
                return true;
            }else{
                return false;
            }
        },

        /*判断必选项*/
        isNodeSel: function() {
            if (this.node.currNode.templateType == 0 && this.node.currNode.questionType == 200) {
                return false;
            }
            let a = this.node.currNode.checkType == 1;
            // if (!a) {
            //     return false;
            // }
            if (a) {
                let b = !(this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].find(sv => {
                    return sv.selfPropagationId == this.node.currNode.selfPropagationId && sv.isShow;
                }))
                if (b) {
                    return b;
                }
                /*填空题不为空*/
                if (this.node.currNode.questionType == '30' || this.node.currNode.questionType == '90') {
                    let c = !this.node.currNode.optionList.find(op => {
                        return !!this.getValueById(op, this.node) || this.saveValue[this.node.currNode.uniqueId].find(sv => {
                            return sv.selfPropagationId == this.node.currNode.selfPropagationId && sv.isShow;
                        }).optionContent;
                    })
                    return c
                }
            }
            let d = this.node.currNode.optionList.find(op => {
                return op.checkList && op.checkList.checkType == 1 && !this.isIdSelected(this.node.currNode, op.optionId)
            })
            if (d) {
                return d;
            }
            return false;
        },
        isShowNode() {
            if (!this.node || !this.showNodeID.length) {
                return false;
            }
            var that = this;
            if(this.activeQuestion&&this.activeQuestion.currNode&&(this.activeQuestion.currNode.questionId==this.node.currNode.questionId)){
                this.activeQuestion.currNode.styleHierarchy=this.styleHierarchy;
                this.activeQuestion.currNode.rootNodeQuestionId=this.rootNode.currNode.questionId;
                this.activeQuestion.currNode.rootUniqueId=this.rootNode.currNode.uniqueId;
            }
            this.node.currNode.styleHierarchy=this.styleHierarchy;
            this.node.currNode.rootNodeQuestionId=this.rootNode.currNode.questionId;
            this.node.currNode.rootUniqueId=this.rootNode.currNode.uniqueId;
            // 添加题显示与添加模板保持一致
            var isShow = (this.showNodeID.includes(this.getShowNodeUniqeId(this.node)) || (this.node.currNode.questionType == 40 && this.showNodeID.includes(this.node.currNode.uniqueId))) && !this.hideNode.find(hn => {
                return hn.uniqueId == this.node.currNode.uniqueId && hn.selfPropagationId == this.node.currNode.selfPropagationId;
            })
            if (!isShow) {
                return false;
            }
            this.nextChild = this.node.childList.filter(childNode => {
                return this.node.currNode.hierarchyList.find(op => {
                    return op.childQuestionId == childNode.currNode.questionId;
                })
            }).map(cl => {
                return cl.currNode.questionId;
            })
            return true;
        },
        marginObj: function() {
            return this.node.currNode.aliasType == 3 ? {
                'margin-left': 0
            } : {}
        },
        showNodeNamese: function() {
            var currNode = this.node.currNode;
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else {
                return "";
            }
        },
        isShowBraden: function() {
            return true;
            /*if (!this.patient) {
                return true
            }
            console.log('ispatient');
            console.log(this.patient);
            if (this.node.currNode.paperTemplateId == 'BradenQ' || this.node.currNode.paperTemplateId == 'Braden') {
                if (eval((parseFloat(this.patient.age) + parseFloat(parseInt(this.patient.ageM) * 12 / 366) + parseFloat(parseInt(this.patient.ageD) / 366)) + this.node.currNode.ageLimit)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }*/
        },
        convertStockData: function() {
            //获取休克指数，如果存在休克指数模板则从休克指数中取得，如果不存在则从通用评估中取
            var tempHierarchyCode = this.node.currNode.hierarchyCode + '' + this.node.currNode.questionId;
            this.node.currNode.tempHierarchyCode = tempHierarchyCode;
            this.node.currNode.tempQuestionId = this.node.currNode.uniqueId;
            let obj = {
                tempHierarchyCode: this.tempHierarchyCode,
                selfPropagationId: this.node.currNode.selfPropagationId,
                source: 'stockData',
            }
            this.tree.$emit('clearTemplate', obj);
            let that = this;
            // console.log(this.tempSaveValue);
            if (this.newScoreHierarchyCode) {
              if (this.tempSaveValue && this.tempSaveValue[this.newScoreHierarchyCode] && this.tempSaveValue[this.newScoreHierarchyCode].length > 0) {
                  let breath = this.tempSaveValue[that.newScoreHierarchyCode].filter(function(el) {
                      return el.questionId == 4402;
                  });
                  let shSou = this.tempSaveValue[that.newScoreHierarchyCode].filter(function(el) {
                      return el.questionId == 4404;
                  })
                  if (breath.length != 0 && shSou.length != 0 && breath[0].optionContent && shSou[0].optionContent) {
                      let num = parseFloat(breath[0].optionContent) / parseFloat(shSou[0].optionContent);
                      this.node.currNode.questionCode = this.node.currNode.catalogueCode;
                      this.tree.$emit('setTempSaveValue', this.node.currNode);
                      if (num && num != Infinity) {
                          this.node.currNode.optionContent = num.toFixed(2);
                          return num.toFixed(2);
                      } else {
                          this.node.currNode.optionContent = '';
                          return '患者心率或者血压为零，结果无法计算。';
                      }
                  } else {
                      return "--";
                  }
                }
            } else {
                var stockData = this.stockData;
                if (stockData != 0 && stockData != "-1.0") {
                    this.node.currNode.optionContent = stockData;
                    this.node.currNode.questionCode = this.node.currNode.catalogueCode;
                    this.tree.$emit('setTempSaveValue', this.node.currNode);
                    return stockData;
                }
            }
            return "--";
        },
    },
    methods: {
        closeAddQuestion: function() {
          console.log('鼠标移出事件触发')
          this.isShowAddQuestion = false;
        },
        /*设置题型组件*/
        setComponent: function() {
            let questionType = this.node.currNode.questionType;
            this.currentComponent = QuestionType[questionType];
        },
        initChildQuesSortable:function(){
            let qid=this.node.currNode.uniqueId?this.node.currNode.uniqueId:this.node.currNode.questionId;
            bus.$emit("initChildSortabble",qid);
        },
        addAttachQues:function(){

            //debugger;
            /*let that=this;
            let qid=this.node.currNode.uniqueId?this.node.currNode.uniqueId:this.node.currNode.questionId;
            let id="#topic-panel-childlist"+qid;
            let zindex=$(id).css('z-index');
       
           
            $(id).css("z-index",999999999999);

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
                  /*  var arr = $(id).sortable('toArray');
                    that.sortDragtable(arr);*/
                
                  /*  $(id).css("z-index",zindex);
                }
            });*/
        },
        addQuestion:function (questionId) {
            bus.$emit('addSearchQuestion', questionId,this.node,this.rootNode); 
        },
        
        /*设置模板组件*/
        setTempComponent: function() {
            let paperTemplateId = this.node.currNode.paperTemplateId;
            this.tempComponent = TempaltePath[paperTemplateId];
        },
        templateValid: function() {
            this.hasClickTemplate = !this.hasClickTemplate;
        },
        changeInput(item, event) {
            if (event) {
                item.optionContent = $(event.currentTarget).val();
                if (item.checkList.length == 0) {
                    return;
                }
                this.$set(item.checkList[0], 'checkError', false);
                this.$set(item.checkList[0], 'checkMsg', '');

                if (item.checkList[0].checkContext) {
                    var reg = item.checkList[0].checkContext;
                    if (item.optionContent.trim() != '') {
                        var r = item.optionContent.match(reg);
                        if (r == null) {

                            　
                            try {　　
                                var regg = eval(reg);
                                r = regg.test(item.optionContent);　　
                            } catch (error) {　　　} finally {　　
                                if (!r) {
                                    this.$set(item.checkList[0], 'checkError', true);
                                    this.$set(item.checkList[0], 'checkMsg', '格式不正确');
                                    this.showError();
                                }　
                            }
                        }
                    }
                }
            }
        },
        showError() {
            $('.i-error').tooltip({
                container: "body",
                placement: "auto top"
            }).on('shown.bs.tooltip', function(event) {
                var that = this;
                $(this).parents("body").find('div.tooltip').css({ zIndex: layer.zIndex });
            });
        },
        showNodeNames: function(currNode) {
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else {
                return currNode.catalogueName;;
            }
        },
        deleteNodes:function(node){
          bus.$emit("deleteQuestion",node);
        },
        changeNodeIndex:function(type,event){
          let objtt=$(event.currentTarget);
          if(objtt.hasClass('disabled')){
              return;
          }
          let obj={
              type:type,
              index:this.nodeIndex,
              node:this.node,
          };
          bus.$emit('changeNodeIndex',obj);
        }
    },
    watch: {
        tempSaveValue: function(curValue) {
            this.tempSaveValue = curValue;
        },
        hasSave: function(curValue) {
            this.hasSave = curValue;
        },
        tempSaveValueComplete: function(curValue) {
            this.tempSaveValueComplete = curValue;
        },
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bigger {
  width: 250px;
}

.normal {
  width: 120px;
}

.small {
  width: 50px;
}

</style>
