<template>
  <div>
    <div class="qx" v-for="(rowItem, rowIndex) in limitArea" :key=rowIndex> 
      <div class="am-ctr-sel w120 control-item">
        <a class="caption" href="javascript:void(0)" @click="openSelectList($event)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{ rowItem.currentRole }}</a>
        <div class="am-dropdown am-mr-10">
          <ul>     
            <li v-for="(item, index) in roleList" @click="selectVal(rowItem,rowIndex,item, $event)" :key=index :class="{ 'active':rowItem.currentRole==item.name}">
              <a href="javascript:void(0)">{{ item.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div :class='{"control-collapse":true,"w120":true,"control-item":true,"open":rowItem.isOpen}' @mouseleave="leaveWardList(rowItem)">
        <div class="hd" style="background:#FFF;height:30px;font-size:14px;" @click.stop="openWardList($event, rowItem, rowIndex)" >
          <i class="i-collapse-angle"></i>{{rowItem.deptCodeNum}}
          <span class="am-ml-5">科室</span>
        </div>
        <div class="bd chk-panel chk-panel-dd" style="width: 600px;border-top: 1px solid #D2D2D2;margin-top: 1px;">
          <div class="hd" style="background:#FFF">
            <div :class='{"all-ward":true, "active":allIsActive}' @click="allWardCode($event)">
              <span>全部</span>
            </div>
          </div>
          <div class="bd" style="max-height: 206px;">
            <ul>
              <li v-for="(item, index) in wardList" :key=index>
                <div :class="{'am-ctr-native-chk':true, 'active':item.isActive}" @click.stop="changeSelect($event, item)" >
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
        <a class="caption" href="javascript:void(0)" @click="openSelectList($event)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{ rowItem.static }}</a>
        <div class="am-dropdown am-mr-10">
          <ul>                                                                     
            <li  v-for="(colItem, colIndex) in limitArr" :key=colIndex  @click="selectStaticVal(colItem, rowIndex, $event)" :class="{'active':colItem.limitName==rowItem.static}">
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
    <label></label>
  </div>
</template>

<script>
export default {
  name:'LimitArea',
  props: ["limitArea","wardList", "roleList"],
  data() {
    return {
      allIsActive: false,
      limitArr: [
        {'limitName': '只读', 'isActive': true, 'authority': 1},
        {'limitName': '编辑', 'isActive': false, 'authority': 2},
      ]
    };
  },
  mounted() {

  },
  computed: {

  },
  methods: {
    leaveWardList: function(item) {
      item.isOpen = false;
    },
    openSelectList: function(ev) { 
      $(ev.target)
        .siblings()
        .slideToggle()
        .parent()
        .toggleClass("open");
    },
    selectVal: function(rowItem,rowIndex, item, ev) { 
      rowItem.currentRole = item.name;  
      rowItem.userRole = item.code; 
      $(ev.target)
        .parents(".control-item")
        .removeClass("open"); 
      $(ev.target)
        .parents(".am-dropdown")
        .css("display", "none"); 
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
    selectStaticVal: function(val, i, ev) { 
      val.isActive = true;
      this.limitArea[i].static = val.limitName;  
      this.limitArea[i].authority = val.authority; 
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
    addLimt: function() { // 增加
      this.default();
      this.limitArea.push({
        authority: "0",
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
      this.roleList.forEach((ele, i) => {
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

<style scoped>
.basic-senior .con .main .qx {
  margin-left: 87px !important;
}
</style>


