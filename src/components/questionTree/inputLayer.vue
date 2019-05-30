<template>
    <div id="inputLayer_" style="display:none">
        <div class="bd">
            <div class="config-bd-pd">
                <div class="config-strip-cont">
                    <ul class="config-strip">
                        <li class="active"><a>{{localObj.layerTitle}}</a></li>
                        <!-- <li><a>组合逻辑</a></li> -->
                    </ul>
                </div>
                <textarea name="" rows="3" class="input-text input-textarea am-mt-10" :placeholder="localObj.placeholder" v-model="localObj.content" maxlength="100"></textarea>
                <div class="am-btn-area">
                    <a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
                    <a class="am-btn am-btn-primary w120" @click="cancel_()" v-if="localObj.type=='check'">取消填空</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'inputLayer',
    props: ['inputLayerObj','isOpenLayer'],
    data() {
        return {
            localObj: {},
            layerIndex: ''
        }
    },
    created: function() {
        
    },
    methods: {
        save_() {
            this.$emit("save", this.localObj);
            this.close();
        },
        cancel_() {
            this.$emit("cancel", this.localObj);
            this.close();
        },
        open() {
            var that = this;
            this.localObj = $.extend(true, {}, this.inputLayerObj);
            this.layerIndex = layer.open({
                type: 1,
                skin: 'layui-layer-demo', //样式类名
                closeBtn: 0, //不显示关闭按钮
                anim: 2,
                shadeClose: true, //开启遮罩关闭
                title: false,
                shade: 0.6,
                // closeBtn: 1,
                area: ['370px'], //宽高
                content: $('#inputLayer_'), //iframe的url
                end: function() {
                    that.$emit("close");
                }
            });
        },
        close() {
            layer.close(this.layerIndex);
        }
    },
    watch: {
        isOpenLayer: function(val) {
            if (val) {
                this.open();
            } else {
                this.close();
            }
        }
    }
}
</script>
