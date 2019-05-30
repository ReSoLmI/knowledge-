<template>
    <div class="hd" style="padding: 0px 5px;">
      <textarea name="" rows="4" cols="" class="input-text input-textarea am-mt-10" v-model="activeQuestion.currNode.remarksContent" @blur="saveQuestion()"></textarea>
      <div class="am-file-btn am-mt-10">
        <el-upload
           :action="uploadImagesUrl"
           list-type="picture-card"
           :file-list="fileList"
           :on-preview="handlePictureCardPreview"
           :on-remove="handleRemove"
           :on-success="handleSuccess" :on-error="uploadError" 
           >
           <i class="el-icon-plus"></i>
         </el-upload>
        <el-dialog :visible.sync="dialogVisible" width="80%"  title="图片放大">
          <img style="width:100%;height:100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div><br/>
      </div>
</template>
<script>
//图片上传组件
import Vue from 'vue';
import common from '@/util/common.js';
import {
  Upload,Dialog
} from 'element-ui';
Vue.use(Upload);
Vue.use(Dialog);
export default {
        props: ['activeQuestion'],  
        data () {
            return {
                uploadImagesUrl: "/upload-service/file/upload?size=1MB&projectName=helpContentImages&optionName=helpContent",
                filePaths:this.activeQuestion.currNode.filePaths,
                fileList:[],
                dialogImageUrl: '',
                dialogVisible: false,
                uploadFormat:['image/jpeg','image/png'],
                avatarFormat:['jpg',"jpeg",'png'],
                maxAvatorFile:1,
            }
        },
        mounted(){
          let that=this;
          this.dispose();
          if(this.filePaths&&this.filePaths.length>0){
            this.filePaths.forEach(item=>{
              that.fileList.push({url:item.filePath});
            });
          }
        },
        methods:{
            //
            dispose(){
              this.filePaths=[];
              this.fileList=[];
              this.dialogImageUrl='';
            },
            //移除路径
            handleRemove(file, fileList) {
                this.fileList=fileList;
                this.filePaths=this.filePaths.filter(item=>{
                if(file.response&&file.response.data){
                    return item.filePath!=file.response.data;
                }else{
                    return item.filePath!=file.url;
                }
              });
              this.$emit("save",this.filePaths,this.activeQuestion.currNode.remarksContent);
            },
            //图片放大
            handlePictureCardPreview(file) {
              this.dialogImageUrl = file.url;
              this.dialogVisible = true;
            },
            //保存成功
            handleSuccess(res, file) {
              if(!this.filePaths){
                this.filePaths=[];
              }
              this.filePaths.push({filePath:res.data});
              this.$emit("save",this.filePaths,this.activeQuestion.currNode.remarksContent);

            },
            uploadError() {
              common.tip_msg("上传失败!");
            },
            //保存问题
            saveQuestion:function(){
                this.$emit("save",this.filePaths,this.activeQuestion.currNode.remarksContent);
            },
        }
    }
</script>