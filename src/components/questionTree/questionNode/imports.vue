<!-- 导入控件 -->
<template>
  <div class="lv-inline">
    <div class="lv-item" v-for="item in node.currNode.optionList">
      <div class="am-input-unit" @click="showImportPop">  
        <input type="text" v-if="!item.style||item.style.height == 1" class="input-text" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" :disabled="isTreeDisabled">
        <textarea rows="4" v-if="item.style&&item.style.height == 2" class="input-text input-textarea" :value="getValueById(item,node)" @input="checkInputUnit(item,node,$event)" :maxLength="item.style.maxLength||100" :style="{'padding-right':0,'width':(item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" :disabled="isTreeDisabled">
        </textarea>
        <i v-if="item.unitList.length == 1">{{item.unitList[0].unitName}}</i>
        <div class="tip-file-item" v-if="showImport">
            <i class="i-close" @click.stop="showImport=false"></i>
            <span>导入</span><a class="am-btn am-btn-plain-info am-ml-10" v-for="(itemSe,index_) in node.currNode.optionList[0].controlList"  @click.stop="checkRadio(itemSe,item)">{{itemSe.controlName}}</a>
        </div>
      </div>
<!--       <div class="placeholder-drag-panel lv-inline" v-if="showImport" style="display:inline">
        <div class="inline am-ctr-sel w200 lv-item" :class="{'open':isComboOpen}" @click.stop="showComboOpen" @mouseleave="isComboOpen=false">
          <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" :class="{disabled:isTreeDisabled}">{{selectControl.value}}</a>
          <div class="am-dropdown am-mr-10" v-show="isComboOpen">
            <ul>
              <li v-for="(itemSe,index_) in node.currNode.optionList[0].controlList" @click.stop="checkRadio(itemSe,item)"><a> {{itemSe.controlName}}</a></li>
            </ul>
          </div>
        </div>
      </div> -->
<!--       <a class="am-btn am-btn-info am-btn-lg" @click="importData(item)" v-if="!showImport&&!isTreeDisabled" style="position: relative;width:50px;bottom:60px" :class="{disabled:isTreeDisabled}">导入</a> -->
    </div>
    <div :id="treeId+'importsTemp'" style="overflow: hidden;margin-top:20px;display:none" >
      <component v-bind:is="importComponent" ref="imports"></component>
    </div>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
/*import { ImportsTemPath } from '@/views/importsTemp'*/
import { mapState } from 'vuex'
export default {
    name: 'import',
    data() {
        return {
            showUnit: true,
            isComboOpen: false, //下拉提是否打开
            selectControl: {
                'key': '',
                value: '请选择'
            },
            importComponent: '',
            showImport: false
        }
    },
    mixins: [questionNodeMixin],
     computed: {
        ...mapState([
            'userfulWidth'
        ])
    },
    methods: {
        checkInputUnit(item, node, event) { ////
            //this.changeInput(node.currNode, event);
            if (this.isTreeDisabled) {
                return;
            }
            //return;
            this.tree.$emit('seleteInput', {
                'node': node,
                'item': item,
                'value': event.currentTarget.value,
            });
        },
        /*显示下拉框*/
        showComboOpen: function() {
            if (this.isTreeDisabled) {
                return;
            }
            this.isComboOpen = true;
        },
        checkRadio: function(itemse, item) {
            this.selectControl = {
                key: itemse.controlType,
                value: itemse.controlName
            }
            this.goTemplate(itemse.controlType, item);
            this.showImport = false;
        },
        goTemplate: function(type, item) {
            let that = this;
           /* this.importComponent = ImportsTemPath[type];
            let index = layer.open({
                type: 1,
                title: '导入',
                shade: 0,
                btn: ['导入'],
                area: ['1000px', '580px'],
                shadeClose: true, //点击遮罩关闭
                content: $(document.getElementById(`${this.treeId}importsTemp`)),
                yes: function() {
                    let result = that.$refs['imports'].getImportValue();
                    layer.close(index);
                    if(!result){
                        return;
                    }
                    that.tree.$emit('seleteInput', {
                        'node': that.node,
                        'item': item,
                        'value': result
                    });
                    
                }
            });*/
        },
        importData: function() {
            this.showImport = true;
        },
        showImportPop:function(){
            if(!this.isTreeDisabled){
                this.showImport = true;
            }
        }
    },
}

</script>
<style scoped>


</style>
