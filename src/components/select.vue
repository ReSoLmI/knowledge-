<template>
    <div class="am-ctr-sel w80 am-ml-10" :class="{open:isOpen}" @click.stop="clickOpen" @mouseleave="isOpen=false">
        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{showNames()}}</a>
        <div class="am-dropdown am-mr-10" v-show="isOpen">
            <ul v-if="types!='dictType'">
                <li v-for="item in arr" @click.stop="selectItem(item)" :class="getClass(item)" ><a>{{item.dicItemValue}}</a></li>
            </ul>
            <ul v-else>
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
           
        },
        props:['activeColumn','arr','types'],
        methods:{
            //选择指定项
            selectItem:function(item){
                this.$emit('selectHeadType',item,this.types);
                this.isOpen=false;
            },
            //获取选中样式
            getClass:function(item){
                if(this.types=='headType'){
                    return item.dicItemKey==this.activeColumn.headType?'active':'';
                }else if(this.types=='displayType'){
                     return item.dicItemKey==this.activeColumn.displayType?'active':'';
                }else if(this.types=='dictType'){
                    let hasValue=(this.activeColumn.headBindingList&&this.activeColumn.headBindingList.length>0)?this.activeColumn.headBindingList[0].dataKeyWord:'';
                    return item.dicItemKey==hasValue?'active':'';
                }
            },
            //显示评估单名称
            showNames:function(){
                if(this.types=='headType'){
                    let value=this.activeColumn.headType;
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
                }else if(this.types=='displayType'){
                    let value=this.activeColumn.displayType;
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
                }else if(this.types=='readFlag') {
                    let value=this.activeColumn.readFlag;
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
                }else if(this.types=="arrangement") {
                  
                    let value=this.activeColumn.alignType;
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
                else if(this.types=='dictType'){
                    let value=(this.activeColumn.headBindingList&&this.activeColumn.headBindingList.length>0)?this.activeColumn.headBindingList[0].dataKeyWord:'';
                    if(!value){
                        if(this.arr&&this.arr.length>0){
                            return this.arr[0].dicItemValue;
                        }else {
                            return '';
                        }
                    }
                    let obj=this.arr.find(al=>{
                        return al.dicItemKey==value;
                    });
                    return obj.dicItemValue;
                }
                
            },
            //点击打开
            clickOpen:function(){
                this.isOpen=true;
            }
        },
        watch:{
            activeColumn:function(curvalue,oldValue){
                this.isOpen=false;
                this.activeColumn=curvalue;
            },
        },
    }
</script>