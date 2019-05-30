<template>
<div class="am-mt-10">
    <template v-if="activeColumn.columnType==11">
       <div class="item first">
            <div class="coulmnHei">
              <span class="nameWid">单元名称</span>
              <input type="text" class="input-text w80 am-mr-10" v-model="activeColumn.headName"  @blur.stop="saveColumn()"/>
              <a class="am-mr-10" :class="getClassC('addData')"  @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
            </div>
            <div class="coulmnHei">
               <span class="nameWid" v-if="tableType==1">宽度</span>
               <span class="nameWid" v-if="tableType==2">高度</span>
               <input type="text" class="input-text  w80 am-mr-10" v-model="activeColumn.width"  @blur.stop="saveColumn()"/>
            </div>
       </div>
       <div class="item first">
          <div class="coulmnHei">
            <span class="nameWid">单元名称</span>
            <input type="text" class="input-text w80 am-mr-10" v-model="activeColumn.headExcList[0].headName"  @blur.stop="saveColumn()"/>
            <a class="am-mr-10" :class="getClassC('addData')"  @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
          </div>
          <div class="coulmnHei">
            <span class="w60">显示形式</span>
            <selectT :arr="displayTypeDict" :types="'displayType'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>  
          </div>         
       </div>
   </template>
   <template v-else-if="activeColumn.columnType==12">
       <div class="item first">
            <div class="coulmnHei">
              <span class="nameWid">单元名称</span>
              <input type="text" class="input-text w80 am-mr-10" v-model="activeColumn.headExcList[0].headName"  @blur.stop="saveColumn()"/>
              <a class="am-mr-10" :class="getClassC('addData')"  @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
            </div>         
       </div> 
       <div class="item first" >
        <div class="coulmnHei">
          <span class="nameWid">单元名称</span>
          <input type="text" class="input-text w80 am-mr-10" v-model="activeColumn.headName"  @blur.stop="saveColumn()"/>
        <a class="am-mr-10" :class="getClassC('addData')"  @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
        </div>
        <div class="coulmnHei">
            <span class="nameWid" v-if="tableType==1">宽度</span>
            <span class="nameWid" v-if="tableType==2">高度</span>
            <input type="text" class="input-text  w80 am-mr-10" v-model="activeColumn.width"  @blur.stop="saveColumn()"/>
        </div>
        <div class="coulmnHei">
          <span class="w60">显示形式</span>
          <selectT :arr="displayTypeDict" :types="'displayType'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>  
        </div>          
       </div>    
   </template>
    <template v-else>
        <div class="item first item-tree-control-first" >
            <i class="i-tree-angle am-mr-5" v-if="activeColumn.childs.length>0" @click.stop="clickExpand()" :class="[getExpandClass()]" ></i>
            <div class="coulmnHei">
              <span class="nameWid">单元名称</span>
              <input type="text" class="input-text am-mr-10" :style="getClass()" v-model="activeColumn.headName"  @blur.stop="saveColumn()"/>
              <template v-if="getContent()">
                  <el-tooltip  placement="top"  popper-class="menu-dd-limit" :content="getContent()">
                      <a class="am-mr-10" :class="getClassC('addData')" @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
                  </el-tooltip>
              </template>
              <template v-else>
                  <a class="am-mr-10" :class="getClassC('addData')" @click.stop="addCodeData(activeColumn.headBindingList)">+绑定数据</a>
              </template>
              <i class="i-link-del am-mr-10" @click.stop="deleteColumn()" v-if="styleHierarchy!=1"></i>
            </div>
            <div class="coulmnHei">
              <template v-if="activeColumn.childs">
                  <span class="nameWid" v-if="tableType==1">宽度</span>
                  <span class="nameWid" v-if="tableType==2">高度</span>
                  <input type="text" style="width:120px;" class="input-text am-mr-10" v-model="activeColumn.width"  @blur.stop="saveColumn()"/>
              </template>
            </div>
            <div class="coulmnHei">
              <span class="w60">显示形式</span>
              <selectT :arr="displayTypeDict" :types="'displayType'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT> 
              <span class="w60 m5">添加题</span>
              <selectT :arr="headTypeDict" :types="'headType'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>
            </div>

            <div class="coulmnHei">
              <span class="w60">使用组句</span>
              <selectT :arr="dictArr" :types="'dictType'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>
              <span class="w60 m5">打印选项</span>
               <selectT :arr="readFlag" :types="'readFlag'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>
            </div>

            <div class="coulmnHei">
              <span class="w60">对齐方式</span>
              <selectT :arr="arrangementList" :types="'arrangement'" :activeColumn="activeColumn" @selectHeadType="selectType" ></selectT>
            </div>
        </div>
        <div class="item item-tree-control" v-for="(columnItem,index) in activeColumn.childs" :key="index" v-show="!activeColumn.isExpand">
            <ul class="tree-control-editabled">
                <li>
                  <rightColumnSetting :readFlag="readFlag" :arrangementList="arrangementList" :dictArr="dictArr" :displayTypeDict="displayTypeDict" :headTypeDict="headTypeDict" :currentColumn="columnItem" :parentColumn="activeColumn" :tableType="tableType" :styleHierarchy='styleHierarchy+1' :headIndex="index"></rightColumnSetting> 
                </li>
                <li v-if="index==activeColumn.childs.length-1" style="padding-left:10px;">
                  <a @click="addColumn()">+添加行</a> 
                </li>
            </ul>
        </div>
        <div>
            <a @click="addColumn()" v-if="activeColumn.childs.length==0&&styleHierarchy<4" class="am-ml-15">+添加列</a> 
        </div>
    </template>
