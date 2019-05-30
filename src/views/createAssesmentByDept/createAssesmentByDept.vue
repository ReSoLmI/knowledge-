<template>
  <div>
    <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
      <div class="am-page-rcont">
            <div class="am-page-pd">
                <div class="book-top-cont">
                    <div class="book-top-return">
                        <a class="txt-return" @click.stop="returnBack()">返回</a>
                        <div class="h5">
                            <template v-if="!isEditAssesmentName">{{evaluationName}}
                                <i class="i-link-upd am-ml-5" style="margin-top: -2px;"  @click.stop="clickEditAssesment"></i>
                            </template>
                            <template v-if="isEditAssesmentName" >
                                <input type="text" class="input-text w180" v-model="evaluationName" id="inputAssesment" @blur="editAssesmentName()"/>
                                <a @click.stop="editAssesmentName()" >保存</a>
                            </template>
                        </div>
                    </div>
                    <div class="step-list-cont">
                        <ul class="step-list">
                            <li class="active">
                                <i class="num">1</i><span class="txt">新建或选择模版</span>
                            </li>
                            <li class="active">
                                <i class="num">2</i><span class="txt">文书样式</span>
                            </li>                            
                            <li class="active">
                                <i class="num">3</i><span class="txt">配置文书内容</span>
                            </li>
                            <li class="active">
                                <i class="num">4</i><span class="txt">列表设置</span>
                            </li>
                            <li class="cur">
                                <i class="num">5</i><span class="txt">科室设置</span>
                            </li>
                            <li class="active">
                                <i class="num">6</i><span class="txt">编辑域设置</span>
                            </li>                            
                        </ul>

                        <div class="right" v-show="!isSkip">
                            <a class="am-btn am-btn-info am-ml-10" @click.stop="clearAllWardCode()">清空设置</a>
                            <a class="am-btn am-btn-info am-ml-10" @click.stop="clickSkip()">下一步</a>
                        </div>                        
                    </div>
                </div>
                <div class="fixed-contain-midden" v-if="isSkip">
                    <div class="item-midden">
                        <p>如果此单据在所有科室录入和展示内容都一致，请跳过此步。</p>
                        <div style="margin-bottom:10px;"><a @click.stop="changeAssesmentStatus">开始设置</a></div>
                        <p @click.stop="clickSkip()"><a class="am-btn am-btn-info" >确认跳过</a></p>
                    </div>
                </div>
                <div class="department-index-menu" v-else>
                    <div class="lside">
                        <ul class="strip-half">
                            <li @click.stop="filterDept(1)" :class="{'active':isAll==1?true:false}">全部<span class="am-ml-5 am-txt-label">{{allWardCount}}</span></li>
                            <li  @click.stop="filterDept(0)" :class="{'active':isAll==0?true:false}">未配置<span class="am-ml-5 am-txt-label">{{noneConfigWardCount}}</span></li>
                        </ul>
                        <div class="am-search-picker">
                            <input type="text" class="input-text" v-model='searchInput' @input="searchWard($event)"/>
                            <i class="i-search"></i>
                        </div>
                        <div class="dl-index-cont">
                            <dl class="dl-index " v-for="(item,index) in wardList" :class="{'first':index==0?true:false}">
                                <dt>{{item.clissify}}</dt>
                                <dd :class="{'active':ward==selectWard}" v-for="ward in item.arrs" @click.stop="choseWard(ward)">
                                <div class="txt">
                                  {{ward.wardName}}<span class="span-auxiliary span-auxiliary-danger" v-show="noneConfigFlag(ward)">未配置</span>
                                </div>
                                </dd>
                           </dl>
                        </div>
                    </div>
                    <div class="rcont">
                        <div class="hd">{{selectWard.wardName}}
                            <div class="right">
                                <!-- <a class="am-btn am-btn-plain-info am-ml-10" @click="clearCurWard">清空当前科室设置</a> -->
                                <a class="am-btn am-btn-info am-ml-10" @click="saveConfig">保存</a>
                            </div>
                        </div>
                        <div class="collapse-item-list">
                            <div class="collapse-item" v-for="item in questionList">
                             <div class="hd"> <!--  -->
                                    <div class="am-ctr-native-chk"  :class="[getClassC(item,'uniqId')]" @click.stop="setAll(item,'uniqId',$event)"><span>{{item.currNode.text}}</span></div>
                                    <div class="am-ctr-native-star"  :class="[getClassC(item,'fix')]" @click.stop="setAll(item,'fix',$event)"><span>设为固定项</span></div>
                                    <i class="i-collapse-angle"></i>
                                </div>
                                <div class="bd" style="display: block;">
                                    <div class="department-option-list">
                                    <template v-for="childItem in item.childList">  
                                        <span :class="[getChildClass(childItem,'uniqId')]" @click.stop="addUniqueId(childItem,$event,item)">{{childItem.currNode.text}}
                                        <i class="department-option-border"  ></i>
                                        <i class="i-star" :class="[getChildClass(childItem,'fix')]" @click.stop="addFix(childItem,$event,item)"></i></span>
                                    </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>  
