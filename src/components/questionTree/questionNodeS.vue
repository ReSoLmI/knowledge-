<!-- 其他 -->
<template>
<li class="metadata-tree-li" :id="node.currNode.uniqueId+node.currNode.selfPropagationId?node.currNode.selfPropagationId:''" v-if="isShowNode">
  <div :id="node.currNode.uniqueId" :style="{'border-width': '0px'}" :key="node.currNode.uniqueId+node.currNode.selfPropagationId?node.currNode.selfPropagationId:''">
    <template>
      <!-- 标题 -->
        <i  v-if="node.childList&&node.childList.length>0" @click.stop="clickExpand()" :class="[getExpandClass()]"></i>
        <!-- {{ (subItem&&node.currNode.aliasType==3)||node.currNode.aliasType != 3 }} -->
        <div v-if="(pageFrom == 'tableDataShow') || (subItem&&node.currNode.aliasType==3)||node.currNode.aliasType != 3" class="txt" :class="getActiveClass(node)" @click.stop="setNodeData($event,node)">
             <template v-if="(subItem&&node.currNode.aliasType==3)">
                {{showSubItemName(node.currNode,subIndex)}}
            </template>
            <template v-else>
                {{node.currNode|showNodeName}}
            </template>
        </div>
        <template>
          <div class="lv-inline">
            <template v-for="(item, index) in node.currNode.optionList">
                <template v-for="(relateNode,subIndex) in item.hierarchyList">                 
                    <questionNode :node='getRelatedNode(relateNode.childQuestionId)' :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated="1" :subItem='"true"' :subIndex="subIndex" :pageFrom="pageFrom"></questionNode>
                </template>
            </template>
          </div>
      </template>
       <component v-bind:is="currentComponent" v-bind="$props" :key="node.currNode.uniqueId+node.currNode.selfPropagationId+node.currNode.questionType" :questionType="node.currNode.questionType" :pageFrom="pageFrom"></component>
      <!-- 内容 -->
        <ul v-show="node.childList.length>0"  :id="'topic-panel-childlist'+(node.currNode.uniqueId?node.currNode.uniqueId:'')">
            <template v-for='cel in node.childList' v-if="(nextChild.indexOf(cel.currNode.questionId)>-1)&&node.currNode.questionType!='70'">
            <template v-if="cel.currNode.questionType == 200 && cel.currNode.aliasType == 3" v-for="(cell,cellIndex) in cel.childList">
                <questionNode :node='cell' :styleHierarchy='styleHierarchy+1' v-bind="$props"  hasrelated='2' :key="'node'+cell.currNode.uniqueId+cell.currNode.selfPropagationId+cell.currNode.questionType" :pageFrom="pageFrom"></questionNode>
            </template>
            <template v-if="!(cel.currNode.questionType == 200 && cel.currNode.aliasType == 3)">
                <questionNode :node='cel' :styleHierarchy='styleHierarchy+1' v-bind="$props" hasrelated='2'  :key="'node'+cel.currNode.uniqueId+cel.currNode.selfPropagationId+cel.currNode.questionType" :pageFrom="pageFrom"></questionNode>
            </template>
          </template>
        </ul>
    </template>
    </div>
  </li>
</template>
<script>
import bus from '@/bus.js';
import Vue from 'vue';
import '@/vendor/bootstrap/bootstrap-dropdowns.min'
import common, { ajaxAsync } from '@/util/common.js';
import { mapState } from 'vuex';
import questionNodeMix from './questionNode/questionNodeMix';
import { TempaltePath } from '@/components/questionTemp'
import { QuestionType } from '@/components/questionTree/questionNode/index'
import questionNodeS from '@/components/questionTree/questionNodeS';
import embedNode from '@/components/questionTree/questionNode/embed'
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

