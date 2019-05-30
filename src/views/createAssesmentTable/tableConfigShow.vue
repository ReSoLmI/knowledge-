<template>
    <div class="topic-scrollbar">
    <template v-if="tableType==1">
        <ul class="topic-panel-list  topic-panel-list-h">
            <div class="tb-inline-item">
                <table class="am-tb-line am-tb-body-hover">
                    <tr v-for="(item,index) in allArray" :key="index" id="topic-panel-list">
                        <!-- <div class="model-tb-before" id="add" :style="getTipsWidth()" style="z-index:997" ></div> -->
                        <td v-for="(tds,tdIndex) in item" :key="tdIndex" v-if="tds" :class="{'th-active':activeColumn&&(tds.headId==activeColumn.headId)}" :rowspan="tds.height" :colspan="tds.Nwidth" @click.stop="changeColumn(tds,$event)" :style="getWidth(tds)">
                        <template v-if="tds.columnType!=11&&tds.columnType!=12">
                             <template v-if="isSHowNameType">
                                {{getHeadName(tds)}}
                            </template>
                            <template v-else>
                               {{tds.headName}}
                           </template>
                        </template>
                        <template v-if="tds.columnType==11">
                            <span class="cm-rightTop" v-if="tds.headExcList.length>0">{{tds.headExcList[0].headName}}</span>
                            <span class="cm-leftBotm">{{tds.headName}}</span>
                        </template>
                        <template v-else-if="tds.columnType==12">
                            <span class="cm-topLeft" v-if="tds.headExcList.length>0">{{tds.headExcList[0].headName}}</span>
                            <span class="cm-rightBotm">{{tds.headName}}</span>
                        </template>
                        <!-- {{ tds.hierarchyNum }} -->
                        <!-- <div class="th-tool-list" v-if="!pageFrom&&tds.hierarchyNum==1"> -->
                        <div class="th-tool-list" v-if="!pageFrom">
                            <!-- <i class="i-pre" @click.stop="changeIndex(item, tds,'pre',$event)" :class="{disabled:tdIndex==0?true:false}"></i> -->
                            <i class="i-pre" @click.stop="changeIndex(item, tds,'pre',$event)" :class="[resDisabled(item, tds, 'pre', tdIndex)]"></i>
                            <!-- <i class="i-next" @click.stop="changeIndex(item, tds,'next',$event)" :class="{disabled:tdIndex==item.length-1?true:false}"></i> -->
                            <i class="i-next" @click.stop="changeIndex(item, tds,'next',$event)" :class="[resDisabled(item, tds, 'next', tdIndex)]"></i>
                            <i class="i-close"  @click.stop="delMainColumn(tds)"></i>
                        </div>
                        <canvas v-if="tds.columnType==11" class="canvas-line canvas-line-ttob"></canvas>
                        <canvas v-if="tds.columnType==12" class="canvas-line canvas-line-btot"></canvas>
                        </td>
                    </tr>
                    <!-- <tbody class="tbody-hover">
                        <tr v-for="data in tableDatas">
                           <td v-for="(item,itemIndex) in data.headList" >
                              <template v-if="pageFrom=='preShow'&&itemIndex==data.headList.length-1">
                                <a  @click.stop="showAssesment(data)">查看</a>
                                <a  @click.stop="editAssesment(data)">修改</a>
                                <a  @click.stop="deleteAssesment(data)">删除</a>                              
                              </template>
                              <template v-else>
                                  <span>{{getColumnData(item.contents)}}</span>
                              </template>
                          </td>
                      </tr>
                  </tbody> -->
                </table> 
            </div>
        </ul>
     
    </template>
   <template v-if="tableType==2">
         <table class="am-tb-line" style="margin-top:10px">
            <tr v-for="(item,index) in allTableData">
              <td v-for="tds in item" v-if="tds&&tds.headLine" :class="{'th-active':activeColumn&&(tds.headId==activeColumn.headId)}"    :rowspan="tds.Nwidth" :colspan="tds.height" @click.stop="changeColumn(tds,$event)" :style="getWidth(tds)">
                <template v-if="!pageFrom&&tds.hierarchyNum==1" >
                   
                </template>
                <template v-if="tds.columnType!=11&&tds.columnType!=12">
                    {{tds.headName}}
                </template>
                <template v-if="tds.columnType==11">
                    <span class="cm-rightTop" v-if="tds.headExcList.length>0">{{tds.headExcList[0].headName}}</span>
                    <span class="cm-leftBotm">{{tds.headName}}</span>
                </template>
                <template v-else-if="tds.columnType==12">
                    <span class="cm-topLeft" v-if="tds.headExcList.length>0">{{tds.headExcList[0].headName}}</span>
                    <span class="cm-rightBotm">{{tds.headName}}</span>
                </template>
                
                <i class="i-th-close" @click.stop="delMainColumn(tds)" v-if="!pageFrom&&tds.hierarchyNum==1" style="z-index:999"></i>
               
                <canvas v-if="tds.columnType==11" class="canvas-line canvas-line-ttob"></canvas>
                <canvas v-if="tds.columnType==12" class="canvas-line canvas-line-btot"></canvas>
                </td>
                <td  v-if="data&&!data.headLine" v-for="(data,dataIndex) in item">
                    <template v-if="pageFrom=='preShow'&&index==allTableData.length-1">
                        <a  @click.stop="showAssesment(data)">查看</a>
                        <a  @click.stop="editAssesment(data)">修改</a>
                        <a  @click.stop="deleteAssesment(data)">删除</a>
                    </template>
                    <template v-else>
                        <span v-if="data">{{getColumnData(data.contents)}}</span>
                    </template>
                </td>
            </tr>          
        </table> 
    </template>
   </div>
