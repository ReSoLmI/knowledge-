<template>
    <div class="placeholder-drag-panel lv-inline">
        <div class="inline">多行文本</div>
        <div class="inline">
          <textarea name="" rows="4" cols="" class="input-text input-textarea w400"></textarea>
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
            this.$options.components.questionNode = require('../questionNode')
        },
        computed:{
           
        },
        methods:{
           
        }
    }
</script>