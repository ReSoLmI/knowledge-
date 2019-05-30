<template>
<div style="display:block;">
    <div class="qx" v-for="(rowItem, rowIndex) in limitArea" :key=rowIndex>
      <div class="am-ctr-sel w120 control-item">
        <a class="caption" href="javascript:void(0)" @click="openSelectList($event, rowItem)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{ rowItem.currentRole }}</a>
        <div class="am-dropdown am-mr-10">
          <ul>
            <li v-for="(item, index) in limitRoleList" @click="selectVal(rowItem, item, index, $event)" :key=index :class="{ 'active': item.isActive }">
              <a href="javascript:void(0)">{{ item.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div :class='{"control-collapse":true, "w120":true, "control-item":true, "open":rowItem.isOpen}'>
        <div class="hd" style="background:#FFF;height:30px;font-size:14px;" @click.stop="openWardList($event, rowItem, rowIndex)">
          <i class="i-collapse-angle"></i>{{rowItem.deptCodeNum}}
          <span class="am-ml-5">科室</span>
        </div>
        <div class="bd chk-panel chk-panel-dd" style="width: 600px;border-top: 1px solid #D2D2D2;margin-top: 1px;" @mouseleave="leaveWard(rowItem)">
          <div class="hd" style="background:#FFF">
            <div :class='{"all-ward":true, "active":allIsActive}' @click="allWardCode($event)">
              <span>全部</span>
            </div>
          </div>
          <div class="bd" style="max-height: 206px;">
            <ul>
              <li v-for="(item, index) in wardList" :key=index>
                <div :class="{'am-ctr-native-chk':true, 'active':item.isActive}" @click="changeSelect($event, item)">
                  <span>{{ item.name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="ft">
            <a class="am-btn am-btn-primary am-mr-10" @click="confirm(rowIndex)">确定</a>
            <a class="am-btn am-btn-plain-primary am-mr-10" @click="cancle(rowIndex)">取消</a>
          </div>
        </div>
      </div>
      <div class="control-item am-ctr-sel w120">
        <a class="caption" href="javascript:void(0)" @mouseout="roleMouseout($event)" @click="openSelectLimitArr($event, rowItem)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{ rowItem.static }}</a>
        <div class="am-dropdown am-mr-10">
          <ul>
            <li  v-for="(colItem, colIndex) in limitArr" :key=colIndex  @click="selectStaticVal(colItem, rowIndex, colIndex, $event)" :class="{'active':colItem.isActive}">
              <a href="javascript:void(0)">{{ colItem.limitName }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="control-item">
        <a class="i-row-plus am-ml-10" @click="addLimt"></a>
        <a class="i-row-minus am-ml-10" @click="delLimt(rowIndex)"></a>
      </div>
    </div>
</div>    
</template>

<script>
import common from "@/util/common.js";
export default {
  props: ["limitArea", "limitRoleList", "currentAreaIndex"],
  data() {
    return {
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      allIsActive: false,
      wardList: [],
      limitArr: [
        {'limitName': '只读', 'isActive': true, 'authority': 1},
        {'limitName': '编辑', 'isActive': false, 'authority': 2},
      ]
    };
  },
  computed: {
    newLimitArr: function() {
      
    },
  },
  mounted() {
    // console.log(limitArea)
    // if(!this.limitArea) { return; }

    if(this.limitArea && this.limitArea.length > 0 && this.limitArea[this.currentAreaIndex].wardCodeStr) {
      let aStaticWardList = this.limitArea[this.currentAreaIndex].wardCodeStr.split(',');
      this.queryAllWards(aStaticWardList)
    } else {
      this.queryAllWards([]);
    }

  },
  methods: {
    deepClone: function (obj) {
      var newObj = obj instanceof Array ? [] : {};
      //obj属于基本数据类型,直接返回obj
      if(typeof obj !== 'object') {
        return obj;
      } else {
      //obj属于数组或对象，遍历它们
        for(var i in obj) {
          newObj[i] = typeof obj[i] === 'object' ? this.deepClone(obj[i]):obj[i]; 
        }
      }
      return newObj;
    },     
    staticWardList: function() {
      let arrStaticWarst = this.limitArea.wardCodeStr.split(',')
      console.log(arrStaticWarst)
      this.wardList.forEach((ele, i) => {
        arrStaticWarst.forEach((element, index) => {
          if(ele.code == element) {
            ele.isActive = true;
          }
        })    
      })
      // this.staticWardList = this.wardList;
    },
    queryAllWards: function () {
      const that = this;
      common.ajax({
        url: 'knowledge-service/routine/wards',
        type: 'get',
        async: false,
        dataType: 'json',
        data: { organCode: common.getOrganCode() },    
        callback: (result) => {
          that.wardList = result; 
          that.wardList.forEach((ele, i) => {
            that.$set(ele, 'isActive', false)
          })
          // console.log(that.wardList)
        }
      })
    },    
    openSelectList: function(ev, item) {
      console.log(item)
      console.log(this.limitRoleList)

      this.limitRoleList.forEach((ele, i) => {
        if(ele.code == item.userRole) {
          ele.isActive = true;
        } else {
          ele.isActive = false;
        }
      })

      $(ev.target)
        .siblings()
        .slideToggle()
        .parent()
        .toggleClass("open");
    },
    openSelectLimitArr: function(ev, item) {     
      this.limitArr.forEach((ele, i) => {
        if(ele.limitName == item.static) {
          ele.isActive = true;
        } else {
          ele.isActive = false;
        }
      })      
      $(ev.target)
        .siblings()
        .slideToggle()
        .parent()
        .toggleClass("open");
    },
    selectVal: function(rowItem, item, i, ev) {
      rowItem.currentRole = item.name;
      rowItem.userRole = item.code;

      console.log(this.limitRoleList)
      this.limitRoleList.forEach( (ele, i) => {
        ele.isActive = false;
      } )
      this.limitRoleList[i].isActive = true;

      $(ev.target)
        .parents(".control-item")
        .removeClass("open");
      $(ev.target)
        .parents(".am-dropdown")
        .css("display", "none");
    },
    openWardList: function(ev, item, index) {
      console.log(item)
      if(item.wardCodeStr) {
        let arrWardCodeList = item.wardCodeStr.split(',')
        arrWardCodeList.forEach((ele, i) => {
          if(!ele) {
            arrWardCodeList.splice(i ,1)    
          }
        })
        // console.log(arrWardCodeList)
        this.wardList.forEach((element, index) => {
          arrWardCodeList.forEach((ele, i) => {
            if(element.code == ele) {
              element.isActive = true;
            }
          })
        })
      }

      item.isOpen = !item.isOpen;
    },
    leaveWard: function(item) {
      item.isOpen = false;
    },
    allWardCode: function(ev) {
      if (this.allIsActive) {
        this.wardList.forEach((ele, i) => {
          ele.isActive = false;
        });
      } else {
        this.wardList.forEach((ele, i) => {
          ele.isActive = true;
        });
      }
      this.allIsActive = !this.allIsActive;
    },
    changeSelect: function(ev, item) {
      item.isActive = !item.isActive;
    },
    confirm: function(index) {
      let n = 0;
      let str = '';
      this.wardList.forEach((ele, i) => {
        if (ele.isActive == true) {
          str += ele.code + ','
          n++;
        }
      });
      this.limitArea[index].deptCodeNum = n;
      this.limitArea[index].isOpen = false;
      this.limitArea[index].wardCodeStr = str;
    },
    selectStaticVal: function(val, i, index, ev) {
      val.isActive = true; 
      this.limitArea[i].static = val.limitName;
      this.limitArea[i].authority = val.authority;

      this.limitArr.forEach((ele, i) => {
        ele.isActive = false;
      })

      console.log(index)
      console.log(this.limitArr)
      this.limitArr[index].isActive = true;

      $(ev.target)
        .parents(".control-item")
        .removeClass("open");
      $(ev.target)
        .parents(".am-dropdown")
        .css("display", "none");
    },
    roleMouseout: function(ev) {
      $(ev.target)
        .parents(".control-item")
        .removeClass("open");
      $(ev.target)
        .parents(".am-dropdown")
        .css("display", "none");
    },
    addLimt: function() {
      this.default();

      this.limitArea.push({

        authority: "1",
        currentRole: "评估单配置员",
        deptCodeNum: 0,
        isOpen: false,
        organCode: this.organCode,
        static: "只读",
        userRole: "ASSESSMENT_CONF",
        wardCodeStr: ""  

      });
    },
    delLimt: function(index) {
      this.limitArea.splice(index, 1);
    },
    cancle: function(index) {
      this.limitArea[index].isOpen = false;      
    },
    default: function() {
      this.allIsActive = false;
      this.wardList.forEach((ele, i) => {
        ele.isActive = false;
      });
      this.limitRoleList.forEach((ele, i) => {
        if(i==0) {
          ele.isActive = true;
        } else {
          ele.isActive = false;
        }
      });
      this.limitArr.forEach((ele, i) => {
        if(i==0) {
          ele.isActive = true;
        } else {
          ele.isActive = false;
        }
      })
    }
  }
};
</script>

