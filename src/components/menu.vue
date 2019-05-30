<template>
  <div class="am-page-lside">
    <ul class="lside-menu-min">
      <li
        :class="{active:selectItem==''||selectItem=='createAssesmentTitle'||selectItem=='createAssesmentContent'||selectItem=='assesmentTableSetting'||selectItem=='styleSetting'||selectItem=='createNotification'||selectItem=='createMenuList' }"
        @click="selectClick()"
      >
        <router-link :to="{ path: '/'+this.selectItem}">
          <img src="../image/assesment.png">
          <div class="txt">文书</div>
        </router-link>
      </li>
      <li :class="{active:selectItem=='createQuestion'}" @click="selectIssure('createQuestion')">
        <router-link :to="{ path: '/createQuestion'}">
          <img src="../image/problem.png">
          <div class="txt">问题</div>
        </router-link>
      </li>
      <li
        :class="{active:selectItem=='wardAssesmentSetting'}"
        @click="selectIssure('wardAssesmentSetting')"
      >
        <router-link :to="{path:'/wardAssesmentSetting'}">
          <img src="../image/nav-user.png">
          <div class="txt">文书分配</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import common from "@/util/common.js";
import Bus from "@/bus.js";
export default {
  name: "mMenu",
  props: ["currentPage"],
  data() {
    return {
      selectItem: this.currentPage || "", //当前选中的菜单名
      isopen: true,
      wardCode: common.getWardCode(), //科室code
      isQuestionnaireOpen: false,
      attchedRoles: []
    };
  },
  created: function() {},
  updated: function() {},
  mounted() {
    let roles = null;
    if (window.sessionStorage.getItem("attchedRoles")) {
      roles = JSON.parse(window.sessionStorage.getItem("attchedRoles"));
      this.attchedRoles = roles || [];
    }
  },
  methods: {
    isShowByRight: function(right) {
      let arr = this.attchedRoles.filter(al => {
        return al.roleCode == right;
      });
      if (arr.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    //点击菜单
    selectClick: function() {
      if (
        this.selectItem == "createQuestion" ||
        this.selectItem == "wardAssesmentSetting"
      ) {
        this.selectItem = "";
        this.$router.push({ path: "/" + this.selectItem });
      }
      if (this.selectItem == "createMenuList") {
        this.$router.push({ path: "/" });
      }
    },
    selectIssure: function(item) {
      this.selectItem = item;
    },
    initMenus: function() {
      this.isQuestionnaireOpen = true;
      this.isopen = false;
    },
    showMenu: function() {
      this.isopen = !this.isopen;
      this.isQuestionnaireOpen = !this.isopen;
    },
    showQuestionnaireMenu: function() {
      this.isQuestionnaireOpen = !this.isQuestionnaireOpen;
      this.isopen = !this.isQuestionnaireOpen;
    }
  },
  watch: {}
};
</script>
<style type="text/css">
.lside-secondary-menu {
  text-align: left;
}
.lside-secondary-menu > li > a {
  position: relative;
  display: block;
  line-height: 40px;
  padding: 0 20px;
  color: #fff;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
}
.lside-secondary-menu > li.li-angle > a {
  padding-right: 35px;
}
.lside-secondary-menu > li.li-angle > a:before {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -4px;
  width: 10px;
  height: 8px;
  background: url(../image/tree-angle-white.png) no-repeat center center;
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
}
.lside-secondary-menu > li.li-angle > a:active {
  background: #4b6fa1;
  opacity: 1;
  filter: alpha(opacity=100);
}
.lside-secondary-menu > li.li-angle.open a:before {
  transform: rotate(180deg);
}
.lside-secondary-menu > li.active > a {
  background: #eff1f3;
  color: #009ef9;
}
.lside-secondary-menu > li.active > a:before {
  background: url(../image/tree-angle-white.png) no-repeat center center;
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.lside-secondary-menu ul {
  display: none;
  position: relative;
}
.lside-secondary-menu ul:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #3d5371;
}
.lside-secondary-menu ul li {
  position: relative;
}
.lside-secondary-menu ul li:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  border-top: 1px solid #3d5371;
}
.lside-secondary-menu ul a {
  display: block;
  line-height: 40px;
  padding: 0 20px 0 30px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #fff;
  opacity: 0.6;
  filter: alpha(opacity=60);
  font-size: 14px;
}
.lside-secondary-menu ul a:hover {
  color: #fff;
  opacity: 1;
  filter: alpha(opacity=100);
}
.lside-secondary-menu ul li.active a {
  color: #009ef9;
  background: #eff1f3;
  opacity: 1;
  filter: alpha(opacity=100);
}
.lside-secondary-menu .li-num a {
  padding-right: 40px;
}
.lside-secondary-menu .li-num .num {
  content: "";
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -15px;
  line-height: 30px;
}
</style>
