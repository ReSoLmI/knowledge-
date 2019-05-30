<!-- 出入量模板 -->
<template>
  <!-- <div>
    <div class="config-bd-pd" style="margin:10px 20px 10px 0;" v-for="cnode in node.childList">{{addedOptionList[cnode.currNode.uniqueId]}}
      <template v-for="selfLoop in addedOptionList[cnode.currNode.uniqueId]" >1
        <template v-for="ccnode in cnode.childList">{{ccnode.currNode.questionType}}2
          <div class="lv-node" style="width: auto; min-width: 525.557px;" v-if="ccnode.currNode.questionType=='13'">
            <div class="lv-item lv-title" style="width: 157.667px; font-weight: normal;">
              {{ccnode.currNode|showNodeName}}
            </div>
            <div class="placeholder-drag-panel lv-inline">
              <div class="inline am-ctr-sel  lv-item" style="width:200px" :class="{'open':isComboOpen[ccnode.currNode.uniqueId+'_'+selfLoop.selfPropagationId]}" @click.stop="showComboOpen(ccnode.currNode.uniqueId,selfLoop.selfPropagationId)" @mouseleave="isComboOpen[ccnode.currNode.uniqueId+'_'+selfLoop.selfPropagationId]=false">
                <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" :class="{disabled:isTreeDisabled}" :ttt="getValue(ccnode.currNode.uniqueId,selfLoop.selfPropagationId)">{{getValue(ccnode.currNode.uniqueId,selfLoop.selfPropagationId)}}</a>
                <div class="am-dropdown am-mr-10" v-show="isComboOpen[ccnode.currNode.uniqueId+'_'+selfLoop.selfPropagationId]">

                  <ul>
                    <li v-for="(item,index_) in getDropList(cnode.currNode.questionId,ccnode.currNode.questionId,selfLoop.selfPropagationId)" @click.stop="checkSelfRadio(initNode(ccnode,selfLoop.selfPropagationId),item)"><a> {{item|showNodeName}} </a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="lv-node" style="width: auto; min-width: 525.557px;" v-if="ccnode.currNode.questionType=='30'">
            <div class="lv-item lv-title" style="width: 157.667px; font-weight: normal;">
              {{ccnode.currNode|showNodeName}}
            </div>
            <div class="lv-inline" questiontype="30">
              <div class="lv-item">
                <div class="am-input-unit">
                  <input type="text" maxlength="100" placeholder="" class="input-text" style="padding-right: 0px; width: 315.334px;">
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div> -->
  <div id="capacity" class="capacity-item-addabeld-list" :style="{'width':(userfulWidth - 200)+'px','margin-left':'5px'}">
    <!--入量-->
    <div class="capacity-item-addabeld" :class="[index>0?'am-mt-20':'']" v-for="(cnode,index) in node.childList">
      <div class="label">{{cnode.currNode|showNodeName}}</div>
      <!-- <template v-for="selfLoop in addedOptionList[cnode.currNode.uniqueId]"> -->
      <div class="control">
        <div class="capacity-inner-item" v-if="addedOptionList&&cnode.currNode&&addedOptionList[cnode.currNode.uniqueId].length>0" v-for="(selfLoop,selfIndex) in addedOptionList[cnode.currNode.uniqueId]">
          <template v-for="ccnode in cnode.childList">
            <template v-if="ccnode.currNode.questionType=='13'">
              <span class="am-mr-5">{{ccnode.currNode|showNodeName}}</span>
              <div class="am-ctr-sel am-mr-10" style="width: 160px;" :class="{'open':isComboOpen[ccnode.currNode.uniqueId+'_'+selfLoop.selfPropagationId]}" @click.stop="showComboOpen(ccnode.currNode.uniqueId,selfLoop.selfPropagationId)" @mouseleave="isComboOpen[ccnode.currNode.uniqueId+'_'+selfLoop.selfPropagationId]=false">
                <a href="javascript:void(0)" class="caption" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{getValue(ccnode.currNode.uniqueId,selfLoop.selfPropagationId)}}</a>
                <div class="am-dropdown">
                  <ul>
                    <li v-for="(item,index_) in getDropList(cnode.currNode.questionId,ccnode.currNode.questionId,selfLoop.selfPropagationId)" @click.stop="checkSelfRadio(initNode(ccnode,selfLoop.selfPropagationId),item)"><a>{{item|showNodeName}}</a></li>
                  </ul>
                </div>
              </div>
            </template>
            <template v-if="ccnode.currNode.questionType=='30'">
              <span class="am-mr-5">量</span>
              <div class="am-input-unit am-mr-10">
                <input type="text" class="input-text w120" :value="getValueBySelfId(ccnode.currNode.optionList[0],ccnode,selfLoop.selfPropagationId)" @input="checkInputUnitTemp(ccnode,$event,selfLoop.selfPropagationId)" />
                <i>ml</i>
              </div>
            </template>
          </template>
          <a class="i-row-plus" @click="addOp(cnode)" v-if="selfIndex == addedOptionList[cnode.currNode.uniqueId].length-1"></a> 
          <a class="i-row-minus" v-if="selfIndex>0"  @click="removeOp(selfLoop.selfPropagationId)"></a>
        </div>
      </div>
      <!-- </template> -->
    </div>
  </div>
  <!--入量 end-->
  </div>
