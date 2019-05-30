<template>
  <div class="bd">
    <div class="hd" style="width:100%;position:fixed;">
      <h3>{{inputLayerObj.layerTitle}} </h3>
      <a class="i-close" @click="closeLayer()"></a>
    </div>
    <div class="config-bd-pd" style="background:#FFF;">
      <div style="clear:both;width:452px;border:1px dashed #d4d1d1;padding: 10px 10px 50px 10px;margin-bottom:10px;position:relative;" v-for="(item, index) in arrCheckList">
        <!-- <textarea name="" rows="3" class="input-text input-textarea am-mt-10" :placeholder="inputLayerObj.placeholder" v-model="textarea_" maxlength="100"></textarea> -->
        <div class="delate" @click="delateFn(index)"><a class="i-close"></a></div>
        <div class="chk-coll-active">
          <label class="am-ctr-chk " :class="getClassVerify(item, 1)" @click="verifyCheck($event, 1, item)">
            <i></i>
            <span class="txt">整形数字</span>
          </label>

          <template v-if="item.matchIntArr.length>0">
            <span class="txt">异常范围</span>
            <div class="hl-control-items">
              <verifyMatchType :matchItem="matchItem" :type="1" :nIndex="index" v-for="(matchItem,index) in item.matchIntArr" @delMatchType="deleteMatchType(index, 1, item)"></verifyMatchType>
            </div>
            <a class="i-hd-link-plus" title="添加" style="color:#666666" @click.stop="addMacthType(1, item)"></a>
          </template>
        </div>
        <div class="chk-coll-active">
          <label class="am-ctr-chk " :class="getClassVerify(item, 2)" @click="verifyCheck($event, 2, item)">
            <i></i>
            <span class="txt">浮点型数字</span>
          </label>
          <template v-if="item.matchFloatArr.length>0">
            <span class="txt">异常范围</span>
            <div class="hl-control-items">
              <verifyMatchType :matchItem="matchItem" :type="2" :nIndex="index" v-for="(matchItem,index) in item.matchFloatArr" @delMatchType="deleteMatchType(index, 2, item)"></verifyMatchType>
            </div>
            <a class="i-hd-link-plus" title="添加" style="color:#666666" @click.stop="addMacthType(2, item)"></a>
          </template>
        </div>
        <div class="chk-coll-active">
          <label class="am-ctr-chk " :class="getClassVerify(item, 3)" @click="verifyCheck($event, 3, item)">
            <i></i>
            <span class="txt">字符</span>
          </label>
          <template v-if="item.matchString&&item.matchString.mathType">
            <span class="txt">内容长度</span>
            <input type="text" class="input-text w70 am-ml-5" style="ime-mode:Disabled;vertical-align: top;" v-model="item.matchString.scope" />
            <span class="txt">字</span>
          </template>
        </div>
        <div class="am-mt-10"></div>
        <div style="float: left; margin-top: 5px;">
          <span class="txt chk-coll-active am-mr-10">提醒方式</span>
          <div class="am-ctr-sel w90" :class="{open: item.isRemindTypeOpen}" @click.stop="item.isRemindTypeOpen=true" @mouseleave="item.isRemindTypeOpen=false">
            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{item.remindType|convertRemindType}}</a>
            <div class="am-dropdown" v-show="item.isRemindTypeOpen">
              <ul>
                <li v-for="(itemRemind, index) in remindTypeArr" :key="index" @click.stop="selectRemindType(itemRemind, item)">
                  <a>{{itemRemind.remindType}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style="float:left;margin-left: 10px;margin-top: 5px">
          <span class="txt" style="line-height:30px;">提示语</span>
          <input type="text" class="input-text w70 am-ml-5" style="ime-mode:Disabled;vertical-align: top;" v-model="item.markedWords" />
        </div>
        <label class="am-ctr-chk" style="float:left;margin-left: 10px;margin-top: 9px" :class="getClassCheckLevel(item)" @click="verifyCheckLevel($event, item)">
          <i></i>
          <span class="txt">提示后可保存</span>
        </label>
      </div> 
      <div class="am-btn-area" style="clear: both">
        <a class="am-btn am-btn-dashed-add" @click="addRemind" style="display: block;padding:5px 0px;">+校验</a>
        <a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
      </div>           
    </div>
  </div>
</template>
<script>
import verifyMatchType from "./verifyMatchType.vue";
import Vue from "vue";
import Bus from "@/bus.js";
export default {
  props: ["inputLayerObj"],
  data() {
    return {
      initData: null,
      targetObj: {},
      layerIndex: 0,
      remindTypeArr: [
        { remindType: "请选择", id: 0 },
        { remindType: "预警色", id: 1 },
        { remindType: "弹出提示", id: 2 }
      ],
      arrCheckList: [],
    };
  },
  filters: {
    convertRemindType(item) {
      if (item == 1) {
        return "预警色";
      } else if (item == 2) {
        return "弹出提示";
      } else {
        return "请选择";
      }
    }
  },
  methods: {
    delateFn: function(i) {
      this.arrCheckList.splice(i, 1)
    },
    getClassVerify: function(item, type) {
      if (item.inputType == type) {
        return "active";
      } else {
        return "";
      }
    },
    getClassCheckLevel: function(item) {
      if (item.checkLevel == 0) {
        return "active";
      } else {
        return "";
      }
    },
    selectRemindType: function(itemRemind, item) {
      item.remindType = itemRemind.id;
      item.isRemindTypeOpen = false;
    },
    verifyCheck(event, type, item) {
      this.$set(item, 'inputType', 0);
      let obj = $(event.currentTarget);
      if (obj.hasClass("active")) {
        item.inputType = undefined;
        item.scopeList = [];
        item.matchIntArr = [];
        item.matchFloatArr = [];
        item.matchString = {}
      } else {
        let mathType = 0;
        if (type == 3) {
          mathType = 6;
          item.scopeList = [{ mathType: mathType, scope: "" }];
          item.matchIntArr = [];
          item.matchFloatArr = [];
          item.matchString.mathType = 6;
          item.inputType = 3;
        }
        if(type == 2) {
          item.inputType = 2;
          item.matchString = {};
          item.matchIntArr = [];  
          item.matchFloatArr = [{ mathType: mathType, scope: "" }]  
          item.scopeList = [{ mathType: mathType, scope: "" }];
        }
        if(type == 1) {
          item.inputType = 1;
          item.matchString = {};
          item.scopeList = [{ mathType: mathType, scope: "" }];
          item.matchFloatArr = [];
          item.matchIntArr = [{ mathType: mathType, scope: "" }]
        }
      }
    },
    verifyCheckLevel: function(event, item) {
      let obj = $(event.currentTarget);
      if (obj.hasClass("active")) {
        Vue.set(item, "checkLevel", 1);
      } else {
        Vue.set(item, "checkLevel", 0);
      }
    },
    getMatchArr: function(type) {
      debugger;
      let matchArr = (this.targetObj && this.targetObj.scopeList) || [];
      if (this.targetObj && this.targetObj.inputType) {
        if (this.targetObj.inputType == 1) {
          this.matchIntArr = matchArr;
          this.matchFloatArr = [];
          this.matchString = {};
        } else if (this.targetObj.inputType == 2) {
          this.matchFloatArr = matchArr;
          this.matchIntArr = [];
          this.matchString = {};
        } else if (this.targetObj.inputType == 3) {
          if (matchArr.length > 0) {
            this.matchString = matchArr[0];
          } else {
            this.matchString = {};
          }
          this.matchIntArr = [];
          this.matchFloatArr = [];
        }
      } else {
        this.matchIntArr = [];
        this.matchFloatArr = [];
        this.matchString = {};
      }
    },
    setMatchArr: function(obj){
      let matchArr = (obj && obj.scopeList) || [];
      let matchFloatArr = [];
      let matchString = {};
      let matchIntArr = [];
      if(obj && obj.inputType == 1) {
        matchIntArr = matchArr;
        matchFloatArr = [];
        matchString = {};        
      }
      if(obj && obj.inputType == 2) {
        matchFloatArr = matchArr;
        matchIntArr = [];
        matchString = {};        
      }
      if(obj && obj.inputType == 3) {
        if (matchArr.length > 0) {
          matchString = matchArr[0];
        } else {
          matchString = {};
        }
        matchIntArr = [];
        matchFloatArr = [];        
      }     
      if(obj && !obj.inputType) {
        matchIntArr = [];
        matchFloatArr = [];
        matchString = {};        
      }
      this.$set(obj, 'matchIntArr', matchIntArr)
      this.$set(obj, 'matchFloatArr', matchFloatArr)
      this.$set(obj, 'matchString', matchString)
      this.$set(obj, 'isRemindTypeOpen', false)
    },
    //添加匹配类型
    addMacthType: function(type, item) {
      if (type == 1) {
      item.matchIntArr.push({
          mathType: 0,
          scope: ""
        });
      } else if (type == 2) {
        item.matchFloatArr.push({
          mathType: 0,
          scope: ""
        });
      }
    },
    deleteMatchType: function(index, type, item) {
      if (type == 1) {
        item.matchIntArr.splice(index, 1);
      } else if (type == 2) {
        item.matchFloatArr.splice(index, 1);
      }
    },
    getSaveData(array) {
      array.forEach(element => {
        if(element.inputType && element.inputType == 1) {
          element.scopeList = element.matchIntArr;          
        }
        if(element.inputType && element.inputType == 2) {
          element.scopeList = element.matchFloatArr;          
        }   
        if(element.inputType && element.inputType == 3) {
          element.scopeList = [element.matchString];          
        } 
        delete element.matchIntArr;
        delete element.matchFloatArr;
        delete element.matchString; 
        delete element.isRemindTypeOpen;                     
      })
    },
    save_() {
      this.getSaveData(this.arrCheckList)
      this.inputLayerObj.content = this.arrCheckList;

      this.$emit("save", this.inputLayerObj);
      layer.close(this.layerIndex);
    },
    initLayer(index) {
      this.layerIndex = index;
    },
    closeLayer() {
      layer.close(this.layerIndex);
    },
    addRemind() {
      this.setMatchArr(this.initData)
      let oData = JSON.parse(JSON.stringify(this.initData))
      // console.log(oData)
      let defaultData = {
        checkContext: "",
        checkId: oData.checkId,
        checkLevel: "1",
        checkType: "",
        isRemindTypeOpen: false,
        markedWords: "",
        matchFloatArr: [],
        matchIntArr: [],
        matchString: {},
        optionId: oData.optionId,
        pictureCount: 0,
        pictureFormat: "",
        pictureSize: "",
        questionId: oData.questionId,
        remindType: 0,
        sortNum: 0,        
      }
      this.arrCheckList.push(defaultData);
    }
  },
  mounted() {    
    Bus.$on('sendVerifyLayer' , (data) => {
      this.initData = JSON.parse(JSON.stringify(data.content))
    })
  },
  watch: {
    inputLayerObj: function(curValue) {
      this.arrCheckList = [];
      this.inputLayerObj = curValue;
      this.targetObj = {};
      if(this.inputLayerObj.content && this.inputLayerObj.checkListGroup && this.inputLayerObj.checkListGroup.length > 0) {
        // this.inputLayerObj.checkListGroup.push(this.inputLayerObj.content);
        this.arrCheckList = this.inputLayerObj.checkListGroup;
        this.arrCheckList.forEach(element => {
          this.setMatchArr(element);          
        });        
      }
      if(this.inputLayerObj.content && this.inputLayerObj.checkListGroup && this.inputLayerObj.checkListGroup.length == 0) {
        this.arrCheckList.push(this.inputLayerObj.content);
        this.arrCheckList.forEach(element => {
          this.setMatchArr(element);          
        });
      }
      if(!this.inputLayerObj.content && this.inputLayerObj.checkListGroup) {
        this.arrCheckList =  this.inputLayerObj.checkListGroup;       
      }
    }
  },
  components: {
    verifyMatchType: verifyMatchType
  }
};
</script>

