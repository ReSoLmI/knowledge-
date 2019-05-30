<template>
  <div class="bd">
    <div style="padding: 2px 0;"></div>
    <div class="am-form-item">
      <div class="am-col-5 am-form-label text-left">体温</div>
      <div class="am-col-19">
        <div
          :class="{'panel-topic-seoncdary':true, 'first': index ==0}"
          v-for="(item, index) in templateDate"
          :key="index"
        >
          <div class="panel-hd">{{item.guiName}}</div>
          <div
            :class="{'am-ctr-sel':true, 'w120':true, 'am-mr-10':true, 'open': val.isOpenSelect}"
            @mouseleave="move(val, i, 'templateDate')"
            @click="openSelect(val, i, index, 'templateDate')"
            style="margin-bottom: 4px"
            v-if="item.detail && item.detail.length>0"
            v-for="(val, i) in item.detail"
            :key="i"
          >
            <a
              class="caption caption-lr-data-set"
              href="javascript:void(0)"
              data-toggle="dropdown"
            >{{ val.palWord }}</a>
            <div class="am-dropdown">
              <span class="cancle" @click="cancle(val, i, index)">取消选择</span>
              <el-tree
                ref="tree"
                @node-click="nodeTemplateClick"
                :data="zTree1"
                :check-on-click-node="true"
                :check-strictly="true"
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="am-form-item" v-for="(item, index) in guideData" :key="index">
      <div class="am-col-5 am-form-label text-left">{{ item.guiName }}</div>
      <div class="am-col-19">
        <div
          :class="{'am-ctr-sel':true, 'w120':true, 'am-mr-10':true, 'open': val.isOpenSelect}"
          @mouseleave="move(val, i, 'guideData')"
          @click="openSelect(val, i, index, 'guideData')"
          style="margin-bottom: 4px"
          v-if="item.detail && item.detail.length>0"
          v-for="(val, i) in item.detail"
          :key="i"
        >
          <a
            class="caption caption-lr-data-set"
            href="javascript:void(0)"
            data-toggle="dropdown"
          >{{ val.palWord }}</a>
          <div class="am-dropdown">
            <span class="cancle" @click="cancle(val, i, index)">取消选择</span>
            <el-tree
              ref="tree"
              @node-click="nodeClick"
              :data="zTree2"
              :check-on-click-node="true"
              :check-strictly="true"
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
      </div>
    </div>
    <div @click="save" class="save">保存导入配置</div>
  </div>
</template>

