<template>
    <div class="am-ctr-sel w80 am-ml-10" :class="{open:isOpen}" @click.stop="clickOpen" @mouseleave="isOpen=false">
        <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{showNames(activeColumn.headType)}}</a>
        <div class="am-dropdown am-mr-10" v-show="isOpen">
            <ul>
             <li v-for="item in arr" @click.stop="selectItem(item)" :class="{'active':item.headType==activeColumn.headType?true:false}"><a>{{item.name}}</a></li>
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
        props:['activeColumn','arr'],
        methods:{
            selectItem:function(item){
                this.$emit('selectHeadType',item.headType);
                this.isOpen=false;

            },
            showNames:function(value){
                 if(!value){
                   if(this.arr&&this.arr.length>0){
                        return this.arr[0].name;
                    }else{
                        return '';
                    }
                }
                let obj=this.arr.find(al=>{
                        return al.headType==value;
                    });
                return obj.name;
            },
            clickOpen:function(){
                this.isOpen=true;
            }

        },
        watch:{
            activeColumn:function(curvalue,oldValue){
                //debugger;
                this.isOpen=false;
                this.activeColumn=curvalue;
                if(!this.activeColumn.headType){
                   
                }

            },
        }
    }
</script>