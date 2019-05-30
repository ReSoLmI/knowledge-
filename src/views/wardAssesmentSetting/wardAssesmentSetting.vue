<template>
<div>
    <menuTemplate :currentPage="currentPage"></menuTemplate>
    <div class="am-page-rcont bg-main">
        <div class="am-condition-top" style="padding: 10px 20px;">
            <span class="am-mr-10">所属项目</span>
            <div class="am-ctr-sel" style="width: 300px;" :class="{'open':isWardOpen}" @click.stop="clickWardOpen()" @mouseleave="isWardOpen=false">
                <a class="caption" >{{wardItem.sysValue}}</a>
                <div class="am-dropdown am-mr-10" >
                    <ul>
                        <li v-for="ward in allWardList" @click.stop="selectWard(ward)" :class="{'active':ward==wardItem?true:false}"><a>{{ward.sysValue}}</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="panel-ws am-mt-20">
            <div class="hd">
                全院通用文书
                <div class="cm-right tips-multiple-menu-cont">
                    <a class="menu-toggle am-btn am-btn-plain-primary" @click.stop="addAssesment()">增加文书<i class="i-ws-angle-green"></i></a>
                </div>
            </div>
            <div class="bd">
                <div class="am-tag-list" style="white-space: normal;">
                    <span class="am-tag" :key="index" v-for="(item, index) in gloablAssesmentArr" @click="changeCdssStatic(item, 'ALL')">
                         {{item.evaluationName}}
                         <i class="i-tag-close" @click.stop="deleteAssesment(item,'global')"></i>
                    </span>
                    
                </div>
            </div>
        </div>
        <div class="panel-ws am-mt-20">
            <div class="hd">
                科室专用
            </div>
            <div class="bd">
                <div class="dot-inner-hd first">未配科室<span class="am-ml-5 am-txt-label"><template v-if="nonConfigWardsArr">{{nonConfigWardsArr.length}}</template></span></div>
                <div class="item-plus-o-list">
                    <div class="item-plus-o" v-for="wardItem in nonConfigWardsArr">{{wardItem.wardName}}<span class="muted-line-txt">|</span>
                        <div class="tips-multiple-menu-cont">
                           <a class="menu-toggle i-plus" @click.stop="configWard(wardItem)">配置</a>
                        </div> 
                    </div>
                </div>
                <div class="dot-inner-hd">已配科室<span class="am-ml-5 am-txt-label">{{configWardsArr.length}}</span></div>
                <table class="am-tb" v-show="totalItems>0">
                    <thead>
                        <tr>
                            <th>科室名称</th>
                            <th>所属项目</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tr :key="i" v-for="(item, i) in configWardsArr">
                        <td>{{item.wardName}}</td>
                        <td>
                            <a class="am-mr-10" :key='index' @click.stop="changeCdssStatic(assesmentItem, 'ONE', item.wardCode)"  v-for="(assesmentItem, index) in item.list">{{assesmentItem.evaluationName}}</a>
                        </td>
                        <td>
                            <div class="tips-multiple-menu-cont">
                                <a @click.stop="editAssesment(item)">编辑<i class="i-ws-angle rotate-180"></i></a>
                                <a @click.stop="deleteAssesment(item)">删除<i class="i-ws-angle rotate-180"></i></a>
                            </div>
                        </td>
                    </tr>
                </table>
                <uib-pagination v-if="totalItems>0" first-text="" next-text="" last-text="" previous-text=""  :total-items="totalItems" v-model="pagination" :max-size="maxSize" class="page" :boundary-links="true" :rotate="false" :items-per-page="perPage"  @change="pageChanged"></uib-pagination>
                <div style="background: #fff" v-if="totalItems==0">
                   <noData content="未配置科室"  ></noData>
                </div>
            </div>
        </div>
    </div>
    <addWardSetting id="addWardSetting_" style="display: none" ref="addWardSetting"></addWardSetting>
    <confirmDelete id="deleteConfirm" style="display:none" :content="'确认删除该问题？'" :layerIndex="layerDelIndex" ></confirmDelete>
    <div v-show="false" id="cdss" style="text-align:center;padding-top:20px;">
      <el-radio v-model="radio" label="1">触发CDSS</el-radio>
      <el-radio v-model="radio" label="0">不触发CDSS</el-radio>

      <div style="margin-top:10px;">
        <a  style="width:100px !important;" class="am-btn am-btn-primary w120" @click="saveCdssStatic()">保存</a>
      </div>
      
    </div>
</div>
</template>

