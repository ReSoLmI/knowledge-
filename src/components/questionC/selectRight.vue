<template>
    <div class="am-ctr-sel w120 am-ml-10" :class="{open:isOpen}" @click.stop="clickOpen" @mouseleave="isOpen=false">
        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{showNames()}}</a>
        <div class="am-dropdown am-mr-10" v-show="isOpen">
            <ul v-if="types=='sortType'">
                <li v-for="item in arr" @click.stop="selectItem(item)" :class="getClass(item)" ><a>{{item.sortName}}</a></li>
            </ul>
            <ul v-if="types=='sortField'">
                <li v-for="item in arr" @click.stop="selectItem(item)" :class="getClass(item)" ><a>{{item.currNode|showNodeNames}}</a></li>
            </ul>
            <ul v-if="types=='linkDict'||types=='specialDict'||types=='inoutType'">
                <li v-for="item in arr" @click.stop="selectItem(item)" :class="getClass(item)" ><a>{{item.dicItemValue}}</a></li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
          return{
            isOpen:false,
          }
        },
        filters:{
            showNodeNames: function(currNode) {
                if (!currNode) {
                    return "";
                }
                if (currNode.aliasType == 1) {
                    return currNode.aliasName;
                } else if (currNode.aliasType == 2) {
                    return currNode.catalogueName;
                } else {
                    return currNode.catalogueName;;
                }
            },
        },
        props:['activeQuestion','arr','types','index'],
        methods:{
            selectItem:function(item){
                
                this.$emit('selectSort',item,this.types,this.index);
                this.isOpen=false;
            },
            getClass:function(item){
                if(this.types=='sortType'){
                    return item.sortType==this.activeQuestion.currNode.sortType?'active':'';
                }else if(this.types=='sortField'){
                     return item.currNode.questionId==this.activeQuestion.currNode.sortField?'active':'';
                }else if(this.types=='linkDict'){
                    return item.dicItemKey==this.activeQuestion.currNode.linkFlag?'active':'';
                }else if(this.types=='specialDict'){
                    debugger;
                    return item.dicItemKey==this.activeQuestion.currNode.specialFlag?'active':'';
                }else if(this.types=='inoutType'){
                    if(!this.activeQuestion.ioLiquidType&&!item.dicItemKey){
                        return 'active';
                    }
                    return item.dicItemKey==this.activeQuestion.ioLiquidType?'active':'';
                }
            },
            showNames:function(){
                if(this.types=='sortType'){
                    let value=this.activeQuestion.currNode.sortType;
                    if(!value){
                       if(this.arr&&this.arr.length>0){
                            return this.arr[0].sortName;
                        }else{
                            return '';
                        }
                    }
                    let obj=this.arr.find(al=>{
                        return al.sortType==value;
                    });
                    return obj.sortName;
                }else if(this.types=='sortField'){
                    let value=this.activeQuestion.currNode.sortField;
                    if(!value){
                       if(this.arr&&this.arr.length>0){
                            return this.arr[0].currNode.catalogueName;
                        }else{
                            return '';
                        }
                    }
                    let obj=this.arr.find(al=>{
                        return al.currNode.questionId==value;
                    });
                    return obj.currNode.aliasType==1?obj.currNode.aliasName:obj.currNode.catalogueName;
                }else{
                    let value='';
                    if(this.types=='linkDict'){
                        value=this.activeQuestion.currNode.linkFlag;
                    }else if(this.types=='specialDict'){
                         value=this.activeQuestion.currNode.specialFlag;
                    }else if(this.types=='inoutType'){
                        value=this.activeQuestion.ioLiquidType;
                    }
                    if(!value){
                       if(this.arr&&this.arr.length>0){
                            return this.arr[0].dicItemValue;
                        }else{
                            return '';
                        }
                    }
                    let obj=this.arr.find(al=>{
                        return al.dicItemKey==value;
                    });
                    return obj.dicItemValue;
                }
            },
            clickOpen:function(){
                this.isOpen=true;
            }
        },
        watch:{
            activeQuestion:function(curvalue,oldValue){
                this.isOpen=false;
                this.activeQuestion=curvalue;
            },
        }
    }
</script>