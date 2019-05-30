import bus from '@/bus.js';
const questionNodeMixin = {
  data() {
    return {
      currNode: this.node.currNode,
      minHeight_bd: {
        'min-height': (this.styleHierarchy <= 1 && this.node.currNode.aliasType != 3) ? '30px' : 0
      },
      tree: this.$parent.isTree ? this.$parent : this.$parent.tree,
      subQuestionList:[
        {"name":"请选择子项题型","code":""},
        {"name":"单选题","code":"10"},
        {"name":"多选题","code":"20"},
        {"name":"开关题","code":"12"},
        {"name":"填空题","code":"30"},
        {"name":"下拉题","code":"13"},
        {"name":"时间框","code":"90"}
        ],
    }
  },
  props: ['node', "saveValue", 'mode', 'treeId', 'columnWidth', 'isTreeDisabled', 'showNodeID', 'hideNode', 'styleHierarchy', 'tempSaveValue', 'units', 'operationNode', 'newScoreHierarchyCode', 'hasSave', 'tempSaveValueComplete', 'addedOption', 'fatherHide','activeQuestion','rootNode','pageFrom','isLastNode','nodeIndex','isShowCloseBtn'],
  computed: {
    validCheckType: function() {
      return false; //TODO 校验改版
      let that = this;
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0) {
        this.node.currNode.checkList[0].checkTypeMsg = "";
      }
      let validCType = this.node.currNode.optionList.some(ol => {
        return that.isInSelected(ol.optionId, ol.questionId);
      })
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0 && this.node.currNode.checkList[0].checkType == '1' && !validCType && this.hasSave) {
        this.node.currNode.checkList[0].checkTypeMsg = "该题目为必填项，请选择!";
        return true;
      }
      return false;
    },
    validAddedOption: function() {
      return false;
      let that = this;
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0) {
        this.node.currNode.checkList[0].checkTypeMsg = "";
      }

      let validCType = this.addedOption.find(a => { return a.parentQuestionId == that.node.currNode.questionId });
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0 && this.node.currNode.checkList[0].checkType == '1' && !validCType && this.hasSave) {
        this.node.currNode.checkList[0].checkTypeMsg = "该题目为必填项，请选择!";
        return true;
      }
      return false;
    },
    validCheckTemplate: function() {
      return false;
      let that = this;
      this.node.currNode.checkTypeMsg = '';
      var selfPropagationId = this.node.currNode.selfPropagationId || '99999';
      var hierarchyCode = this.node.currNode.hierarchyCode;
      var tempHierarchyCode = hierarchyCode + '' + this.node.currNode.questionId;
      if (this.hasClickTemplate) {

      }
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0 && this.node.currNode.checkList[0].checkType == '1') {
        if (!this.tempSaveValueComplete || (this.tempSaveValueComplete && !this.tempSaveValueComplete[tempHierarchyCode]) || (this.tempSaveValueComplete && this.tempSaveValueComplete[tempHierarchyCode] && this.tempSaveValueComplete[tempHierarchyCode][selfPropagationId] == undefined)) {
          this.node.currNode.checkTypeMsg = "该题目是必填项，请填写完整!";
          return true;
        }
      }
      if (this.tempSaveValueComplete && this.hasSave && this.tempSaveValueComplete[tempHierarchyCode]) {
        let ss = this.tempSaveValueComplete[tempHierarchyCode][selfPropagationId];
        if (!ss) {
          this.node.currNode.checkTypeMsg = "该题目还没有填写完整，请继续填写!";
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    validTextCheckType: function() {
      return false;
      let validCType = true;
      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0) {
        this.node.currNode.checkList[0].checkTypeMsg = "";
      }
      if (this.node.currNode.questionType == 70) {
        for (let item in this.node.childList) {
          if (!this.getValueUnit(this.node.childList[item].currNode)) {
            validCType = false;
            break;
          }
        }
      } else {
        validCType = this.getValueUnit(this.node.currNode);
      }

      if (this.node.currNode.checkList && this.node.currNode.checkList.length > 0 && this.node.currNode.checkList[0].checkType == '1' && !validCType && this.hasSave) {
        this.node.currNode.checkList[0].checkTypeMsg = "该题目为必填项，请填写!";
        return true;
      }
      return false;
    },
  },
  filters: {
    showNodeName: function(currNode, title) {
      if(currNode.aliasType == 3) {
        return ''
      } else {
        return currNode.aliasName || currNode.catalogueName;
      }
    },
  },
  methods: {
    getShowNodeUniqeId: function(node) {
      return node.currNode.uniqueId + (node.currNode.selfPropagationId ? ('self' + node.currNode.selfPropagationId) : '');
    },
    setClass:function(node){
      debugger
        let len=$('#embabedQuestion').length;
        bus.$emit('closePop');
        if(this.activeQuestion&&this.activeQuestion.currNode){
            let id=this.activeQuestion.currNode.uniqueId?this.activeQuestion.currNode.uniqueId:this.activeQuestion.currNode.questionId;
            if(node.currNode.uniqueId==id||node.currNode.questionId==id){
                return;
            }
        }
        let obj={
            node:node,
        }
        bus.$emit('selectQuestion', obj);
    },
    getActiveClass:function(cel){
        let style='';
        if(this.styleHierarchy>1&&this.hasrelated!=1){
            style+='lv-child ';
        }
        if(this.styleHierarchy==1) {
           style+='lv-parent '
        }
        if(this.hasrelated ==1){
            style+='lv-inner ';
        }
        if(this.node.currNode.questionType==310){
            style+='am-legend-ft';
        }
        if(this.hasrelated!=1){
            style+='lv-node ';
        }
        if(this.isShowCloseBtn){
            style+='topic-panel ';
        }
        if(this.activeQuestion&&this.activeQuestion.currNode){
            if(this.activeQuestion.currNode.uniqueId){
                if(this.activeQuestion.currNode.uniqueId==cel.currNode.uniqueId){
                    style+= 'active';
                }
            }else if(cel.currNode.questionId==this.activeQuestion.currNode.questionId){
                style+= 'active';
            }
        }
        return style;
    },
    /*判断选项是否选中*/
    isIdSelected(currNode, optionId) {
      if (!this.saveValue[currNode.uniqueId]) {
        return false;
      }
      let that = this;
      return this.saveValue[currNode.uniqueId].find(sv => {
        return sv.isShow && sv.optionId == optionId && sv.selfPropagationId == currNode.selfPropagationId;
      })
    },
    /*设置宽度*/
    nodeWidth(width) {
      return 'inherit'
      if (!width) {
        return 20;
      }
      let allWidth = this.userfulWidth - (this.styleHierarchy - 1) * 15;
      debugger
      return width >= 100 ? allWidth : width * allWidth / 100
    },
    /*获取单选、多选的扩展文本框内容*/
    getValueById: function(item, node) {

      if(node.currNode.questionType == 30 && item.blankFiller) {
        return item.blankFiller
      }

      let uniqueId = node.currNode.uniqueId;
      let svl = this.saveValue[uniqueId] && this.saveValue[uniqueId].find(sv => {
        return sv.isShow && sv.optionId == item.optionId && sv.selfPropagationId == node.currNode.selfPropagationId;
      })
      if (svl) {
        return svl.optionContent;
      } else {
        if (node.currNode.questionType == 90) {          
          return ''; //new Date().format(item.timeFormat);
        } else {
          return "";
        }
      }
    },
    /*获取标题名字*/
    showNodeNames: function(currNode) {
      if (!currNode) {
        return "";
      }
      if(currNode.aliasType == 3) {
        return ''
      }
      return currNode.aliasName || currNode.catalogueName;
    },
    /*获取文本框内容*/
    getOptionContent: function(node) {
      node = node || this.node;
      if (!this.saveValue[node.currNode.uniqueId]) {
        return "";
      }
      let result = ""
      node.currNode.optionList.forEach((op, index) => {
        let svl = this.isOptionSelected(op, node.currNode.uniqueId);
        if (svl) {
          let unitName = "";
          if (svl.unit) {
            unitName = op.unitList.find(ul => {
              return ul.unitCode == svl.unit;
            }).unitName;
          }
          result += (result ? ('/' + svl.optionContent || '') : svl.optionContent || '') + unitName;
        }

      })
      return result;
    },
    isNodeShow: function(node) {
      if (!node || !this.showNodeID) {
        return false;
      }
      //  if(node.currNode.uniqueId.indexOf('q1000222')>-1)//debugger;
      return (this.showNodeID.includes(this.getShowNodeUniqeId(node)) || (node.currNode.questionType == 40 && this.showNodeID.includes(node.currNode.uniqueId + ""))) && !this.hideNode.find(hn => {
        return hn.uniqueId == node.currNode.uniqueId && hn.selfPropagationId == node.currNode.selfPropagationId;
      })
    },
        getValueBySelfId: function(option, node, selfPropagationId) {

      // option.selfPropagationId = selfPropagationId;
      // node.currNode.selfPropagationId = selfPropagationId;
      // return this.getValueById(option, node);

      let uniqueId = node.currNode.uniqueId;
      // console.log(uniqueId,selfPropagationId,'333333333333');
      let svl = this.saveValue[uniqueId] && this.saveValue[uniqueId].find(sv => {
        return sv.isShow && sv.optionId == option.optionId && sv.selfPropagationId == selfPropagationId;
      })
      if (svl) {
        return svl.optionContent;
      } else {
        if (node.currNode.questionType == 90) {
          return ''; //new Date().format(item.timeFormat);
        } else {
          return "";
        }
      }
    },
    //获取关联节点
    getRelatedNode: function(id) {
      return this.node.childList.find(childNode => {
        return childNode.currNode.questionId == id;
      });
    },
    getKey:function(id){
        let childNode= this.node.childList.find(childNode => {
            return childNode.currNode.questionId == id;
        });
        if(childNode.currNode){
            return 'node'+childNode.currNode.uniqueId+childNode.currNode.selfPropagationId+childNode.currNode.questionType;
        }
    },
    /*单位是否被选中*/
    isUnitCodeSel: function(currNode, option, unitCode) { //
      if (!this.saveValue[currNode.uniqueId]) {
        return;
      }
      return this.saveValue[currNode.uniqueId].find(sv => {
        return sv.isShow && sv.unit == unitCode && currNode.selfPropagationId == sv.selfPropagationId && sv.optionId == option.optionId
      })
    },
    isOptionSelected: function(option, uniqueId) {
      if (!this.saveValue[uniqueId]) {
        return false;
      }
      return this.saveValue[uniqueId].find(sv => {
        return sv.isShow && sv.optionId == option.optionId && sv.selfPropagationId == option.selfPropagationId
      })
    },
    /*最大长度*/
    getMaxLength(item) {
      let maxLength = item.style && item.style.maxLength;
      if (item.checkList && item.checkList.inputType == '3') {
        maxLength = (item.checkList.scopeList.length > 0 && item.checkList.scopeList[0].scope) || 100;
      }
      maxLength = maxLength || 100;
      return maxLength
    }

  }
}

export default questionNodeMixin
