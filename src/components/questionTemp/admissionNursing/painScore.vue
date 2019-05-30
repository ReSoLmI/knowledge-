
<template>
  <!-- 疼痛评分 -->
  <div class="config-bd-pd" style="margin-bottom:10px;width:780px;padding-right:20px">
    <div class="view-item">
      <div class="label" style="line-height: 30px">{{node.currNode|showNodeName}}</div>
      <div class="control">
        <div
          class="am-ctr-sel w200"
          v-if="mode!='show'"
          :class="{'open':isOpenPop}"
          @click.stop="isOpenPop = true"
          @mouseleave="isOpenPop = false;"
        >
          <a
            class="caption"
            href="javascript:void(0)"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="true"
          >{{getValue}}</a>
          <div class="am-dropdown" v-show="isOpenPop">
            <ul>
              <li v-for="item in node.currNode.optionList" @click.stop="selectOption(item,node)">
                <a>{{item|showNodeName}}</a>
              </li>
            </ul>
          </div>
        </div>
        <template v-for="cel in node.childList">
          <painScoreTool
            v-bind="$props"
            :node="cel"
            :key="cel.currNode.uniqueId"
            v-if="celIsInNode(cel)&&(cel.currNode.paperTemplateId=='FACE'||cel.currNode.paperTemplateId=='VAS')"
            @scoreChange="scoreChange"
          ></painScoreTool>
          <tableTop
            v-bind="$props"
            :node="cel"
            :key="cel.currNode.uniqueId"
            v-if="celIsInNode(cel)&&(cel.currNode.paperTemplateId=='PIPP'||cel.currNode.paperTemplateId=='FLACC')"
            @scoreChange="scoreChange"
          ></tableTop>
        </template>
      </div>
    </div>
    <input type="hidden" :value="getScore" data-value="true">
  </div>
</template>
<script>
import questionNodeMixin from "@/components/questionTree/questionNode/questionNodeMix";
import templateMix from "./templateMix";
import painScoreTool from "@/components/questionTemp/admissionNursing/painScoreTool";
import tableTop from "@/components/questionTemp/admissionNursing/tableTop";
export default {
  data() {
    return {
      isOpenPop: false,
      scoreNum: "-"
    };
  },
  mixins: [questionNodeMixin, templateMix],
  mounted: function() {
    if (this.node.currNode.optionList.length > 0 && !this.getValue) {
      this.selectOption(this.node.currNode.optionList[0], this.node);
    }
  },
  computed: {
    getValue: function() {
      let selectV =
        this.saveValue[this.node.currNode.uniqueId] &&
        this.saveValue[this.node.currNode.uniqueId].find(sv => {
          return (
            sv.isShow &&
            sv.selfPropagationId == this.node.currNode.selfPropagationId
          );
        });
      if (selectV) {
        return this.showNodeNames(
          this.node.currNode.optionList.find(op => {
            return op.optionId == selectV.optionId;
          })
        );
      } else {
        return "";
      }
    },
    getScore: function() {
      let scoreNum = this.scoreNum;
      if (scoreNum == "-") {
        return "";
      }
      let showNode = this.node.childList.find(cel => {
        return this.celIsInNode(cel);
      });
      if (showNode) {
        let paperTemplateId = showNode.currNode.paperTemplateId;
        if (paperTemplateId == "PIPP") {
          if (scoreNum > 12) {
            return "高危";
          } else if (scoreNum <= 12 && scoreNum > 6) {
            return "中危";
          } else {
            return "低危";
          }
        } else {
          if (scoreNum >= 7) {
            return "高危";
          } else if (scoreNum <= 6 && scoreNum >= 4) {
            return "中危";
          } else {
            return "低危";
          }
        }
      }
    }
  },
  methods: {
    celIsInNode: function(node) {
      return this.showNodeID.includes(this.getShowNodeUniqeId(node));
    },

    scoreChange: function(score) {
      this.scoreNum = score;
    }
  },
  components: {
    painScoreTool: painScoreTool,
    tableTop: tableTop
  }
};
</script>
