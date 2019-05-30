  <template>
  <div>
    <div class="header"></div>
    <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
    <div class="am-page-rcont">
      <div class="am-page-pd">
        <div class="book-top-cont">
          <div class="book-top-return">
            <a class="txt-return" @click.stop="returnBack()">返回</a>
            <div class="h5">创建
              <template v-if="!isEditAssesmentName">{{evaluation.evaluationName}}
                <i class="i-link-upd am-ml-5" style="margin-top: -2px;" @click.stop="clickEditAssesment()"></i>
              </template>
              <template v-if="isEditAssesmentName">
                <input type="text" class="input-text w180" v-model="evaluation.evaluationName" id="inputAssesment" @blur="editAssesmentName()" />
                <a @click.stop="editAssesmentName()">保存</a>
              </template>
            </div>
          </div>
          <div class="step-list-cont">
            <ul class="step-list">
              <li class="active">
                <i class="num">1</i><span class="txt">新建或选择模版</span>
              </li>
              <li class="cur">
                <i class="num">2</i><span class="txt">配置文书内容</span>
              </li>
              <li>
                <i class="num">3</i><span class="txt">列表设置</span>
              </li>
            </ul>
            <div class="right">
              <a class="am-btn am-btn-plain-info am-ml-10" @click.stop="preAssesment()">预览</a>
              <a class="am-btn am-btn-info am-ml-10" @click.stop="saveMainQuestion()">保存</a>
              <a class="am-btn am-btn-info am-ml-10" @click.stop="refresh()">刷新</a>
              <a class="am-btn am-btn-info am-ml-10" @click.stop="next()">下一步</a>
            </div>
          </div>
        </div>
        <div class="topic-layout-cont">
          <div class="topic-layout-lside">
            <h4>问题类型</h4>
            <ul class="topic-list">
              <li class="active">
                <div class="txt"></div>
                <!-- <div class="placeholder-drag-panel">
                  <span class="h4 am-mr-20">单选题</span>
                  <div class="am-ctr-native-rdo am-mr-20"><span>选项一</span></div>
                  <div class="am-ctr-native-rdo am-mr-20"><span>选项二</span></div>
                </div> -->
              </li>
            </ul>
          </div>
          <div class="topic-layout-rcont" v-if="curNode.currNode">
            <quill-editor ref="myTextEditor" :content="curNode.currNode.remarksContent" :options="editorOption" @change="onEditorChange($event)" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)">
              <div id="toolbar" slot="toolbar">
                <button id="custom-button" class="mineBtn" @click="customButtonClick">占位符</button>
              </div>              
            </quill-editor>
          </div>
          <div class="topic-layout-right" style="width:366px;">
            <div class="topic-strip-h4">内容设置</div>
            <template v-if="curNode&&curNode.childList&&curNode.childList.length>0">
              <div class="bd bd-second" v-for="(childItem,childIndx) in curNode.childList" :key="childIndx">
                <rightSetting :childItem="childItem" :index="childIndx"></rightSetting>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import menuTemplate from "../../components/menu.vue";
