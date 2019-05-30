<template>
  <div class="loadData" style="height:100%;display:none;">
    <div class="am-pop-bd" style="bottom: 76px;">
      <div class="data-source-list-cont">
        <ul class="data-source-list">
          <li class="btn-data-source-plus" @click="openUploadLayer"></li>
          <li v-for="(menu,index) in menuList" :key="index">
            <div class="inner">{{menu}}</div>
          </li>
        </ul>
      </div>
  </div>
  </div>
</template>
<script>
import common from '../../util/common.js';
export default {
  name: 'loadData',
  data () {
    return {
    }
  },
  props: {
    menuData: {
      default: []
    }
  },
  computed: {
    menuList () {
      return this.menuData
    }
  },
  methods: {
    openUploadLayer () {
      this.$emit('showUpload')
    },
    getConfigMenu: function () {
      common.ajax({
        url: 'system-setting-service/menu/configed',
        data: {},
        type: 'get',
        callback: (res) => {
          console.log(res)
          this.menuList = res
        }
      })
    }
  },
  components: {
  }
}
</script>
