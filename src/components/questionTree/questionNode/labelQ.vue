<template>
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