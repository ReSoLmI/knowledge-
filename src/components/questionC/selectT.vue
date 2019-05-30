<template>
  <div class="am-item-inline">
    <div class="am-ctr-sel-close">
      <div class="am-ctr-sel" v-bind:style="{ width: type=='unit'&&!mUnit?'120px':type=='time'?'210px':LogicMode?'105px':mUnit?'80px':'80px'}" :class="{'open':isOpen}" @click="toggleOpen($event)" @mouseleave="blur_($event)" style="float:left;">
        <a class="caption" style="min-height:30px;" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" :style="getStyle">{{showName(currChosed)}}</a>
        <div class="am-dropdown" style="width:100%" v-show="isOpen">
          <ul>
            <li v-for="(item, index) in list" :key="index" @click="chosedS(item)" :class="{'logicMode': index==0&&LogicMode}">
              <a>{{showName(item)}}</a>
            </li>
          </ul>
        </div>
      </div>
      <a class="i-label-close" v-show="!mUnit&&type == 'unit'&&index!=0" @click.stop="delUnit"></a>
    </div>
  </div>
</template>
<script>
export default {
  name: "selectT",
  props: [
    "LogicMode",
    "list",
    "chosed",
    "type",
    "index",
    "parentIndex",
    "symbol",
    "mUnit"
  ],
  data() {
    return {
      currChosed: {},
      isOpen: false
    };
  },
  methods: {
    showName(obj) {
      if (this.type == "unit") {
        return obj.unitName;
      }
      return obj.name;
    },
    blur_(event) {
      this.isOpen = false;
    },
    toggleOpen(event) {
      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },
    chosedS(item) {
      this.currChosed = item;
      this.$emit("complete", item, this.index, this.parentIndex);
    },
    getName(code) {
      let str = "";
      this.list.some(function(el) {
        if (el.code == code || el.unitCode == code) {
          str = el.name || el.unitName;
        }
        return el.code == code || el.unitCode == code;
      });
      return str;
    },
    getUnit(code) {
      let tempObj = {};
      this.list.some(function(el) {
        if (el.unitCode == code) {
          tempObj = el;
        }
        return el.unitCode == code;
      });

      return tempObj;
    },
    delUnit: function() {
      //
      this.$emit("deleteUnit", this.index, this.parentIndex);
    },
    getStyle: function() {
      if (this.type == "unit") {
        return "border-radius: 4px 0 0 4px";
      }
    }
  },
  watch: {
    chosed: function(curValue) {
      debugger
      if (this.type == "unit") {
        if (!this.chosed.unitCode) {
          this.currChosed = this.list[0];
        } else {
          this.chosed.unitName = this.getName(this.chosed.unitCode);
          this.currChosed = this.chosed;
        }
      } else {
        if (!this.chosed.code) {
          this.currChosed = this.list[0];
        } else {
          this.chosed.name = this.getName(this.chosed.code);
          this.currChosed = this.chosed;
        }
      }
    }
  },
  mounted() {
    if (this.type == "unit") {
      debugger
      if (!this.chosed.unitCode) {
        this.currChosed = this.list[0];
      } else {
        this.chosed.unitName = this.getName(this.chosed.unitCode);
        this.currChosed = this.chosed;
      }
    } else {
      debugger
      if (!this.chosed.code) {
        this.currChosed = this.list[0];
      } else {
        this.chosed.name = this.getName(this.chosed.code);
        this.currChosed = this.chosed;
      }
    }
  }
};
</script>
<style scoped>
.logicMode {
  background: #f3f3f3;
}
.logicMode a {
  cursor: not-allowed;
}
</style>
