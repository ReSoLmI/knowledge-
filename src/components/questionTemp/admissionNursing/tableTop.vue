<template>
<div class="chil-bd">
  <div class="config-bd-pd" style="margin:10px 20px 10px 0;" :class="getActiveClass(node)" @click.stop="setClass(node)">
    <div class="num-score-box numsb-before-tb">
      <div class="box-hd" style="font-size: initial">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
        <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
      </div>
    </div>
    <div style="margin-top:-2px;">
      <table class="jy-score-tb jy-normal-tb bg-white" v-show="isShow">
        <tbody>
          <tr v-for="(itemNode,trIndex) in childList">
            <td class="txt-muted">{{itemNode.currNode|showNodeName}}</td>
            <td @click.stop="selectOption(tdItem,itemNode)" :class="[getClass(tdindex,trIndex),isIdSelected(itemNode.currNode,tdItem.optionId)?'active':'']" v-for="(tdItem,tdindex) in itemNode.currNode.optionList">{{tdItem|showNodeName}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <input type="hidden" :value="getScore" data-value='true'>
  </div>
</div>
</template>
<script>
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import templateMix from './templateMix';
// import questionNodeMixin from '@/questionTree/questionNodeMix';
export default {
    data() {
        return {}
    },
    mixins: [questionNodeMixin, templateMix],
    computed: {
        getScore: function() {
            if (this.score == '-') {
                return '';
            }
            let paperTemplateId = this.node.currNode.paperTemplateId;
            if (paperTemplateId == 'BradenQ' || paperTemplateId == 'Braden') {
                if (this.score <= 16) {
                    return "高危";
                } else if (this.score > 16 && this.score <= 21) {
                    return "中危";
                } else if (this.score > 21) {
                    return "低危";
                }
            }else if(paperTemplateId == 'GCS'){
                let result = "";
                if (this.score > 2 && this.score <= 8) {
                    result = "重型 ";
                } else if (this.score > 8 && this.score <= 12) {
                    result = "中型";
                } else if (this.score > 12) {
                    result = "轻型";
                }
                return result +" "+this.score + '分';
            }else{
                return this.score + '分';
            }
        },
    },
    methods: {
        getClass: function(tdIndex, trIndex, isActive) {
            tdIndex = tdIndex + 1;
            if (trIndex == 0) {
                return 'jy-rate-' + tdIndex;
            } else {
                return 'jy-rate-plbtn-' + tdIndex;
            }
        }
    },
    mounted: function() {
        this.$emit('scoreChange', this.score);
    },
    watch: {
        score: function(val) {
            this.$emit('scoreChange', val);
        }
    }
}

</script>
