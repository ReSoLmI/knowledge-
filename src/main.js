import './css/global.css';
import './css/care.css';
import './css/level.css';
import './css/pagination.css';
import './css/layout.css';
import './css/layout-tree.css';
import $ from 'jquery';
import '../static/layer_pc/layer.js';
import './directive.js'
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router.js';
import common from './util/common.js';
import store from './store/';
import './components/';
import App from './App';
import {
  init
} from '@/util/util'
import * as pagination from "vuejs-uib-pagination";



$(window).keydown(function (event) {
  if (event.keyCode == 123 && typeof (showDevTools) == 'function') {
    showDevTools();
  }
});

Vue.config.productionTip = false; // 阻止 vue 在启动时生成生产提示。
Vue.use(pagination);
Vue.use(VueRouter);
const router = new VueRouter({
  routes
});

// Vue.config.errorHandler = function(err, vm, info) {

// }

router.beforeEach((to, from, next) => {
  common.setUserInfo();
  common.setWardCode();
  layer.closeAll();
  $('.platform-header-place').css("display", "none");
  // $('.bg-main').css('background', '#fff');
  // 南京鼓楼版，去掉头部加载
  if (to.path == '/nursingDiagnosis' || to.path == '/questionnaireCach' || to.path == '/questionnaireList' || to.path == '/noRightMsg' || to.path == '/' || to.path == '/createAssesmentTitle' || to.path == '/createAssesmentContent' || to.path == '/createQuestion' || to.path == '/assesmentTableSetting' || to.path == '/createAssesmentByDept' || to.path == '/styleSetting' || to.path == '/createNotification' || to.path == '/wardAssesmentSetting' || to.path == '/createAssessmentReactArea' || to.path == '/assessmentHightArea' || to.path == '/assessmentMenu') {
    $.getScript(common.getPlatformUrl() + "/common/header/header.js", function () {
      if ($("body").find(".platform-header").length == 0) {
        $("body").initHeader();
      }
    });
  } else {
    $('.bg-main').css('background', '#fff');
  }

  init().then(() => {
    next();
  })

});
router.afterEach((to, from) => {

})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { //子组件注册  原来叫App，在我的实例里面依然叫App
    App
  },
});
