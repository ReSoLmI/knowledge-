<template>
    <div class="">
        <div class="control-item">
            <span class="am-txt-label am-mr-10">占位符{{index+1}}</span>
            <div class="am-ctr-sel w140 am-mr-10" @mouseleave="isShowPop=false" :class="{open:isShowPop}">
                <!-- <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">按项目</a> -->
                <input type="text" class="input-text"  placeholder="搜索题目" v-model="itemChild.currNode.aliasName" @input="searchInputQuestion($event)" @click.stop="openInputQuestion($event)"/>
                <i class="btn-angle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"></i>
                <div class="am-dropdown am-mr-10">
                    <ul>
                        <li v-for="item in embedArrs" :class="{active:(itemChild.currNode.questionId==item.questionId)?true:false}" @click.stop="selectItem(item)"><a>{{item.aliasName}}</a></li>
                    </ul>
                </div>
            </div>
            <div class="am-input-label-unit am-mr-10" style="width: 110px;">
                <span class="txt">宽<i class="muted-line-txt">|</i></span>
                <input type="text" style="padding-left:40px;" class="input-text" v-if="itemChild.currNode&&itemChild.currNode.style" v-model="itemChild.currNode.style.width"  @blur.stop="saveQuestion()">
                <i class="unit">px</i>
            </div>
        </div>
        <div class="control-item" style="margin-top: 5px;">
            <div class="am-ctr-native-chk am-mr-10" :class="[getClassC()]" @click="addCheck($event)"><span>下划线</span></div>
            <div class="am-ctr-native-chk am-mr-10" :class="[getClassC('hideTitleCheck')]" @click="addIsShowTitle($event)"><span>隐藏标题</span></div>
             <i class="i-link-del am-mr-10" @click.stop="deleteEmbed()"></i>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import common from '@/util/common.js';
import Bus from '@/bus.js';
    export default{
        data(){
            return{
                isShowPop:false,//是否打开显示
                embedArrs:[],//占位符数组
                itemChild:this.childItem,
            }
        },
        props:['childItem','index'],
        methods:{
            //显示名称
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
            //输入内容搜索
            searchInputQuestion:function(event){
                let val=$(event.currentTarget).val();
                this.getQuestion(val);
            },
            //通过输入值搜索问题添加到占位符
            getQuestion:function(val){
                let that=this;
                common.ajax({
                    url: "knowledge-service/new/common/search",
                    dataType: "json",
                    type: "get",
                    data:{keywords:val},
                    callback: function(data) {
                        that.embedArrs=data;
                        //插入一个空节点
                        that.embedArrs.splice(0,0,
                        {
                            catalogueName: "请选择",
                            questionId: '',
                            aliasName:'请选择',
                            checkType: "1",
                            hierarchyList: [],
                            filePaths: [],
                            helpContent: '',
                            remarksContent:'',
                            optionList: [],
                            uniqueId:0,
                            questionId:0
                        });
                        that.isShowPop=true;
                    }
                });
            },
            //点击下划线
            addCheck(event) {
                let obj = $(event.currentTarget);
                let checkType = "1";
                if (obj.hasClass('active')) {
                    checkType = "0";
                }
                Vue.set(this.itemChild.currNode.optionList[0], "implantStyle",checkType);
                this.saveQuestion();
            },
            //点击隐藏标题
            addIsShowTitle(event) {
                /*aliasType
                  1.显示别名
                  2.显示默认名称
                  3.不显示内容
                  */
                let obj = $(event.currentTarget);
                let aliasType = "3";
                if (obj.hasClass('active')) {
                    aliasType = "2";
                }
                Vue.set(this.itemChild.currNode, "aliasType", aliasType);
                obj.toggleClass("active");
                this.saveQuestion();
            },
            //获取样式
            getClassC:function(type){
                if(type=='hideTitleCheck'){
                    let aliasType = this.itemChild.currNode.aliasType;
                    if (aliasType == 2 || aliasType == 1) {
                        return '';
                    } else {
                        return 'active';
                    }
                }else{
                    if(this.itemChild.currNode.optionList.length>0&&this.itemChild.currNode.optionList[0].implantStyle==1){
                        return 'active';
                    }
                }
                return '';
            },
            //选择制定项
            selectItem:function(item){
                let newNode=$.extend({},item,{style: {
                        height: 0,
                        link: 0,
                        maxLength: 0,
                        width: '10'
                        }});
                this.itemChild={currNode:newNode};
                this.isShowPop=false;
                console.log(this.itemChild);
                Bus.$emit('selectEmbedQuestion',item,this.index);
            },
            openInputQuestion:function(event){
                let val=$(event.currentTarget).val();
                this.getQuestion(val);
            },
            //保存问题
            saveQuestion:function(){
                 Bus.$emit('editAttachQuestion',this.itemChild);
            },
            //删除占位符附属题
            deleteEmbed:function(){
                Bus.$emit('deleteQuestion',this.itemChild,this.index);
            }
        },
        watch:{
            childItem:function(curvalue){
                this.itemChild=curvalue;
            }
        }
    }
</script>