</template>
<script>
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import { mapState } from 'vuex'
// import questionNodeMixin from '@/questionTree/questionNodeMix';
export default {
    data() {
        return {
            isComboOpen: {}, //下拉提是否打开
            extendRemark: JSON.parse(this.node.currNode.extendRemark),
            addedOptionList:{},
            selfId: 1,            
        }
    },
    mixins: [questionNodeMixin],
    computed: {
        ...mapState([
            'userfulWidth'
        ]),
    },
    mounted: function() {
        this.getOptionList();
        let that = this;
        this.node.childList.forEach(cnode => {
          if (!that.addedOptionList[cnode.currNode.uniqueId] || that.addedOptionList[cnode.currNode.uniqueId].length == 0) {
            that.addOp(cnode);
          }
        })
    },
    methods: {
        /*显示下拉框*/
        showComboOpen: function(uniqueId, selfPropagationId) {
            if (this.isTreeDisabled) {
                return;
            }
            if (this.isComboOpen[uniqueId + '_' + selfPropagationId] === undefined) {
                this.$set(this.isComboOpen, uniqueId + '_' + selfPropagationId, true);
            } else {
                this.isComboOpen[uniqueId + '_' + selfPropagationId] = true;
            }
            this.$forceUpdate();
            console.log(this.isComboOpen[uniqueId + '_' + selfPropagationId], 8888);
        },
        /*移除一行*/
        removeOp: function(selfPropagationId) {
            this.tree.$emit('removeBatchNode', selfPropagationId);
            // this.addedOptionList = this.addedOptionList.filter(add => {
            //     return add.selfPropagationId != selfPropagationId
            // });
            this.getOptionList();
        },

        getOptionList: function() {
            //debugger;
            let that=this;
            let result = {};
            debugger
            // console.log(this.saveValue)
            this.node.childList.forEach(cnode => {
              if (this.saveValue[cnode.currNode.uniqueId]) {
                  result[cnode.currNode.uniqueId] = this.saveValue[cnode.currNode.uniqueId].filter(sv => {
                      return sv.isShow && sv.selfAddQuestions == 'ioAddedNode';
                  })
              } else {
                  result[cnode.currNode.uniqueId] = [];
              }
            })
            console.log(result);
            console.log(this.saveValue);

            this.addedOptionList = result;
        },
        /*新增一列*/
        addOp: function(node) {
            let selfPropagationId = new Date().format('yyyyMMddhhmmss');
            this.selfId++;
            let addedOption = {
                questionId: node.currNode.questionId,
                selfAddQuestions: 'ioAddedNode',
                hierarchyCode: node.currNode.hierarchyCode,
                selfPropagationId: selfPropagationId + this.selfId,
                uniqueId: node.currNode.uniqueId,
                isShow: true,
                // questionType:this.node.currNode.questionType
            }
            //debugger;
            
            this.tree.$emit('setAddNode', addedOption);
            //debugger;
            this.getOptionList();
            //this.addedOptionList.push($.extend(true, {}, addedOption));
        },
        checkInputUnitTemp(ccnode,$event,selfPropagationId){
            let item = ccnode.currNode.optionList[0];
            item.paperTemplateId = this.node.currNode.paperTemplateId;
            item.tempQuestionId = this.node.currNode.uniqueId;
            this.checkInputUnit(item,ccnode,$event,selfPropagationId)
        },
        getDropList(questionId, cQuestionId, selfPropagationId) {
            if (this.extendRemark[questionId][cQuestionId]) {
                return this.extendRemark[questionId][cQuestionId]
            } else {
                let fquestionId = Object.keys(this.extendRemark[questionId])[0];
                let node = this.node.childList.find(cl => {
                    return cl.currNode.questionId == questionId
                }).childList.find(cnode => {
                    return cnode.currNode.questionId == fquestionId;
                })
                let sv = this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].find(sv => {
                    return sv.isShow && sv.selfPropagationId == selfPropagationId;
                })
                if (sv) {
                    return this.extendRemark[questionId][fquestionId].find(er => {
                        return er.catalogueCode == sv.optionKey;
                    })[cQuestionId];
                } else {
                    return []
                }
            }
        },
        getValue: function(uniqueId, selfPropagationId) {
            // if(uniqueId=='511880')//debugger;
            let selectV = this.saveValue[uniqueId] && this.saveValue[uniqueId].find(sv => {
                return sv.isShow && sv.selfPropagationId == selfPropagationId;
            })
            if (selectV) {
                return selectV.optionContent;
            } else {
                return "--"
            }
        },
        checkSelfRadio(node, item) {
            if (this.isTreeDisabled) {
                return;
            }
            item.optionKey = item.catalogueCode;
            item.optionContent = item.catalogueName;
            item.selfPropagationId = node.currNode.selfPropagationId;
            item.paperTemplateId = this.node.currNode.paperTemplateId;
            item.tempQuestionId = this.node.currNode.uniqueId;
            this.tree.$emit('seleteRadio', {
                node: node,
                item: item
            });
            this.isComboOpen[node.currNode.uniqueId + '_' + node.currNode.selfPropagationId] = false;
        },
        initNode(cNode, selfPropagationId) {
            let node = $.extend(true, {}, cNode);
            this.addSelfPropagationId(node, selfPropagationId);
            // this.tree.$emit('setNodeValid', node);
            //that.getValidNode(copyNode, 'add');
            return node;
        },
        /*增加自增长id*/
        addSelfPropagationId: function(node, id) {
            var that = this;
            this.$set(node.currNode, 'selfPropagationId', id);
            //node.currNode.selfPropagationId = id;
            node.currNode.optionList.forEach(op => {
                that.$set(op, 'selfPropagationId', id);
            })
            node.childList.forEach(cd => {
                that.addSelfPropagationId(cd, id);
            })
        },
    },

    watch: {

    }
}

</script>
<style scope>
.jy-score-tb tr.active {
  color: #fff;
  background: #3ED086;
  border-color: #3ED086;
}

</style>
