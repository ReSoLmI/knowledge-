<template>
 <div class="am-file-btn am-mt-10 lv-inline">
    <input type="file">
    <a class="am-btn am-btn-primary" style="margin-top:10px">导入</a>
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
            // console.log(this.$options.components.questionNode)
        },
        computed:{
           
        },
        methods:{
           
        }
    }
</script>