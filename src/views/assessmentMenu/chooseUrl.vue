<template>
  <div id="pop-content-01" style="display: none;">
    <div class="menu-multi-lr" style="height: 410px;overflow: auto;">
      <div class="lside" v-if="leftUrlList.length">
        <ul class="menu-first">
          <li :class="{active:leftMenu==leftMenuChoosed}" v-for="(leftMenu,index) in leftUrlList" :key="index" @click="getUrlChild(leftMenu)">{{leftMenu}}</li>
        </ul>
      </div>
      <div class="rcont" v-if="leftUrlList.length">
        <ul class="menu-second">
          <li v-for="(urlChild,index) in urlChildList" :key="index" @click="chooseChildUrl(urlChild,index)" :class="{active:urlChild.menuUrl==url}">{{urlChild.menuName}}</li>
        </ul>
      </div>
      <p style="text-align:center;line-height:390px" v-if="!leftUrlList.length&&isLoaded">
        <a>暂无菜单数据源，请先导入</a>
      </p>
    </div>
  </div>
</template>
<script>
import common from '../../util/common.js';
export default {
  name: 'pop-content',
  data () {
    return {
      leftUrlList: [],
      urlChildList: [],
      menuType: '',
      leftMenuChoosed: '',
      url: '',
      childNum: null,
      isLoaded: false
    }
  },
  methods: {
    getUrlChoose (menuType, nowUrl) { // 获取左侧
      this.leftUrlList = []
      this.urlChildList = []
      this.menuType = menuType
      this.url = nowUrl
      this.isLoaded = false
      common.ajax({
        url: `system-setting-service/menu/configedApp/${menuType}`,
        type: 'get',
        callback: (res) => {
          console.log(res)
          this.isLoaded = true
          this.leftUrlList = res
          this.getUrlChild(this.leftUrlList[0], menuType)
        }
      })
    },
    getUrlChild (appName, menuType = this.menuType) {
      this.leftMenuChoosed = appName
      let params = {
        menuType: menuType,
        appName: appName
      }
      common.ajax({
        url: 'system-setting-service/menu/configed/menuType',
        type: 'post',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          this.urlChildList = res
        }
      })
    },
    chooseChildUrl (itemUrl, index) {
      console.log(itemUrl)
      this.childNum = index
      this.url = itemUrl.menuUrl
      this.$emit('changeUrl', itemUrl)
    }
  }
}
</script>
