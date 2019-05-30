webpackJsonp([14],{

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

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_level_css__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_level_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_level_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_common_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bus_js__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_questionTree_questionTree__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_questionTree_questionTree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_questionTree_questionTree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_util__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'firstPg',
    data() {
        return {
            currQuestion: null,
            mode: __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].getUrlParam("mode") || 'add',
            questionId: __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].getUrlParam("questionId"),
            type: __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].getUrlParam("type"),
            loading: false,
            renderReady: false,
            catalogue: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util_util__["b" /* getCatalogue */])(),
            evaluation: {},
            evaluationType: __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].getUrlParam('evaluationType')
        };
    },
    async mounted() {
        this.getData();
    },
    computed: {},
    filters: {
        showNodeName: function (currNode) {
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else if (currNode.aliasType == 3) {
                return '';
            } else {
                return currNode.catalogueName;;
            }
        }
    },
    methods: {
        //预览初始化数据
        async getData() {
            this.loading = true;
            let url = "knowledge-service/evaluation/questions/dynamic";
            let obj = {};
            try {
                let question = await __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_common_js__["b" /* ajaxAsync */])({
                    url: url,
                    dataType: "json",
                    type: "get",
                    data: {
                        catalogueRule: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__util_util__["b" /* getCatalogue */])(),
                        questionIds: this.questionId
                    }
                });
                if (question.constructor == Array) {
                    let obj = { 'questionList': question };
                    this.currQuestion = question;
                    this.freshTreeNode(obj);
                }
                this.$nextTick(function () {
                    this.loading = false;
                });
            } catch (e) {
                this.loading = false;
                this.renderReady = true;
            }
        },
        closeLayer: function () {
            __WEBPACK_IMPORTED_MODULE_1__util_common_js__["a" /* default */].exec_iframe();
        },
        /*刷新树结构*/
        freshTreeNode: function (questionList) {
            var that = this;
            this.$nextTick(() => {
                if (!this.$refs.questionTree) {
                    setTimeout(() => {
                        this.freshTreeNode(questionList);
                    }, 10);
                    return;
                }
                this.$refs.questionTree.initData(questionList);
                this.$nextTick(() => {
                    console.log('third:', ':', (performance.now() / 1000).toFixed(2));
                    this.renderReady = true;
                });
            });
        }
    },
    components: {
        'questionTree': __WEBPACK_IMPORTED_MODULE_3__components_questionTree_questionTree___default.a
        // 'loading': loading,
    },
    watch: {}
});

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(4)(
  /* script */
  __webpack_require__(288),
  /* template */
  __webpack_require__(416),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 416:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "am-page-slide"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.currQuestion && _vm.currQuestion.length > 0),
      expression: "currQuestion&&currQuestion.length>0"
    }],
    staticClass: "hd"
  }, [_c('h3', [_vm._v("预览-" + _vm._s(_vm._f("showNodeName")(_vm.currQuestion[0].currNode)))]), _vm._v(" "), _c('a', {
    staticClass: "i-close",
    on: {
      "click": function($event) {
        return _vm.closeLayer()
      }
    }
  })]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.renderReady && _vm.currQuestion),
      expression: "renderReady&&currQuestion"
    }],
    staticClass: "bd amp-confirm-scroll"
  }, [_c('questionTree', {
    ref: "questionTree",
    attrs: {
      "mode": _vm.mode,
      "isShowCloseBtn": false
    }
  })], 1), _vm._v(" "), (_vm.renderReady && !_vm.currQuestion) ? _c('div', {
    staticStyle: {
      "min-height": "100px",
      "line-height": "100px",
      "text-align": "center"
    }
  }, [_vm._m(0)]) : _vm._e()])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "no-data"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(62)
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "responsive-txt"
  }, [_c('div', {
    staticClass: "txt"
  }, [_vm._v("无评估项")])])])
}]}

/***/ }),

/***/ 83:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);

let bus = new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]();
/* harmony default export */ __webpack_exports__["a"] = (bus);

/***/ })

});
//# sourceMappingURL=14.60e2655046d882c98fa8.js.map