<template>
  <div class="config-bd-pd" style="margin-bottom: 10px;margin-right: 20px">
    <div class="num-score-box">
      <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
        <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
      </div>
    </div>
    <div style="margin-top:-2px;">
      <table class="jy-score-tb jy-adlScore-tb bg-white" v-show="isShow">
        <tbody>
          <tr v-for="(itemNode,trIndex) in childList">
            <td class="txt-muted">{{itemNode.currNode|showNodeName}}</td>
            <td @click.stop="selectOption(tdItem,itemNode)" :class="[getClass(tdindex),isIdSelected(itemNode.currNode,tdItem.optionId)?'active':'']" v-for="(tdItem,tdindex) in itemNode.currNode.optionList">{{tdItem|showNodeName}}<span v-show="tdItem.optionScore!=undefined">{{tdItem.optionScore}}分</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <input type="hidden" :value="getScore()" data-value='true'>
  </div>
</template>
<script>
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import templateMix from './templateMix';
export default {
    data() {
        return {
        }
    },
    mixins: [questionNodeMixin,templateMix],
    computed:{
        // /*获取评分*/
        // score:function(){
        //     let saveValues = [];
        //     Object.values(this.saveValue).forEach(ev=>{
        //         saveValues = saveValues.concat(ev);
        //     });
        //     return saveValues.filter(sv=>{
        //         return sv.tempQuestionId == this.currNode.uniqueId&&sv.selfPropagationId == this.currNode.selfPropagationId && sv.isShow;
        //     }).reduce(function(pre,now){
        //         return pre+now.optionScore||0;
        //     },0)
        // }
    },
    methods: {
        /**
         * [getClass 根据索引id，是否选中返回相应的类名]
         * @param  {[type]}  tdIndex  [所在单元格的index索引]
         * @param  {Boolean} isActive [是否选中，是则添加active类，否则不添加]
         * @return {[type]}           [返回类名]
         */
        getClass: function(tdIndex) {
            tdIndex = tdIndex + 1;
            let classa = 'jy-rate-plbtn-' + tdIndex;
            return classa;
        },
        getScore:function(){
            if(this.node.currNode.paperTemplateId == 'NUTRITION_ASSESSMENT'){
                return this.getAssValue();
            }
            return this.score;
        },
        /*营养风险返回值*/
        getAssValue:function(){
            let result = "";
            if(this.score===0){
                return "低风险";
            }else if(this.score>0&&this.score<4){
                return "中风险";
            }else if(this.score>=4){
                return "高风险";
            }
        }
    },
}

</script>
