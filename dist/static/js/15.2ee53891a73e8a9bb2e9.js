webpackJsonp([15],{

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(4)(
  /* script */
  __webpack_require__(247),
  /* template */
  __webpack_require__(262),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 240:
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: C:/Users/zhang/Desktop/knowledge/src/components/questionTree/questionTree.vue: Unexpected token (292:4)\n\n\u001b[0m \u001b[90m 290 | \u001b[39m  mounted\u001b[33m:\u001b[39m \u001b[36mfunction\u001b[39m() {}\u001b[33m,\u001b[39m\n \u001b[90m 291 | \u001b[39m  computed\u001b[33m:\u001b[39m {\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 292 | \u001b[39m    \u001b[33m...\u001b[39mmapState([\u001b[32m\"patient\"\u001b[39m\u001b[33m,\u001b[39m \u001b[32m\"paperStyle\"\u001b[39m])\u001b[33m,\u001b[39m\n \u001b[90m     | \u001b[39m    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 293 | \u001b[39m    hasTreeData\u001b[33m:\u001b[39m \u001b[36mfunction\u001b[39m() {\n \u001b[90m 294 | \u001b[39m      \u001b[36mreturn\u001b[39m (\n \u001b[90m 295 | \u001b[39m        \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mtreeData \u001b[33m&&\u001b[39m\u001b[0m\n");

/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(59)(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"questionTree.vue","sourceRoot":""}]);

// exports


/***/ }),

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(241);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(60)("07fabdbe", content, true);

/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(242)

var Component = __webpack_require__(4)(
  /* script */
  __webpack_require__(240),
  /* template */
  __webpack_require__(246),
  /* scopeId */
  "data-v-95c8a980",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: [_vm.paperStyle.arrangement == 1 ? 'lvh-cont lvh-cont-remove-line' : 'lv-cont'],
    attrs: {
      "id": _vm.treeId
    }
  }, [_c('div', {
    staticClass: "topic-panel-list",
    class: {
      'topic-empty': (_vm.pageFrom == 'tableDataShow' || _vm.hasTreeData || !_vm.isShowCloseBtn) ? false: true
    },
    attrs: {
      "id": "topic-panel-list"
    }
  }, [_vm._l((_vm.treeData.questionList), function(cels, celsIndex) {
    return [(cels.currNode.lineFeed == 1) ? _c('span', {
      attrs: {
        "id": "linedFeed"
      }
    }, [_c('br')]) : _vm._e(), _vm._v(" "), (_vm.pageFrom != 'tableDataShow') ? [_vm._l((cels.childList), function(cel, celIndex) {
      return (cels.currNode.questionType == 300) ? [(cel.currNode.paperTemplateId != 'BOTTOM') ? [_c('questionNode', {
        attrs: {
          "node": cel,
          "showNodeID": _vm.showNodeID,
          "rootNode": cels,
          "nodeIndex": celIndex,
          "isLastNode": (celIndex == (cels.childList.length - 1)) ? true : false,
          "activeQuestion": _vm.activeQuestion,
          "isShowCloseBtn": _vm.isShowCloseBtn,
          "hideNode": _vm.hideNode,
          "styleHierarchy": _vm.styleHierarchy,
          "saveValue": _vm.saveValue,
          "tempSaveValue": _vm.tempSaveValue,
          "units": _vm.units,
          "operationNode": _vm.operation.node,
          "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
          "hasSave": _vm.hasSave,
          "tempSaveValueComplete": _vm.tempSaveValueComplete,
          "addedOption": _vm.addedOption,
          "columnWidth": _vm.columnWidth,
          "isTreeDisabled": _vm.isTreeDisabled,
          "mode": _vm.mode,
          "treeId": _vm.treeId
        }
      })] : _vm._e(), _vm._v(" "), (cel.currNode.paperTemplateId == 'BOTTOM') ? [_c('div', {
        staticClass: "am-legend-ft"
      }, [_c('div', {
        staticStyle: {
          "margin-top": "-20px",
          "position": "relative"
        }
      }, [_vm._l((cel.childList), function(ce, ceIndex) {
        return [_c('questionNode', {
          attrs: {
            "node": ce,
            "showNodeID": _vm.showNodeID,
            "nodeIndex": celIndex,
            "isLastNode": (ceIndex == (cel.childList.length - 1)) ? true : false,
            "rootNode": cel,
            "activeQuestion": _vm.activeQuestion,
            "isShowCloseBtn": _vm.isShowCloseBtn,
            "hideNode": _vm.hideNode,
            "styleHierarchy": _vm.styleHierarchy,
            "saveValue": _vm.saveValue,
            "tempSaveValue": _vm.tempSaveValue,
            "units": _vm.units,
            "operationNode": _vm.operation.node,
            "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
            "hasSave": _vm.hasSave,
            "tempSaveValueComplete": _vm.tempSaveValueComplete,
            "addedOption": _vm.addedOption,
            "columnWidth": _vm.columnWidth,
            "isTreeDisabled": _vm.isTreeDisabled,
            "mode": _vm.mode,
            "treeId": _vm.treeId
          }
        })]
      })], 2)])] : _vm._e()] : _vm._e()
    }), _vm._v(" "), (!_vm.isShowCloseBtn) ? [(!(cels.currNode.questionType == 200 && cels.currNode.aliasType == 3)) ? [(cels.currNode.lineFeed == 1) ? _c('span', {
      attrs: {
        "id": "lineFeed"
      }
    }, [_c('br')]) : _vm._e(), _vm._v(" "), (cels.currNode.questionType != 300) ? _c('questionNode', {
      key: 'tree' + cels.currNode.uniqueId + cels.currNode.selfPropagationId + cels.currNode.questionType,
      ref: "questionNode",
      refInFor: true,
      attrs: {
        "node": cels,
        "rootNode": cels,
        "isLastNode": (celsIndex == (_vm.treeData.questionList.length - 1)) ? true : false,
        "nodeIndex": celsIndex,
        "activeQuestion": _vm.activeQuestion,
        "isShowCloseBtn": _vm.isShowCloseBtn,
        "showNodeID": _vm.showNodeID,
        "hideNode": _vm.hideNode,
        "styleHierarchy": _vm.styleHierarchy,
        "saveValue": _vm.saveValue,
        "tempSaveValue": _vm.tempSaveValue,
        "units": _vm.units,
        "operationNode": _vm.operation.node,
        "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
        "hasSave": _vm.hasSave,
        "tempSaveValueComplete": _vm.tempSaveValueComplete,
        "addedOption": _vm.addedOption,
        "columnWidth": _vm.columnWidth,
        "isTreeDisabled": _vm.isTreeDisabled,
        "mode": _vm.mode,
        "treeId": _vm.treeId
      }
    }) : _vm._e()] : _vm._e(), _vm._v(" "), _vm._l((cels.childList), function(cell, cellIndex) {
      return (cels.currNode.questionType == 200 && cels.currNode.aliasType == 3) ? [(cell.currNode.lineFeed == 1 || cels.currNode.lineFeed == 1) ? _c('span', {
        attrs: {
          "id": "lineFeed"
        }
      }, [_c('br')]) : _vm._e(), _vm._v(" "), (cels.currNode.questionType != 300) ? _c('questionNode', {
        key: 'tree' + cell.currNode.uniqueId + cell.currNode.selfPropagationId + cell.currNode.questionType,
        ref: "questionNode",
        refInFor: true,
        attrs: {
          "node": cell,
          "rootNode": cels,
          "isLastNode": (cellIndex == (cels.childList.length - 1)) ? true : false,
          "nodeIndex": cellIndex,
          "activeQuestion": _vm.activeQuestion,
          "isShowCloseBtn": _vm.isShowCloseBtn,
          "showNodeID": _vm.showNodeID,
          "hideNode": _vm.hideNode,
          "styleHierarchy": _vm.styleHierarchy,
          "saveValue": _vm.saveValue,
          "tempSaveValue": _vm.tempSaveValue,
          "units": _vm.units,
          "operationNode": _vm.operation.node,
          "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
          "hasSave": _vm.hasSave,
          "tempSaveValueComplete": _vm.tempSaveValueComplete,
          "addedOption": _vm.addedOption,
          "columnWidth": _vm.columnWidth,
          "isTreeDisabled": _vm.isTreeDisabled,
          "mode": _vm.mode,
          "treeId": _vm.treeId
        }
      }) : _vm._e()] : _vm._e()
    })] : _vm._e(), _vm._v(" "), (_vm.isShowCloseBtn && cels.currNode.questionType != 300) ? [(cels.currNode.questionType != 300) ? _c('questionNode', {
      key: 'tree' + cels.currNode.uniqueId + cels.currNode.selfPropagationId + cels.currNode.questionType,
      ref: "questionNode",
      refInFor: true,
      attrs: {
        "node": cels,
        "rootNode": cels,
        "isLastNode": (celsIndex == (_vm.treeData.questionList.length - 1)) ? true : false,
        "nodeIndex": celsIndex,
        "activeQuestion": _vm.activeQuestion,
        "isShowCloseBtn": _vm.isShowCloseBtn,
        "showNodeID": _vm.showNodeID,
        "hideNode": _vm.hideNode,
        "styleHierarchy": _vm.styleHierarchy,
        "saveValue": _vm.saveValue,
        "tempSaveValue": _vm.tempSaveValue,
        "units": _vm.units,
        "operationNode": _vm.operation.node,
        "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
        "hasSave": _vm.hasSave,
        "tempSaveValueComplete": _vm.tempSaveValueComplete,
        "addedOption": _vm.addedOption,
        "columnWidth": _vm.columnWidth,
        "isTreeDisabled": _vm.isTreeDisabled,
        "mode": _vm.mode,
        "treeId": _vm.treeId
      }
    }) : _vm._e()] : _vm._e()] : [_c('questionNodeS', {
      key: cels.currNode.uniqueId,
      attrs: {
        "node": cels,
        "pageFrom": _vm.pageFrom,
        "rootNode": cels,
        "activeQuestion": _vm.activeQuestion,
        "showNodeID": _vm.showNodeID,
        "hideNode": _vm.hideNode,
        "styleHierarchy": _vm.styleHierarchy,
        "saveValue": _vm.saveValue,
        "tempSaveValue": _vm.tempSaveValue,
        "units": _vm.units,
        "operationNode": _vm.operation.node,
        "newScoreHierarchyCode": _vm.newScoreHierarchyCode,
        "hasSave": _vm.hasSave,
        "tempSaveValueComplete": _vm.tempSaveValueComplete,
        "addedOption": _vm.addedOption,
        "isShowCloseBtn": _vm.isShowCloseBtn
      }
    })]]
  }), _vm._v(" "), (!_vm.hasTreeData && _vm.pageFrom != 'knowledge') ? _c('div', {
    staticClass: "no-data"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(62)
    }
  }), _vm._v(" "), _vm._m(0)]) : _vm._e()], 2)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "responsive-txt"
  }, [_c('div', {
    staticClass: "txt"
  }, [_vm._v("无评估项")])])
}]}

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_questionTree_questionTree__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_questionTree_questionTree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_questionTree_questionTree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_common_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue__ = __webpack_require__(1);
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
    data() {
        return {
            evaluationId: __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].getUrlParam('assesmentId'),
            layerIndex: 0,
            activeQuestionArr: []
        };
    },
    props: [],
    methods: {
        //通过评估单id获取评估单
        getEvaluationById() {
            let that = this;
            __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].ajax({
                url: 'knowledge-service/evaluation/paper2/' + this.evaluationId + '/detail',
                // url: 'knowledge-service/evaluation/paper2/'+this.evaluationId+'/paper',
                type: 'get',
                async: false,
                callback: function (data) {
                    that.refreshPreShow(data);
                }
            });
        },
        //初始化组件
        initLayer: function (index, activeQuestionArr) {
            this.layerIndex = index;
            this.activeQuestionArr = activeQuestionArr;
            this.getEvaluationById();
            $('.layui-layer-content').scrollTop(0);
            if (activeQuestionArr.length > 0) {
                let id = "#" + activeQuestionArr[0].currNode.uniqueId + (activeQuestionArr[0].currNode.selfPropagationId ? activeQuestionArr[0].currNode.selfPropagationId : '');
                this.$nextTick(() => {
                    let top = this.setHeight($(id)[0]) - 70;
                    $('.layui-layer-content').scrollTop(top);
                });
            }
        },
        //设置高度
        setHeight(obj) {
            var parObj = obj;
            var top = obj.offsetTop;
            while (parObj = parObj.offsetParent) {
                top += parObj.offsetTop;
            }
            return top;
        },
        //关闭
        close: function () {
            layer.close(this.layerIndex);
        },
        //刷新预览
        refreshPreShow(questionList) {
            let that = this;
            __WEBPACK_IMPORTED_MODULE_2_vue__["default"].nextTick(function () {
                that.$refs.questionTree.initData(questionList);
            });
        }
    },
    components: {
        'questionTrees': __WEBPACK_IMPORTED_MODULE_0__components_questionTree_questionTree___default.a
    }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 262:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "bd amp-scroll"
  }, [_c('questionTrees', {
    ref: "questionTree",
    attrs: {
      "mode": "add",
      "initFlag": 'false',
      "activeQuestion": _vm.activeQuestionArr,
      "pageFrom": 'tableDataShow',
      "isShowCloseBtn": 'true'
    }
  })], 1)
},staticRenderFns: []}

/***/ })

});
//# sourceMappingURL=15.2ee53891a73e8a9bb2e9.js.map