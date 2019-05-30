<template>
    <div class="bd">
     <div class="hd">
      <h3>{{inputLayerObj.layerTitle}} </h3>
      <a class="i-close" @click="closeLayer()"></a>
    </div>
    <div class="main-con" style="padding: 0 10px;">
      <textarea v-model="note" class="input-text input-textarea am-mt-10" placeholder="请输入选项注解" name="" id="myNote" cols="30" rows="9"></textarea>
   </div>
    <div class="am-btn-bottom">
      <a class="am-btn am-btn-primary w120" @click="saveNote()">保存</a>
    </div>
  </div> 
</template>

<script>
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
export default {
  props: ['inputLayerObj'],  
  data() {
    return {
      note: "",
    }
  },
  mounted() {

  },
  watch: {
    inputLayerObj: function(curVal) {      
      this.inputLayerObj = curVal;
      if(curVal.optionItem.optionNote) {
        this.note = curVal.optionItem.optionNote;
        if(curVal.optionItem.optionNote.indexOf('<br/>') > -1) {
          let reg = new RegExp("<br/>","g");   
          this.note = this.note.replace(reg,"\n"); 
        }
      } else {
        this.note = ""    
      }
    }    
  },
  methods: {
    saveNote() {

      let val = this.note.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
      this.$set(this.inputLayerObj.activeQuestion.currNode.optionList[this.inputLayerObj.optionIndex], 'optionNote', val)
      this.$emit('saveOptionNote', this.inputLayerObj.activeQuestion, this.inputLayerObj.optionIndex)
      layer.closeAll();
    },
    closeLayer() {
      layer.closeAll();
    },    
    initLayer() {
      console.log(this.inputLayerObj.activeQuestion)
    }
  }  
}
</script>



