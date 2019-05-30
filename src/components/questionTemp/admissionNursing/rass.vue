<template>
  <div class="config-bd-pd" style="margin:10px 20px 10px 0;">
    <div class="num-score-box numsb-before-tb">
      <div class="box-hd" style="font-size: initial">{{currNode|showNodeName}}
      </div>
    </div>
    <div style="margin-top:-2px;">
      <table class="jy-score-tb jy-normal-tb bg-white" v-show="isShow">
        <tbody>
          <tr v-for="optionItem in currNode.optionList"  @click.stop="selectOption(optionItem,node)" :class="{'active':isIdSelected(node.currNode,optionItem.optionId)}">
            <td class="txt-muted">{{optionItem.optionScore>0?'+'+optionItem.optionScore:optionItem.optionScore}}</td>
            <td >{{optionItem|showNodeName}}</td>
            <td>{{optionItem.helpContent}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <input type="hidden" :value="getScore" data-value='true'>
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
            let sv = this.saveValue[this.node.currNode.uniqueId]&&this.saveValue[this.node.currNode.uniqueId].find(sv=>{
                return sv.isShow  && sv.selfPropagationId == this.node.currNode.selfPropagationId
            })
            if(sv){
                let score = sv.optionScore;
                if(score>0){
                    score = '+'+score
                }
                return score + '分, '+ this.showNodeNames(this.currNode.optionList.find(op=>{
                    return op.optionId == sv.optionId;
                }));
            }else{
                return ""
            }
        },
    },
    methods: {

    },
    mounted: function() {

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
