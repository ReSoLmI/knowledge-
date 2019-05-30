<!-- 签名验证 -->
<!-- 根据工号或名字搜索护士、医生 主要用于签名 -->
<template>
  <div class="lv-inline">
    <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3" :style="{'width':nodeWidth(node.currNode.style.width)+'px'}">
      {{node.currNode|showNodeName}}<span v-if="showPrintCode" style="color:red" :title="node.currNode.uniqueId">{{node.currNode.uniqueId}}</span>
    </div>
    <div class="lv-inline">
      <div class="lv-item" v-for="item in node.currNode.optionList">
        <template v-if="mode!='pageShow'">
          <div class="am-input-unit">
            <input type="text" class="input-text" :value="getValueById(item,node)" :maxLength="item.style&&item.style.maxLength||100" :style="{'padding-right':item.unitList.length!=1?'0':item.unitList[0].unitName.length*12+10+'px','width':(item.style.width ? item.style.width : 220)+'px','margin-left':(item.style.margin || 0) + 'px'}" readonly="readonly" @click.stop="showVerPop()" >
          </div>
          <span v-if="showPrintCode" :title="item.optionId">{{item.optionId}}</span>
        </template>
        <template v-if="mode=='pageShow'">
            <span :style="{'width':nodeWidth(item.style.width)+'px','margin-left':(item.style.margin || 0) + 'px'}">{{getValue}}</span>
        </template>
      </div>
    </div>
    <div :id="'verificationLayer'+node.currNode.uniqueId" style="display: none;overflow: hidden;">
        <div style="margin-left: 24px;margin-top:20px;">
          <div class="am-form-item">
            <div class="am-form-label am-col-6">用户名</div>
            <div class="am-col-18">
              <input type="text" class="input-text w200" v-model="userName" />
              <div class="explain" v-if="isChecking">校验中</div>
            </div>
          </div>
          <div class="am-form-item">
            <div class="am-form-label am-col-6">密码</div>
            <div class="am-col-18">
              <input type="password" class="input-text w200 input-error" v-model="userPassword" />
              <div class="explain-error-1" v-if="!isPassWrite">{{errorInfo}}</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import { ajaxAsync, getOrganCode } from '@/util/common_b';
import DES3 from '@/vendor/des3';
export default {
    name: 'signature_verification',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue'],
    data() {
        return {
            selectList: [],
            isComboOpen: false,
            content: "",
            isChecking: false,
            isPassWrite: true,
            userName: "",
            userPassword: '',
            errorInfo: ''
        }
    },
    mounted: async function() {
        this.content = this.getValue;
    },
    computed: {
        ...mapState([
            'patient', 'userfulWidth', 'showPrintCode','permission'
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
        noPremission:function(){
            return !this.permission||this.permission.indexOf(this.node.currNode.rightType||'')<0;
        }
    },
    methods: {
        /*弹出密码验证框*/
        showVerPop: function() {
            // if(!this.permission||this.permission.indexOf(this.node.currNode.rightType||'')<0){
            //     return true;
            // }
            let that = this;
            let index = layer.open({
                type: 1,
                title: '账号验证', // that.showNodeNames(fatherNode.currNode),
                shade: 0,
                btn: ['确定'],
                area: ['400px', ''],
                shadeClose: true, //点击遮罩关闭
                content: $('#verificationLayer'+this.node.currNode.uniqueId),
                yes: function() {
                    that.checkUser().then(function(user) {
                        that.setUser(user);
                        that.initInfo();
                        layer.close(index);
                    }, function(e) {
                        that.isPassWrite = false;
                        that.isChecking = false;
                        that.errorInfo = e.responseJSON && e.responseJSON.message || "";
                        that.userPassword = "";
                        that.$forceUpdate();
                        // layer.close(index);
                        // that.showVerPop();
                    });
                },
                end: function() {
                  //  that.initInfo();
                }
            })
        },
        /*初始化错误信息*/
        initInfo: function() {
            this.userName = "";
            this.userPassword = "";
            this.isPassWrite = true;
            this.isChecking = false;
            this.errorInfo = "";
        },
        /*校验用户密码*/
        checkUser: async function() {
            this.isChecking = true;
            return await ajaxAsync({
                url: `user-service/user/check?organCode=${getOrganCode()}&loginName=${this.userName}&password=${this.pwdEncrypt(this.userPassword)}`,
                dataType: "json",
                is_failure: 'first',
                type: "post"
            });
        },
        /*设置用户信息*/
        setUser: function(user) {
            let item = this.node.currNode.optionList[0];
            item.optionKey = this.userName;
            this.tree.$emit('seleteInput', {
                'node': this.node,
                'item': item,
                'value': user.staffName
            });
        },
        stringToHex: function(s) {
            var r = ""; //这里本来有0x,我去掉了，需要的朋友自己加
            var hexes = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
            for (var i = 0; i < s.length; i++) { r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf]; }
            return r;
        },
        /*des3加密*/
        pwdEncrypt: function(pwd) {
            var des3en = DES3.encrypt(pwd);
            return this.stringToHex(des3en);
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
  min-height: 15px;
}








/*错误提示*/

.explain-error-1 {
  line-height: 15px;
  font-size: 12px;
  color: #F4333C;
  margin: 2px 0 -17px 0;
  min-height: 15px;
}

.am-form-label {
  font-size: 14px;
}

</style>
