<template>
    <div class="am-mt-10">
    <div class="am-ctr-sel w90" :class="{open:isMatchOpen}" @click.stop="isMatchOpen=true" @mouseleave="isMatchOpen=false">
      <a class="caption"  href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{matchItem.mathType|convertMatch}}</a>
      
      <div class="am-dropdown" v-show="isMatchOpen">
       <ul>
        <li v-for="item in matchTypeArr" @click.stop="selectMatchType(item)"><a>{{item.mathType}}</a></li>
       </ul>
      </div>
     </div>
     <input type="text" class="input-text w70 am-ml-5"  style="ime-mode:Disabled;vertical-align: top;"  v-model="matchItem.scope"  />
      <a class="i-hd-link-minus" title="删除"  @click.stop="deleteMatchType"></a>
</div>
</template>
<script>
    export default{
         data () {
            return {
                matchTypeArr:[],
                isMatchOpen:false,
            }
        },
        props:['type','matchItem','nIndex'],
        methods:{
            selectMatchType:function(item){
                this.matchItem.mathType=item.id;
                this.isMatchOpen=false;
            },
            deleteMatchType:function(){
                this.$emit("delMatchType",this.nIndex,this.type);
            }
        },
        filters:{
            convertMatch(item){
              //debugger;
                if(item==0){
                    return "请选择";
                }else if(item==1){
                    return "小于";
                }else if(item==2){
                    return "小于等于";
                }else if(item==3){
                    return "等于";
                }else if(item==4){
                    return "大于等于";
                }else if(item==5){
                    return '大于';
                }else{
                    return '1111';
                }
            }
        },
        mounted(){
             this.matchTypeArr=
                [
                  {'mathType':'请选择','id':0},
                  {'mathType':'小于','id':1},
                  {'mathType':'小于等于','id':2},
                  {'mathType':'等于','id':3},
                  {'mathType':'大于等于','id':4},
                  {'mathType':'大于','id':5},
                ];
         }
    }

</script>