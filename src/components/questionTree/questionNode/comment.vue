<template>
    <div style="padding: 0px 5px;">
      <textarea :style="{'width': node.currNode.style.width + 'px','min-width':'200px'}" name="" rows="4" cols="" class="input-text input-textarea am-mt-10" v-model="node.currNode.remarksContent"></textarea>
      <div class="am-file-preview am-mt-10" v-if="node.currNode.filePaths&&node.currNode.filePaths.length>0">
        <img  v-for="(item, index) in node.currNode.filePaths" :key="index" :src="item.filePath" alt="" >
      </div>
    </div>
</template>
<script>
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
    export default{
        data(){
            return{
                isComboOpen:false,//下拉提是否打开
                cmbItem:{},//下拉框默认选项
            }
        },
        mixins: [questionNodeMixin],
        beforeCreate: function() {
            this.$options.components.questionNode = require('../questionNode');
        },
        computed:{
           
        },
        methods:{
           
        }
    }
</script>