<template>
<div>
    <menuTemplate></menuTemplate>
    <div class="am-page-rcont">
            <div class="am-page-pd">
                <div class="strip-top-cont">
                    <ul class="strip-top">
                        <li :class="{active:assesmentPage=='createAssesPage'}" @click="assesmentPage='createAssesPage'"><a>创建文书</a></li>
                        <li :class="{active:assesmentPage=='myAssesPage'}" @click="assesmentPage='myAssesPage'"><a>我的文书</a></li>
                    </ul>
                </div>
                <template v-if="assesmentPage=='createAssesPage'">
                <h4 class="h5-top">选择创建文书类型</h4>
                <div class="card-book-cont">
                    <ul class="card-book-list">
                        <li v-for="(item,index) in assesmentClassifyList" @click="createAssesmentItem(item)">
                           <div class="inner">
                               <img :src="item.url"/>
                               <p>{{item.dicItemValue}}</p>
                           </div>
                       </li> 
                    </ul>
                </div>
                </template>
                <template v-else>
                    <div class="am-condition">
                    <div class="am-ctr-sel am-mr-10" :class="{open:isCmbOpen}" @click.stop="isCmbOpen=true" @mouseleave="isCmbOpen=false">
                        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{wardItem.sysValue}}</a>
                        <div class="am-dropdown am-mr-10" v-show="isCmbOpen">
                            <ul>
                             <li v-for="item in allWardList" @click.stop="selectWardItem(item)" :class="{'active':item==wardItem?true:false}"><a>{{item.sysValue}}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="am-ctr-sel am-mr-10" :class="{open:isClassifyOpen}" @click.stop="isClassifyOpen=true" @mouseleave="isClassifyOpen=false">
                        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{assesClassifyItem.dicItemValue}}</a>
                        <div class="am-dropdown am-mr-10" v-show="isClassifyOpen">
                            <ul>
                             <li v-for="item in assesmentClassifyList" @click.stop="selectClissify(item)" :class="{'active':item==assesClassifyItem?true:false}"><a>{{item.dicItemValue}}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="am-search-picker am-mr-10">
                        <input type="text" class="input-text" placeholder="关键词搜索" v-model="keyWords" @input="reservetRefreshAssesment()">
                        <i class="i-search"></i>
                    </div>
                </div>
                <div class="bg-white">
                    <table class="am-tb">
                        <thead>
                            <tr>
                                <th>文书名称</th>
                                <th>所属项目</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tr v-for="item in MyAssesmentList">
                            <td><a>{{item.evaluationName}}</a></td>
                            <td>{{wardItem.sysValue}}</td>
                            <td>{{item.createDate}}</td>
                            <td>
                                <a @click.stop="editAssesment(item)">编辑</a>
                                <a @click.stop="delAssesment(item)">删除</a>
                            </td>
                        </tr>
                        
                    </table>
                </div>
                 <uib-pagination v-if="totalItems>0" first-text="" next-text="" last-text="" previous-text=""  :total-items="totalItems" v-model="paginate" :max-size="maxSize" class="page" :boundary-links="true" :rotate="false" :items-per-page="perPage"  @change="pageChanged"></uib-pagination>
                 <div style="background: #fff">
                    <noData content="没有符合条件的数据" v-if="totalItems==0" ></noData>
                </div> 
                </template>
              
                
            </div>
        </div>
   
    </div>
</template>
<script>
// import temp from '@/components/temp.vue';
import common from '../../util/common.js';
import menu from '../../components/menu.vue';
import  pagination from 'vuejs-uib-pagination';
import noData from '@/components/common/noData';
    export default{
        name:'',
        data (){
            return {
                totalItems:0,
                paginate: { currentPage: 1 },
                maxSize: 5,
                perPage:12,
                assesmentPage:'createAssesPage',
                allWardList:[],
                wardItem:{},
                isCmbOpen:false,

                keyWords:'',//我的文书搜索关键字

                isClassifyOpen:false,//评估单类别是否打开
                assesClassifyItem:{},//选中评估单类别

                assesmentImgArrs:
                [
                    require("../../image/card-book-1.png"),
                    require("../../image/card-book-2.png"),
                    require('../../image/card-book-3.png'),
                    require('../../image/card-book-4.png'),
                    require('../../image/card-book-5.png')
                ],

                assesmentClassifyList:[],
                MyAssesmentList:[],
            }
        },
        methods:{
            createAssesmentItem:function(item){
                let query={dicItemCode:item.dicItemCode,dicItemKey:item.dicItemKey};
                this.$router.push({ path: '/createAssesmentTitle',query:query});
            },
            selectWardItem:function(item){
                this.wardItem=item;
                this.isCmbOpen=false;
                this.reservetRefreshAssesment();
            },
            selectClissify:function(item){
                this.assesClassifyItem=item;
                this.isClassifyOpen=false;
                this.reservetRefreshAssesment();
            },
            getAssesmentClassify:function(){
                let that=this;
                common.ajax({
                  url: 'knowledge-service/dictionary/EVALUATION_LIST_CLASSIFY',
                  type: 'get',
                  callback: function(data) {
                    data.forEach((al,index)=>{
                        let url=that.assesmentImgArrs[0];
                        if(that.assesmentImgArrs.length>index){
                            url=that.assesmentImgArrs[index];
                        }
                        al.url=url;
                    });
                    that.assesmentClassifyList=data;
                  }
                })
            },
            pageChanged:function(){
                this.getMyAssesmentList();
            },
            //用于如果选中的不是第一页，进而查询数据
            reservetRefreshAssesment:function(){
                if(this.paginate.currentPage==1)
                {
                    this.getMyAssesmentList();
                }else{
                     this.paginate.currentPage=1;
                }
            },
            //获取我的评估单
            getMyAssesmentList:function(){
                //debugger;
                let that=this;
                let organCode=this.wardItem.destination.organCode;
                let b=this.assesClassifyItem.dicItemKey;
                let data= {
                    organCode:organCode,
                    evaluationClassify:b,
                    keywords:$.trim(this.keyWords),
                    pageNumber:this.paginate.currentPage-1,
                    pageSize:this.perPage
                };
                common.ajax({
                url:"knowledge-service/evaluation/paper2/myPaperList",
                dataType:"json",
                type:"get",
                data:data,
                callback:function(data){
                    that.MyAssesmentList=data.content;
                    that.totalItems = data.totalElements;
                    }
                });
            },
            //获取所属项目
            getAllHospital(){
                //debugger;
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
            //编辑文书
            editAssesment:function(item){
                let { query } = this.$route;
                Object.assign(query, {
                    assesmentId: item.evaluationId,
                    dicItemKey:item.evaluationClassify
                });
                this.$router.push({path:'/createAssesmentContent',query:query});
            },
            delAssesment:function(item){
                //debugger;
                let that=this;
                common.ajax({
                  url: 'knowledge-service/evaluation/paper/'+item.evaluationId,
                  type: 'delete',
                  dataType:'text',
                  callback: function(data) {
                     that.getMyAssesmentList();
                  }
                })
            },
        },
        mounted(){
            this.getAssesmentClassify();
        },
        watch:{
            assesmentPage:function(val,oldvalue){
                if(val=='myAssesPage'){
                    this.getAllHospital();
                    if(this.assesmentClassifyList.length>0){
                        this.assesClassifyItem=this.assesmentClassifyList[0];
                    }
                    this.getMyAssesmentList();
                }
            }
        },
        components: {
            'menuTemplate':menu,
            'noData':noData,
            // 'temp':temp,
        }
    }
</script>