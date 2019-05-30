<template>
  <div class="item">
    <div class="coulmnHei">
      <span class="nameWid">固定列</span>
      <input v-enter-number type="text" v-model="tableData.fixedRows" class="input-text w80 am-mr-10" @blur="save()"/>
    </div>
    <div class="coulmnHei">
      <span class="nameWid">操作内容</span>
      <el-checkbox v-model="tableData.contentModification" @change="save">修改</el-checkbox>
      <el-checkbox v-model="tableData.contentExamine" @change="save">查看</el-checkbox>
      <el-checkbox v-model="tableData.contentDelete" @change="save">删除</el-checkbox>
    </div>
    <div class="coulmnHei">
      <el-checkbox v-model="tableData.fixedHeader" @change="save">冻结表头</el-checkbox>
      <el-checkbox v-model="tableData.fixedOperationTool" @change="save">冻结操作栏</el-checkbox>
    </div>        
  </div>
</template>

<script>
import { ajaxAsync } from "@/util/common_b";
import common from "@/util/common.js";
import { Checkbox } from "element-ui";
import Vue from 'vue';
Vue.component(Checkbox.name, Checkbox);
export default {
  props: ["tableData"],
  data() {
    return {
      fixedHeader: false,
      fixedOperationTool: false,
      modification: false,
      examine: false,
      del: false,
    }
  },
  methods: {
    save: function() {
      this.editColumnSetting();
    },
    async editColumnSetting() {
      let param = { 
        tableId: this.tableData.tableId,
        fixedRows: this.tableData.fixedRows,
        contentModification: this.tableData.contentModification,
        contentExamine: this.tableData.contentExamine,
        contentDelete: this.tableData.contentDelete,
        fixedHeader: this.tableData.fixedHeader,
        fixedOperationTool: this.tableData.fixedOperationTool
      };
      let url = "knowledge-service/evaluation/updateTableProperty";
      let data = await ajaxAsync({
        url: url,
        type: "post",
        data: JSON.stringify(param)
      });
      common.tip_msg("已保存", 1000);
    },    
  }
}
</script>

<style scoped>
.item {
  padding-left: 10px;
  padding-top: 10px;
}
.nameWid {
  display: inline-block;
  width: 70px; 
}
.coulmnHei {
  padding-bottom: 5px; 
}
.el-checkbox {
  color: #4a4a4a;
}
</style>


