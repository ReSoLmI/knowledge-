<template>
  <div>
    <menuTemplate></menuTemplate>
    <div class="am-page-rcont">
      <div class="am-page-pd">
        <div class="strip-top-cont">
          <ul class="strip-top">
            <li
              :class="{active:assesmentPage=='createAssesPage'}"
              @click="assesmentPage='createAssesPage'"
            ><a>创建文书</a></li>
            <li
              :class="{active:assesmentPage=='myAssesPage'}"
              @click="assesmentPage='myAssesPage'"
            ><a>我的文书</a></li>
          </ul>
        </div>
        <template v-if="assesmentPage=='createAssesPage'">
          <h4 class="h5-top">选择创建文书类型</h4>
          <div class="card-book-cont">
            <ul class="card-book-list">
              <li
                v-for="(item,index) in assesmentClassifyList"
                @click="createAssesmentItem(item)"
                :key = "index"
              >
                <div class="inner">
                  <img :src="item.url" />
                  <p>{{item.dicItemValue}}</p>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div class="am-condition">
            <div
              class="am-ctr-sel am-mr-10"
              :class="{open:isCmbOpen}"
              @click.stop="isCmbOpen=true"
              @mouseleave="isCmbOpen=false"
            >
              <a
                class="caption"
                href="javascript:void(0)"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="true"
              >{{wardItem.sysValue}}</a>
              <div
                class="am-dropdown am-mr-10"
                v-show="isCmbOpen"
              >
                <ul>
                  <li
                    v-for="(item, index) in allWardList"
                    @click.stop="selectWardItem(item)"
                    :class="{'active':item==wardItem?true:false}"
                    :key = "index"
                  ><a>{{item.sysValue}}</a></li>
                </ul>
              </div>
            </div>
            <div
              class="am-ctr-sel am-mr-10"
              :class="{open:isClassifyOpen}"
              @click.stop="isClassifyOpen=true"
              @mouseleave="isClassifyOpen=false"
            >
              <a
                class="caption"
                href="javascript:void(0)"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="true"
              >{{assesClassifyItem.dicItemValue}}</a>
              <div
                class="am-dropdown am-mr-10"
                v-show="isClassifyOpen"
              >
                <ul>
                  <li
                    v-for="(item, index) in assesmentClassifyList"
                    @click.stop="selectClissify(item)"
                    :class="{'active':item==assesClassifyItem?true:false}"
                    :key = "index"
                  ><a>{{item.dicItemValue}}</a></li>
                </ul>
              </div>
            </div>
            <div class="am-search-picker am-mr-10">
              <input
                type="text"
                class="input-text"
                placeholder="关键词搜索"
                v-model="keyWords"
              >
              <i class="i-search"></i>
            </div>
          </div>
          <div class="bg-white">
            <table class="am-tb">
              <thead>
                <tr>
                  <th>文书名称</th>
                  <th>参数映射</th>
                  <th>所属项目</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tr
                v-for="(item, index) in MyAssesmentList"
                :key=index
              >
                <td><a @click.stop="editAssesment(item)">{{item.evaluationName}}</a></td>
                <td>{{item.domainUrl}}</td>
                <td>{{wardItem.sysValue}}</td>
                <td>{{item.createDate}}</td>
                <td>
                  <a @click.stop="editAssesment(item)">编辑</a>
                  <a @click.stop="delAssesment(item)">删除</a>
                  <a @click.stop="openMenu(item)">菜单配置</a>
                </td>
              </tr>
            </table>
          </div>
          <uib-pagination
            v-if="totalItems>0"
            first-text=""
            next-text=""
            last-text=""
            previous-text=""
            :total-items="totalItems"
            v-model="paginate"
            :max-size="maxSize"
            class="page"
            :boundary-links="true"
            :rotate="false"
            :items-per-page="perPage"
            @change="pageChanged"
          ></uib-pagination>
          <div style="background: #fff">
            <noData
              content="没有符合条件的数据"
              v-if="totalItems==0"
            ></noData>
          </div>
        </template>
      </div>
    </div>
    <confirmDelete
      id="deleteConfirm"
      style="display:none"
      :content="'确认删除该问题？'"
      :layerIndex="layerDelIndex"
    ></confirmDelete>
  </div>