</template>
<script>
import menu from '../../components/menu.vue';
import Bus from '@/bus.js';
import Vue from 'vue';
import common from '@/util/common.js';
    export default{
        data(){
            return{
                wardList:[],//科室数组
                wardList_copy:[],
                organCode:common.getUrlParam('organCode')||common.getOrganCode(),
                currentPage:'createAssesmentByDept',
                evaluationId:common.getUrlParam('assesmentId'),
                selectWard:{},
                allWardCount:0,
                noneConfigWardCount:0,
                isSkip:false,             
                searchInput:'',
                isAll:1,
                questionList:[],
                wardConfigArrs:[],
                evaluationName: '',
                isEditAssesmentName:false,
            }
        },
        methods:{
            // 清除当前可是动态列表设置
            clearCurWard: function() {
              let that = this;
              let text = '是否清空当前科室设置？'
              const confirmBox = layer.confirm(text, {
                btn: ['是','否'] 
              },function(){
                that.clearWardCode(that.selectWard.wardCode);
                that.getDynasicAssesment();
              });
            },
            clearAllWardCode: function(wardCode) {
              let that = this;
              let text = '是否清空全部科室设置？'
              const confirmBox = layer.confirm(text, {
                btn: ['是','否'] 
              },function(){
                that.clearWardCode(wardCode)
              });
            },
            // 清除全部动态科室列表设置
            clearWardCode: function(wardCode) {
              const that = this;
              let param = {
                'evaluationId': this.evaluationId,
                'type': 3,
              }              
              if(wardCode) {
                param.wardCode = wardCode
              }
              common.ajax({
                url: 'knowledge-service/evaluation/paper2/reset',
                type: 'get',
                data: param,  
                callback: function() {
                  if(wardCode) {
                    common.tip_msg('当前科室设置清空设置成功', 1000);
                    return; 
                  }
                  common.tip_msg('清空设置成功', 1000) 
                  that.isSkip = true;
                  that.$route.query.dynamic = 0;
                }         
              })      
            },
            //跳过设置
            clickSkip:function(){            
              let { query } = this.$route;              
              this.$router.push({ path: '/createAssessmentReactArea', query:query});
            },
            //更改动态文书状态
            changeAssesmentStatus:function(flag){
                let that = this;
                let text = '是否设置为动态列表？'
                const confirmBox = layer.confirm(text, {
                  btn: ['是','否'] //按钮
                },function(){
                  common.ajax({
                    url: 'knowledge-service/dynamic/evaluation/update/dynamicFlag',
                    type: 'get',
                    data:{evaluationId:that.evaluationId,organCode:that.organCode},
                    async:false,
                    dataType:'text',
                    callback: function(data) {
                        that.isSkip=false;
                        layer.close(confirmBox)    
                    }
                  });
                });
            },
            //编辑评估单名称
            editAssesmentName:function(){
                let that=this;
                let data={evaluationId:this.evaluationId,evaluationName:this.evaluationName};
                common.ajax({
                url: "knowledge-service/evaluation/paper2/update",
                dataType: "text",
                type: "put",
                data:JSON.stringify(data),
                callback: function(problems) {
                  that.isEditAssesmentName=false;
                  common.tip_msg("保存成功",1000);
                }
              });
            },
            clickEditAssesment:function(){
                this.isEditAssesmentName=true;
                Vue.nextTick(function(){
                    $('#inputAssesment').focus();
                })
            },
            //获取所有病区
            getAllWard:function(){
                this.allWardCount=0;
                let that=this;
                let data={organCode:this.organCode,wardType:2};
                common.ajax({
                url: 'sys-service/sys/v1/units',
                type: 'get',
                data:data,
                async:false,
                dataType:'json',
                callback: function(data) {
                  let newData=[];
                  for (var i in data) {
                      var t = {
                          clissify: i,
                          arrs: data[i]
                      };
                      newData.push(t);
                      that.allWardCount+=data[i].length;
                  }
                  that.selectWard=newData[0].arrs[0];
                  that.wardList=newData;
                  that.wardList_copy=newData;
                }
                });
            },
            noneConfigFlag:function(ward){
                let has= this.wardConfigArrs.some(al=>{
                    return al==ward.wardCode;
                });
                if(!has){
                    return true;
                }else{
                    return false;
                }
            },
            //获取已配置未配置数量
            getConfigCount:function(){
                let that=this;
                let data={evalutionListId:this.evaluationId,organCode:this.organCode};
                common.ajax({
                url: 'knowledge-service/dynamic/wardstatis',
                type: 'get',
                data:data,
                dataType:'json',
                callback: function(data) {
                    //debugger;
                    that.wardConfigArrs=data;
                    that.noneConfigWardCount= that.allWardCount-(data.length);
                    
                    }
                });
            },
            //返回
            returnBack:function(){
                let { query } = this.$route;
                this.$router.push({ path: '/assesmentTableSetting',query:query});
            },
            //选择科室
            choseWard:function(ward){
                this.selectWard=ward;
                this.questionList=[];
                this.getDynasicAssesment();
            },
            //显示节点名称
            showNodeName: function(currNode) {
                //debugger;
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
            //查找科室
            searchWard:function(event){
                let curValue=$(event.currentTarget).val();
                if(!$.trim(curValue)){
                    this.wardList=this.wardList_copy;
                    return;
                }
                var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
                let searchArr=[];
                if(pattern.test(curValue)){
                    this.wardList_copy.forEach(function(el){
                        if(el.arrs&&el.arrs.length>0){
                            let tempArr=el.arrs.filter(e=>{
                                return e.wardName.indexOf(curValue)>=0;
                            });
                            if(tempArr.length>0){
                                searchArr.push({clissify:el.clissify,arrs:tempArr});
                            }
                        }
                    });

                }else{
                    this.wardList_copy.forEach(function(el){
                        if(el.clissify==curValue.toUpperCase()){
                            searchArr.push(el);
                        }
                    });
                }
                this.wardList=searchArr;
            },
            //筛选科室
            filterDept:function(isAll){
                let that=this;
                this.isAll=isAll;
                if(isAll){
                    this.wardList=this.wardList_copy;
                }else{
                    /*clissify*/
                    let list=[];
                    this.wardList_copy.forEach(al=>{
                        let arrs=[];
                        al.arrs.forEach(cl=>{
                            if(!that.wardConfigArrs.some(kl=>{
                                return kl==cl.wardCode;
                            })){
                                arrs.push(cl);
                            }
                        });
                        if(arrs.length>0){
                            list.push({clissify:al.clissify,arrs:arrs});
                        }
                    })
                    this.wardList=list;
                    
                }
                this.selectWard=this.wardList[0].arrs[0];
            },
            //获取样式类别
            getClassC:function(item,type){
                if(type=='uniqId'){
                    if(item.currNode.selectFlag==1||item.currNode.selectFlag==2){
                        return 'active';
                    }
                }else{
                    if(item.currNode.selectFlag==2){
                        return 'active';
                    }
                }
                return '';
            },
            getChildClass:function(childItem,type){
                //debugger;
                if(type=='uniqId'){
                    if(childItem.currNode.selectFlag==1||childItem.currNode.selectFlag==2){
                        return 'active';
                    }else{
                        return '';
                    }
                }else{
                    if(childItem.currNode.selectFlag==2){
                        return 'active';
                    }else{
                        return '';
                    }
                }
            },
            //查询动态评估单配置
            getDynasicAssesment:function(){
                //debugger;
                let that=this;
                let data={
                  "evalutionListId": this.evaluationId,
                  "organCode": this.organCode,
                  "wardCode": this.selectWard.wardCode,
                }
                common.ajax({
                url: 'knowledge-service/dynamic/query',
                type: 'post',
                data:JSON.stringify(data),
                dataType:'json',
                callback: function(data) {
                    that.questionList=data.questionList;
                    
                    }
                });
            },
            setAll(item,type,event){
                //debugger;
                let obj=$(event.currentTarget);
                if(type=='uniqId'){
                    let flag=1;
                    if(obj.hasClass('active')){
                        flag=0;
                        item.currNode.selectFlag=0;
                    }else{
                        if(item.currNode.selectFlag==0){
                            item.currNode.selectFlag=1;
                        }
                    }
                    if(item.childList&&item.childList.length>0){
                        item.childList.forEach(al=>{
                            al.currNode.selectFlag=flag;
                        });
                    }
                }else{
                    let flag=2;
                    if(obj.hasClass('active')){
                        flag=0;
                        item.currNode.selectFlag=1;
                        if(item.childList&&item.childList.length>0){
                            item.childList.forEach(al=>{  //如果不存在选中文书，则设置为0
                                 al.currNode.selectFlag=1;
                            })
                        }
                    }else{
                        item.currNode.selectFlag=2;
                        if(item.childList&&item.childList.length>0){
                            item.childList.forEach(al=>{
                                al.currNode.selectFlag=2;
                            })
                        }
                        
                    }
                    
                }
            },
            //设为固定项
            addFix:function(item,event,parentItem){
                //debugger;
                let obj=$(event.currentTarget);
                if(obj.hasClass('active')){
                    if(item.currNode.selectFlag!=1){
                        item.currNode.selectFlag=0;
                    }
                }else{
                    item.currNode.selectFlag=2;
                }

                let as=true;
                parentItem.childList.forEach(cl=>{
                    //debugger;
                    if(cl.currNode.selectFlag==0||cl.currNode.selectFlag==1){
                        as=false;
                        return;
                    }
                })
                if(as){
                    parentItem.currNode.selectFlag=2;
                    
                }else{
                    if(parentItem.childList.some(al=>{
                        return al.currNode.selectFlag==0;
                    })){
                        parentItem.currNode.selectFlag=0;
                    }else{
                        parentItem.currNode.selectFlag=1;
                    }
                    /*if(parentItem.currNode.selectFlag==2){
                        
                    }*/
                }

               
            },
            //设为唯一项
            addUniqueId:function(item,event,parentItem){
              let obj=$(event.currentTarget);
              if(obj.hasClass('active')){
                  Vue.set(item.currNode,'selectFlag',0);
              }else{
                  Vue.set(item.currNode,'selectFlag',1);
              }

              let hasNone=parentItem.childList.some(al=>{
                      return al.currNode.selectFlag==0;
                  });
              if(!hasNone){
                  if(parentItem.currNode.selectFlag!=2){
                      parentItem.currNode.selectFlag=1;
                  }
              }else{
                  parentItem.currNode.selectFlag=0;
              }
            },
            //保存文书
            saveConfig:function(){
                let arr=[];
                let that=this;
                this.questionList.forEach(al=>{
                    if(al.childList&&al.childList.length>0){
                        al.childList.forEach(cl=>{
                            if(cl.currNode.selectFlag!=0){
                                let fix=cl.currNode.selectFlag==1?0:cl.currNode.selectFlag==2?1:0;
                                arr.push({fixed:fix,uniqueId:cl.currNode.uniqueId});
                            }
                        });
                    }
                    if(al.currNode.selectFlag!=0){
                        let fix=al.currNode.selectFlag==1?0:al.currNode.selectFlag==2?1:0;
                        arr.push(({fixed:fix,uniqueId:al.currNode.uniqueId}));
                    }
                });
                let data={
                  evalutionListId:this.evaluationId,
                  organCode:this.organCode,
                  uniqueIdList:arr,
                  wardCode:this.selectWard.wardCode,
                }
                common.ajax({
                  url: 'knowledge-service/dynamic/save',
                  type: 'post',
                  data:JSON.stringify(data),
                  dataType:'text',
                  callback: function(data) {
                    common.tip_msg("保存成功", 1000);
                  }
                });
            },
            
        },
        mounted(){
            this.evaluationName = this.$route.query.evaluationName || common.getUrlParam("evaluationName");
            if(common.getUrlParam('dynamic')==0){
                this.isSkip=true;
            }else{
                this.isSkip=false;
            }
            this.getAllWard();
            this.getConfigCount();
            this.getDynasicAssesment();
        },
        components:{
            'menuTemplate':menu,
        }
    }
</script>