<template>
   <div class="bd amp-scroll">
        <questionTrees ref="questionTree" mode='add' :initFlag="'false'" :activeQuestion="activeQuestionArr" :pageFrom="'tableDataShow'" :isShowCloseBtn="'true'" ></questionTrees>
    </div>
</template>
<script>
import questionTrees from '@/components/questionTree/questionTree';
import common from '@/util/common.js';
import Vue from 'vue';

export default{
    data(){
        return{
            evaluationId:common.getUrlParam('assesmentId'),
            layerIndex:0,
            activeQuestionArr:[],
        }
    },
    props:[],
    methods:{
        //通过评估单id获取评估单
        getEvaluationById(){
            let that=this;
            common.ajax({
              url: 'knowledge-service/evaluation/paper2/'+this.evaluationId+'/detail',
              // url: 'knowledge-service/evaluation/paper2/'+this.evaluationId+'/paper',
              type: 'get',
              async: false,
              callback: function(data) {
                that.refreshPreShow(data);
                }
            })
        },
        //初始化组件
        initLayer:function(index,activeQuestionArr){
            this.layerIndex=index;
            this.activeQuestionArr=activeQuestionArr;
            this.getEvaluationById();
            $('.layui-layer-content').scrollTop(0);
            if(activeQuestionArr.length>0){
                let id="#"+activeQuestionArr[0].currNode.uniqueId+(activeQuestionArr[0].currNode.selfPropagationId?activeQuestionArr[0].currNode.selfPropagationId:'');
                this.$nextTick(() => {
                    let top=this.setHeight($(id)[0])-70;
                    $('.layui-layer-content').scrollTop(top);
                })
            }
        },
        //设置高度
        setHeight(obj){
            var parObj=obj;
            var top=obj.offsetTop;
            while(parObj=parObj.offsetParent){
                top+=parObj.offsetTop;
            }
            return top;
        },
        //关闭
        close:function(){
            layer.close(this.layerIndex);
        },
        //刷新预览
        refreshPreShow(questionList) {
            let that = this;
            Vue.nextTick(function() {
                that.$refs.questionTree.initData(questionList);
            })
        },
    },
    components:{
        'questionTrees':questionTrees,
    }
}
</script>