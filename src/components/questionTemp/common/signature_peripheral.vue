<!-- 通过手写板或身份证导入签名-->
<template>
  <div class="lv-inline">
    <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3" :style="{'width':(node.currNode.style.width || 220)+'px'}">
      {{node.currNode|showNodeName}}<span v-if="showPrintCode" style="color:red" :title="node.currNode.uniqueId">{{node.currNode.uniqueId}}</span>
    </div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList">
        <template v-if="mode!='pageShow'">
          <div class="am-input-unit" v-if="getInputType(item)!=1">
            <input type="text" class="input-text" :value="getValueById(item,node)" :maxLength="item.style&&item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width ? item.style.width : 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" readonly="readonly" @click.stop="showVerPop(item)">
          </div>
          <img :src="getOptionSaveValue(item,node.currNode.uniqueId).imageUrl" v-if="getInputType(item)==1" style="width:200px;height:40px" @click.stop="showVerPop(item)"></img>
          <span v-if="showPrintCode" :title="item.optionId">{{item.optionId}}</span>
        </template>
        <template v-if="mode=='pageShow'">
            <span :style="{'width':nodeWidth(item.style.width)+'px','margin-left':(item.style.margin || 0) + 'px',}" v-if="getInputType(item)!=1">{{getValue}}</span>
            <img :src="getOptionSaveValue(item,node.currNode.uniqueId).imageUrl" v-if="getInputType(item)==1" style="width:200px;height:40px"></img>
        </template>
      </div>
    </div>
    <div style="display:none" id="signature_peripheral_checkPop">
      <div class="am-btn-area" style="margin:10px 20px">
        <a class="am-pop-btn am-btn-confirm" @click.stop="importType(1)">身份证</a>
        <a class="am-pop-btn am-btn-confirm" @click.stop="importType(2)">手写板</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import { ajaxAsync, getOrganCode, transformBase64ToFile, openLayer } from '@/util/common_b';
export default {
    name: 'signature_peripheral',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue'],
    data() {
        return {
            activeItem: '',
            layerIndex: ''
        }
    },
    mounted: async function() {
        this.content = this.getValue;
        $(window).keydown(function(event) {
            if (event.keyCode == 123 && typeof(parent.showDevTools) == 'function') {
                parent.showDevTools();
            }
        });
    },
    computed: {
        ...mapState([
            'patient', 'userfulWidth', 'showPrintCode'
        ]),
        getValue: function() {
            let selectV = this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].filter(sv => {
                return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
            })
            if (selectV) {
                let res = selectV.reduce((pre, cur, index) => {
                    return pre + (index ? '/' : '') + (cur.optionContent ? cur.optionContent : '');
                }, '')
                return res || '';
            } else {
                return ""
            }
        },
    },
    methods: {
        /*签名导入*/
        importType: async function(type) {
            let that = this;
            layer.close(this.layerIndex);
            let clientObj = parent.ewellBrowserInfrastructure;
            if (typeof(clientObj) == 'undefined' ) {
              clientObj = ewellBrowserInfrastructure;
              if(typeof(clientObj) == 'undefined') {
                  console.log('请在客户端中打开');
                  return;
              }
            }
            if (type == 1) {
                let data;
                try {
                    data = clientObj.readCard();
                } catch (e) {
                    openLayer(e.message);
                    return;
                }
                let item = $.extend(true, {}, that.activeItem);
                that.setPatient(item, data.split('_')[0]);
            } else if (type == 2) {
                // if(typeof(ewellBrowserInfrastructure)!='undefined'&&typeof(ewellBrowserInfrastructure.startHandwrite)=='function'){
                clientObj.startHandwrite(function(data) {
                    let fileData = transformBase64ToFile(JSON.parse(data).signPicture, 'image/jpeg');
                    ajaxAsync({
                        url: 'base-service/file/uploadFiles?size=1024MB&projectName=enr&optionName=picture',
                        dataType: "json",
                        type: "post",
                        cache: false,
                        content_type: false,
                        processData: false,
                        data: fileData,
                    }).then(function(imageInfo){
                      let item = $.extend(true, {}, that.activeItem);
                      item.inputType = 1;
                      item.imageUrl = imageInfo.length > 0 && imageInfo[0].data;
                      that.setPatient(item, '');
                    });
                });
            }
        },
        showVerPop: function(item) {
            this.activeItem = item;
            this.layerIndex = layer.open({
                type: 1,
                title:'签名方式',
                content: $('#signature_peripheral_checkPop'),
                shade: 0,
            })
        },
        /*设置用户信息*/
        setPatient: function(item, value) {
            this.tree.$emit('seleteInput', {
                'node': this.node,
                'item': item,
                'value': value
            });
        },
        // 获取输入类型
        getInputType: function(option) {
            let sv = this.getOptionSaveValue(option, this.node.currNode.uniqueId);
            if (sv) {
                return sv.inputType;
            } else {
                return "";
            }
        }

    },
    watch: {

    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.lv-inline: {
  font-size: 14px;
}

.before {
  top: -999px;
  left: -999px;
}

.dir-top {
  top: auto;
  bottom: 30px;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}

.explain {
  line-height: 15px;
  font-size: 12px;
  color: #777;
  margin: 2px 0 -17px 0;
}














/*错误提示*/

.explain-error-1 {
  line-height: 15px;
  font-size: 12px;
  color: #F4333C;
  margin: 2px 0 -17px 0;
}

.am-form-label {
  font-size: 14px;
}

</style>
