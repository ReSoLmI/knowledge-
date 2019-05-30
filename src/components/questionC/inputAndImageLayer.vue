<template>
    <div class="bd">
     <div class="hd">
      <h3>{{inputLayerObj.layerTitle}} </h3>
      <a class="i-close" @click="closeLayer()"></a>
    </div>
    <div class="config-bd-pd">
       <textarea name="" rows="3" class="input-text input-textarea am-mt-10" :placeholder="inputLayerObj.placeholder" v-model="textarea_" maxlength="500"></textarea>
       <div style="margin-top:15px">
         <el-upload
           :action="uploadImagesUrl"
           list-type="picture-card"
           :file-list="fileList"
           :on-preview="handlePictureCardPreview"
           :on-remove="handleRemove"
           :on-success="handleSuccess" :on-error="uploadError"  :before-upload="beforeUpload"
           >
           <i class="el-icon-plus"></i>
         </el-upload>
        <el-dialog :visible.sync="dialogVisible" width="80%"  title="图片放大">
          <img style="width:100%;height:100%" :src="dialogImageUrl" alt="">
        </el-dialog>
       </div>
   </div>
    <div class="am-btn-bottom">
      <a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import common from '@/util/common.js';
import {
  Upload,Dialog
} from 'element-ui';
Vue.use(Upload);
Vue.use(Dialog);
export default {
        props: ['inputLayerObj'],  
        data () {
            return {
                uploadImagesUrl: "/upload-service/file/upload?size=1MB&projectName=helpContentImages&optionName=helpContent",
                textarea_:"",
                layerIndex:0,
                filePaths:[],
                fileList:[],
                dialogImageUrl: '',
                dialogVisible: false,
                uploadFormat:['image/jpeg','image/png'],
                avatarFormat:['jpg',"jpeg",'png'],
                maxAvatorFile:1,
            }
        },
        methods:{
            save_(){
                this.$emit("save",this.textarea_,this.filePaths,this.inputLayerObj);
                this.closeLayer();
            },
            init(content,filePaths){
              //debugger;
              let that=this;
              this.dispose();
              this.textarea_ = content;
              if(filePaths&&filePaths.length>0){
                filePaths.forEach(item=>{
                  that.fileList.push({url:item.filePath});
                });
              }
              this.filePaths=filePaths;
            },
            dispose(){
              this.filePaths=[];
              this.fileList=[];
              this.dialogImageUrl='';
            },
            initLayer(index){
              //debugger;
              this.layerIndex=index;
            },
            closeLayer(){
              this.dispose();
              layer.close(this.layerIndex);
            },
            handleRemove(file, fileList) {
              //debugger;
              console.log(file);
              this.fileList=fileList;
              this.filePaths=this.filePaths.filter(item=>{
                if(file.response&&file.response.data){
                  return item.filePath!=file.response.data;
                }else{
                  return item.filePath!=file.url;
                }
              });
              console.log(this.filePaths);
            },
            handlePictureCardPreview(file) {
              this.dialogImageUrl = file.url;
              this.dialogVisible = true;
            },
            handleSuccess(res, file) {
              //debugger;
              if(!this.filePaths){
                this.filePaths=[];
              }
              this.filePaths.push({filePath:res.data});
            },
            uploadError() {
              common.tip_msg("上传失败!");
            },
            beforeUpload(file) {
              //debugger;
              if (this.uploadFormat.indexOf(file.type) == -1) {

                layer.msg("请上传" + this.avatarFormat + "格式文件")
                return false;
              }

              let fileSize = file.size / 1024 / 1024;
             /* this.checkContainer(fileSize)*/

              /*if (this.freeSpace === 0) {
                return false;
              }*/
              if (fileSize > this.maxAvatorFile) {
                layer.msg("请上传" + this.maxAvatorFile + "M以下文件");
                return false;
              }
            },
            checkContainer(size) {
              common.ajax({
                url: '/upload-service/file/getInfo',
                dataType: "json",
                async: false,
                type: "get",
                callback: function(data) {
                  if (size / 1024 >= parseInt(data.freeSpace)) {
                    common.tip_msg("空间不足！");
                  }
                }
              })
            },
        }
    }
</script>
<style type="text/css">
    .am-btn-bottom{
        position: absolute;
        left: 50%;
        bottom: 0px;
        margin: -10px 0 10px -50px;
    }
</style>