<script>
import menuTemplate from '@/components/menu.vue';
import addWardSetting from './addWardSetting.vue';
import common from '@/util/common.js';
import { getCatalogue } from '@/util/util';
import confirmDelete from '@/components/confirm_delete.vue';
import noData from '@/components/common/noData';
import { Radio } from "element-ui";
Vue.component(Radio.name, Radio);
import Vue from 'vue';
    export default{
        data(){
            return{
              radio: '0',
              currentPage:'wardAssesmentSetting',//评估单科室配置
              isWardOpen:false,//下拉框是否打开
              allWardList:[],//所有科室列表
              wardItem:{},//选中的科室项
              layerDelIndex:0,
              totalItems:0,
              maxSize:5,
              perPage:12,
              pagination: {currentPage:1},
              gloablAssesmentArr:[],//全院通用文书
              nonConfigWardsArr:[],//未配置科室
              configWardsArr:[],//已配科室
              curAssessmentItem: null,
              curCdssStatic: '',
              curWardCode: ''
            }
        },
        mounted(){
            this.getAllHospital();
            this.getAllConfig();
        },
        methods:{
            // 获取当前的CDSS状态
            getCurCdssStatic: function(evaluationType) {
              let that = this;
              let dicItemValue = this.curWardCode ;
              if(this.curCdssStatic === 'ALL') {
                dicItemValue = 'all'   
              }              
              common.ajax({
                url: 'knowledge-service/dictionary/find?evaluationType=' + evaluationType + '&dicItemValue=' + dicItemValue,
                type: 'get',
                callback: function(data) {
                  if(data.configureStatus) {
                    that.radio = data.configureStatus
                  } else {
                    that.radio = '0'
                  }
                }
              });              
            },
            // 保存当前文书的CDSS开关状态
            saveCdssStatic: function() {
              let dicItemValue = this.curWardCode ;
              if(this.curCdssStatic === 'ALL') {
                dicItemValue = 'all'   
              }
              common.ajax({
                url: 'knowledge-service/dictionary/modify?evaluationType=' + this.curAssessmentItem.type + '&dicItemValue=' + dicItemValue + '&openFlag=' + this.radio,
                type: 'get',
                callback: function(data) {
                  common.tip_msg('保存成功')
                  layer.closeAll();                  
                }
              }); 
            },
            // 改变当前文书的cdss状态
            changeCdssStatic: function(assesmentItem, flag, wardCode) {
              if(flag === 'ONE') {
                this.curWardCode = wardCode;
              }
              this.curCdssStatic = flag;
              this.getCurCdssStatic(assesmentItem.type)
              this.curAssessmentItem = assesmentItem;
              // console.log(assesmentItem)
              layer.open({
                type: 1,
                skin: 'layui-layer-demo', //样式类名*/
                closeBtn: 1, //不显示关闭按钮
                anim: 2,
                shadeClose: true, //开启遮罩关闭
                title: 'CDSS开关配置',
                shade: 0.6,
                area: ['500px','150px'], //宽高
                content: $('#cdss'),
                success: function(layero, index){
                },
                end:function(){
                  // layer.msg('保存成功');  
                },
              })              
            },
            //获取所有的配置
            getAllConfig:function(){
                let that=this;
                let data={
                    organCode:this.wardItem.destination.organCode,
                    catalogueRule: getCatalogue(),
                    pageSize:this.perPage,
                    pageNumber:this.pagination.currentPage-1
                };
                common.ajax({
                  url: 'knowledge-service/evaluation/config',
                  type: 'get',
                  data:data,
                  callback: function(data) {
                    that.nonConfigWardsArr=data.wardRes.unassignedWardList;
                    that.configWardsArr=data.wardRes.assignedWardList?data.wardRes.assignedWardList.content:[];
                    that.totalItems=data.wardRes.assignedWardList?data.wardRes.assignedWardList.totalElements:0;
                    that.gloablAssesmentArr=data.organRes?data.organRes.list:[];
                  }
                });
            },
            //新增绑定评估单
            addAssesment:function(){
                this.openInputLayer(this.gloablAssesmentArr,undefined);
            },
            //打开弹出层
            openInputLayer(arrs,wardCode) {
                let that=this;
                layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //样式类名*/
                    closeBtn: 1, //不显示关闭按钮
                    anim: 2,
                    shadeClose: true, //开启遮罩关闭
                    title: '配置单据',
                    shade: 0.6,
                    area: ['500px','300px'], //宽高
                    content: $('#addWardSetting_'), //iframe的url
                    success: function(layero, index)
                    {
                        that.$refs.addWardSetting.initLayer(index,arrs,wardCode,that.wardItem.destination.organCode);
                    },
                    end:function(){
                        that.getAllConfig();
                    },
                });
            },
            //配置科室绑定评估单
            configWard:function(wardItem){
              this.openInputLayer(wardItem.list,wardItem.wardCode);
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
            //选择所属项目
            selectWard:function(ward){
                this.wardItem=ward;
                this.isWardOpen=false;
                this.getAllConfig();
            },
            //点击科室打开下拉框
            clickWardOpen:function(){
                this.isWardOpen=true;
            },
            //分页
            pageChanged: function() {
               this.getAllConfig();
            },
            //编辑评估单
            editAssesment:function(item){
                this.openInputLayer(item.list,item.wardCode);
            },
            //删除绑定评估单
            deleteAssesment:function(item,type){
                let that=this;
                let data={organCode:this.wardItem.destination.organCode,wardCode:item.wardCode};
                if(type=='global'){
                    data.evaluationId=item.evaluationId;
                }
                this.layerDelIndex = layer.open({
                type: 1,
                shift: 5,
                title: '',
                btn: ['确定', '取消'],
                shadeClose: true,
                shade: 0.6,
                closeBtn: 0,
                area: ['460px','200px'],
                content: $('#deleteConfirm'),
                success:function(layero){
                     var btn = layero.find('.layui-layer-btn');
                     btn.css({'padding':'0','margin-top':'-10px'});
                },
                yes: function(index) {
                    common.ajax({
                    url: 'knowledge-service/evaluation/config/delete',
                    type: 'get',
                    data:data,
                    callback: function(data) {
                        that.getAllConfig();
                        layer.close(index);
                        }
                    });
                }
            });
            },

        },
        components: {
            'menuTemplate':menuTemplate,
            'addWardSetting':addWardSetting,
            'confirmDelete': confirmDelete,
            'noData':noData,
        }

    }
</script>