import rightSetting from "./rightSetting.vue";
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import E from "../../../static/wangEditor.min.js";
import { getCatalogue } from "@/util/util";
import "@/css/quill/quill.core.css";
import "@/css/quill/quill.snow.css";
import "@/css/quill/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { ajaxAsync } from "@/util/common_b";
export default {
  data() {
    return {
      currentPage: "createNotification", //当前页为告知书
      evaluation: {},
      isEditAssesmentName: false,
      evaluationId: common.getUrlParam("assesmentId"), //评估单id
      curNode: {},
      start: 0, //点击的开始位置
      textContent: "",
      disabled: true,
      editorOption: {
        //编辑器选项以及初始化
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            /* [{ 'color': [] }],*/
            [{ align: [] }],
            ["clean"]
          ]
        }
      }
    };
  },
  created: function() {
    Bus.$off("selectEmbedQuestion");
    Bus.$on("selectEmbedQuestion", this.selectEmbedQuestion);
    Bus.$off("editAttachQuestion");
    Bus.$on("editAttachQuestion", this.editAttachQuestion);
    Bus.$off("deleteQuestion");
    Bus.$on("deleteQuestion", this.deleteQuestion);
  },
  mounted() {
    this.getEvaluationById();


    this.$nextTick(function() {
      this.$refs.myTextEditor.quill.enable(true);
      this.$refs.myTextEditor.quill.blur();
    });

  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  methods: {
    next: function() {
      let { query } = this.$route;
      query.lastStepName = 'createNotificationPage';
      this.$router.push({ path: "/assesmentTableSetting", query: query });
    },
    customButtonClick: function() {
      var range = this.editor.getSelection();
      this.addEmbed(range.index)
    },
    // 缓存刷新接口调取
    refresh() {
      common.ajax({
        url:
          "knowledge-service/evaluation/_refresh?evaluationId=" +
          this.evaluationId,
        type: "get",
        dataType: "json",
        callback: function(data) {
          common.tip_msgArea("刷新成功", 1000);
        }
      });
    },
    //编辑告知书名称
    editAssesmentName: function() {
      let that = this;
      let data = {
        evaluationId: this.evaluationId,
        evaluationName: this.evaluation.evaluationName
      };
      common.ajax({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data: JSON.stringify(data),
        callback: function(problems) {
          that.isEditAssesmentName = false;
          common.tip_msg("保存成功", 1000);
        }
      });
    },
    //点击编辑文书
    clickEditAssesment: function() {
      this.isEditAssesmentName = true;
      Vue.nextTick(function() {
        $("#inputAssesment").focus();
      });
    },
    //编辑器内内容改变事件
    onEditorChange(editor) {
      let that = this;
      this.curNode.currNode.remarksContent = editor.html;
      this.textContent = editor.text;
    },
    //编辑器焦点
    onEditorFocus(editor) {
      var range = this.editor.getSelection();
      this.start = range.index;
    },
    onEditorBlur(editor) {
      return;
      var range = this.editor.getSelection();
      this.start = range.index;
    },
    //点击返回
    returnBack: function() {
      let { query } = this.$route;
      Object.assign(query, {
        assesmentId: undefined
      });
      if (common.getUrlParam("typeFrom") == "createAsses") {
        this.$router.push({ path: "/", query: query });
      } else {
        this.$router.push({ path: "/createAssesmentTitle", query: query });
      }
    },
    //点击新增占位符
    addEmbed: function(num) {
      let remarksContent = this.$refs.myTextEditor.quill.getText();
      let content = remarksContent.substring(0, num);
      let index = content.split("占位符").length;
      let label =
        "<i>" +
        "  " +
        '</i></span><span style="color:#fff;background:#009EF9" data-index="33">占位符' +
        index +
        "</span><i>" +
        "  " +
        "</i>";
      let node = this.initNode(30);
      //根据选中的题目保存后台拼接好questionId和optionID之后返回
      // debugger;
      console.log('点击编辑完后的start值' + num)
      this.$refs.myTextEditor.quill.clipboard.dangerouslyPasteHTML(
        num,
        label
      );
      this.saveTempQuestion(node, "childQuestion", index - 1);
    },
    //保存占位符附属题
    async saveTempQuestion(node, mainOrChild, sortNum, option) {
      let param = {
        evaluationId: this.evaluationId,
        req: node.currNode,
        sortNum: sortNum
      };
      if (mainOrChild != "mainQuestion") {
        param.parentUniqueId = this.curNode.currNode.uniqueId;
      }
      let data = await ajaxAsync({
        url: "knowledge-service/new/paper/question",
        type: "post",
        data: JSON.stringify(param)
      });
      //将对应的占位符替换为<<<>>>保存到remarkContent中
      this.saveMainQuestion();
    },
    //右侧删除占位符
    deleteQuestion: async function(node, index) {
      this.curNode.childList.splice(index, 1);
      let that = this;
      if (node.currNode.uniqueId) {
        await ajaxAsync({
          url:
            "knowledge-service/evaluation/paper2/delquestion?uniqueId=" +
            node.currNode.uniqueId +
            "&evaluationId=" +
            this.evaluationId,
          type: "delete"
        });
      }
      //删除右侧的占位符同时要删除remarkContents中的内容占位符并且保存
      if (this.curNode.currNode.remarksContent) {
        let regObj = new RegExp(
          "<span(.(?!<span))*?占位符" + (index + 1) + "</span>",
          "g"
        );
        this.curNode.currNode.remarksContent = this.curNode.currNode.remarksContent.replace(
          regObj,
          ""
        );
        this.saveMainQuestion();
      }
    },

    //通过评估单id获取评估单
    getEvaluationById() {
      let that = this;
      common.ajax({
        url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/detail",
        // url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/paper",
        type: "get",
        callback: function(data) {
          that.evaluation = data;
          if (data.questionList.length == 0) {
            let node = that.initNode(230);
            that.saveMainQuestion(node);
          } else {
            that.curNode = data.questionList[0];
            if (that.curNode.currNode.remarksContent) {
              let arr = that.curNode.currNode.remarksContent.split("<<<>>>");
              let content = "";
              for (var i = 0; i < arr.length; i++) {
                if (i == arr.length - 1) {
                  content += arr[i];
                } else {
                  content +=
                    arr[i] +
                    '<span style="color:#fff;background:#009EF9" data-index="33">占位符' +
                    (i + 1) +
                    "</span>";
                }
              }
              that.curNode.currNode.remarksContent = content;

              that.$nextTick(function() {
                that.$refs.myTextEditor.quill.enable(true);
                that.$refs.myTextEditor.quill.blur();
              });

            }
          }
        }
      });
    },
    //预览文书
    preAssesment: function() {
      let url = "/#/preShowAssesment?" + "&evaluationId=" + this.evaluationId;
      this.showQuestionLayer(url);
    },
    //打开弹出预览层
    showQuestionLayer(url) {
      let that = this;
      $(".ui-sys-bar").css("display", "none");
      layer.open({
        type: 2,
        title: false,
        closeBtn: 0, //不显示关闭按钮
        shadeClose: true,
        shade: 0.6,
        area: ["1200px", "100%"],
        offset: "rb", //右下角弹出*/
        content: [url, "no"], //iframe的url，no代表不显示滚动条
        end: function() {
          //此处用于演示
          $(".ui-sys-bar").css("display", "block");
        }
      });
    },
    //保存或者编辑内嵌题
    saveMainQuestion: async function(node) {
      let that = this;
      let url = "knowledge-service/new/paper/question";
      let type = "post";
      let param = {};
      if (node) {
        param = {
          evaluationId: this.evaluationId,
          req: node.currNode,
          sortNum: 0
        };
      } else {
        type = "put";
        let newNode = $.extend(true, {}, this.curNode.currNode);
        let regObj = new RegExp(
          "<span(.(?!<span))*?占位符(.?[0-9])</span>",
          "g"
        );
        newNode.remarksContent = newNode.remarksContent.replace(
          regObj,
          "<<<>>>"
        );
        param = {
          evaluationId: this.evaluationId,
          req: newNode,
          uniqueId: this.curNode.currNode.uniqueId
        };
      }
      let data = await ajaxAsync({
        url: url,
        type: type,
        data: JSON.stringify(param)
      });
      if (data.req) {
        that.curNode = { currNode: data.req, childList: [] };
      } else {
        that.getEvaluationById();
      }
      common.tip_msgArea("已保存", 1000);
    },
    //保存选择的附属题,先删除之前的附属题，然后再查找问题把当前的节点保存进去
    selectEmbedQuestion: async function(item, index) {
      let that = this;
      debugger;
      let node = this.curNode.childList[index];
      //通过uniqueid删除原来这个节点数据
      let data = await ajaxAsync({
        url:
          "knowledge-service/evaluation/paper2/delquestion?uniqueId=" +
          node.currNode.uniqueId +
          "&evaluationId=" +
          this.evaluationId,
        type: "delete"
      });
      if (item.uniqueId == 0 || item.questionId == 0) {
        //新增一个空的节点作为附属题
        let node = this.initNode(30); //获取一个节点
        this.saveTempQuestion(node, "childQuestion", index); //将节点保存为指定附属题
      } else {
        //新增一个常用对象作为附属题
        this.saveEmbed(item, index);
      }
    },
    //保存指定位置的附属题，再保存主问题，刷新
    saveEmbed: async function(item, index) {
      let url =
        "knowledge-service/evaluation/paper2/question?questionId=" +
        item.questionId +
        "&evaluationId=" +
        this.evaluationId +
        "&parentUniqueId=" +
        this.curNode.currNode.uniqueId +
        "&sortNum=" +
        index;
      let data = await ajaxAsync({
        url: url,
        dataType: "json",
        type: "post"
      });
      this.saveMainQuestion();
    },
    //编辑附属题例如宽度以及下划线等题目
    editAttachQuestion: function(node, index, isInsert) {
      let that = this;
      let type = "put";
      let param = {
        evaluationId: this.evaluationId,
        req: node.currNode,
        uniqueId: node.currNode.uniqueId
      };
      common.ajax({
        url: "knowledge-service/new/paper/question",
        type: type,
        data: JSON.stringify(param),
        callback: function(data) {
          common.tip_msg("已保存", 2000);
        }
      });
    },
    //初始化节点
    initNode: function(questionType) {
      let node = {
        currNode: {
          catalogueName: "",
          questionType: questionType,
          questionId: "",
          aliasType: questionType == 230 ? "4" : "3",
          sexType: "10",
          catalogueRule: getCatalogue(),
          checkType: "1",
          hierarchyList: [],
          filePaths: [],
          helpContent: "",
          style: {
            height: 0,
            link: 0,
            maxLength: 0,
            width: "10"
          },
          remarksContent: "",
          optionList: []
        },
        childList: []
      };
      if (questionType == "30") {
        node.currNode.optionList.push({
          catalogueName: "",
          optionId: "",
          questionId: "",
          logicList: [],
          hierarchyList: [],
          filePaths: [],
          helpContent: "",
          checkList: {
            checkContext: "",
            checkMark: "",
            checkType: "",
            inputType: "",
            scopeList: [],
            pictureCount: 0,
            pictureFormat: "",
            pictureSize: "",
            remindType: 0
          },
          style: {
            height: 0,
            link: 0,
            maxLength: 0,
            width: "10"
          },
          unitList: []
        });
      }
      return node;
    }
  },
  components: {
    menuTemplate: menuTemplate,
    rightSetting: rightSetting,
    quillEditor: quillEditor
  }
};
</script>

<style scoped>
.mineBtn {
  position: absolute;
  top: 40px;
  font-size: 14px;
  color: #4A4A4A;
  border: none;
  width: 80px;
  height: 40px;
  left: 0;
}
</style>
