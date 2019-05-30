<template>
  <div class="config-bd-pd" style="margin-bottom:10px;font-size:14px;width:760px">
    <div class="num-score-box ">
      <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
        <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
      </div>
      <div class="" v-show="isShow">
        <div>
          <div class="label am-before-tb">
            <div class="control">
              <div class="num-score-box am-mt-20 view-secondary-box" v-for="(item,index) in childList">
                <div class="box-hd">
                  {{item.currNode|showNodeName}}
                </div>
                <div class="view-secondary-bd box-bd">
                  <!-- <div id="am-ctr-group" style="margin-bottom: -10px;">
  <div class="am-ctr-group-item" v-show="mode!='show'" v-for="optionItem in item.currNode.optionList">
    <label class="am-ctr-rdo" :class="{'active':isIdSelected(item.currNode,optionItem.optionId)}">
      <input type="radio" :name="'rdo-0'+index" @click.stop="selectOption(optionItem,item)"><i></i><span class="txt">{{optionItem|showNodeName}}</span></label>
  </div>
</div>
 -->
                  <template v-for="optionItem in item.currNode.optionList" v-show="mode!='show'">
                    <div class="lv-item" @click.stop="selectOption(optionItem,item)">
                      <div class="am-ctr-native-rdo" :class="{'active':isIdSelected(item.currNode,optionItem.optionId)}">
                        <span> {{optionItem|showNodeName}}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input type="hidden" :value="getScore" data-value='true'>
  </div>
</template>
<script>
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import templateMix from './templateMix';
export default {
    data() {
        return {}
    },
    mixins: [questionNodeMixin, templateMix],
    methods: {


    },
    computed: {
        getScore: function() {
            if (this.score == '-') {
                return ''
            }
            if (this.node.currNode.paperTemplateId == 'FALL') {/*跌倒*/
                if (this.score >= 15) {
                    return "高风险";
                } else {
                    return "低风险";
                }
            } else {
                return this.score;
            }

        },
    }
}

</script>
