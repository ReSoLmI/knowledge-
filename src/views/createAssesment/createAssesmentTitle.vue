<template>
<div>
    <menuTemplate ref="leftmenu" :currentPage="Page"></menuTemplate>
    <div class="am-page-rcont" ref="wrap">
      <div class="am-page-pd">
          <div class="book-top-cont">
              <div class="book-top-return">
                <a class="txt-return" @click="returnBack()">返回</a>
                <div class="h5">创建{{pageType|convertPageType}}</div>
              </div>
              <div class="step-list-cont">
                <ul class="step-list">
                    <li class="cur">
                        <i class="num">1</i><span class="txt">新建或选择模版</span>
                    </li>
                    <li>
                        <i class="num">2</i><span class="txt">文书样式</span>
                    </li>                    
                    <li>
                        <i class="num">3</i><span class="txt">配置文书内容</span>
                    </li>
                    <li>
                        <i class="num">4</i><span class="txt">列表设置</span>
                    </li>
                    <li>
                        <i class="num">5</i><span class="txt">科室设置</span>
                    </li>
                </ul>
              </div>
          </div>
          <div class="book-timeline">
              <div class="even">
                  <i class="i-timeline-dot"></i>
                  <h5>所属项目</h5>
                  <div  class="am-ctr-sel w200 " :class="{'open':isWardOpen}" @click.stop="isWardOpen=true" @mouseleave="isWardOpen=false"><!--测试环境这一个下拉框-->
                      <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{wardItem.sysValue}}</a> <!--下拉框默认的字--->
                      <div class="am-dropdown am-mr-10" v-show="isWardOpen" > 
                          <ul> <!--下拉框里的内容循环---->
                              <li v-for="ward in allWardList" @click.stop="selectWard(ward)" :class="{'active':ward==wardItem?true:false}"><a>{{ward.sysValue}}</a></li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div class="even">
                  <i class="i-timeline-dot"></i>
                  <h5>评估单据类型</h5>
                  <div class="am-ctr-sel w200" :class="{'open':isEvaluationTypeOpen}" @click.stop="isEvaluationTypeOpen=true" @mouseleave="isEvaluationTypeOpen=false">
                      <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{selectEvaluationType.evaluationName}}</a> <!---请选择类型这个下拉框---->
                      <div class="am-dropdown am-mr-10" v-show="isEvaluationTypeOpen"> 
                          <ul>
                              <li v-for="type in evaluationTypeList" @click.stop="selectEvaluation(type)" :class="{'active':type==selectEvaluationType?true:false}"><a>{{type.evaluationName}}</a> </li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div class="even even-last">
                  <i class="i-timeline-dot"></i>
                  <h5>创建新文书</h5>
                  <div class="panel-h-step">
                      <div class="hd">创建<br/>新文书</div>
                      <div class="bd-txt"><span class="am-mr-10">评估单标题</span><input @blur="checkTypeName"   type="text" class="input-text am-mr-10" style="width: 300px;" v-model="evaluationName"/>
                        <a class="am-btn am-btn-primary" @click="create()">创建</a>
                      </div>
                  </div>
                  <div class="panel-h-step am-mt-10">
                      <div class="hd">引用<br/>文书模版</div>
                      <div class="bd">
                          <ul class="list-inner">
                              <li class="am-flex-item" v-for="(item, index) in paperList" :key="index">
                                  <a class="am-flex-title" @click.stop="copyEvalutionTemplate(item)">{{item.evaluationName}}</a> 
                                  <div class="am-flex-after">
                                      <span class="am-ml-10">{{item.sysValue}}</span> 
                                      <span class="am-ml-10">{{item.operationName}}</span>
                                      <span class="am-ml-10">{{item.createDate|filterDate}}</span> 
                                      <a class="am-ml-10" @click="showAssesment(item)">预览</a>
                                  </div>
                              </li>
                              <mugen-scroll :handler="fetchData" :should-handle="!loading"  scroll-container="wrap" >
                              </mugen-scroll>
                          </ul> 
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
</div>
</template>
<script>
import common from '../../util/common.js';
import menuTemplate from '../../components/menu.vue';
import MugenScroll from 'vue-mugen-scroll';
import { getCatalogue } from '@/util/util';
import "@/css/pagination.css";
    export default{
        data(){
            return{
                Page:'createAssesmentTitle',
                pageType:common.getUrlParam("dicItemKey"), 
                paperList:[],
                evaluationName:'',//评估单名称

                evaluationTypeList:[], //评估单类型数组 第二个下拉框数组
                selectEvaluationType:{},//选中的评估单类型 第二个的显示值
                isEvaluationTypeOpen:false,//第二个点击是否打开下拉框

                perPage:15, 
                currentPage: 1, 
                loading:true, // vue-mugen-scroll插件下拉刷新的开关

                allWardList:[], // 第一个下拉框数组
                isWardOpen:false, // 第一个下拉内容的显示
                wardItem:{}, // 第一个下拉框中的显示值
                paperNameList: [],
                isRepeat: false,
            }
        },
        filters:{
            convertPageType:function(pageType){
                if(pageType==1){
                    return "评估单据";
                }else if(pageType==2){
                    return "会诊单据";
                }else if(pageType==3){
                    return '告知书单据';
                }
            },
            filterDate:function(time){
                return (new Date(time)).format("yyyy-MM-dd hh:mm");
            },
        },
        methods: {
            checkTypeName: function() {
              this.isRepeat = false;
              if(this.paperNameList && this.paperNameList.length > 0) {
                this.paperNameList.forEach((ele) => {
                  if(ele == this.evaluationName) {
                    common.tip_msg('当前名称被占用');
                    this.evaluationName = '';
                    this.isRepeat = true;
                  }
                })
              }
            },
            //返回
            returnBack:function(){
                this.$router.push({path:'/'});   // 返回到根目录
            },
            //自动加载提取数据
            fetchData:function(){
              this.loading = true; 
              this.getPaperList(); 
              this.currentPage++;
              this.loading=false;
            },
            //选择所属项目 第一个下拉框的点击
            selectWard:function(ward){ // 选择所属项目 然后 变色
                this.wardItem=ward; // 下拉框显示的字 改变
                this.isWardOpen=false; // 下拉框消失
                this.refreshData(); // 下面的文书模板随之改变
            },
            //选择评估单类型 第二个下拉框的点击
            selectEvaluation:function(evaluationType){ // 展示的下拉框点击的时候
                this.selectEvaluationType=evaluationType;
                this.isEvaluationTypeOpen=false;
                this.refreshData(); // 下面的文书模板随之改变
            },
            refreshData(){
                this.loading = true;
                this.paperList=[];
                this.currentPage=1;
                this.getPaperList();
                this.currentPage++;
                this.loading=false;
            },
            //引用复制文书模板
            copyEvalutionTemplate:function(item){
                let that=this;
                common.ajax({
                url:"knowledge-service/evaluation/paper2/"+item.evaluationId,
                dataType:"json",
                type:"post",
                callback:function(data){
                    let { query } = that.$route;
                    Object.assign(query, { 
                        assesmentId: data,
                    });
                    if(that.pageType==3){
                        that.$router.push({path:'/createNotification',query:query});
                    }else{
                        that.$router.push({path:'/createAssesmentContent',query:query});
                    }
                  }
                });
            },
            /*创建文书*/
            create:function(){
                // this.checkTypeName();
                if(this.isRepeat) { return; }
                if(!this.selectEvaluationType||(this.selectEvaluationType&&!this.selectEvaluationType.subClass)){
                    common.tip_msg("请先选择评估单类型", 1000);
                    return;
                }
                if(!this.evaluationName){
                    common.tip_msg("请先创建评估单名称", 1000);
                }
                if(!this.wardItem||(this.wardItem&&!this.wardItem.destination)){
                    return;
                }
                let that=this;
                let obj={
                    catalogueRule:getCatalogue(),
                    evaluationListName:this.evaluationName,
                    evaluationListClassify:this.pageType,
                    subClass:this.selectEvaluationType.subClass,
                    organCode:this.wardItem.destination.organCode,
                }
                common.ajax({
                  url: 'knowledge-service/evaluation/paper2',
                  type: 'post',
                  data: JSON.stringify(obj),
                  callback: function(data) {
                    let { query } = that.$route;
                    query.evaluationName = that.evaluationName;
                    Object.assign(query, {
                        assesmentId: data,
                    })
                    if(that.pageType==3){ 
                        that.$router.push({path:'/createNotification',query:query});
                    }else{
                        that.$router.push({path:'/styleSetting',query:query});
                    }
                  }
                });
            },
            //获取文书列表
            getPaperList(){
              let that=this;
              let param={'pageNumber':this.currentPage-1,
                'pageSize':this.perPage,
                'evaluationClassify':this.pageType,
                'subClass':this.selectEvaluationType.subClass,
                'organCode':(this.wardItem&&this.wardItem.destination.organCode)?this.wardItem.destination.organCode:undefined};
              common.ajax({
                url:"knowledge-service/evaluation/paper2/list",
                dataType:"json",
                type:"get",
                async:true,
                data:param, // 是告诉我们需要获取哪些内容吗？
                callback:function(data){
                  that.paperList= that.paperList.concat(data.content);
                }
              });
            },
            // 获取所有文书名称
            getPaperName() {
              let that=this;
              let param={
                'pageNumber': 0,
                'pageSize': 10000,
                'evaluationClassify':this.pageType,
                'subClass':this.selectEvaluationType.subClass,
                'organCode':(this.wardItem&&this.wardItem.destination.organCode)?this.wardItem.destination.organCode:undefined};
              common.ajax({
                url: "knowledge-service/evaluation/paper2/list",
                dataType: "json",
                type: "get",
                async: false,
                data: param,
                callback:function(data){
                  if(data.content && data.content.length > 0) {
                    data.content.forEach(element => {
                      that.paperNameList.push(element.evaluationName)
                    });
                  }
                }
              });              
            },
            //获取所属项目
            getAllHospital(){
              let that=this;
              common.ajax({
              url:"knowledge-service/evaluation/paper2/sysvalues",
              dataType:"json",
              type:"post",
              async:false,
              data:{},
              callback:function(data){
                that.allWardList=data;
                if(data.length>0){
                  that.wardItem=data[0];
                }}
              });
            },
            //获取评估单据类型
            getAssesmentType(){
                let that=this;
                common.ajax({
                url:"knowledge-service/evaluation/paper2/evaluationTypeList",
                dataType:"json",
                type:"get",
                async:false,
                data:{evaluationClassify:this.pageType},
                callback:function(data){
                    that.evaluationTypeList=data; // 第二个下拉框
                    that.evaluationTypeList.splice(0,0,{evaluationName:'请选择类型',subClass:undefined}); // 下拉框的第一行添加
                    that.selectEvaluationType=that.evaluationTypeList[0];// 第二个下拉框的显示内容是下拉框内容的第一个
                    }
                });
            },
            /*预览评估单*/
            showAssesment(item){ // 点击浏览触发事件
                $(".ui-sys-bar").css("display","none");
                layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 0, //不显示关闭按钮
                    shadeClose: true,
                    shade: 0.6,
                    area: ['770px', '100%'],
                    offset: 'rb', //右下角弹出
                    anim: 2,
                    content: ['/#/preShowAssesment?evaluationId=' + item.evaluationId], //iframe的url，no代表不显示滚动条
                    end: function() { //此处用于演示
                        $(".ui-sys-bar").css("display","block");
                    }
                });
            },
        },
        mounted(){
            this.getAllHospital(); //获取所属项目
            this.getAssesmentType(); //获取评估单据类型
            this.refreshData();
            this.getPaperName();
        },
        components:{
           'menuTemplate':menuTemplate,
           MugenScroll,
        }
    }
</script>