</template>
<script>
import common from '@/util/common.js';
import '@/css/jquery-ui.css';
import Bus from '@/bus.js';
import Vue from 'vue';
export default{
    data(){
        return{
          columnList:[],//表头数据
          layerDelIndex:'',
          isInitLoad:false,
          newTableHeight:0,

          allSpan: 0,
          allArray: [],//水平表头
          maxHeight: 0,
          tableDatas:[],//水平数据
          isDynaicTable:0,
          positionLeft:{ //定位
              left:0,
              width:80,
              height:60,
          },
          allTableData:[],//垂直列表数据 
          curParentColumn: null,             
        }
    },
    props:['tableType','activeColumn','pageFrom','columnListData'],
    mounted(){
    },
    methods:{
        getCurColumn: function(arr, id) {
          arr.some((Element, Index) => {
            if(Element.childs && Element.childs.length > 0) {
              if(Element.headId == id) {
                this.curParentColumn = Element;
                return true;
              }
              this.getCurColumn(Element.childs, id)
            } else {
              if(Element.headId == id) {
                this.curParentColumn = Element;
                return true;
              }
            }
          })
        },         
        resDisabled: function(item, tds, mode, tdIndex) {
          return;
          let parentId = tds.parentHeadId;
          let sortNum = tds.sortNum;
          let changeNum = sortNum-1;
          let hierarchyNum = tds.hierarchyNum;
          if(mode == 'next') {
            changeNum = sortNum+1;
          }
          if(parentId) {
            if((sortNum == 0&&mode == 'pre') || (hierarchyNum != 1 && tds.childs.length > 0) || (this.curParentColumn && sortNum == this.curParentColumn.childs.length - 1 && mode == 'next')) {
              return 'disabled'
            }       
          } else {
            if(tdIndex == 0 && mode =='pre') {
              return 'disabled'
            }
            let n = this.columnListData.length;
            if(tds.sortNum==n-1 && mode =='next') {
              return 'disabled'
            }
            return ''
          }
        },
        //针对导管样式，如果有值则显示表头，如果没有值则不显示表头
        isSHowNameType:function(tds){
            if(tds.headType==3&&tds.parentHeadId){
                return true;
            }else{
                return false;
            }
        },
        //调节选项位置
        changeIndex(parentItem, item, mode, event) {
          let objs=$(event.currentTarget);
          if(objs.hasClass('disabled')){
              return;
          }
          let obj={
              item :item,
              mode:mode,
          }
          Bus.$emit('changeColumnIndex',obj);
        },
        /**************************************************/
        getMaxHeight() {
            let maxHeightArr = [];
            var getHeight = function(node, height) {
                if (node.childs.length == 0) {
                    maxHeightArr.push(height);
                } else {
                    node.childs.forEach(child => {
                        getHeight(child, ++height);
                    })
                }
            }
            this.columnList.forEach(ht => {
                getHeight(ht, 1);
            })
            this.maxHeight = Math.max(...maxHeightArr);
        },
        /*设置每个单元格宽度和高度*/
        setWidthHeight(node) {
            if (Array.isArray(node)) {
                node.forEach(n => {
                    return this.setWidthHeight(n);
                });
                return;
            }
            node.height = node.childs.length > 0 ? (node.childs[0].headLine - node.headLine) : (this.maxHeight - node.headLine+1);
            node.Nwidth = this.getNodeWidth(node);
            node.childs.forEach(child=>{
                this.setWidthHeight(child);
            })
        },
        /*获取节点宽度*/
        getNodeWidth: function(node) {
            var getWidth = function(node) {
                let Nwidth = 0;
                if (node.childs.length == 0) {
                    return 1;
                }
                node.childs.forEach(ch => {
                    Nwidth += parseInt(getWidth(ch));
                })
                return Nwidth;
            }
            return getWidth(node);
        },
        /*根据宽度和高度生成对应表格数据*/
        setTable(node) {
            // console.log(node);
            let allWidth = node.reduce((pre, now) => {
                return pre + now.Nwidth;
            }, 0)
            let array = new Array(this.maxHeight);
            for (var i = 0; i < array.length; i++) {
                array[i] = new Array(allWidth);
            }

            let height = 0;
            var setSigTable = function(snode, height, Nwidth) {
                array[height][Nwidth] = snode;
                snode.childs.forEach(ch => {
                    setSigTable(ch, height + snode.height, Nwidth)
                    Nwidth = Nwidth + ch.Nwidth;
                })
            }
            if (Array.isArray(node)) {
                var Nwidth = 0;
                node.forEach(n => {
                    setSigTable(n, height, Nwidth);
                    Nwidth = Nwidth + n.Nwidth;
                })
            }
            this.allArray = new Array(this.maxHeight);
            for (var i = 0; i < this.maxHeight; i++) {
                this.allArray[i] = this.allArray[i] || [];
                this.allArray[i] = this.allArray[i].concat(array[i]);
            }
        },
        //初始化表头
        initTableColumn:function(columnList,isDynaicTable){
            let that=this;
            this.columnList=columnList;
            this.isDynaicTable=isDynaicTable;
            if(this.isDynaicTable==1){ //针对动态列表，需要等数据匹配完整的显示列名再加载出来
                return;
            }
            if(this.columnList.length==0){
                this.allArray=[];
                return;
            }
            this.getMaxHeight();
            this.setWidthHeight(this.columnList);
            this.setTable(this.columnList);

            if(!this.pageFrom&&this.tableType==2){ //转化为垂直表头
                this.changeToVertial();
            }
            Vue.nextTick(function(){
                that.shapeRange1();
                that.shapeRange2();
            });
        },
        //初始化表格数据
        initTableData:function(tableDataAll){
            //动态项处理
            this.dynasicColumn(tableDataAll);
            this.allArray=[];
            if(this.columnList.length==0){
                return;
            }
            this.getMaxHeight();
            this.setWidthHeight(this.columnList);
            this.setTable(this.columnList);

           if(this.pageFrom=='preShow'&&this.tableType==2){
                this.changeToVertial();
            }
            let that=this;
            Vue.nextTick(function(){
                that.shapeRange1();
                that.shapeRange2();
            });
            console.log(this.allArray)
        },
        //转化为垂直显示
        changeToVertial:function(){
            let tableData = [];
            this.allArray.forEach(td=>{
                tableData.push(td);
            });
            //debugger;
            this.tableDatas.forEach(td=>{
                let arr=[];
                td.headList.forEach(ts=>{
                    //这里将ts的数据项添加每一个评估单的大类，主要用于修改，查看
                    let newObj=$.extend({},td,{headList:undefined});
                    let row=$.extend({},ts,newObj); 
                    arr.push(row);
                })
                tableData.push(arr);
            })

            let height = tableData.length;
            let width = tableData.length>0&&tableData[0].length;
            let newTableData =  new Array(width);
             for (var i = 0; i < newTableData.length; i++) {
                newTableData[i] = new Array(height);
            }
            for(let i = 0,len = tableData.length;i<len;i++){
                for(let j=0,lenJ=tableData[i].length;j<lenJ;j++){
                    newTableData[j][i] = tableData[i][j];
                }
            }
            this.allTableData = newTableData;
        },
        //动态项表格处理
        dynasicColumn:function(tableDataAll){
            let that=this;
            if(this.isDynaicTable==1){
                let delMainIndexArrs=[];
                for(var ai= 0,len = this.columnList.length;ai<len;ai++){
                    //debugger;
                    let al=this.columnList[ai];

                    if(al.isFixed==1){
                        delMainIndexArrs.push(al);
                    }else{
                        if(this.isNodeShow(al,tableDataAll)){
                            delMainIndexArrs.push(al);
                        }
                    }
                }
                this.pushData(delMainIndexArrs,tableDataAll);
                this.columnList = delMainIndexArrs;
            }else{
                this.tableDatas=tableDataAll;
            }
            if(this.pageFrom=='preShow'){ //添加一列操作列
                this.tableDatas.forEach(ts=>{
                    ts.headList.push({catalogueCode:0,width:200});
                });
                this.columnList.push({
                        "headLine": 1,
                        "headName": "操作",
                        "headType": 1,
                        "hierarchyNum": 1,
                        "parentHeadId":0,
                        "sortNum": this.columnList.length,
                        "width": 200,
                        "childs": [],
                        "columnType": "10",
                        "headBindingList": [],
                        "headExcList": [],
                        'isFixed':1,
                    });
                if(this.columnList.length==1&&this.columnList[0].headName=='操作'){
                    this.columnList=[];
                } 
            }
        },
        //动态列判断是否显示列，如果是固定项isFixed为1或者是查询的数据里面存在列，那么就显示
        isNodeShow:function(nodes,tableDataAll){
            let isShow;
            let result = false;
            try{
                isShow = function(node){
                    if(node.isFixed == 1||tableDataAll.find(data=>{
                        return data.headList.find(hl=>{
                            return hl.headId == node.headId && hl.headDataFlag == 1;
                        })
                    })){
                        result = true;
                    }
                    node.childs.forEach(cl=>{
                        isShow(cl);
                    })
                }
            }catch(ee){
                result = true;
            }
            isShow(nodes);
            return result;
        },
        pushData:function(delMainIndexArrs,tableDataAll){
            let lastCol = this.getLastCol(delMainIndexArrs);
            let td = [];
            let allData = [];
            tableDataAll.forEach(tds=>{
                td = [];
                tds.headList.forEach((hl,indee)=>{
                    if(lastCol.indexOf(hl.headId)>-1){
                        td.push(hl);
                    }
                })

                let newObj=$.extend({},tds,{headList:undefined});
                let row=$.extend({},newObj,{headList:td}); 
                allData.push(row);
            }) 
            this.tableDatas = allData;
        },
        //获取最后列的项
        getLastCol:function(nodes){
            let cols = [];
            let getLast = function(node){
                if(node.childs.length == 0){
                    cols.push(node.headId);
                }else{
                    node.childs.forEach(ch=>{
                        getLast(ch);
                    })
                }
             }
             nodes.forEach(n=>{
                getLast(n);
             })
             return cols;
        },
        //画斜线1
        shapeRange1:function(){
            $(".canvas-line-ttob").each((index,al)=>{
                var o_h = $(al).parents("td").innerHeight();
                var o_w = $(al).parents("td").innerWidth();
                var canvas=$(al)[0];
                var context = canvas.getContext("2d");
                canvas.width = o_w;
                canvas.height = o_h;
                context.clearRect(0, 0, o_w, o_h);
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(o_w, o_h);
                context.lineWidth = 1; 
                context.strokeStyle = '#e5e5e5';
                context.stroke();
            })
        },
        //画斜线2
        shapeRange2:function(){
            $(".canvas-line-btot").each((index,al)=>{
                var o_h = $(al).parents("td").innerHeight();
                var o_w = $(al).parents("td").innerWidth();
                var canvas=$(al)[0];
                var context = canvas.getContext("2d");
                canvas.width = o_w;
                canvas.height = o_h;
                context.clearRect(0, 0, o_w, o_h);
                context.beginPath();
                context.moveTo(0, o_h);
                context.lineTo(o_w, 0);
                context.lineWidth = 1; 
                context.strokeStyle = '#e5e5e5';
                context.stroke();
            })
        },

        //初始化表格数据
        initTableShow:function(){
            this.tableDatas=[];
            this.totalItems=0;
        },
        //合并列的计算
        getColSpan:function(column){
            let colspan=0;
            column.childs.forEach(al=>{
                al.childs.forEach(cl=>{
                    colspan++;
                });
                if(al.childs.length==0){
                    colspan++;
                }
            });
            return colspan;
        },
        //获取表头名称
        getHeadName:function(child){
            if(!child.headName){
                //针对导管添加题
                let obj=undefined;
                if(this.tableDatas&&this.tableDatas.length>0){
                    if(this.tableDatas[0].headList&&this.tableDatas[0].headList.length>0){
                        this.tableDatas[0].headList.forEach(hl=>{
                            if(hl.headId==child.headId){
                                obj=hl;
                            }
                        })
                    }
                    if(obj){
                       return obj.catalogueName;
                    }
                }
            }else{
                return child.headName;
            }
            return '';

        },
        //拼接每一列查询的数据
        getColumnData:function(obj,childNode){
            if(!obj){
                return '';
            }
             let content='';
            let that=this;
            obj.forEach(al=>{
                content+=(al.optionContent?al.optionContent:(al.optionName&&al.optionName!=undefined)?al.optionName:'')+',';
            });
            if(content&&content.length>0){
                 content=content.substring(0,content.length-1);
            }
            let reg = /\d{4}-\d{1,2}-\d{1,2}/g;
            if (reg.test(content)) {
                 let date=new Date(content);
                return  date.format('yyyy-MM-dd hh:mm');
            } else {
               return content;       
            }
        },
        //判断是否是日期类型
        isDate:function(str)
        {
            if(!/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.test(str))
                return false;
            var year = RegExp.$1-0;
            var month = RegExp.$2-1;
            var date = RegExp.$3-0;
            var obj = new Date(year,month,date);
            return !!(obj.getFullYear()==year && obj.getMonth()==month && obj.getDate()==date);
        },
        //删除列
        delMainColumn:function(column){
            this.$emit('delMainColumn',column);
        },
        changeColumn:function(column,event){
            console.log(2)
            let obj=$(event.currentTarget);
            this.positionLeft.left=obj[0].offsetLeft;
            this.positionLeft.height=obj.parents("table").height();
            this.positionLeft.width=obj[0].offsetWidth;
            if(column.hierarchyNum!=1){
                return;
            }
            this.$emit('changeColumn',column);
        },
        //获取每一列水平宽度
        getWidth:function(item,type){
            let a=this.computedWidthByType(item);
            if(type=='div'){
                a=a-1;
            }
            if(this.tableType==1){
                return {'width':a+'px', "min-width":a+'px'};
            }else{
                return {'height':a+'px',"min-height":a+'px'};
            }
        },
        
        //计算宽度
        computedWidthByType(item){
            let a=0;
            if(item.columnType==11){
                a+=parseInt($.trim(item.width));
            }else if(item.columnType==12){
                 a+=parseInt($.trim(item.width));
            }else{
                a+=parseInt($.trim(item.width));
            }
            if(a<36){
                return 36;
            }
            return a;
        },
        getActive:function(item){
            if(activeColumn&&item.headId==activeColumn.headId){
                return 'th-active';
            }else{
                return '';
            }
        },
        //将点击选中样式
        getTipsWidth:function(){
            let that=this;
            if(this.tableType==1){
                return {left:this.positionLeft.left+'px',height:this.positionLeft.height+'px',width:this.positionLeft.width+'px'};
            }else{
              
            }
        },
        //处理评估单
        dealAssesment:function(data){
            Bus.$emit('dealAssesment',data);
        },
        //预览评估单
        showAssesment:function(data){
            Bus.$emit('showAssesment',data);
        },
        //编辑评估单
        editAssesment:function(data){
            Bus.$emit('editAssesment',data);
        },
        //删除评估单
        deleteAssesment:function(data){
            Bus.$emit('deleteAssesment',data);
        },
        //打印评估单
        printAssesment:function(data){
            Bus.$emit('printAssesment',data);
        },
    },
    watch:{
        //表头
        columnList:function(cur,oldValue){
            this.columnList=cur;
        },
        //表格类型，表示横向还是纵向
        tableType:function(curvalue,oldValue){
            this.tableType=curvalue;
        },
    }
}
    