</template>
<script>
import Bus from "@/bus.js";
import common from "../../util/common.js";
import menuTemplate from "../../components/menu.vue";
import pagination from "vuejs-uib-pagination";
import noData from "@/components/common/noData";
import confirm_delete from "@/components/confirm_delete.vue";
export default {
  name: "creatAssessment",
  data() {
    return {
      totalItems: 0,
      paginate: { currentPage: 1 },
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      maxSize: 5,
      perPage: 12,
      assesmentPage: "createAssesPage",
      allWardList: [],
      wardItem: {},
      isCmbOpen: false,
      layerDelIndex: 0,
      keyWords: "", //我的文书搜索关键字
      isClassifyOpen: false, //评估单类别是否打开
      assesClassifyItem: {}, //选中评估单类别
      assesmentClassifyList: [], // 文书类型列表
      MyAssesmentList: [], //我的评估列表  
      curDomain: common.getPlatformUrl("serviceUrl"), // 服务器url          
      //评估单图片
      assesmentImgArrs: [
        require("../../image/card-book-1.png"),
        require("../../image/card-book-2.png"),
        require("../../image/card-book-3.png"),
        require("../../image/card-book-4.png"),
        require("../../image/card-book-5.png")
      ],
    };
  },
  methods: {
    openMenu: function(item) {
      let { query } = this.$route;
      query.assessmentDomain = item.menuUrl;
      this.$router.push({ path: "/assessmentMenu", query: query });
    },
    //选择创建文书的类型
    createAssesmentItem: function(item) {
      let query = {
        dicItemCode: item.dicItemCode,
        dicItemKey: item.dicItemKey,
        organCode: this.organCode
      };
      this.$router.push({ path: "/createAssesmentTitle", query: query });
    },
    //选择医院名称
    selectWardItem: function(item) {
      this.wardItem = item;
      this.isCmbOpen = false;
      this.reservetRefreshAssesment();
    },
    //选择类型
    selectClissify: function(item) {
      this.assesClassifyItem = item;
      this.isClassifyOpen = false;
      this.reservetRefreshAssesment();
    },
    //初始化文书类型
    getAssesmentClassify: function() {
      let that = this;
      common.ajax({
        url: "knowledge-service/dictionary/EVALUATION_LIST_CLASSIFY",
        type: "get",
        async: false,
        callback: function(data) {
          data.forEach((al, index) => {
            // 替换接口返回中前5张文书类型渲染到页面上的icon
            let url = that.assesmentImgArrs[0];
            if (that.assesmentImgArrs.length > index) {
              url = that.assesmentImgArrs[index];
            }
            al.url = url;
          });
          that.assesmentClassifyList = data;
        }
      });
    },
    //分页
    pageChanged: function() {
      this.getMyAssesmentList();
    },
    //用于如果选中的不是第一页，进而查询数据
    reservetRefreshAssesment: function() {
      if (this.paginate.currentPage == 1) {
        this.getMyAssesmentList();
      } else {
        this.paginate.currentPage = 1;
      }
    },
    //获取我的评估单
    getMyAssesmentList: function() {
      let that = this;
      let organCode = this.wardItem.destination.organCode;
      let b = this.assesClassifyItem.dicItemKey;
      let data = {
        organCode: organCode,
        evaluationClassify: b,
        keywords: $.trim(this.keyWords),
        pageNumber: this.paginate.currentPage - 1,
        pageSize: this.perPage
      };
      common.ajax({
        url: "knowledge-service/evaluation/paper2/myPaperList",
        dataType: "json",
        type: "get",
        data: data,
        callback: function(data) {
          that.MyAssesmentList = that.getMenuList(data.content);
          that.totalItems = data.totalElements;
        }
      });
    },
    getMenuList(data) {
      data.forEach((ele, index) => {
        let routerName = "";
        let menuUrl = "";
        let domainUrl = "";
        if (ele.tableFlag == 0) {
          routerName = "assessment";
        } else {
          if (ele.subClass == "FALL_RECORD") {
            routerName = "assesmentQueryFD";
          } else {
            routerName = "assesmentQuery";
          }
        }
        if (routerName == "assessment") {
          menuUrl = this.curDomain + ":8219/enr/#/" + routerName +
            "?evaluationType=" + ele.type + "&isOnce=true";
          domainUrl = "/enr/#/" + routerName + "?evaluationType=" + ele.type + "&isOnce=true";
        } else {
          menuUrl = this.curDomain + ":8219/enr/#/" + routerName + "?assesmentId=" + ele.evaluationId +
            "&dicItemKey=" + ele.evaluationClassify + "&evaluationType=" + ele.type;
          domainUrl = "/enr/#/" + routerName + "?assesmentId=" + ele.evaluationId + "&dicItemKey=" +
            ele.evaluationClassify + "&evaluationType=" + ele.type;
        }
        this.$set(ele, "menuUrl", menuUrl);
        this.$set(ele, "domainUrl", domainUrl);
      });
      return data;
    },
    //获取所属项目
    getAllHospital() {
      let that = this;
      common.ajax({
        url: "knowledge-service/evaluation/paper2/sysvalues",
        dataType: "json",
        type: "post",
        async: false,
        data: {},
        callback: function(data) {
          that.allWardList = data;
          if (data.length > 0) {
            that.wardItem = data[0];
          }
        }
      });
    },
    //编辑文书
    editAssesment: function(item) {
      let { query } = this.$route;
      Object.assign(query, {
        assesmentId: item.evaluationId,
        dicItemKey: item.evaluationClassify,
        typeFrom: "createAsses",
        evaluationName: item.evaluationName
      });
      if (item.evaluationClassify == 3) {
        this.$router.push({ path: "/createNotification", query: query });
      } else {
        this.$router.push({ path: "/createAssesmentContent", query: query });
      }
    },
    //删除评估单
    delAssesment: function(item) {
      debugger;
      let that = this;
      this.layerDelIndex = layer.open({
        type: 1,
        shift: 5,
        title: "",
        btn: ["确定", "取消"],
        shadeClose: true,
        shade: 0.6,
        closeBtn: 0,
        area: ["460px", "200px"],
        content: $("#deleteConfirm"),
        success: function(layero) {
          var btn = layero.find(".layui-layer-btn");
          btn.css({ padding: "0", "margin-top": "-10px" });
        },
        yes: function(index) {
          common.ajax({
            url: "knowledge-service/evaluation/paper/" + item.evaluationId,
            type: "delete",
            dataType: "text",
            callback: function(data) {
              that.getMyAssesmentList();
            }
          });
          layer.close(index);
        }
      });
    }
  },
  mounted() {
    this.getAssesmentClassify();
    if (common.getUrlParam("typeFrom") == "createAsses") {
      this.assesmentPage = "myAssesPage";
    }
  },
  watch: {
    //文书类型选择
    assesmentPage: function(val, oldvalue) {
      if (val == "myAssesPage") {
        this.getAllHospital();
        this.assesmentClassifyList.splice(0, 0, {
          dicItemCode: undefined,
          dicItemKey: undefined,
          dicItemValue: "请选择文书类型"
        });
        if (this.assesmentClassifyList.length > 0) {
          this.assesClassifyItem = this.assesmentClassifyList[0];
        }
        this.getMyAssesmentList();
      } else {
        this.assesmentClassifyList = this.assesmentClassifyList.filter(al => {
          return al.dicItemValue != "请选择文书类型";
        });
      }
    },
    keyWords: function() {
      if (this.keyWords) {
        this.reservetRefreshAssesment();
      } else {
        this.keyWords = "";
        this.reservetRefreshAssesment();
      }
    }
  },
  components: {
    menuTemplate: menuTemplate,
    noData: noData,
    confirmDelete: confirm_delete
  }
};
</script>
<style scoped>
.am-ctr-sel {
  width: auto;
}
</style>

