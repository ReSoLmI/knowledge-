<template>
  <div id="container">
      <div ref="editor" class="editor" style="text-align:left"></div>
      <!-- <div class="btnContainer">
        <button class="saveBtn" v-on:click="getContent">查看内容</button>
      </div> -->
  </div>
</template>

<script>
import common from "@/util/common.js";

import E from "../../../static/wangEditor.min.js";

export default {
  name: "editor",
  data() {
    return {
      editorContent: "",
      pageSet: common.getUrlParam("pageSet")
    };
  },
  methods: {
    getContent: function() {
      console.log(this.editorContent);
    }
  },
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = html => {
      var data = editor.txt.getJSON();
      //   var data = JSON.stringify(editor.txt.getJSON())
      //   console.log(data)
      this.editorContent = data;
    };
    // 上传图片
    editor.customConfig.uploadImgShowBase64 = true;
    // editor.customConfig.uploadImgServer = '/upload'
    editor.create();
  }
};
</script>

<style scoped>
#container {
  width: 800px;
  margin: 0 auto;
}
.title {
  background-color: #f2f2f2;
  padding: 10px;
  font-size: 14px;
}
.btnContainer {
  text-align: center;
}
.saveBtn {
  margin: 10px auto;
}
</style>