</div>
</template>
<script>
import Bus from '@/bus.js';
import { getCatalogue } from '@/util/util';
import draggable from 'vuedraggable';
import selectT from '@/components/select.vue';
import Vue from 'vue';
import {
  Tooltip
} from 'element-ui';
Vue.use(Tooltip)
export default{
    name: 'rightColumnSetting',
    data(){
        return{
          activeColumn:this.currentColumn,
          isAddData:false,
          activeQuestionArr:[],
          columnHeaderName:0,//添加列的名字，是依次增加
          currentDataHead:{},
        }
    },
    props:['currentColumn','tableType','styleHierarchy','parentColumn','headIndex','dictArr','displayTypeDict','headTypeDict','readFlag',"arrangementList"],
    computed:{
        levelCont() {
          var level = this.activeColumn.headLine;
          var cls = "layout-right";
         
          if (level == 1) {
                return cls;
          } else{
                return '';
          }
        },
    },
    methods:{
        //+数据
        addCodeData:function(headBindingList){
            debugger;
            Bus.$emit('addCodeData',this.activeColumn);
        },
        //获取绑定数据内容
        getContent:function(){
            let s="";
            this.activeColumn.headBindingList.forEach(al=>{
                s+=al.questionName+',';
            });
            if(s&&s.length>0){
                s=s.substring(0,s.length-1);
            }
            return s;
        },
        //拖动改变
        dragChange:function(){
            this.activeColumn.childs.map((item,index)=>{
                item.sortNum=index;
            });
        },
        dragChangeV:function(arr){
            arr.map((item,index)=>{
                item.sortNum=index;
            });
        },
        //获取展开类
        getExpandClass:function(){
          if(this.activeColumn.isExpand){
            return 'collpsan-angle-active';
          }else{
            return 'collpsan-angle';
          }
        },
        //点击展开
        clickExpand:function(){
            Bus.$emit('clickExpand',this.activeColumn);
        },
        //获取层级样式
        getClass:function(){
            if(this.styleHierarchy==1){
                return {width:'120px'};
            }else if(this.styleHierarchy==2){
                return {width:'90px'};
            }else if(this.styleHierarchy==3){
                return {width:'80px'};
            }else {
                return {width:'60px'};
            }
        },
        getClassC:function(type){
            if(type=='addData'){
                if(!this.activeColumn.headBindingList||(this.activeColumn.headBindingList&&this.activeColumn.headBindingList.length==0)){
                  return 'am-txt-normal';
                }else{
                  return 'am-data-active';
                }
            }
        },
        //添加列
        addColumn:function(){
            //debugger;
            let columnHeaderName=this.activeColumn.childs.length+1;   
            columnHeaderName++;
            if(columnHeaderName<10){
              columnHeaderName='0'+columnHeaderName;
            }
         
            let columnType=this.activeColumn.columnType;
            this.activeColumn.childs.push(
                {
                "headLine": this.styleHierarchy+1,
                "headName": columnHeaderName,
                "hierarchyNum": this.styleHierarchy+1,
                "sortNum": this.activeColumn.childs.length,
                "tableId": this.tableId,
                "width": 80,
                "catalogueRule": getCatalogue(),
                "childs": [],
                "columnType":columnType,
                "headBindingList": [],
                "headExcList": [],
                "alignType": null
            });
            this.saveColumn();
        },
        //删除列
        deleteColumn:function(){
            //debugger;
            let aa=this.parentColumn;
            let ss=this.activeColumn;
            let headId=this.activeColumn.headId;
            let index=-1;
            this.parentColumn.childs.forEach((al,aIndex)=>{
              if(al.headId==headId){
                  index=aIndex;
                  return;
              }
            });
            if(index>=0){
              this.parentColumn.childs.splice(index,1); 
            }
            this.saveColumn(this.parentColumn);
        },
        //下拉框选择
        selectType:function(item,type){
            debugger;
            if(type=='headType'){
                this.activeColumn.headType=item.dicItemKey;
            }else if(type=='displayType'){
                this.activeColumn.displayType=item.dicItemKey;
            }else if(type=='readFlag'){
                this.activeColumn.readFlag=item.dicItemKey;
            }else if(type=='arrangement'){
                this.activeColumn.alignType=item.dicItemKey;
            }else if(type=='dictType'){
                if(item.dicItemKey==0||!item.dicItemKey){
                    let headBindItem=[];
                    if(this.activeColumn.headBindingList&&this.activeColumn.headBindingList.length>0){
                        headBindItem=this.activeColumn.headBindingList;
                        headBindItem[0].dataKeyWord='';
                        headBindItem[0].dataType=1;
                    }else{
                        headBindItem=[{'dataKeyWord':'','dataType': 1}];
                    }
                    this.activeColumn.headBindingList=headBindItem;
                }
                let headBindItem=[];
                if(this.activeColumn.headBindingList&&this.activeColumn.headBindingList.length>0){
                    headBindItem=this.activeColumn.headBindingList;
                }else{
                    headBindItem=[{'dataKeyWord':'','dataType': 2}];
                }
                headBindItem[0].dataKeyWord=item.dicItemKey;
                headBindItem[0].dataType=2;
                this.activeColumn.headBindingList=headBindItem;
            }
            this.saveColumn();
        },
        //保存列
        saveColumn:function(column){
            debugger;
            //针对删除，需要传递父一层级的column，不然当前层级删除了找不到了
            if(column){
                Bus.$emit('activeColumnChange',column);
            }else{
                Bus.$emit('activeColumnChange',this.activeColumn);
            }
        },
        //移动列
        changeHeadIndex:function(mode){
            let i=-1;
            //debugger;
            let index=this.headIndex;
            if(index>-1){
                if(mode=='pre'){
                    i=index-1;
                }else if(mode=='next'){
                    i=index+1;
                }else if(mode=='first'){
                    i=0;
                }else if(mode=='last'){
                    i=this.parentColumn.childs.length-1;
                }
                let cur=this.parentColumn.childs[i];
                this.parentColumn.childs[i]=this.activeColumn;
                this.parentColumn.childs[index]=cur;
            }
            this.saveColumn(this.parentColumn);
        },
        
    },
    watch:
    {
        activeColumn: {
          handler: function(val, oldVal) { //
            },
            deep: true
        },
        currentColumn:{
            handler: function(val, oldVal) { //
                this.activeColumn=val;
            },
            deep: true
        },
    },
    components:{
         draggable,
         'selectT':selectT
    }

}
</script>
<style type="text/css">
    .w100{
        width: 100px;
    }
    .w80{
        width: 80px;
    }
    .w60{
      width: 60px;
      display: inline-block;
    }
    .m5 {
      margin-left: 10px;
    }
    .nameWid {
      display: inline-block;
      width: 70px; 
    }
    .coulmnHei {
      padding-bottom: 5px; 
    }
    .layout-right .item-tree-control-first {
      width: 350px;
    }
    .layout-right .item {
      padding-left: 10px;
      padding-bottom: 10px;
      padding-right: 0px;
      padding-top: 0px; 
    }
    .item-tree-control {
      padding-left: 0px !important;
    }
    .tree-control-editabled ul {
      padding-left: 0px;
    }
</style>