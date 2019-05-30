<!-- 根据工号或名字搜索护士、医生 主要用于签名 -->
<template>
  <div class="lv-inline">
    <div class="lv-item lv-title" v-if="node.currNode.aliasType != 3" :style="{'margin-left':'5px','width':nodeWidth(node.currNode.style.width)+'px'}">
      {{node.currNode|showNodeName}}
    </div>
    <div class="lv-inline">
      <template v-if="mode!='pageShow'">
        <div class="am-search-picker lv-item" @mouseleave="hideComboOpen" :style="{'width':nodeWidth(node.currNode.optionList.length>0&&node.currNode.optionList[0].style.width)+'px','margin-left':(node.currNode.optionList[0].style.margin || 0) + 'px'}" v-for="itemss in node.currNode.optionList">
          <input type="text" class="input-text" @input.stop="searchUser($event)" :style="{'width':nodeWidth(itemss.style.width)+'px','margin-left':(item.style.margin||10) + 'px'}" v-model="content">
          <div class="am-dropdown" v-show="isComboOpen" style="display: block">
            <ul>
              <li v-for="(item,index_) in selectList" @click.stop="checkRadio(item)" :class="{active:isKeySelected(node.currNode,item.key)}"><a> {{item.key}}/{{item.value}}</a></li>
            </ul>
          </div>
        </div>
      </template>
      <template v-if="mode=='pageShow'" v-for="itemss in node.currNode.optionList">
        <div class="lv-item">
          <span :style="{'width':nodeWidth(itemss.style.width)+'px','margin-left':(itemss.style.margin || 0 )+ 'px'}">{{getValue}}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import questionNodeMixin from '@/components/questionTree/questionNode/questionNodeMix';
import { ajaxAsync, getOrganCode } from '@/util/common_b';
export default {
    name: 'userNursing',
    mixins: [questionNodeMixin],
    props: ['node', 'saveValue'],
    data() {
        return {
            selectList: [],
            isComboOpen: false,
            content: ""
        }
    },
    mounted: async function() {
        this.content = this.getValue;
    },
    computed: {
        ...mapState([
            'patient', 'userfulWidth'
        ]),
        getValue: function() {
            let selectV = this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].filter(sv => {
                return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
            })
            if (selectV) {
                let res = selectV.reduce((pre, cur, index) => {
                    return pre + (index ? '/' : '') + (cur.optionContent ? cur.optionContent : '');
                }, '')
                return res || '';
            } else {
                return ""
            }
        },
    },
    methods: {
        /*显示下拉框*/
        showComboOpen: function(target) {
            this.isComboOpen = true;
            this.dir(target);
        },
        /*确定弹框方向*/
        dir: function(target) {
            //  判断边界问题
            //  先左右吧
            var o = $(target).next(".am-dropdown").addClass("before");
            var o_w = o.innerWidth();
            var o_h = o.innerHeight();
            //                                          上下
            var over_h = $(".amp-confirm-scroll").innerHeight() - ($(target).offset().top - $(".amp-confirm-scroll").offset().top) - 30;
            if (o_h < over_h) {} else {
                $(target).next(".am-dropdown").addClass("dir-top");
            }
            o.removeClass("before");
        },
        hideComboOpen: function() {
            this.isComboOpen = false;
            if (this.content != this.getValue) {
                let selectV = this.saveValue[this.node.currNode.uniqueId] && this.saveValue[this.node.currNode.uniqueId].filter(sv => {
                    return sv.isShow && sv.selfPropagationId == this.node.currNode.selfPropagationId;
                })
                if (selectV) {
                    this.tree.$emit('seleteRadio', {
                        node: this.node,
                        item: {
                            optionKey: selectV.optionKey,
                            optionContent: selectV.optionContent,
                            selfPropagationId: this.node.currNode.selfPropagationId
                        },
                        isCancel: true
                    });
                }
            }
            this.content = this.getValue;
        },
        isKeySelected: function(currNode, key) {
            if (!this.saveValue[currNode.uniqueId]) {
                return false;
            }
            let that = this;
            return this.saveValue[currNode.uniqueId].find(sv => {
                return sv.isShow && sv.optionKey == key && sv.selfPropagationId == currNode.selfPropagationId;
            })
        },
        // 单选选中
        checkRadio(item) {
            this.isComboOpen = false;
            this.tree.$emit('seleteRadio', {
                node: this.node,
                item: {
                    optionKey: item.key,
                    optionContent: item.value,
                    selfPropagationId: this.node.currNode.selfPropagationId
                },
            });
            this.selectList = [];
            console.log(333);
            this.content = this.getValue;
        },

        async searchUser(event) {
            console.log(event.currentTarget.value);
            let target = event.currentTarget;
            let users = await ajaxAsync({
                url: "sys-service/sys/v1/users",
                dataType: "json",
                data: {
                    organCode: getOrganCode(),
                    pageNumber: 0,
                    pageSize: 1000,
                    codeOrName: event.currentTarget.value,
                },
                type: "get"
            });
            // Object.values(units).forEach(unit => {
            //     allUnits = allUnits.concat(unit);
            // })

            this.selectList = users.content.map(unit => {
                return { key: unit.loginName, value: unit.staffName }
            })
            let that = this;
            this.$nextTick(function() {
                that.showComboOpen(target);
            })

        }
    },
    watch: {

    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.lv-inline: {
  font-size: 14px;
}

.before {
  top: -999px;
  left: -999px;
}

.dir-top {
  top: auto;
  bottom: 30px;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}

</style>
