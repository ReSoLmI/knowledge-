<template>
     <div class="bd">
        <div class="hd">
            <h3>+组句 </h3>
            <a class="i-close" @click="closeLayer()"></a>
        </div>
        <div id="pop-content-03">
            <div class="am-pd-20">
                <div class="am-form">
                    <div class="am-form-item">
                        <div class="am-form-label am-col-7 static">
                            组句显示
                        </div>
                        <template>
                            <div class="am-col-17">
                                <div class="am-ctr-native-rdo am-mr-10" :class="{'active':SentenceRes.displayType==1?true:false}" @click.stop="addGroupSentence"><span>显示</span></div>
                                <div class="am-ctr-native-rdo am-mr-10" :class="{'active':SentenceRes.displayType==2?true:false}" @click.stop="hideGroupSentence"><span>不显示</span></div>
                            </div>
                        </template>
                    </div>
                    <template v-if="SentenceRes.displayType==1">
                        <div class="am-form-item">
                            <div class="am-form-label am-col-7">
                                前缀
                            </div>
                            <div class="am-col-17">
                                <input type="text" class="input-text w200" v-model="SentenceRes.prefixValue"/>
                            </div>
                        </div>
                        <div class="am-form-item">
                            <div class="am-form-label am-col-7">
                                后缀
                            </div>
                            <div class="am-col-17">
                                <input type="text" class="input-text w200" v-model="SentenceRes.suffixValue"/>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="am-btn-area last">
                    <a class="am-pop-btn" @click.stop="closeLayer">取消</a>
                    <a class="am-pop-btn am-btn-confirm" @click="saveGroup">确定</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//组句
export default{
    data(){
        return{
            SentenceRes:{},
            layerIndex:0,
        }
    },
    props:['inputLayerObj','index'],
    methods:{
        init:function(SentenceRes){
            if(!SentenceRes){
                this.SentenceRes={displayType:1};
            }else{
                this.SentenceRes = $.extend(true, {}, SentenceRes); 
            }
        },
        //保存组句
        saveGroup:function(){
            if(this.SentenceRes.displayType==2){
                this.SentenceRes.prefixValue='';
                this.SentenceRes.suffixValue='';
                this.$emit("saveGroup",this.SentenceRes,this.inputLayerObj);
                this.closeLayer();
            }else {
                this.$emit("saveGroup",this.SentenceRes,this.inputLayerObj);
                this.closeLayer();
            }
        },
        //关闭层
        closeLayer:function(){
            this.SentenceRes={};
            layer.close(this.layerIndex);
        },
        //初始化层
        initLayer(index){
            this.layerIndex=index;
        },
        //显示
        addGroupSentence:function(){
            this.SentenceRes.displayType=1;
        },
        //隐藏
        hideGroupSentence:function(){
            this.SentenceRes.displayType=2;
        }
    }
}
</script>