<template>
  <div>
    <div id="pop-content-09">
      <div class="am-pd-20">
        <div style="margin: 0 0 -20px -15px;">
          <div class="am-form-item">
            <div class="am-form-label am-col-4">模板标题</div>
            <div class="am-col-20">
              <input type="text" class="input-text" placeholder="30个字内" :value="newTitle" @input="changeTitle" maxlength="30"/>
            </div>
          </div>
          <div class="am-form-item">
            <div class="am-form-label am-col-4">模板内容</div>
            <div class="am-col-20">
              <textarea name="" rows="4" cols="" class="input-text input-textarea" placeholder="" :value="newContent" @input="changeContent" ></textarea>
            </div>
          </div>
        </div>
        <div class="am-btn-area last">
          <a class="am-btn-confirm" @click="updateRecord">确定</a>
          <a class="am-btn-cancel" @click="closeLayer">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      newContent: '',
      newTitle: ''
    }
  },
  props: ['title', 'content'],
  methods: {
    init () {
      this.newContent = ''
      this.newTitle = ''
    },
    updateRecord () {
      let recordInfo = {
        title: this.newTitle,
        content: this.newContent
      }
      if (this.newTitle === '' || this.newContent === '') {
        layer.msg('标题和内容不能为空！')
        return false
      }
      this.$emit('updateRecord', recordInfo)
    },
    changeTitle (event) {
      let el = event.currentTarget
      console.log(el.value)
      this.newTitle = el.value
    },
    changeContent (event) {
      let el = event.currentTarget
      console.log(el.value)
      this.newContent = el.value
    },
    closeLayer () {
      layer.closeAll()
    }
  },
  watch: {
    'title': function () {
      this.newTitle = this.title
    },
    'content': function () {
      this.newContent = this.content
    }
  }
}
</script>
