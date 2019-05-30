<template>
  <div class="text-center" style="height:50px;line-height:50px;">
    暂无已配过菜单的应用，请去系统配置添加住院护理应用</a>
  </div>
</template>
<script>
export default {
  name: 'noConfigedMenu',
  data () {
    return {
    }
  },
  methods: {
    addApp () {
      this.$emit('showAddApp')
    }
  }
}
</script>
