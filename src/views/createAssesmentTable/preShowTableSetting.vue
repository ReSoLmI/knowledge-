<template>
    <div class="am-page-slide">
    <div class="hd" >
            <h3>预览</h3>
            <a class="i-close" @click="closeLayer()"></a>
        </div>
    <div class="bd amp-confirm-scroll" v-show="columnList.length>0">
        <tableShow  ref="tableShow" :tableType="tableType" :activeColumn="activeColumn"  :pageFrom="'preShow'"></tableShow>
        <uib-pagination v-if="totalItems>0" first-text="" next-text="" last-text="" previous-text=""  :total-items="totalItems" v-model="pagination" :max-size="maxSize" class="page" :boundary-links="true" :rotate="false" :items-per-page="perPage"  @change="pageChanged"></uib-pagination>
    </div>
    <div v-if="totalItems==0" style="min-height:100px;line-height:100px;text-align:center;margin-top: 50px">
      <div class="no-data">
        <img src="../../image/no-data/no-data-notice.png" />
        <div class="responsive-txt">
          <div class="txt">暂无数据</div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import Bus from '@/bus.js';
import Vue from 'vue';
import common from '@/util/common.js';
import tableShow from './tableConfigShow.vue';
export default{
    data(){
        return{
          tableType:'',
          columnList:[],//列头数组
          evaluationId:common.getUrlParam('evaluationId'),//评估单id
          evaluationClass:common.getUrlParam('evaluationClass'),//评估单类别
          organCode:common.getUrlParam('organCode')||common.getOrganCode(),
          wardCode:common.getUrlParam('wardCode')||'000',//科室code
          activeColumn:undefined,
          totalItems:0,
          maxSize:5,
          perPage:12,
          pagination: {currentPage:1},
          tableDataAll:[],
          evaluationType:'COMMON_ASSESSMENT', //一般护理记录单通用
          saveHeadList:[],
          isDynaicTable:0,//0表示不是动态列表，1表示是动态列表
        }
    },
    created: function() {
        Bus.$off('selectData');
        Bus.$on('selectData', this.selectData);
    },
    methods:{
        //获取配置表头数据
        getAllTablRefresh:function(){
          let data={
            evaluationClassify: this.evaluationClass,
            organCode:this.organCode,
            isFixed:1,
            evaluationIdList: [
              this.evaluationId
          ]};
          let that=this;
          common.ajax({
            url: 'knowledge-service/evaluation/queryList',
            type: 'post',
            async: false,
            data:JSON.stringify(data),
            callback: function(data) {
              that.isDynaicTable=data.dynamic;
              that.columnList=data.headTreeList;
              let catalogue=that.columnList[0].getCatalogue;                 
              that.tableType=data.tableType;
              that.refreshTableColumn();
            }
          });
        },
        //获取表头绑定的最后一层数据，用来传递给后台查询数据
        getLastNode: function(node) {
          let that=this;
          if (node.childs.length == 0) {
              that.saveHeadList.push(node)
          }
          node.childs.forEach(ch => {
              that.getLastNode(ch);
          })
        },
        //查询列表项
        getDataByParam:function(columnList,param){
            this.saveHeadList=[];
            let that=this;
            columnList.forEach(al=>{
                that.getLastNode(al);
            });
            let data={
              headList:this.saveHeadList,
              organCode:this.organCode,
              pageNumber:this.pagination.currentPage-1,
              pageSize:this.perPage,
              evaluationType:this.evaluationType,
              wardCode:this.wardCode,
            }
            let newData=$.extend({},data,param);//将两个参数合并
            common.ajax({
            url: 'enr/assessment/context/list',
            type: 'post',
            data:JSON.stringify(newData),
            async: true,
            callback: function(data) {
              that.totalItems = data.totalElements;
              that.tableDataAll=data.content;
              that.refreshTableShow();
            }
          });
        },
        //分页改变
        pageChanged:function(){
            this.selectData();
        },
        //刷新表格数据
        refreshTableShow(){
            let that = this;
            Vue.nextTick(function() {
                that.$refs.tableShow.initTableData(that.tableDataAll);
            });
        },
        //刷新表头数据
        refreshTableColumn(){
          let data = $.extend(true, [], this.columnList); 
          this.$refs.tableShow.initTableColumn(data,this.isDynaicTable);
        },
        closeLayer:function(){
            common.exec_iframe();
        },
        //查询表头配置，并且获取表头绑定的数据组成表格
        selectData:function(){
            this.getAllTablRefresh();
            this.getDataByParam(this.columnList);
            
        }
    },
    mounted(){
        this.selectData();
    },
    components:{
        'tableShow':tableShow,
    }
}
    
</script>