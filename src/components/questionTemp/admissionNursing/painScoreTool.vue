<!-- 疼痛评分 -->
<template>
  <div class="view-secondary-box am-mt-10" style="font-size: 14px" :class="getActiveClass(node)" @click.stop="setClass(node)">
    <!-- 1801数字，1802面部,1803语言描述 -->
    <template v-if="currNode&&currNode.paperTemplateId=='VAS'">
      <div class="num-score-box">
        <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
          <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
        </div>
        <div class="box-bd" v-if="isShow">
          <div class="num-slider-cont">
            <div class="lside">无痛</div>
            <div class="inner clearfix">
              <ul class="clearfix">
                <li :style="getStyle(index)" @click.stop="selectPainBar(item,node)" v-for="(item,index) in optionNodeList" :class="{'last':optionNodeList.length-1==index}"><i class="dot"></i></li>
              </ul>
            </div>
            <div class="slider">
              <i :style="{'margin-left': selectBarPercent}" class="sliderBar"></i>
            </div>
            <div class="rside">最痛</div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="currNode&&currNode.paperTemplateId=='NRS'">
      <div class="num-score-box">
        <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
          <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
        </div>
        <div class="view-secondary-bd" v-if="isShow">
          <div class="NRS-panle-cont" style="border:none; border-top: 1px solid #e5e5e5;">
            <ul class="NRS-value-list clearfix">
              <li style="width:9%" :class="{active:isIdSelected(currNode,item.optionId)}" v-for="item in optionNodeList" @click.stop="selectOption(item,node)"><a>{{item|showNodeName}}</a></li>
            </ul>
            <ul class="NRS-title-list clearfix">
              <li>无痛</li>
              <li>轻微疼痛</li>
              <li>轻度疼痛</li>
              <li>中度疼痛</li>
              <li>重度疼痛</li>
              <li>剧烈疼痛</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template v-if="currNode&&currNode.paperTemplateId=='FACE'">
      <div class="num-score-box">
        <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
          <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
        </div>
        <div class="box-bd" v-if="isShow">
          <table class="smiling-face-tb">
            <tr>
              <td v-for="(item,index) in optionNodeList" @click.stop="selectOption(item,node)"><a :title="item|showNodeName" :class="[getFaceClass(item,index),isIdSelected(currNode,item.optionId)?'active':'']"></a></td>
            </tr>
          </table>
        </div>
      </div>
    </template>
    <template v-if="currNode&&currNode.paperTemplateId=='DPIS'">
      <div class="num-score-box">
        <div class="box-hd">{{currNode|showNodeName}}<span class="am-ml-10">{{score}}分</span>
          <a style="float:right" @click="isShow=!isShow" v-show="mode=='show'">详情</a>
        </div>
        <div class="box-bd" v-if="isShow">
          <div class="am-btn-rdo-radius">
            <a v-for="item in optionNodeList" @click.stop="selectOption(item,node)" :class="{active:isIdSelected(currNode,item.optionId)}">{{item|showNodeName}}({{item.optionScore}})</a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import templateMix from './templateMix';
export default {
    data() {
        return {
            optionNodeList: this.node.currNode.optionList,
            selectBarPercent: '',
            optionQuestionId: 0,
            curOpenOption: {},
            isFirstLoad: false,
            painCurNode: {},
            selfPropagationId: '',
        }
    },
    mixins: [questionNodeMixin, templateMix],
    methods: {
        selectPainBar: function(item, node) {
            if (this.mode == 'show') {
                return;
            }
            let percent = (item.optionScore) * 10;
            this.selectBarPercent = percent + '%';
            this.selectOption(item, node);
        },

        getStyle(index) {
            if (index != this.optionNodeList.length - 1) {
                return 'width: 10%';
            } else {
                return '';
            }
        },

        getFaceClass: function(item, index) {
            return ('i-smiling-face-' + index);
        },
    },
    mounted:function(){
      this.$emit('scoreChange',this.score);
    },
    watch:{
    	score:function(val){
    		this.$emit('scoreChange',val);
    	}
    }
}

</script>
