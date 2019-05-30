<template>
<div>
  <div :class="{'panel-chk-move':true,'am-mt-10':index!==0}" v-for="(record,index) in recordList" :key="index">
    <div class="hd">
      <div :class="{'am-ctr-native-chk':true,'active':isRecordId(record)}" @click.stop="chooseRecord(record)">
        <span>{{record.title}}</span>
      </div>
      <div class="right">
        <a class="i-move-pre" @click.stop="recordMove(record,'moveTop')" v-if="index!==0">上移</a>
        <a class="i-move-next" @click.stop="recordMove(record,'moveDown')" v-if="index!==recordList.length-1">下移</a>
        <a class="i-move-upd" @click.stop="editRecord(record)">修改</a>
        <a class="i-move-del" @click.stop="deleteRecord(record)">删除</a>
      </div>
    </div>
    <div class="bd">
      <div class="txt-details-collapse" style="word-break: break-word;">{{record.content}}
        <!-- <a class="collapse-angle" href="javascript:void(0)" data-toggle="dropdown">详情
          <i class="i-angle am-ml-5"></i>
        </a> -->
      </div>
    </div>
  </div>
 </div>
</template>
<script>
export default {
  data () {
    return {
      checkRecordArr: []
    }
  },
  props: ['recordList'],
  methods: {
    editRecord (record) {
      this.$emit('editRecord', record)
    },
    deleteRecord (record) {
      this.$emit('deleteRecord', record)
    },
    chooseRecord (record) {
      let index = this.checkRecordArr.findIndex((el) => {
        return el.id === record.id
      })
      if (index >= 0) {
        this.checkRecordArr.splice(index, 1)
      } else {
        this.checkRecordArr.push(record)
      }
      this.$emit('chooseRecord', this.checkRecordArr)
    },
    // 分组是否选中（被移动至）
    isRecordId (record) {
      return this.checkRecordArr.some((el) => {
        return el.id === record.id
      })
    },
    recordMove (record, flag) {
      let params = {
        record: record,
        flag: flag
      }
      this.$emit('recordMove', params)
    },
    initCheckArr () {
      this.checkRecordArr = []
    }
  }
}
</script>
