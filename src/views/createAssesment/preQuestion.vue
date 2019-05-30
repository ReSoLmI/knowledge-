<template>
  <div class="am-page-slide">
   <div class="hd" v-show="currQuestion&&currQuestion.length>0">
            <h3>预览-{{currQuestion[0].currNode|showNodeName}}</h3>
            <a class="i-close" @click="closeLayer()"></a>
        </div>
    <div class="bd amp-confirm-scroll" v-show="renderReady&&currQuestion">
      <questionTree :mode='mode' ref="questionTree" :isShowCloseBtn='false' ></questionTree>
    </div>
    <div v-if="renderReady&&!currQuestion" style="min-height:100px;line-height:100px;text-align:center">
      <div class="no-data">
        <img src="../../image/no-data/no-data-notice.png" />
        <div class="responsive-txt">
          <div class="txt">无评估项</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/css/level.css';
import common, { ajaxAsync } from '@/util/common.js';
import bus from "@/bus.js"
import questionTree from '@/components/questionTree/questionTree';
import { mapState, mapActions } from 'vuex'
import { getCatalogue } from '@/util/util';
export default {
    name: 'firstPg',
    data() {
        return {
            currQuestion:null,
            mode: common.getUrlParam("mode") || 'add',
            questionId: common.getUrlParam("questionId"),
            type: common.getUrlParam("type"), 
            loading: false,
            renderReady: false,
            catalogue: getCatalogue(),
            evaluation: {},
            evaluationType: common.getUrlParam('evaluationType'),
        }
    },
    async mounted() {
        this.getData();
    },
    computed: {},
    filters: {
        showNodeName: function(currNode) {
            if (currNode.aliasType == 1) {
                return currNode.aliasName;
            } else if (currNode.aliasType == 2) {
                return currNode.catalogueName;
            } else if (currNode.aliasType == 3) {
                return '';
            } else {
                return currNode.catalogueName;;
            }
        },
    },
    methods: {
        //预览初始化数据
        async getData() {
            this.loading = true;
            let url = "knowledge-service/evaluation/questions/dynamic";
            let obj = {};
            try {
                let question = await ajaxAsync({
                    url: url,
                    dataType: "json",
                    type: "get",
                    data: {
                       catalogueRule: getCatalogue(),
                       questionIds: this.questionId
                    },
                })
                if (question.constructor == Array){
                    let obj={'questionList':question};
                    this.currQuestion=question;
                    this.freshTreeNode(obj);
                }
                this.$nextTick(function() {
                    this.loading = false;
                })
            } catch (e) {
                this.loading = false;
                this.renderReady = true;
            }
        },
        closeLayer:function(){
            common.exec_iframe();
        },
        /*刷新树结构*/
        freshTreeNode: function(questionList) {
            var that = this;
            this.$nextTick(() => {
                if (!this.$refs.questionTree) {
                    setTimeout(() => {
                        this.freshTreeNode(questionList);
                    }, 10)
                    return;
                }
                this.$refs.questionTree.initData(questionList);
                this.$nextTick(() => {
                    console.log('third:', ':', (performance.now() / 1000).toFixed(2));
                    this.renderReady = true;
                })
            })
        },
    },
    components: {
        'questionTree': questionTree,
        // 'loading': loading,
    },
    watch: {
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only 
<style src="@/css/firstPg.css" scoped>
</style>
-->
