<template>
    <div :id="id" style="display: none;">
        <div class="bd">
            <div class="am-msg-lg-info">
                <div class="inner">
                    <i class="i-question-lg"></i>
                    <h3>{{content}}</h3>
                </div>
            </div>
            <!--<div class="am-txt-danger text-center am-mt-15">请谨慎！删除该编码规则后，之前采用该规则生成的所有编码都会被删除！</div>-->
           
           <!--  <div class="layui-layer-btn">
            <a class="layui-layer-btn0">确定</a>
            <a class="layui-layer-btn1">取消</a>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'confirmDelete',
    props: ['id','content'],
    data() {
        return {
            selectItem: 'issureTemplate',
        }
    },
    methods: {
        
    }
}
</script>
