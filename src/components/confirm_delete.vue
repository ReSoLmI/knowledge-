<template>
    <div :id="id" style="display: none;" class="ssss">
        <div class="hd">
            <h3 v-if="!title">删除</h3>
            <h3 v-else>{{title}}</h3>
            <div class="h3-small"></span></div>
            <a class="i-close" @click="close()"></a>
        </div>
        <div class="bd">
            <div class="am-msg-lg-info" style="margin-bottom: 0px">
                <div class="inner">
                    <i class="i-question-lg"></i>
                    <h3>{{content}}</h3>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'confirmDelete',
    props: ['id','content','layerIndex','title'],
    data() {
        return {
            selectItem: 'issureTemplate',
        }
    },

    methods: {
        close:function(){
            layer.close(this.layerIndex);
        }
    }
}
</script>
