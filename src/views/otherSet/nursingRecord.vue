<template>
  <div>
    <div class="am-page-rcont-second am-pd-20" style="top:0;">
      <div class="menu-llr-cont">
        <div class="lsde">
          <ul class="jy-menu">
            <li v-for="(ward,index) in allWards" :key="index" :class="{'active':wardIndex===index}" @click="chooseWard(ward,index)">{{ward.wardName}}</li>
          </ul>
        </div>
        <div class="lside-second">
          <div class="bd">
            <ul class="jy-menu-primary-light" ref="scroll">
              <li :class="{'active':groupId===group.id}" v-for="(group,index) in groupList" :key="index" @click="getRecord(group,index)" @mouseover="isShowEdit(group)" @mouseout="isShowEdit(group)">
                 <el-tooltip  :content="group.groupName" placement="bottom" effect="light" :disabled="group.groupName.length<=8">
                 <div>
                  <input type="text" v-model="group.groupName"  disabled="disabled"  v-if="!group.isEdit" :class="{'PR80':group.rightShow}"/>
                  <input type="text" v-model="group.groupName"  v-focus  v-if="group.isEdit" class="PR80" maxlength="20"/>
                <div class="right" v-show="!group.isEdit&&group.rightShow">
                  <a class="i-move-pre" @click.stop="changeGroupOrder(group,'moveTop')" v-if="index!==0">上移</a>
                  <a class="i-move-next" @click.stop="changeGroupOrder(group,'moveDown')"  v-if="index!==groupList.length-1">下移</a>
                  <a class="i-move-upd" @click.stop="edit(group)">修改</a>
                  <a class="i-move-del" @click.stop="deletGroup(group,index)">删除</a>
                </div>
                <div data-edit class="right-txt" v-if="group.isEdit">
                  <a class="link-confirm" @click.stop="saveCreatGroup(group)">确定</a>
                  <a class="link-cancel am-ml-10" @click.stop="cancle(group,index)">取消</a>
                </div>
                </div>
                 </el-tooltip>
              </li>
            </ul>
          </div>
          <a class="plus-li" @click="creatGroup">＋分组</a>
        </div>
        <div class="llrcont" style="background:#fff;height: 100%;">
          <div class="hd">
            {{group.groupName}}
            <div class="right">
              <div class="dd-group am-ml-10" :class="{'disabled':checkedRecordArr.length===0}"  @click="initCheck">
                <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button">移动分组</a>
                <div class="am-dropdown" style="width: 150px;right: 0;">
                  <div class="hd">移动至</div>
                  <ul>
                    <li v-for="(groupItem,index) in groupList" :key="index" v-if="groupItem.id===group.id" :class="{'disabled':groupItem.id===group.id,'active':checkGroup(groupItem)}"  @click.stop="chooseMoveGroup(groupItem,'disabled')">{{groupItem.groupName}}</li>
                    <li v-for="(groupItem,index) in groupList" :key="index" v-if="groupItem.id!==group.id" :class="{'disabled':groupItem.id===group.id,'active':checkGroup(groupItem)}" @click.stop="chooseMoveGroup(groupItem)">{{groupItem.groupName}}</li>
                  </ul>
                  <div class="ft">
                    <a class="am-btn am-btn-primary" style="width: 96px;" @click.stop="moveToGroup">确认</a>
                  </div>
                </div>
              </div>
              <div class="dd-menu am-ml-10" :class="{'disabled':checkedRecordArr.length===0}" @click="getCopyGroup">
                <a class="caption" href="javascript:void(0)" data-toggle="dropdown">复制至病区</a>
                <div class="am-dropdown" style="width: 320px;right: 0;">
                  <div class="bd">
                    <ul class="panel-menu">
                      <li v-for="(ward,index) in canCopyWard" :key="index" @click.stop="chooseMoveWard(ward,index)" :class="{'active':moveWardIndex === index}">{{ward.wardName}}</li>
                    </ul>
                    <ul class="panel-menu panel-menu-second">
                      <li v-for="(mopveGroup,index) in moveGroupList" :key="index" @click.stop="checkcopyGroup(mopveGroup)" v-if="mopveGroup.id!==group.id">
                        <div :class="{'am-ctr-native-chk':true,'active':moveGroupActive(mopveGroup)}" >
                          <span>{{mopveGroup.groupName}}</span>
                        </div>
                      </li>
                      <li v-for="(mopveGroup,index) in moveGroupList" :key="index" v-if="mopveGroup.id===group.id" @click.stop="stopFunc">
                        <div class="am-ctr-native-chk disabled" >
                          <span style="color: #ddd;">{{mopveGroup.groupName}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="ft">
                    病区{{haveCheckWard.length}} | 分组{{checkMoveGroupArr.length}}
                    <a class="cm-right am-btn am-btn-primary" style="width: 96px;" @click.stop="copyToGroup">确认</a>
                  </div>
                </div>
              </div>
              <a class="am-btn am-btn-primary am-ml-10" @click="addRecord('add')">＋模板</a>
            </div>
          </div>
          <div class="bd">
            <record :recordList='recordList' @editRecord='editRecord' @deleteRecord="deleteRecord" @chooseRecord='chooseRecord' @recordMove="recordMove" ref="record"></record>
          </div>
        </div>
      </div>
    </div>
    <addRecord id="addRecord" ref="addRecord" style="display:none;" @updateRecord="updateRecord" :title='title' :content="content"></addRecord>
  </div>
</template>
<script>
import common from '../../util/common.js';
import record from './groupContent'
import addRecord from './addRecord'
import '@/vendor/bootstrap/bootstrap-dropdowns.min'
import Vue from 'vue'
import {Tooltip} from 'element-ui'
Vue.use(Tooltip)
export default {
  name: 'nursingRecord',
  data () {
    return {
      allWards: [],
      wardIndex: 0,
      groupMap: {},
      groupList: [],
      ward: {},
      group: {},
      recordList: [],
      groupId: 0,
      title: '',
      content: '',
      record: {},
      checkGroupArr: [],
      checkedRecordArr: [],
      moveWardIndex: 0,
      moveGroupList: [],
      checkMoveGroupArr: [],
      moveWard: {},
      haveCheckWard: [],
      wardCode: common.getUrlParam('wardCode') || common.getWardCode()
    }
  },
  async mounted () {
    let selWard = null;
    this.allWards = await common.queryAllWards();
    this.allWards.forEach(ele => {
      if(ele.wardCode == this.wardCode) {
        selWard = ele    
      }
    })
    this.allWards = [selWard];
    this.ward = this.allWards[0];
    await this.chooseWard(this.ward, 0)
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  computed: {
    canCopyWard: function () {
      return this.allWards.filter((el) => {
        return el.wardCode !== this.ward.wardCode
      })
    }
  },
  methods: {
    // 选择科室
    chooseWard (ward, index) {
      this.wardIndex = index
      console.log(ward)
      this.ward = ward
      this.getGroup()
    },
    // 查询分组
    getGroup () {
      common.ajax({
        url: `knowledge-service/nursingrecord/group/${this.ward.wardCode}`,
        type: 'get',
        data: {},
        callback: (res) => {
          console.log(res)
          this.groupMap = res.groupMap
          if (this.groupMap[this.ward.wardCode]) {
            this.groupList = this.groupMap[this.ward.wardCode]
            this.groupList.forEach((el) => {
              this.$set(el, 'isEdit', false)
              this.$set(el, 'rightShow', false)
            })
            this.groupList = this.sortKey(this.groupList, 'groupOrder')
            this.getRecord(this.groupList[0], 0)
          } else {
            this.groupList = []
          }
        }
      })
    },
    isShowEdit (group) {
      group.rightShow = !group.rightShow
    },
    sortKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    // 新建分组
    creatGroup () {
      let order = this.groupList[this.groupList.length - 1].groupOrder + 1
      this.groupList.push({
        'groupName': '',
        'groupOrder': order,
        'wardCode': this.ward.wardCode,
        'wardName': this.ward.wardName,
        'isEdit': true
      })
      this.$nextTick(() => {
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight + 40
      })
    },
    // 保存新建分组
    saveCreatGroup (group) {
      if (group.groupName === '') {
        layer.msg('请填写分组名称')
        return false
      }
      let order
      if (group.groupOrder === undefined) {
        order = this.groupList[this.groupList.length - 1].groupOrder + 1
      } else {
        order = group.groupOrder
      }
      let params = {
        'groupName': group.groupName,
        'groupOrder': order,
        'wardCode': this.ward.wardCode,
        'wardName': this.ward.wardName
      }
      if (group.id) {
        params.id = group.id
      }
      common.ajax({
        url: 'knowledge-service/nursingrecord/group',
        type: 'put',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          if (res) {
            this.groupMap = res.groupMap
            if (this.groupMap[this.ward.wardCode]) {
              this.groupList = this.groupMap[this.ward.wardCode]
              this.groupList.forEach((el) => {
                this.$set(el, 'isEdit', false)
                this.$set(el, 'rightShow', false)
              })
              console.log(this.groupList)
            }
            layer.msg('保存成功')
          }
        }
      })
    },
    // 删除分组
    deletGroup (group, index) {
      common.ajax({
        url: `knowledge-service/nursingrecord/group?groupId=${group.id}`,
        type: 'DELETE',
        data: {},
        callback: (res) => {
          console.log(res)
          if (res) {
            this.groupMap = res.groupMap
            if (this.groupMap[this.ward.wardCode]) {
              this.groupList = this.groupMap[this.ward.wardCode]
              this.groupList.forEach((el) => {
                this.$set(el, 'isEdit', false)
                this.$set(el, 'rightShow', false)
              })
              console.log(this.groupList)
            }
            layer.msg('删除成功')
            let isHave = this.groupList.some((el) => {
              return el.id === this.groupId
            })
            if (!isHave) {
              this.getRecord(this.groupList[0], 0)
            }
          }
        }
      })
    },
    // 改变分组顺序
    changeGroupOrder (group, flag) {
      let params = {}
      let revId = 0
      this.groupList.forEach((el) => {
        params[el.id] = el.groupOrder
      })
      if (flag === 'moveTop') {
        let index = this.groupList.findIndex((el) => {
          return el.id === group.id
        })
        revId = this.groupList[index - 1].id
        params[revId]++
        params[group.id]--
      } else if (flag === 'moveDown') {
        let index = this.groupList.findIndex((el) => {
          return el.id === group.id
        })
        revId = this.groupList[index + 1].id
        params[revId]--
        params[group.id]++
      }
      common.ajax({
        url: `knowledge-service/nursingrecord/group/order`,
        type: 'put',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          if (res) {
            this.groupMap = res.groupMap
            if (this.groupMap[this.ward.wardCode]) {
              this.groupList = this.groupMap[this.ward.wardCode]
              this.groupList.forEach((el) => {
                this.$set(el, 'isEdit', false)
                this.$set(el, 'rightShow', false)
              })
              console.log(this.groupList)
            } else {
              this.groupList = []
            }
            layer.msg('保存成功')
          }
        }
      })
    },
    // 移动模板
    recordMove (recordParams) {
      let params = {}
      let revId = 0
      let record = recordParams.record
      this.recordList.forEach((el) => {
        params[el.id] = el.recordOrder
      })
      if (recordParams.flag === 'moveTop') {
        let index = this.recordList.findIndex((el) => {
          return el.id === record.id
        })
        revId = this.recordList[index - 1].id
        params[revId]++
        params[record.id]--
      } else if (recordParams.flag === 'moveDown') {
        let index = this.recordList.findIndex((el) => {
          return el.id === record.id
        })
        revId = this.recordList[index + 1].id
        params[revId]--
        params[record.id]++
      }
      common.ajax({
        url: `knowledge-service/nursingrecord/record/order`,
        type: 'put',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          if (res) {
            this.recordList = res.recordList
          }
        }
      })
    },
    // 分组名称编辑
    edit (group) {
      group.isEdit = !group.isEdit
    },
    // 取消按钮
    cancle (group, index) {
      if (group.id === undefined) {
        this.groupList.splice(index, 1)
      } else {
        this.getGroup()
      }
    },
    // 获取模板
    getRecord (group, index) {
      if (group.isEdit) {
        return false
      }
      this.group = group
      this.groupId = group.id
      this.checkedRecordArr = []
      this.$refs.record.initCheckArr()
      common.ajax({
        url: 'knowledge-service/nursingrecord/record',
        type: 'get',
        data: {
          groupId: group.id
        },
        callback: (res) => {
          console.log(res)
          this.recordList = res.recordList
        }
      })
    },
    // 新增模板弹窗
    addRecord (flag) {
      if (flag === 'add') {
        this.title = ''
        this.content = ''
        this.record = {}
        this.$refs.addRecord.init()
      }
      layer.open({
        type: 1,
        title: '增加模板',
        area: ['520px', ''],
        shadeClose: true,
        content: $('#addRecord')
      })
    },
    // 新增.编辑模板
    updateRecord (param) {
      let order
      if (this.record.recordOrder !== undefined) {
        order = this.record.recordOrder
      } else {
        if (this.recordList.length) {
          order = this.recordList[this.recordList.length - 1].recordOrder + 1
        } else {
          order = 0
        }
      }
      let params = {
        content: param.content,
        groupId: this.group.id,
        recordOrder: order,
        title: param.title
      }
      if (this.record.id !== undefined) {
        params.id = this.record.id
      }
      common.ajax({
        url: 'knowledge-service/nursingrecord/record',
        type: 'put',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          if (res) {
            this.recordList = res.recordList
            layer.closeAll()
            if (this.record.id === undefined) {
              layer.msg('新增成功')
            } else {
              layer.msg('修改成功')
            }
          }
        }
      })
    },
    // 修改模板
    editRecord (record) {
      this.record = record
      this.title = record.title
      this.content = record.content
      this.addRecord('edit')
    },
    // 删除模板
    deleteRecord (record) {
      common.ajax({
        url: `knowledge-service/nursingrecord/record?recordId=${record.id}`,
        type: 'delete',
        data: {},
        callback: (res) => {
          console.log(res)
          if (res) {
            this.recordList = res.recordList
            layer.msg('删除成功')
          }
        }
      })
    },
    // 选择移动分组
    chooseMoveGroup (group, disabled) {
      if (disabled === 'disabled') {
        return false
      }
      if (!this.checkedRecordArr.length) {
        layer.msg('请先选择模板')
        return false
      }
      let index = this.checkGroupArr.findIndex((el) => {
        return el.id === group.id
      })
      if (index >= 0) {
        this.checkGroupArr.splice(index, 1)
      } else {
        this.checkGroupArr = []
        this.checkGroupArr.push(group)
      }
    },
    // 分组是否选中（被移动至）
    checkGroup (group) {
      return this.checkGroupArr.some((el) => {
        return el.id === group.id
      })
    },
    chooseRecord (arr) {
      this.checkedRecordArr = arr
    },
    // 初始化选择项
    initCheck () {
      if (!this.checkedRecordArr.length) {
        layer.msg('请先选择模板')
        return false
      }
      this.checkGroupArr = []
    },
    // 移动至分组
    moveToGroup () {
      let groupIdArr = []
      let recordIdArr = []
      this.checkGroupArr.forEach((el) => {
        groupIdArr.push(el.id)
      })
      this.checkedRecordArr.forEach((el) => {
        recordIdArr.push(el.id)
      })
      if (!this.checkedRecordArr.length) {
        layer.msg('请选择模板')
        return false
      }
      if (!this.checkGroupArr.length) {
        layer.msg('请选择移动到的分组')
        return false
      }
      common.ajax({
        url: `knowledge-service//nursingrecord/record/group?groupId=${groupIdArr[0]}&recordIdList=${recordIdArr}`,
        type: 'post',
        data: {},
        callback: (res) => {
          console.log(res)
          if (res) {
            layer.msg('移动成功')
            this.checkGroupArr = []
            this.checkedRecordArr = []
            this.getRecord(this.group)
            $('.dd-group').click()
          }
        }
      })
    },
    chooseMoveWard (ward, index) {
      this.moveWardIndex = index
      common.ajax({
        url: `knowledge-service/nursingrecord/group/${ward.wardCode}`,
        type: 'get',
        data: {},
        callback: (res) => {
          this.moveGroupList = res.groupMap[ward.wardCode]
        }
      })
      this.moveWard = ward
    },
    // 选择复制分组
    checkcopyGroup (moveGroup) {
      if (!this.checkedRecordArr.length) {
        layer.msg('请先选择模板')
        return false
      }
      let index = this.checkMoveGroupArr.findIndex((el) => {
        return el.id === moveGroup.id
      })
      if (index >= 0) {
        this.checkMoveGroupArr.splice(index, 1)
      } else {
        this.checkMoveGroupArr.push(moveGroup)
      }
      this.haveCheckWard = []
      this.checkMoveGroupArr.forEach((el) => {
        let isHave = this.haveCheckWard.some((item) => {
          return item === el.wardCode
        })
        if (!isHave) {
          this.haveCheckWard.push(el.wardCode)
        }
      })
    },
    moveGroupActive (mopveGroup) {
      return this.checkMoveGroupArr.some((el) => {
        return el.id === mopveGroup.id
      })
    },
    // 获取复制至病区分组数据
    getCopyGroup (event) {
      if (!this.checkedRecordArr.length) {
        layer.msg('请先选择模板')
        return false
      }
      this.checkMoveGroupArr = []
      this.haveCheckWard = []
      this.chooseMoveWard(this.canCopyWard[0], 0)
    },
    stopFunc () {
      return false
    },
    // 复制到分组
    copyToGroup () {
      let groupIdArr = []
      let recordIdArr = []
      this.checkMoveGroupArr.forEach((el) => {
        groupIdArr.push(el.id)
      })
      this.checkedRecordArr.forEach((el) => {
        recordIdArr.push(el.id)
      })
      if (!this.checkedRecordArr.length) {
        layer.msg('请选择模板')
        return false
      }
      if (!this.checkMoveGroupArr.length) {
        layer.msg('请选择复制到的分组')
        return false
      }
      common.ajax({
        url: `knowledge-service//nursingrecord/record/group?groupIdList=${groupIdArr}&recordIdList=${recordIdArr}`,
        type: 'put',
        data: {},
        callback: (res) => {
          console.log(res)
          if (res) {
            layer.msg('复制成功')
            this.checkMoveGroupArr = []
            this.checkedRecordArr = []
            this.getRecord(this.group)
            $('.dd-menu').click()
          }
        }
      })
    }
  },
  components: {
    record,
    addRecord
  }
}
</script>
<style scoped>
.PR80 {
  padding-right: 80px!important;
}
input[disabled] {
  background-color: #E7F6FF !important;
  color: #333 !important;
  cursor: pointer !important
}
.jy-menu-primary-light li.active input[disabled] {
  background-color: #FFFFFF !important;  
  color: #333 !important;
}
.el-tooltip .PR80 {
  background-color: #FFFFFF !important;  
  color: #333 !important;
}
.menu-llr-cont .llrcont > .bd {
  height: calc(100% - 66px);
}
.hd {
  background: #FFF;
  z-index: unset;
}
</style>
