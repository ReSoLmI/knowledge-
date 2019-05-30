<template>
  <div>
    <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
    <div class="am-page-rcont bg-main">
      <div class="am-page-pd">
        <div class="book-top-cont">
          <div class="book-top-return">
            <a class="txt-return" @click.stop="returnBack()">返回</a>
            <div class="h5">
              <template v-if="!isEditAssesmentName">{{evaluationName}}
                <i class="i-link-upd am-ml-5" style="margin-top: -2px;" @click.stop="clickEditAssesment"></i>
              </template>
              <template v-if="isEditAssesmentName">
                <input type="text" class="input-text w180" v-model="evaluationName" id="inputAssesment" @blur="editAssesmentName()" />
                <a @click.stop="editAssesmentName()">保存</a>
              </template>
            </div>
          </div>
          <div class="step-list-cont">
            <ul class="step-list">
              <li class="active">
                <i class="num">1</i>
                <span class="txt">新建或选择模版</span>
              </li>
              <li class="active">
                <i class="num">2</i>
                <span class="txt">文书样式</span>
              </li>              
              <li class="active">
                <i class="num">3</i>
                <span class="txt">配置文书内容</span>
              </li>
              <li class="active">
                <i class="num">4</i>
                <span class="txt">列表设置</span>
              </li>
              <li class="active">
                <i class="num">5</i>
                <span class="txt">科室设置</span>
              </li>
              <li class="cur">
                <i class="num">6</i>
                <span class="txt">编辑域设置</span>
              </li>
            </ul>
            <div class="right">
              <a class="am-btn am-btn-plain-info am-ml-10" @click="clickSkip">回到首页</a>
              <a class="am-btn am-btn-plain-info am-ml-10" @click="returnHome">暂不设置</a>
              <a class="am-btn am-btn-info am-ml-10" @click="saveAllArea">保存</a>
            </div>
          </div>
        </div>
        <div class="fixed-contain-midden" v-if="isSkip">
          <div class="item-midden">
            <p>如果此单据不设置编辑域，请跳过此步。</p>
            <div style="margin-bottom: 10px;"> <a @click.stop="changeAssesmentStatus(1)">开始设置</a></div>
            <p @click.stop="clickSkip()"><a class="am-btn am-btn-info">确认跳过</a></p>
          </div>
        </div>
				<div class="basic-senior" v-show="!isSkip" style="height:500px;">
					<ul class="title clearfix">
						<li class="active">
							<a href="javascript:void(0)">基础模式</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click="goHightArea">高级模式</a>
						</li>
					</ul>
          <reactContent v-if="routineFlag != 2" :from="fromFlag" ref="react" :reactHigh.sync="reactHigh"></reactContent>
				</div>        
      </div>
    </div>
  </div>
</template>
<script>
import mMenu from "../../components/menu.vue";
import common from "@/util/common.js";
import reactContent from './reactMainContent'

export default {
  data() {
    return {
      fromFlag: 'baseAreact',
      isSkip: true,
      reactHigh: true,
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      currentPage: "createAssessmentReactArea",
      evaluationId: common.getUrlParam("assesmentId"),
      routineFlag: null, // 当前文书存在哪个流程的标志
      evaluationName: '',
      isEditAssesmentName: false,
    };
  },
  watch: {
    routineStepList: {
      deep: true,
      handler: function(nVal, oVal) {
        this.isEdit = true;
      }
    }
  },
  methods: {
    clickSkip: function() {
      this.$router.push({ path: "/" });
    },
    returnBack: function() {
      let { query } = this.$route;
      this.$router.push({ path: "/createAssesmentByDept", query: query });
    },
    goHightArea: function() {
      let { query } = this.$route;
      query.routineFlag = 2;
      this.$router.push({ path: "/assessmentHightArea", query: query });
    },
    // 更新编辑域设置状态
    changeAssesmentStatus: function(n) {
      this.isSkip = false;
      this.routineFlag = n;
      let data={evaluationId:this.evaluationId,routineFlag:this.routineFlag};
      common.ajax({
        url: 'knowledge-service/evaluation/updateRoutineFlag',
        type: 'get',
        data:data,
        dataType:'json',
      });   
    },
    edit: function(ev) {
      ev.target.parentElement.previousElementSibling.disabled = false;
      // console.log(ev.target.parentElement.previousElementSibling.disabled = false)     
    },
    saveAllArea: function() {
      this.changeAssesmentStatus(1);
      this.$refs.react.saveAllArea();
    },
    //编辑评估单名称
    editAssesmentName:function(){
      let that=this;
      let data={evaluationId:this.evaluationId,evaluationName:this.evaluationName};
      common.ajax({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data:JSON.stringify(data),
        callback: function(problems) {
          that.isEditAssesmentName=false;
          common.tip_msg("保存成功",1000);
        }
      });
    },
    clickEditAssesment:function() {
      this.isEditAssesmentName=true;
      Vue.nextTick(function(){
          $('#inputAssesment').focus();
      })
    },   
    callbackSet: function() {
      this.changeAssesmentStatus(0);
    },
    returnHome: function() {
      const that = this;
      let param = {
        'evaluationId': this.evaluationId,
        'type': 2
      }
      common.ajax({
        url: 'knowledge-service/evaluation/paper2/reset',
        type: 'get',
        data: param,  
        callback: function() {
          common.tip_msg('重置成功', 1000)
        }         
      })      
      this.$router.push({ path: "/" });
    }     
  },
  mounted() {    
    this.evaluationName = this.$route.query.evaluationName || common.getUrlParam("evaluationName");
    if(!this.routineFlag) {
      this.isSkip = true;
    } else {
      this.isSkip = false;
    }

  },
  created() {
    this.routineFlag = this.$route.query.routineFlag;
    if(this.routineFlag == 2) {
      this.goHightArea();
    }
  },
  components: {
    menuTemplate: mMenu,
    reactContent: reactContent
  }
}
</script>

<style scoped>
.am-ctr-native-chk {
  background: none;
}
.basic-senior .con .main .domain-list {
  padding: 0px
}
.basic-senior .con .main .edit-domain .all-select {
  padding: 0px 0px 10px 0px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
