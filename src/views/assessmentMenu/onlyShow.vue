<template>
  <div class="am-form" style="max-width: 800px;">
    <div class="am-form-item" v-if="rightData.logo!=''">
      <div class="am-form-label am-col-4">图片</div>
      <div class="am-col-20">
        <div class="am-file-menu-img active">
          <img :src="rightData.logo">
        </div>
      </div>
    </div>
    <div class="am-form-item" v-if="rightData.menuUrlType==='1'">
      <div class="am-form-label am-col-4 static">url地址</div>
      <div class="am-col-20">
        <span class="am-mr-10">URL+参数映射</span>
        <div class="am-mt-10">{{rightData.menuUrl}}</div>
        <div
          class="am-mt-10"
          v-for="(mapping,index) in rightData.mappingList"
          :key="index"
          v-if="mapping.remoteColumn!=''||mapping.localColumn!=''"
        >
          <span class="am-mr-10">{{mapping.remoteColumn}}</span>---
          <span class="am-mr-10">{{mapping.localColumn}}</span>
        </div>
      </div>
    </div>
    <!--am-form-item end-->
    <!--am-form-item-->
    <div class="am-form-item" v-if="rightData.menuUrlType==='2'">
      <div class="am-form-label am-col-4 static">url地址</div>
      <div class="am-col-20">
        <span class="am-mr-10">webservece配置一个接口地址+参数映射</span>
        <div class="am-mt-10">{{rightData.menuUrl}}</div>
        <div class="am-mt-10">
          <span class="am-mr-10">出参</span>GetEntryPointUrlResult
        </div>
      </div>
    </div>
    <!--am-form-item end-->
    <!--am-form-item-->
    <div class="am-form-item">
      <div class="am-form-label am-col-4 static">科室权限</div>
      <div class="am-col-20">
        <span v-if="rightData.isGlobal === 0">{{getWards.length}} 科室</span>
        <span v-if="rightData.isGlobal === 1">全院</span>
        <div class="am-mt-10" v-if="rightData.isGlobal === 0">
          <span v-for="(ward,index) in getWards" :key="index">
            {{ward}}
            <span class="muted-line-txt" v-if="index!=getWards.length-1">|</span>
          </span>
        </div>
      </div>
    </div>
    <!--am-form-item end-->
    <!--am-form-item-->
    <div class="am-form-item">
      <div class="am-form-label am-col-4 static">角色权限</div>
      <div class="am-col-20">
        {{getRoles.length}} 个权限
        <div class="am-mt-10">
          <span v-for="(role,index) in getRoles" :key="index">
            {{role}}
            <span class="muted-line-txt" v-if="index!=getRoles.length-1">|</span>
          </span>
        </div>
      </div>
    </div>
    <!--am-form-item end-->
    <!--am-form-item-->
    <div class="am-form-item">
      <div class="am-form-label am-col-4 static">可见性</div>
      <div class="am-col-20" v-show="rightData.activeFlag==1">显示</div>
      <div class="am-col-20" v-show="rightData.activeFlag==0">隐藏</div>
    </div>
    <div class="am-form-item">
      <div class="am-form-label am-col-4 static">是否第三方调用</div>
      <div class="am-col-20" v-show="rightData.thirdPartyInvoke==1">是</div>
      <div class="am-col-20" v-show="rightData.thirdPartyInvoke!==1">否</div>
    </div>
    <!--am-form-item end-->
  </div>
</template>
<script>
export default {
  name: "showConfig",
  props: {
    rightData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    getWards: function() {
      if (this.rightData.wardName === "" || !this.rightData.wardName) {
        return [];
      }
      if (this.rightData.wardName.length) {
        return this.rightData.wardName.split("|");
      } else {
        return [];
      }
    },
    getRoles: function() {
      if (this.rightData.roleName === "" || !this.rightData.roleName) {
        return [];
      }
      if (this.rightData.roleName.length) {
        return this.rightData.roleName.split("|");
      } else {
        return [];
      }
    }
  },
  mounted() {
    console.log(this.rightData);
  }
};
</script>
