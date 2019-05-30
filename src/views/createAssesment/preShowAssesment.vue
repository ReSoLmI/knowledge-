<template>
    <div>
       <div class="hd">
           <h3>预览-{{evaluation.evaluationName}} </h3>
           <a class="i-close" @click="closeLayer()"></a>
       </div>
        <div class="bd amp-confirm-scroll topic-layout-rcont" v-show="renderReady&&questionListLen>0" style="border: 1px solid #E5E5E5;margin-top:10px;bottom: 7px;">
            <questionTree :mode='mode' ref="questionTree" :isShowCloseBtn='false' :treeId="evaluation.evaluationId"></questionTree>
        </div>
        <div v-if="renderReady&&questionListLen==0" style="min-height:100px;line-height:100px;text-align:center">
            <div class="no-data">
            <img src="../../image/no-data/no-data-notice.png" />
            <div class="responsive-txt">
                <div class="txt">没有配置评估单数据</div>
            </div>
            </div>
        </div>
  </div>  
</template>
<script>
import common, { ajaxAsync } from '@/util/common.js';
import bus from "@/bus.js"
import questionTree from '@/components/questionTree/questionTree';
import { mapState, mapActions,mapMutations} from 'vuex'
import { getCatalogue } from '@/util/util';

export default {
    name: "evaluationShow",
    data() {
        return {
            questionListLen: 0,
            mode: common.getUrlParam("mode") || 'add',
            evaluationId: common.getUrlParam("evaluationId"),
            type: common.getUrlParam("type"), //Education
            loading: false,
            renderReady: false,
            latestAssessmentId: '',
            catalogue: getCatalogue(),
            evaluation: {},
            evaluationType: common.getUrlParam('evaluationType'),
        }
    },
    async mounted() {
        //debugger;
        this.getData();
        /*this.SET_USERFULWIDTH($('body').width() - 100);*/
        this.SET_USERFULWIDTH(1100);
    },
    methods: {
        ...mapMutations([
            'SET_PAPERSTYLE', 'SET_USERFULWIDTH'
        ]),
        async getData() {
            this.loading = true;
            let url= "knowledge-service/evaluation/paper2/"+this.evaluationId+"/detail";
            // let url= "knowledge-service/evaluation/paper2/"+this.evaluationId+"/paper";
            let obj = {};
            try {
                let evaluation = await ajaxAsync({
                    url: url,
                    dataType: "json",
                    type: "get",
                })
                let questionList = [];
                if (evaluation.constructor == Object) {
                    this.evaluation = Object.freeze(evaluation);
                    this.questionListLen = evaluation.questionList.length;
                    this.freshTreeNode(evaluation);
                }
                this.$nextTick(function() {
                    this.loading = false;
                })
            } catch (e) {
                this.loading = false;
                this.renderReady = true;
            }
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
                //debugger;
                this.SET_PAPERSTYLE(questionList.paperStyle);
                this.$refs.questionTree.initData(questionList);
                this.$nextTick(() => {
                    /*console.log('third:', ':', (performance.now() / 1000).toFixed(2));*/
                    this.renderReady = true;
                })
            })
        },
        closeLayer:function(){
            common.exec_iframe();
        }
    },
    components: {
        'questionTree': questionTree,
    },
}
</script>