<template>
  <div id="pop-content-01" style="display: none;">
      <div class="am-pd-20" style="max-height: 410px;overflow: auto;">
        <!-- <div class="am-file-btn">
          <input type="file" />
          点击上传
        </div> -->
      <el-upload
        ref="upload"
        class="upload-demo "
        :before-upload="beforeAvatarUpload"
        :action="upLoadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-remove="beforeRemove"
        :accept="acceptArr"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :file-list="fileList">
        <div  class="am-file-btn">点击上传</div>
        <div slot="tip" class="el-upload__tip">仅支持内容按照模板要求的excle文件</div>
      </el-upload>
        <!-- <ul class="file-after-list">
          <li>体征..xlsx<i class="right i-label-close"></i></li>
          <li>体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx体征..xlsx<i class="right i-label-close"></i></li>
        </ul> -->
        <div class="am-btn-area last">
          <a class="am-pop-btn am-btn-cancel" @click="cancleUpload">取消</a>
          <a class="am-pop-btn am-btn-confirm" @click="submitUpload">保存</a>
        </div>
      </div>
    </div>
</template>
<script>
import Vue from "vue";
import { Upload } from "element-ui";
Vue.component(Upload.name, Upload);
export default {
  name: 'uploadChoose',
  data () {
    return {
      upLoadUrl: 'system-setting-service/unsafepass/upload/parse?access_token=' + $.cookie('_token_'),
      acceptArr: 'xlxs',
      fileList: []
    }
  },
  methods: {
    reset () {
      this.fileList = []
    },
    beforeAvatarUpload (file) {
      let isJPG = false
      let lastindex = file.name.lastIndexOf('.')
      if (file.name.substring(lastindex + 1) === 'xlsx' || file.name.substring(lastindex + 1) === 'xls') {
        isJPG = true
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        layer.msg('上传的文件只能是excel!', {
          zIndex: layer.zIndex // 重点1
        })
        // layer.msg('上传的文件只能是excel!')
      }
      if (!isLt2M) {
        layer.msg('上传文件大小不能超过10M!', {
          zIndex: layer.zIndex // 重点1
        })
      }
      console.log(file)
      return isJPG && isLt2M
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      layer.msg(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`, {
        zIndex: layer.zIndex // 重点1
      })
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(`确定移除${file.name}？`)
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.fileList = []
      if (!res.success) {
        if (res.data !== 'null') {
          layer.msg(res.data, {
            zIndex: layer.zIndex
          })
        } else {
          layer.msg('文件解析有误', {
            zIndex: layer.zIndex
          })
        }
      } else {
        layer.msg('上传成功', {
          zIndex: layer.zIndex // 重点1
        })
        this.cancleUpload()
        this.$emit('updateConfigMenu')
      }
    },
    cancleUpload () {
      this.$emit('closeUploadLayer')
    }
  }
}
</script>