<script>
import Vue from "vue";
import common from "@/util/common.js";
import { Tree } from "element-ui";
Vue.component(Tree.name, Tree);
export default {
  props: ["activeQuestion"],
  data() {
    return {
      evaluationId: common.getUrlParam("assesmentId"),
      parIndex: null,
      sonIndex: null,
      temParIndex: null,
      temSonIndex: null,
      zTree: [],
      zTree1: [],
      zTree2: [],
      questionList: [],
      isCheckBoolean: true,
      defaultProps: {
        children: "optionList",
        label: "showName"
      },
      templateDate: [
        {
          guiName: "腋温",
          detail: [
            {
              itemLocate: 0,
              palWord: "选择腋温类型",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000004
            },
            {
              itemLocate: 1,
              palWord: "选择腋温值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000004
            }
          ]
        },
        {
          guiName: "口温",
          detail: [
            {
              itemLocate: 2,
              palWord: "选择口温类型",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000001
            },
            {
              itemLocate: 3,
              palWord: "选择口温值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000001
            }
          ]
        },
        {
          guiName: "耳温",
          detail: [
            {
              itemLocate: 4,
              palWord: "选择耳温类型",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000002
            },
            {
              itemLocate: 5,
              palWord: "选择耳温值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000002
            }
          ]
        },
        {
          guiName: "肛温",
          detail: [
            {
              itemLocate: 6,
              palWord: "选择肛温类型",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000003
            },
            {
              itemLocate: 7,
              palWord: "选择肛温值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100000,
              vitalKind: 100000003
            }
          ]
        }
      ],
      guideData: [
        {
          guiName: "呼吸",
          detail: [
            {
              itemLocate: 8,
              palWord: "选择呼吸值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100002
            }
          ]
        },
        {
          guiName: "血压",
          detail: [
            {
              itemLocate: 9,
              palWord: "选择收缩压",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100003
            },
            {
              itemLocate: 10,
              palWord: "选择舒张压",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval2",
              uniqueId: 0,
              vitalType: 100003
            }
          ]
        },
        {
          guiName: "脉搏",
          detail: [
            {
              itemLocate: 11,
              palWord: "选择脉搏值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100001
            }
          ]
        },
        {
          guiName: "药物过敏",
          detail: [
            {
              itemLocate: 12,
              palWord: "选择药物名称",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignSval1",
              uniqueId: 0,
              vitalType: 100019
            },
            {
              itemLocate: 13,
              palWord: "选择药物结果",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval2",
              uniqueId: 0,
              vitalType: 100019
            }
          ]
        },
        {
          guiName: "血糖",
          detail: [
            {
              itemLocate: 14,
              palWord: "选择血糖值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100011
            },
            {
              itemLocate: 15,
              palWord: "选择测量时间段",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100011
            }
          ]
        },
        {
          guiName: "疼痛评分",
          detail: [
            {
              itemLocate: 16,
              palWord: "选择评分值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100006
            },
            {
              itemLocate: 17,
              palWord: "选择评分工具",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignSval1",
              uniqueId: 0,
              vitalType: 100006
            }
          ]
        },
        {
          guiName: "大便",
          detail: [
            {
              itemLocate: 18,
              palWord: "选择是否灌肠",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignSval2",
              uniqueId: 0,
              vitalType: 100007
            },
            {
              itemLocate: 19,
              palWord: "选择大便次数",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100007
            },
            {
              itemLocate: 20,
              palWord: "选择灌肠前次数",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval2",
              uniqueId: 0,
              vitalType: 100007
            },
            {
              itemLocate: 21,
              palWord: "选择灌肠后次数",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval3",
              uniqueId: 0,
              vitalType: 100007
            }
          ]
        },
        {
          guiName: "身高",
          detail: [
            {
              itemLocate: 22,
              palWord: "选择身高值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100012
            }
          ]
        },
        {
          guiName: "体重",
          detail: [
            {
              itemLocate: 23,
              palWord: "选择体重值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100013
            }
          ]
        },
        {
          guiName: "心率",
          detail: [
            {
              itemLocate: 24,
              palWord: "选择心率值",
              isOpenSelect: false,
              hierarchyCode: "",
              optionId: 0,
              subType: "vitalSignNval1",
              uniqueId: 0,
              vitalType: 100004
            }
          ]
        }
      ]
    };
  },
  methods: {
    save() {
      let data = {
        evaluationId: this.evaluationId,
        vitalShareItemList: []
      };
      this.saveData(this.guideData, data);
      this.saveData(this.templateDate, data);
      common.ajax({
        url: "knowledge-service/vitalshare/savemap",
        dataType: "json",
        type: "post",
        async: false,
        data: JSON.stringify(data),
        callback: function(res) {
          common.tip_msg("保存成功", 1000);
        }
      });
    },
    saveData(obj, data) {
      obj.forEach((ele, i) => {
        ele.detail.forEach((element, index) => {
          if (element.hierarchyCode) {
            if (element.vitalKind) {
              data.vitalShareItemList.push({
                hierarchyCode: element.hierarchyCode,
                optionId: element.optionId,
                subType: element.subType,
                uniqueId: element.uniqueId,
                vitalType: element.vitalType,
                itemLocate: element.itemLocate,
                optionName: element.palWord,
                vitalKind: element.vitalKind
              });
            } else {
              data.vitalShareItemList.push({
                hierarchyCode: element.hierarchyCode,
                optionId: element.optionId,
                subType: element.subType,
                uniqueId: element.uniqueId,
                vitalType: element.vitalType,
                itemLocate: element.itemLocate,
                optionName: element.palWord
              });
            }
          }
        });
      });
    },
    move(val, i, n) {
      if (n == "templateDate") {
        this.temParIndex = null;
        this.temSonIndex = null;
      } else {
        this.sonIndex = null;
        this.parIndex = null;
      }
      val.isOpenSelect = false;
    },
    openSelect(val, i, index, n) {
      if (n == "templateDate") {
        this.temParIndex = index;
        this.temSonIndex = i;
      } else {
        this.sonIndex = i;
        this.parIndex = index;
      }
      val.isOpenSelect = !val.isOpenSelect;
    },
    cancle(val) {
      val.isOpenSelect = false;
      val.hierarchyCode = "";
      val.optionId = 0;
      val.uniqueId = 0;
      val.palWord = "请选择";
    },
    getQuestionTree() {
      const that = this;
      common.ajax({
        url:
          "knowledge-service/evaluation/paper2/" +
          this.evaluationId +
          "/sketch",
        dataType: "json",
        type: "get",
        async: true,
        callback: function(res) {
          that.questionList = res.questionList;
          that.getQuestionList(that.questionList, that.zTree);
          // element-ui 多次使用zTree时，绑定的数据需要进行区分
          that.zTree1 = that.zTree;
          that.zTree2 = that.zTree;
        }
      });
    },
    nodeClick(data, node, self) {
      if (data.optionList) {
        // common.tip_msg('当前配置请绑定问题选项', 1000)
        return;
      }
      this.guideData[this.parIndex].detail[this.sonIndex].hierarchyCode =
        data.hierarchyCode;
      this.guideData[this.parIndex].detail[this.sonIndex].optionId =
        data.optionId;
      this.guideData[this.parIndex].detail[this.sonIndex].uniqueId =
        data.uniqueId;
      this.guideData[this.parIndex].detail[this.sonIndex].palWord =
        data.showName;
    },
    getQuestionList(questionList, zTree) {
      questionList.forEach((ele, i) => {
        if (ele.childList && ele.childList.length > 0) {
          if (ele.optionList && ele.optionList.length > 0) {
            zTree.push({
              showName: ele.aliasName,
              optionList: ele.optionList
            });
          }
          this.getQuestionList(ele.childList, this.zTree);
        } else {
          if (ele.optionList && ele.optionList.length > 0) {
            zTree.push({
              showName: ele.aliasName,
              optionList: ele.optionList
            });
          }
        }
      });
    },
    getStaticData() {
      const that = this;
      common.ajax({
        url: "knowledge-service/vitalshare/loadmap",
        dataType: "json",
        type: "get",
        async: false,
        data: { evaluationId: this.evaluationId },
        callback: function(res) {
          that.getData(that.templateDate, res);
          that.getData(that.guideData, res);
        }
      });
    },
    getData(data, res) {
      data.forEach((ele, i) => {
        ele.detail.forEach((element, index) => {
          res.forEach((val, n) => {
            if (element.itemLocate == val.itemLocate) {
              element.hierarchyCode = val.hierarchyCode;
              element.optionId = val.optionId;
              element.uniqueId = val.uniqueId;
              element.palWord = val.optionName;
            }
          });
        });
      });
    },
    nodeTemplateClick(data, node, self) {
      if (data.optionList) {
        // common.tip_msg('当前配置请绑定问题选项', 1000)
        return;
      }
      this.templateDate[this.temParIndex].detail[
        this.temSonIndex
      ].hierarchyCode = data.hierarchyCode;
      this.templateDate[this.temParIndex].detail[this.temSonIndex].optionId =
        data.optionId;
      this.templateDate[this.temParIndex].detail[this.temSonIndex].uniqueId =
        data.uniqueId;
      this.templateDate[this.temParIndex].detail[this.temSonIndex].palWord =
        data.showName;
    }
  },
  mounted() {
    this.getQuestionTree();
    this.getStaticData();
  }
};
</script>

<style scoped>
.save {
  font-size: 13px;
  width: 100px;
  background: #009ef9;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.el-tree {
  border: none !important;
  width: 200px;
}
.cancle {
  padding-left: 10px;
  display: inline-block;
}
.cancle:hover {
  width: 100%;
  background: #e5e7f3;
}
.panel-topic-seoncdary {
  padding-top: 15px;
}
.panel-topic-seoncdary > .panel-hd {
  line-height: 30px;
}
.panel-topic-seoncdary.first {
  padding-top: 0;
}
</style>