// import '@/css/care.css';
export default {
    name: 'questionNode',
    data() {
        return {
            // saveValue: [],
            showNode: {},
            nextChild: [], //向下扩展子集
            /*startTime:(new Date()).format('yyyy-MM-dd hh:mm:ss'),*/
            //popHeight:0,
            questionId: this.node.currNode.questionId,
            adminationDate: (new Date()).format('yyyy-MM-dd'),
            hasMinValid: false,
            maxDate: (new Date()).format('yyyy-MM-dd'),
            hasClickTemplate: false,
            currentComponent: '',
            tempComponent: '',

            // isFolder: true
        }
    },
    mixins: [questionNodeMix],
    props: ['node', "saveValue", 'styleHierarchy', 'tempSaveValue', 'units', 'operationNode', 'newScoreHierarchyCode', 'hasSave', 'tempSaveValueComplete', 'addedOption', 'showNodeID', 'hideNode', 'hasrelated','activeQuestion','rootNode','isShowCloseBtn','pageFrom','subItem','subIndex'],
    filters: {
        showNodeName: function(currNode, title) {
          if(!currNode.aliasName&&!currNode.catalogueName) {
            return "选择题目"
          }

          if (currNode.aliasType == 1) {
              return currNode.aliasName;
          } else if (currNode.aliasType == 2) {
              return currNode.catalogueName;
          } else if (currNode.aliasType == 3) {
              return currNode.aliasName || currNode.catalogueName;
          } else {
              return currNode.aliasName;;
          }
        },
    },
    components: {
        'questionNodeS':questionNodeS,
         embedNode: embedNode,
    },
    mounted: async function() {
        let templateType = this.node.currNode.templateType;
        this.setComponent();
    },
    computed: {
        ...mapState([
            'patient'
        ]),
        isShowAddQuestion(){
            //debugger;
          if(common.getUrlParam('assesmentId')&&this.activeQuestion&&this.activeQuestion.currNode&&this.activeQuestion.currNode.questionId==this.node.currNode.questionId&&this.activeQuestion.currNode.uniqueId==this.node.currNode.uniqueId&&this.activeQuestion.currNode.isAttach){
            return true;
          }else{
            return false;
          }
        },        
        isShowNode() {
            if (!this.node || !this.showNodeID.length) {
                return false;
            }
            /*if(this.activeQuestion&&this.activeQuestion.currNode&&(this.activeQuestion.currNode.questionId==this.node.currNode.questionId)){
                this.activeQuestion.currNode.styleHierarchy=this.styleHierarchy;
                this.activeQuestion.currNode.rootNodeQuestionId=this.rootNode.currNode.questionId;
                this.activeQuestion.currNode.rootUniqueId=this.rootNode.currNode.uniqueId;
            }*/
            this.node.currNode.styleHierarchy=this.styleHierarchy;
            this.node.currNode.rootNodeQuestionId=this.rootNode.currNode.questionId;
            this.node.currNode.rootUniqueId=this.rootNode.currNode.uniqueId;
            var that = this;
            // 添加题显示与添加模板保持一致
            /*var isShow = (this.showNodeID.includes(this.getShowNodeUniqeId(this.node)) || (this.node.currNode.questionType == 40 && this.showNodeID.includes(this.node.currNode.uniqueId))) && !this.hideNode.find(hn => {
                return hn.uniqueId == this.node.currNode.uniqueId && hn.selfPropagationId == this.node.currNode.selfPropagationId;
            })*/
            var isShow=true;
            //console.log('node', this.showNodeNames(this.node.currNode), ':', (performance.now() / 1000).toFixed(2),this.node.currNode.questionId,'&',this.node.currNode.hierarchyCode);
            if (!isShow) {
                return false;
            }
            debugger
            this.nextChild = this.node.childList.filter(childNode => {
                return this.node.currNode.hierarchyList.find(op => {
                    return op.childQuestionId == childNode.currNode.questionId;
                })
            }).map(cl => {
                return cl.currNode.questionId;
            })
            debugger
            console.log(this.nextChild)
            return true;
        },
        marginObj: function() {
            return this.node.currNode.aliasType == 3 ? {
                'margin-left': 0
            } : {}
        },
        showNodeNamese: function() {
            var currNode = this.node.currNode;

            if(!currNode.aliasName&&!currNode.catalogueName) {
              return "选择题目"
            }

            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else if(currNode.aliasType == 3){
                return currNode.aliasName || currNode.catalogueName;
            } else {
              return ""
            }
        }, 
        isShowBraden: function() {
            if (!this.patient) {
                return true
            }
            if (this.node.currNode.paperTemplateId == 'BradenQ' || this.node.currNode.paperTemplateId == 'Braden') {
                if (eval((parseFloat(this.patient.age) + parseFloat(parseInt(this.patient.ageM) * 12 / 366) + parseFloat(parseInt(this.patient.ageD) / 366)) + this.node.currNode.ageLimit)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
    },
    methods: {
        addQuestion:function (questionId) {
            bus.$emit('addSearchQuestion', questionId,this.node,this.rootNode); 
        },
        setNodeData:function(event,node){
            let obj={
                node:node,
                type:'add',
            }
            let acObj = $(event.currentTarget);
            
            if(acObj.hasClass('active')){
                obj.type='remove';
            }
            bus.$emit('selectAddData', obj);
        },
        getActiveClass:function(node){

              for(var i=0;i<this.activeQuestion.length;i++){
                let al=this.activeQuestion[i];
                if(al.currNode.uniqueId==node.currNode.uniqueId&&al.currNode.optionId==node.currNode.optionId){
                    console.log(node.currNode.uniqueId+'为选中状态');
                    return 'active';
                }
              }
              return '';
            },
        showSubItemName: function(currNode,subIndex) {
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else if(currNode.aliasType==3){
                return '子项'+(subIndex+1);
            }
        },
        /*设置模板组件*/
        setTempComponent: function() {
            let paperTemplateId = this.node.currNode.paperTemplateId;
            this.tempComponent = TempaltePath[paperTemplateId];
        },
        /*设置题型组件*/
        setComponent: function() {
            let questionType = this.node.currNode.questionType;
            this.currentComponent = QuestionType[questionType];
        },
        clickExpand:function(){
            //debugger;
           /* if(this.node.currNode.isExpand){
                this.node.currNode.isExpand=false;
                Vue.set(this.node.currNode,'isExpand',false);
              }else{
                Vue.set(this.node.currNode,'isExpand',true);
                this.node.currNode.isExpand=true;
              }*/
        },
        getExpandClass:function(){
          if(this.node.currNode.isExpand){
            return 'i-tree-angle active';
          }else{
            return 'i-tree-angle';
          }
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
            //
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
                return currNode.catalogueName || currNode.aliasName || "选择题目";
            }
        },
        
        deleteNodes:function(node){
          bus.$emit("deleteQuestion",node);
        },
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