</script>
<style type="text/css">
    .am-tb-line{
        table-layout: fixed;
    }
    .am-tb-line td{
        position: relative;
        border: 1px solid #E5E5E5;
        vertical-align: middle;
        text-align: center;
        min-width: 36px;
        word-break: break-all;
        word-wrap: break-word;
        background: #F7F7F7;
        color: #666;
        white-space: normal;
    }
    .am-tb-line td:hover .i-th-close{
        display: block;
    }
    .am-tb-line .td-left{
        text-align: left;
    }
    .am-tb-line .td-right{
        text-align: right;
    }
    .am-tb-line span{
        display: block;
        line-height: 20px;
        padding: 0 10px;
        min-height: 20px;
    }
    .am-tb-line .th-active:before{
        content: "";
        position: absolute;
        z-index: 10;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border: 1px solid #009EF9;
        pointer-events: none;
    }
    .am-tb-line-second{
        width: 100%;
    }
    .am-tb-line-second tr td:first-child{
        border-left: none;
    }
    .am-tb-line-second tr td:last-child{
        border-right: none;
    }
    .am-tb-line-second tr:first-child td{
        border-top: none;
    }
    .am-tb-line-second tr:last-child td{
        border-bottom: none;
    }
    .th-line-slash-ttob, .th-line-slash-btot{
        position: relative;
    }
    .th-line-slash-ttob td, .th-line-slash-btot td{
        border: none;
    }
    /*纵向的*/
    .am-tb-line-v td{
        height: 37px;
    }
    .am-tb-line-v .am-tb-line-second td{
        height: 36px;
    }
    /*.am-tb-line-v .am-tb-line-second tr:nth-child(1) th{
        height: 36px;
    }*/
    .am-tb-line-v .th-line-slash-ttob td,
    .am-tb-line-v .th-line-slash-btot td{
        height: auto!important;
    }
    .am-tb-line-v .th-line-slash-ttob td span,
    .am-tb-line-v .th-line-slash-btot td span{
        line-height: 18px;
    }

    
    /*//*/
    .inline-item-list{
        font-size: 0;
        padding: 10px;
    }
    .inline-item{
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
    }
    .canvas-line{
        position: absolute;
        left: 0;
        top: 0;
    }
    /*//*/
    .th-line-slash-ttob span, .th-line-slash-btot span{
        display: inline-block;
        width: 50%;
    }

    /*.tb-inline-item{
        position: relative;
        display: inline-block;
        padding-right: 59px;
    }
    .tb-inline-item .tb-before{
        position: absolute;
        top: 0;
        width: 60px;
        right: 0;
        bottom: 0;
        border: 1px dashed #E5E5E5;
        min-height: 60px;
        text-align: center;
    }
    .tb-inline-item .tb-before:after{
        content: "";
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
    }
*/  
    .tb-inline-item{
        position: relative;
    }
    .am-tb-line .ui-sortable-placeholder{
        /*box-shadow: 0px 0px 1px red inset;*/
        border: 1px solid #e5e5e5;
        background: #EBF6FF;
        margin-top: 0; 
        min-width: 78px;
    }
    .am-tb-line{
        min-width: 60px;
        height: 60px;
    }
    .am-tb-line .th-placeholder{
        min-width: 0;
        width: 0;
        height: 60px;
        border: 1px solid red;
        background: #fff;
    }
    

    /*//纵向*/
    /*.am-tb-line-v .am-tb-line-second tr th:first-child{
        border-left: 1px solid #e5e5e5;
    }
    .am-tb-line-v .am-tb-line-second tr th:last-child{
        border-right: 1px solid #e5e5e5;
    }
    .am-tb-line-v .am-tb-line-second tr:first-child th{
        border-top: 1px solid #e5e5e5;
    }
    .am-tb-line-v .am-tb-line-second tr:last-child th{
        border-bottom: 1px solid #e5e5e5;
    }*/
    /*.am-tb-line-v .th-line-slash-ttob, .th-line-slash-btot{
        position: relative;
    }*/
    /*.am-tb-line-v .th-line-slash-ttob th, .th-line-slash-btot th{
        border: 1px solid #e5e5e5;
    }*/
    /*.am-tb-line-v .tb-second tr th{
        border-left: 1px solid #e5e5e5;
    }*/

    /*.am-tb-line-v .am-tb-line-second tr th{
        border: 1px solid #e5e5e5;
    }
    .am-tb-line-v .tb-second tr th:first-child{
        border: none;
    }
    .am-tb-line-v .tb-second tr th:first-child{
        border-top: none;
    }
    .am-tb-line-v .tb-second tr th:last-child{
        border-bottom: none;
    }*/
    .am-tb-15 td{
        line-height: 15px;
        vertical-align: middle;
    }
    .am-tb-line-v .tb-second{
        margin-top: -1px; 
    }
    .am-tb-line-v .tb-second th{
        border-left: 1px solid #e5e5e5;
    }
    .am-tb-line-v .am-tb-line-second tr th:first-child{
        border-left: 1px solid #e5e5e5;
    }
    .am-tb-line-v .tb-second tr:nth-child(1) th:first-child{
        border-top: 1px solid #e5e5e5;
        border-left: none;
    }
    .am-tb-line-v .tb-second tr:nth-child(1) th:first-child{
        border-bottom: none;
    }
    .am-tb-line-v .tb-second tr:nth-child(2) th{
        border-top: 1px solid #e5e5e5;
    }
    .am-tb-line-v .tb-second .am-tb-line-second tr:not(:first-child) th{
        border-left: 1px solid #e5e5e5;
    }
    .am-tb-line-v .th-line-slash-btot .am-tb-line-second tr th:first-child,
    .am-tb-line-v .th-line-slash-ttob .am-tb-line-second tr th:first-child{
        border-left: none;
    }
    .am-tb-line-v .ui-sortable-placeholder{
        margin-left: 0; 
        overflow: visible;
    }
    .am-tb-line-v tr+.ui-sortable-placeholder{
        border-top: none;
    }
    .am-tb-line-v .ui-sortable-placeholder td{
        height: 36px;
    }
    .am-tb-line-v .ui-sortable-helper{
        padding: 0;
        display: table;
        overflow: visible;
    }
    /*.am-tb-line-v .ui-sortable-helper>th:before{
        display: none;
    }
    .am-tb-line-v .ui-sortable-helper>th{
        position: relative;
    }*/
    .am-tb-body-hover .tbody-hover td{
        background: #fff;
    }
    .am-tb-body-hover .tbody-hover tr:nth-child(2n){
         background:#f7f7f7 ;
    }
    .am-tb-body-hover .tbody-hover tr:hover td{
        background: #EBF6FF;
        color: #009ef9;
    }
</style>