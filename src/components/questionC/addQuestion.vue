<template>
    <div>
        <div class="topic-panel-placeholder am-mt-10" style="margin-left:5px;" @click.stop="isShowPop=true" v-show="!isShowPop">
            <a class="btn-topic-placeholder">+问题</a>
        </div>
        <div class="topic-panel-search am-mt-10"  v-show="isShowPop" id="searchDown" >
            <div class="am-search-picker am-mr-10">
                <input type="text" class="input-text" id="input-text-in" placeholder="搜索添加问题" v-model="problems" @click.stop="searchProblems()">
                <i class="i-search"></i>
                <div class="am-dropdown" style="display: block;">
                    <ul class="search-rr-list">
                         <li class="am-flex-item" v-for="(item, index) in problemsResult" :key="index" @click.stop="addQuestion(item)">
                           <div class="am-flex-title">
                              {{item.aliasName}} {{item|showNodeType}}
                          </div>
                           <div class="am-flex-after">
                               {{item.questionRemark}}
                           </div>
                       </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//+问题，用于创建文书列表搜索添加问题
import common from '@/util/common.js';
    export default{
        data(){
            return{
                isShowPop:false,
                problemsResult:[],
                readyQuestion: [],
                problems:''
            }
        },
        filters: {
            //显示节点名称
            showNodeName: function(currNode) {
              if(currNode.aliasType == 3) {
                return ""
              }
              return currNode.aliasName || currNode.catalogueName;
            },
            //根据问题类型显示问题名称
            showNodeType(item){
                if(item.questionType==10||item.questionType==11){
                    return '单选题';
                }else if(item.questionType==20){
                    return '多选题';
                }else if(item.questionType==12){
                    return '开关题';
                }else if(item.questionType==30){
                    return '填空题';
                }else if(item.questionType==90){
                    return '时间题';
                }else if(item.questionType==40){
                    return '添加题';
                }else{
                    return '';
                }
            }
        },
        methods:{
            //搜索问题
            searchProblems: function() {
              var that = this;
              let value = this.problems.trim();
              if (value == "") {
                that.problemsResult = [];
                return;
              }
              this.isShowPop = true;
              common.ajax({
                url: "knowledge-service/evaluation/cluster/search",
                dataType: "json",
                type: "get",
                async: false,
                data: {
                  "requestNum": 10000,
                  "keywords": value
                },
                callback: function(problems) {
                  that.problemsResult = problems;
                }
              });
            },
            //添加问题
            addQuestion: function(question) {
                this.$emit("addQuestion",question.questionId);
                $('#input-text-in').val('');
                this.problemsResult=[];
                this.isShowPop=false;
            },
            //关闭搜索的下拉框
            closePop:function(){
                this.isShowPop=false;
                $('#input-text-in').val('');
                this.problemsResult=[];
            }
        },
        mounted(){

        },
        watch: {
          problems: function() {
            this.searchProblems();
          },
          isShowPop: function(nVal, oVal) {
            console.log(nVal)
          }          
        }
    }
</script>