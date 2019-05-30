import common, { ajaxAsync } from "@/util/common";
import { getCatalogue } from '@/util/util';
const questionMixin = {
  methods: {
    // 获取模块下所有选中的选项
    getSelectedNode: function(node) {
      if (!node) {
        return;
      }
      this.getValidNode(node, 'add');
    },
    showNodeNames: function(currNode) {
      if(currNode.aliasType == 3) {
        return "";
      }
      return currNode.aliasName || currNode.catalogueName || "";
    },
    getShowNodeUniqeId: function(node) {
      return node.currNode.uniqueId + (node.currNode.selfPropagationId ? ('self' + node.currNode.selfPropagationId) : '');
    },
    isShowNode: function(node) {
      let a = this.showNodeID.includes(this.getShowNodeUniqeId(node)) ||
        (node.currNode.questionType == 40 && this.showNodeID.includes(node.currNode.uniqueId));

      debugger
      let b = (this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].find(sv => {
          return sv.isShow && sv.selfPropagationId == node.currNode.selfPropagationId && !(node.currNode.questionType == 30 && !sv.optionContent);
        })) || (node.currNode.questionType == 200 && node.currNode.templateType == 0) ||
        (node.currNode.questionType == 40 && node.currNode.selfPropagationId) ||
        (node.currNode.questionType == '300' && node.currNode.templateType == 0);;

      var tempHierarchyCode = node.currNode.hierarchyCode + '' + node.currNode.questionId;

      var c = false;
      if ((node.currNode.templateType == 1 || node.currNode.templateType == 3) && this.tempSaveValue && this.tempSaveValue[tempHierarchyCode] && this.tempSaveValue[tempHierarchyCode].length > 0) {
        c = true;
      }

      let d = node.currNode.questionType == 70 && this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].find(sv => {
        return node.childList.find(cl => {
          return sv.uniqueId == cl.currNode.uniqueId && sv.selfPropagationId == cl.currNode.selfPropagationId;
        })
      })

      return a && (b || c || d);
    },
    // 评估记录其他评估项排除内容
    getRemoveQuestion: async function() {
      let tempQuestions = window.sessionStorage.getItem('_removeQuestions');
      var removeQuestions = tempQuestions && JSON.parse(tempQuestions);
      if (!removeQuestions) {
        try {
          removeQuestions = await ajaxAsync({
            url: "enr2.0/assessment/filter/info",
            dataType: "json",
            is_failure: 'first',
            type: "get",
          })
          window.sessionStorage.setItem('_removeQuestions', JSON.stringify(removeQuestions));
        } catch (e) {
          removeQuestions = [];
        }
      }
      let obj = {
        question: [],
        template: []
      }
      removeQuestions.forEach(rq => {
        if (rq.type == 1) {
          obj.question.push(rq.value);
        } else if (rq.type == 2) {
          obj.template.push(rq.value);
        }
      })
      return obj;
    },
    //修改选项赋值 查看页传入treeData
    initSaveValue: function(controlName, treeData) {
      //debugger;
      let that = this;
      that.saveValue = {};
      this.showNodeID = [];
      that.addedOption = [];
      //if (this.pageMode == 'pageShow') {
      this.initData(treeData);
      //}
      if (controlName && controlName.length > 0) {
        controlName.forEach(ct => {
          if (ct.selfAddQuestions == 'addedNode') {
            that.addNodeBySave(ct);
            return;
          }
        })
        controlName.forEach(ct => {
          // 模板
          if (ct.tempHierarchyCode) {
            if (!that.tempSaveValue[ct.tempHierarchyCode]) {
              that.$set(that.tempSaveValue, ct.tempHierarchyCode, []);
            }
            that.tempSaveValue[ct.tempHierarchyCode].push(ct);
            if (this.pageMode !== 'pageShow') {
              if (!that.tempSaveValueComplete[ct.tempHierarchyCode]) {
                that.$set(that.tempSaveValueComplete, ct.tempHierarchyCode, []);
              }
              var selfPropagationId = ct.selfPropagationId || '99999';
              that.tempSaveValueComplete[ct.tempHierarchyCode][selfPropagationId] = true;
            }
            return;
          }
          if (ct.selfAddQuestions == 'addedNode') {
            return;
          }
          let node = that.getNodeByHierarchyCode(ct.hierarchyCode, ct.selfPropagationId);
          if (node) {
            let logic = {};
            node.currNode.optionList.forEach(ol => {
              if (ol.optionId == ct.optionId && ol.questionId == ct.questionId) {
                logic = ol.logicList;
              }
            })

            let obj = $.extend(true, ct, {
              logicList: logic,
              isShow: true
            })
            if (!that.saveValue[node.currNode.uniqueId]) {
              that.$set(that.saveValue, node.currNode.uniqueId, []);
            }
            that.saveValue[node.currNode.uniqueId].push(obj);
          }
        })
        that.treeData.questionList.forEach(data_n => {
          that.getValidNode(data_n, 'init')
        })
      } else {
        that.treeData.questionList.forEach(data_n => {
          that.getValidNode(data_n, 'add')
        })
      }
    },
    /*根据选项删除或增加子节点选中项*/
    findNodeByOption: function(option, node, type) {
      var that = this;
      if (type === 'add' || type === 'addSelf') {
        if (!this.saveValue[option.uniqueId]) {
          this.$set(this.saveValue, option.uniqueId, []);
        }
        if (!option.isShow) {
          option.isShow = true;
        } else {
          if (!this.saveValue[option.uniqueId].find(sv => {
              return sv.optionId == option.optionId && sv.selfPropagationId == option.selfPropagationId;
            })) {
            this.saveValue[option.uniqueId].push(option);
          }
        }
      } else if (type === 'click') {
        this.$set(this.operation, 'node', option);
      }
      //var conclusionList = this.getConclusionList(option, node, type);
      if (type === 'remove') {
        let i = this.saveValue[option.uniqueId].indexOf(option);
        if (Array.isArray(option)) {
          i = this.saveValue[option.uniqueId].indexOf(option[0]);
        }
        this.saveValue[option.uniqueId].splice(i, 1);
        type = 'nextRemove';
      } else if (type === 'nextRemove') {
        option.isShow = false;
      }
      this.loginDeal(option, node, type);
    },
    /*逻辑处理*/
    loginDeal: function(option, node, type, clickLogic) { 
      let that = this;
      let logic = option.logicList;
      if (!logic || logic.length == undefined || logic.length == 0) {
        return;
      }
      logic.forEach(cl => {
        cl.conclusionList.forEach(c => {
          let tranType = (type == 'nextRemove' || type == 'init') ? type : 'add';
          if (cl.generalType == 2) {
            var fatherNode = "";
            // 本题为逻辑题或子节点为控制节点，直接从当前节点往下找被控制节点
            if (cl.uniqueId == node.currNode.uniqueId || node.childList.find(cl => {
                return cl.currNode.questionId == c.relateQuestionId;
              })) {
              fatherNode = node;
            } else {
              fatherNode = that.getNodeByHierarchyCode(cl.hierarchyCode, option.selfPropagationId);
            }
            var nnode = that.findChild(fatherNode, c.relateQuestionId);
            if (!nnode) {
              return;
            }
            if (Array.isArray(nnode)) {
              // 显示
              if (cl.logicType == 1) {
                nnode.forEach(que => {
                  that.getValidNode(que, tranType);
                })
              }
            } else {
              if (cl.logicType == 1) {
                that.getValidNode(nnode, tranType);
                // 添加  type入口控制 只会在操作的时候触发一次
              } else if (cl.logicType == 2) {
                if (type == 'addSelf') {
                  that.addNodeById(nnode, 'show', option.optionId, option.aliasName);
                } else if (type == 'click') {
                  that.addNodeById(nnode, 'add');
                }
              } else if (cl.logicType == 6) {
                if (tranType == 'nextRemove') {
                  that.getValidNode(nnode, tranType);
                  return;
                }

                if (clickLogic != 'clickLogic') {
                  return;
                }
                let con = nnode.currNode.selfPropagationId ? `[uniqueid="${nnode.currNode.uniqueId}"][selfPropagationid="${nnode.currNode.selfPropagationId}"]` : `#${nnode.currNode.uniqueId}`
                that.getValidNode(nnode, tranType);
                that.$nextTick(() => {
                  $(con).css('display','none');
                  setTimeout(function() {
                    $(con).css('display','none');
                    let index = layer.open({
                      type: 1,
                      title:'',// that.showNodeNames(fatherNode.currNode),
                      shade: 0,
                      btn: ['确定'],
                      area: ['800px', ''],
                      shadeClose: true, //点击遮罩关闭
                      content: $(con),
                      yes: function() {
                        that.showNodeID.remove(that.getShowNodeUniqeId(nnode));
                        that.$emit('seleteInput', {
                          'node': node,
                          'item': option,
                          'value': $(con + ` [data-value=true]`).last().val()
                        });
                        layer.close(index);
                      },
                      end:function(){
                        that.showNodeID.remove(that.getShowNodeUniqeId(nnode));
                      }
                    })
                  }, 50)
                })
              }
            }
          } else {
            //TODO 文书逻辑
            let relateNode = that.getNodeByHierarchyCode(c.relateHierarchyCode, option.selfPropagationId);
            if (!relateNode) {
              return;
            }
            if (cl.logicType == 1) {
              that.getValidNode(relateNode, tranType);
              // 添加  type入口控制 只会在操作的时候触发一次
            } else if (cl.logicType == 6) {
              if (tranType == 'nextRemove') {
                that.getValidNode(relateNode, tranType);
                return;
              }
              if (clickLogic != 'clickLogic') {
                return;
              }
              that.getValidNode(relateNode, tranType);
              that.$nextTick(() => {
                let con = relateNode.currNode.selfPropagationId ? `[uniqueid="${relateNode.currNode.uniqueId}"][selfPropagationid="${relateNode.currNode.selfPropagationId}"]` : `#${relateNode.currNode.uniqueId}`
                let index = layer.open({
                  type: 1,
                  title: '',//that.showNodeNames(relateNode.currNode),
                  shade: 0,
                  btn: ['确定'],
                  area: ['1000px', '580px'],
                  shadeClose: true, //点击遮罩关闭
                  content: $(con),
                  yes: function() {
                    that.$emit('seleteInput', {
                      'node': node,
                      'item': option,
                      'value': $(con + ` [data-value=true]`).last().val()
                    });
                    layer.close(index);
                  }
                })
              })
            }
          }
        });
      });
    },

    /*根据节点删除或增加子节点选中项*/
    getValidNode: function(node, type) {
      var that = this;
      if (!node) {
        return
      }
      if (type === 'add' || type === 'init') {
        if (this.showNodeID.indexOf(this.getShowNodeUniqeId(node)) < 0) {
          this.showNodeID.push(this.getShowNodeUniqeId(node));
          setTimeout(function() {  that.addFirstAdded(node); }, 300);
        }
      } else if (type === 'remove' || type === 'nextRemove') {
        this.showNodeID.remove(this.getShowNodeUniqeId(node));
      }
      node.currNode.optionList.forEach(sNode => {
        let svSigle = this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].find(sv => {
          return sv.optionId == sNode.optionId && sv.selfPropagationId == sNode.selfPropagationId;
        })
        if (svSigle) {
          this.findNodeByOption(svSigle, node, type);
          return;
        }
        // 新增时选中默认项
        if (type === 'add' && !(this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].find(sv => {
            return sv.selfPropagationId == node.currNode.selfPropagationId;
          })) && sNode.defaultType == 1) {
          // this.findNodeByOption(this.getQesSvObj(sNode, node, {}), node, type);

          let sNodes = node.currNode.optionList.filter(op=>{
            return op.defaultType == 1;
          })
          sNodes&&sNodes.forEach(sn=>{
            this.findNodeByOption(this.getQesSvObj(sn, node, {}), node, type);
          })

        }
        if (type == 'add') {
          let svObj;
          if (node.currNode.templateType != 1 && node.currNode.questionType == 90 && !(this.mode == 'add' && this.isTreeDisabled)) {
            // if (sNode.timeFormat == 'yyyy-MM-dd hh:mm:ss') {
            //   sNode.timeFormat = 'yyyy-MM-dd hh:mm';
            // }
            svObj = this.getQesSvObj(sNode, node, {
              optionContent: new Date().format(sNode.timeFormat),
              timeFormat: sNode.timeFormat
            });
            this.findNodeByOption(svObj, node, type);
          } else if (node.currNode.templateType == 0 && node.currNode.questionType == '30' && sNode.unitList.length >= 1) {
            svObj = this.getQesSvObj(sNode, node, {
              unit: sNode.unitList[0].unitCode
            });
            this.findNodeByOption(svObj, node, type);
          }
        } else if (this.saveValue[node.currNode.uniqueId] && this.saveValue[node.currNode.uniqueId].length > 0) {
          let q = this.saveValue[node.currNode.uniqueId].find(sv => {
            return sv.selfPropagationId == node.currNode.selfPropagationId
          });
          if (q) {
            this.findNodeByOption(q, node, type);
          }
        }
      })
      node.childList.forEach(function(childNode) {
        if (that.logicNode.indexOf(childNode.currNode.questionId) < 0 || (node.currNode.questionType == '40' && !!node.currNode.selfPropagationId)) {
          //&& (!childNode.currNode.style || childNode.currNode.style.displayType == 1)
          that.getValidNode(childNode, type);
        }
      })
    },
       // 添加题默认添加一个
    addFirstAdded: function(node) {
      if (node.currNode.questionType == '40' && !node.currNode.selfPropagationId) {
        var fnode = this.getFatherNodeById(node.currNode.hierarchyCode);
        if (!fnode) {
          return;
        }
        var tNode;
        if (fnode.constructor === Array) {
          tNode = fnode;
        } else {
          tNode = fnode.childList;
        }
        if (!tNode.find(cl => {
            return cl.currNode.questionId == node.currNode.questionId && cl.currNode.selfPropagationId
          })) {
          node.currNode.optionList.forEach(item => {
            if (item.optionType == 61) {
              this.addNode({
                item: item,
                node: node,
                type: 'add'
              });
            }
          })
        }
      }
    },
    // 根据层级code查找节点
    getNodeByHierarchyCode: function(hierarchyCode, selfPropagationId) {
      let hcodes = hierarchyCode.split('|');
      let hcode = hcodes.shift();
      let node = this.treeData.questionList.find(q => {
        return q.currNode.questionId == hcode && ((q.currNode.questionType == 40 &&
          q.currNode.selfPropagationId == selfPropagationId) || q.currNode.questionType != 40);
      });
      while (hcodes.length > 0) {
        let hcode = hcodes.shift();
        node = node.childList.find(n => {
          return n.currNode.questionId == hcode && ((n.currNode.questionType == 40 &&
            n.currNode.selfPropagationId == selfPropagationId) || n.currNode.questionType != 40);
        })
      }
      return node;
    },
    /*获取非选项项题目saveValue对象*/
    getQesSvObj: function(item, node, obj) {
      obj = obj || {};
      return $.extend({
        selfPropagationId: item.selfPropagationId,
        questionId: item.questionId,
        questionCode: node.currNode.catalogueCode,
        questionId: node.currNode.questionId,
        hierarchyCode: node.currNode.hierarchyCode,
        logicList: item.logicList,
        uniqueId: node.currNode.uniqueId,
        isShow: true,
        switchType: item.switchType,
        optionCode: item.catalogueCode,
        optionKey: item.optionKey,
        optionScore: item.optionScore,
        optionId: item.optionId,
        optionContent: item.optionContent,
        timeFormat: item.timeFormat,
        paperTemplateId: item.paperTemplateId,
        tempQuestionId: item.tempQuestionId //存模板题对应模板题目的uniqueId
      }, obj)
    },
    /*判断题内单个选项是否符合*/
    isOptionSuccess: function(condition, item) {
      return condition.conditionType == 1 && item.questionId == condition.questionId && item.optionId == condition.optionId ||
        ((condition.conditionType == 2 || condition.conditionType == 3) && this.operation && this.operation.node &&
          this.operation.node.questionId == condition.questionId && this.operation.node.optionId == condition.optionId)
    },
    /*判断题内单个选项是否符合，组合逻辑*/
    isConditionSuccess: function(condition_s, node) {
      try {
        function isChildNodeSelete(condition_s, node) {
          if (that.saveValue[node.currNode.uniqueId] && that.saveValue[node.currNode.uniqueId].find(sv => {
              return sv.selfPropagationId == node.currNode.selfPropagationId && this.isOptionSuccess(condition_s, sv)
            })) {
            throw ('success')
          }
          node.childList.forEach(cl => {
            isChildNodeSelete(condition_s, cl);
          })
        }
        isChildNodeSelete();
      } catch (e) {
        return true;
      }
      return false;
    },
    /*判断题内逻辑是否符合*/
    checkQuestionCondition: function(node, item, condition) {
      let that = this;
      if (condition.length == 1) {
        return this.isOptionSuccess(condition[0], item);
      }
      return condition.every(con => {
        return this.isConditionSuccess(con, node);
      })
    },
    // 是否满足条件
    checkConditionSuccess: function(conditions, item, logicScope, node, type) {
      var that = this;
      if (logicScope == 1) {
        return this.checkQuestionCondition(node, item, conditions);
      } else if (logicScope == 2) {
        return conditions.every((con, index) => {
          return this.saveValue[con.uniqueId].find(sv => {
            return con.conditionType == 1 && sv.questionId == con.questionId && sv.optionId == con.optionId &&
              sv.selfPropagationId == node.currNode.selfPropagationId ||
              ((con.conType == 2 || con.conType == 3) && this.operation && this.operation.node &&
                this.operation.node.questionId == con.questionId && that.operation.node.optionId == con.optionId &&
                !(type == 'click' && index < conditions.length - 1))
            // type:click 防止点击+选中的组合逻辑在每次点击时触发
          })
        })
      }
    },
    // 获取符合逻辑的问题
    getConclusionList: function(item, node, type) {
      let logic = item.logicList;
      if (!logic || logic.length == undefined || logic.length == 0) {
        return [];
      }
      var that = this;
      var conclusionList = [];
      logic.forEach(ls => {
        var sigD = [];
        for (let i = 0; i < ls.conditionList.length; i++) {
          let condition = ls.conditionList[i];
          if (condition.joinType == 1) {
            sigD.push(condition);
          } else if (condition.joinType == 2) {
            sigD.push(condition);
            if (that.checkConditionSuccess(sigD, item, ls.logicScope, node, type)) {
              conclusionList.push(ls);
              return;
            }
          } else {
            sigD.push(condition);
            if (that.checkConditionSuccess(sigD, item, ls.logicScope, node, type)) {
              conclusionList.push(ls);
              return;
            }
          }
        }
      })
      return conclusionList;
    },
    // 获取评估项名字(评估记录其他评估项)
    getAssessmentName: async function() {
      let that = this;
      let resultName = "";

      var getName = function(node, isFirst, name) {
        if (!that.isShowNode(node)) {
          return;
        }
        if (!that.saveValue[node.currNode.uniqueId]) {
          that.$set(that.saveValue, node.currNode.uniqueId, []);
        }
        let qName = that.getSentence(node.currNode);
        if (isFirst == 1) {
          resultName += qName ? (qName + ":") : '';
        } else {
          if (!name.find(n => {
              return n == qName;
            })) {

            resultName += (!qName || resultName.slice('-1') == ":" ? '' : ',') + qName
          }
        }

        let optionNameS = [];
        let optionFirst = true;
        node.currNode.optionList.forEach(function(item) {
          let opItem = that.saveValue[node.currNode.uniqueId].find(sv => {
            return sv.uniqueId == node.currNode.uniqueId && sv.optionId == item.optionId &&
              sv.selfPropagationId == node.currNode.selfPropagationId && sv.isShow
          })
          if (opItem) {
            let optionName = "";
            if (node.currNode.questionType == 30 || node.currNode.questionType == 90) {
              optionName = that.getSentence(item, true, opItem);
            } else {
              optionName = that.getSentence(item);
            }
            optionNameS.push(optionName);
            resultName += ((resultName.split(':')[0] + ":" == resultName || !optionName || (optionFirst && isFirst == 1)) ? "" : ',') + optionName;
            optionFirst = false;
            item.hierarchyList && item.hierarchyList.forEach(hc => {
              let cNode = node.childList.find(cl => {
                return cl.currNode.questionId == hc.childQuestionId;
              })

              getName(cNode, isFirst == 1 ? 2 : false, [optionName]);
            })
          }
          if (node.currNode.questionType == '40' && node.currNode.selfPropagationId && item.optionType == 23) {
            resultName += ',' + that.getSentence(item);
          }
        })

        node.childList.forEach(function(cnode, index) {
          if (node.currNode.hierarchyList.find(hc => {
              return hc.childQuestionId == cnode.currNode.questionId
            })) {
            let level = false;
            if (isFirst == 1) {
              level = 2;
            }
            if (node.currNode.questionType == 200 && node.currNode.aliasType != 3 && index == 0) {
              level = 'cluster';
            }
            getName(cnode, level, optionNameS);
          }
        })
      }
      let result = "";
      this.treeData.questionList.forEach(data_n => {
        resultName = "";
        getName(data_n, 1);
        let single = resultName.split(':')[0] + ':' == resultName ? '' : resultName;
        result += (result.length == 0 || !single ? '' : ',') + single;
      })
      return result;
    },

    /*拼接前后缀*/
    getSentence: function(currNode, isContent, item) {
      let sentence = currNode.sentence;
      let nodeName = "";
      if (isContent) {
        let unit = currNode.unitList && currNode.unitList.find(ul => {
          return ul.unitCode == item.unit
        });
        nodeName = item.optionContent + (unit ? unit.unitName : '');
      } else {
        nodeName = this.showNodeNames(currNode);
      }
      if (sentence.displayType == 1) {
        return (sentence.prefixValue || '') + nodeName + (sentence.suffixValue || '');
      } else {
        return '';
      }
    },
    //初始化节点数据 获取所有节点
    getAllNode: function() {
      var that = this;
      this.allNode = [];
      this.treeData.questionList.forEach(qt => {
        that.setNodeInfo(qt);
      })
    },
    /*处理节点数据:性别隐藏、增加模块id、获取所有节点、获取所有逻辑节点*/
    setNodeInfo: function(node) {
      if (Array.isArray(node)) {
        node = node.filter(cnode => {
          return cnode.currNode.sexType !== this.patient.physiSexCode;
        })
        node.forEach(ql => {
          this.setNodeInfo(ql);
        })
        return;
      }
      if (!node.currNode.uniqueId) {
        this.$set(node.currNode, 'uniqueId', node.currNode.questionId);
      }
      node.childList = node.childList.filter(cnode => {
        return cnode.currNode.sexType !== this.patient.physiSexCode;
      })
      var that = this;
      this.allNode.push(node.currNode.questionId);
      node.currNode.optionList.forEach(op => {
        if (!op.logicList) {
          op.logicList = [];
        }
        op.logicList.forEach(ls => {
          var sigD = [];
          for (let i = 0; i < (ls.conclusionList && ls.conclusionList.length); i++) {
            if (that.logicNode.indexOf(ls.conclusionList[i].relateQuestionId) < 0) {
              that.logicNode.push(ls.conclusionList[i].relateQuestionId);
            }
          }
        })
      })
      if (!node.childList) {
        node.childList = [];
      }
      node.childList.forEach(cl => {
        that.setNodeInfo(cl);
      })
    },
    // 根据id查找节点
    getNodeById: function(node, questionId, hierarchyCode, selfPropagationId) {
      var that = this;
      try {
        function getNodePath(node, questionId, hierarchyCode, selfPropagationId) {
          if (node.constructor === Array) {
            node.forEach(childNode => {
              //if (!(hierarchyCode && hierarchyCode.indexOf(childNode.currNode.questionId) < 0)) {
              getNodePath(childNode, questionId, hierarchyCode, selfPropagationId);
              //}
            })
          } else {
            if (node.currNode.questionId == questionId && selfPropagationId == node.currNode.selfPropagationId && hierarchyCode == node.currNode.hierarchyCode) {
              throw (node);
            }
            node.childList.forEach(childNode => {
              //if (!(hierarchyCode && hierarchyCode.indexOf(childNode.currNode.questionId) < 0)) {
              getNodePath(childNode, questionId, hierarchyCode, selfPropagationId)
              //}
            })
          }
        }
        getNodePath(node, questionId, hierarchyCode, selfPropagationId);
      } catch (node) {
        return node;
      }
    },
    /*获取父节点*/
    getFatherNodeById: function(hierarchyCode, selfPropagationId) {
      let hCodes = hierarchyCode.split('|');
      if (hCodes.length == 1) {
        return this.treeData.questionList;
      }
      hCodes.pop();
      let fCodes = hCodes.join('|');
      return this.getNodeByHierarchyCode(fCodes, selfPropagationId);
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
    // 获取最近节点
    getClosestNode: function(node, questionId, hierarchyCode, questionIds, selfPropagationId) {
      let tNode;
      let rNode;
      if (node.constructor === Array) {
        tNode = node;
      } else {
        tNode = node.childList;
      }
      tNode.forEach(t => {
        if (t.currNode.questionId == questionId && t.currNode.selfPropagationId == selfPropagationId) {
          rNode = t;
        }
      })
      if (rNode) {
        return rNode;
      }
      var thisNode = this.getNodeById(node, questionIds, hierarchyCode, selfPropagationId);
      if (thisNode) {
        var ctnode = this.findChild(thisNode, questionId, selfPropagationId);
        if (ctnode) {
          return ctnode;
        }
      }
      let questions = [];
      this.getNodesById(node, questionId, questions);
      if (hierarchyCode == "") {
        hierarchyCode = questionIds;
      }
      return this.findClosestQuestion(questions, hierarchyCode, selfPropagationId);
    },
    findChild: function(node, questionId, selfPropagationId) {
      try {
        var findChildNode = function(node, questionId, selfPropagationId) {
          if (node.currNode.questionId == questionId) {
            throw node;
          }
          node.childList.forEach(cl => {
            findChildNode(cl, questionId, selfPropagationId);
          })
        }
        findChildNode(node, questionId, selfPropagationId);
      } catch (node) {
        return node;
      }
    },

    // 获取符合条件的所有问题
    getNodesById: function(node, questionId, questions, hierarchyCode) {
      // 
      var that = this;
      if (node.constructor === Array) {
        node.forEach(n => {
          that.getNodesById(n, questionId, questions, hierarchyCode);
        })
      } else {
        if (node.currNode.questionId == questionId) {
          //alert('aa'+node.currNode.customizeId+":"+id);
          //if (selfPropagationId == node.currNode.selfPropagationId) {
          if (hierarchyCode !== undefined && node.currNode.hierarchyCode == hierarchyCode) {
            questions.push(node);
          } else {
            questions.push(node);
          }
          //}
        }
        node.childList.forEach(n => {
          that.getNodesById(n, questionId, questions, hierarchyCode);
        })
      }
    },
    //添加保存节点
    addNodeBySave: function(ct) {
      var that = this;
      let questionId = ct.questionId;
      let optionId = ct.optionId;
      let hierarchyCode = ct.hierarchyCode;
      let aliasName = ct.optionContent;
      var temSelfPropagationId = ct.selfPropagationId;
      var qnode;
      // if()
      // this.selfPropagationId = ct.selfPropagationId + 1;
      this.usedSelfId.push(ct.selfPropagationId);
      qnode = that.getNodeByHierarchyCode(ct.hierarchyCode);
      var node = that.getFatherNodeById(ct.hierarchyCode);
      var fNode = that.getFatherNodeById(node.currNode.hierarchyCode);
      var copyNode = $.extend(true, {}, node);
      copyNode.childList = [$.extend(true, {}, qnode)];
      copyNode.currNode.optionList = copyNode.currNode.optionList.filter(ol => {
        return ol.optionType != 61;
      })
      copyNode.currNode.optionList.forEach(op => {
        if (op.optionType == 23) {
          op.aliasName = aliasName;
        }
      })

      var tNode;
      if (fNode.constructor === Array) {
        tNode = fNode;
      } else {
        tNode = fNode.childList;
      }
      ct.parentQuestionId = node.currNode.questionId;
      that.addedOption.push(ct);
      //fNode.childList = node;
      var template;
      var flag = 0;
      //that.addSelfPropagationId(copyNode, temSelfPropagationId);

      for (let i = 0; i < tNode.length; i++) {
        let childNode = tNode[i];
        if (childNode.currNode.questionId == node.currNode.questionId && childNode.currNode.selfPropagationId == undefined) {
          flag = i;
        }
      }
      that.addSelfPropagationId(copyNode, temSelfPropagationId);

      tNode.splice(flag, 0, copyNode);
      let optionIndex = 1;
      tNode.forEach(tn => {
        if (tn.currNode.questionId == copyNode.currNode.questionId && tn.currNode.optionId == copyNode.currNode.optionId && tn.currNode.selfPropagationId) {
          tn.currNode.optionList.forEach(ol => {
            if (ol.optionType == 24) {
              ol.aliasName = optionIndex;
              optionIndex++;
            }
          })
        }
      })
    },
    // 查找最近的节点
    findClosestQuestion: function(questions, hierarchyCode, selfPropagationId) {
      let maxLength = 0;
      var flag = 0;
      var hie;
      var length;
      hierarchyCode = hierarchyCode + "";
      questions.forEach((que, index) => {
        if (que.currNode.selfPropagationId == selfPropagationId) {
          hie = que.currNode.hierarchyCode;
          length = 0;
          for (var i = 0; i < hie.length; i++) {
            if (i == hierarchyCode.length) {
              //length = i-1;
              break;
            }
            if (hie.charAt(i) == hierarchyCode.charAt(i)) {
              length = i;
            }
          }
          if (length > maxLength) {
            maxLength = length;
            flag = index;
          }
        }
      })
      return questions[flag];
    },

  }
}
export default questionMixin
