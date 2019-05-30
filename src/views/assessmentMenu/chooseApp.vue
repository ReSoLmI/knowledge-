<template>
  <div id="pop-content-01" style="display: none;">
    <div class="am-pd-20" style="height: 410px;overflow: auto;">
      <div class="card-app-o-list-cont" v-if="getAppList.length">
        <ul class="card-app-o-list">
          <li v-for="(item,index) in getAppList" :key="index">
            <div class="inner" @click="addApp(item)">
              <img :src="item.appLogo" />
              <h4>{{item.appName}}</h4>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="!getAppList.length&&loadedFlag" style="text-align:center;line-height:360px">
        <a>暂无可添加应用</a>
      </p>
    </div>
  </div>
</template>
<script>
import common from '../../util/common.js';
export default {
  name: 'chooseApp',
  data () {
    return {}
  },
  props: {
    appList: {
      type: Array,
      required: true
    },
    loadedFlag: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    getAppList () {
      return this.appList
    }
  },
  methods: {
    addApp (item) {
      let params = {
        'appCode': item.appCode,
        'appName': item.appName
      }
      common.ajax({
        url: 'system-setting-service/topMenu/add',
        data: JSON.stringify(params),
        type: 'post',
        callback: (res) => {
          console.log(res)
          let promiseF = new Promise((resolve) => {
            this.$emit('indexPageInit', 'add')
            resolve()
          })
          promiseF.then(() => {
            layer.closeAll()
            layer.msg('添加成功')
          })
        }
      })
    }
  },
  created () {
  }
}

</script>
