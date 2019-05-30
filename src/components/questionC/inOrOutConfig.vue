<template>
	<div class="bd">
     	<div class="hd">
	        <h3>出入量配置</h3>
	        <a class="i-close" @click="closeLayer()"></a>
      	</div>
        <div class="config-bd-pd" v-if="inOutConfigArr.length>0" v-for="(item,index) in inOutConfigArr">
        	<span class="txt chk-coll-active" >名称：</span>
        	<input type="text" class="input-text w80 am-ml-5"  style="ime-mode:Disabled;vertical-align: top;"  v-model="item.ioLiquidRelateName" />
        	<span class="txt chk-coll-active" >方式：</span>
            <selectRight v-if="layerObj.inOutTypeArr" :arr="layerObj.inOutTypeArr" :index="index" :activeQuestion="item" :types="'inoutType'" @selectSort="selectSort"></selectRight>
            <template v-if="item.ioLiquidType==1">
            	<a v-for="inItem in layerObj.inDetailArr" @click.stop="addDetail(item,inItem)" class="am-ml-10" :class="getClass(item,inItem)">{{inItem.dicItemValue}}
				<template v-if="getBindValue(item,inItem)">
					{{getBindValue(item,inItem)}}
				</template>
            	</a>
            </template>
            <template v-if="item.ioLiquidType==2">
            	<a v-for="inItem in layerObj.outDetailArr"  @click.stop="addDetail(item,inItem)" :class="getClass(item,inItem)" class="am-ml-10" >{{inItem.dicItemValue}}
				<template v-if="getBindValue(item,inItem)">
					{{getBindValue(item,inItem)}}
				</template>
            	</a>
            </template>
            <a class="i-link-del" style="margin-left:10px"  @click="delItem(index)"></a>
        </div>
        <div>
            <a class="am-btn am-btn-plain-primary " style="margin-top:20px;margin-left:20px" @click.stop="addInOutConfig($event)" >+ 出入量</a>
        </div>
        <div class="am-btn-area" style="clear: both">
            <a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
        </div>
        </div>
    </div>
</template>
<script>
//出入量配置
import selectRight from './selectRight.vue';
import common from '@/util/common.js';
	export default{
		data(){
			return{
				indexLayer:0,
				inOutConfigArr:[],
				layerObj:{},
				evaluationId:common.getUrlParam('assesmentId'),
			}
		},
		props:[],
		methods:{
			closeLayer:function(){
				layer.close(this.indexLayer);
			},
			//保存出入量配置
			save_:function(){
				for(var i=0;i<this.inOutConfigArr.length;i++){
					if(!this.inOutConfigArr[i].ioLiquidType||!this.inOutConfigArr[i].ioLiquidRelateName){
						common.tip_msg('请将数据填写完整再保存');
						return;
					}
				}
				let that=this;
				let data={
				  evaluationId: this.evaluationId,
				  relateList: this.inOutConfigArr,
				}
        common.ajax({
          url: 'knowledge-service/ioliquid/relate',
          dataType: "text",
          type: "post",
          data:JSON.stringify(data),
          callback: function(data) {
              that.closeLayer();
          }
        });
			},
			initLayer:function(indexLayer){
				this.indexLayer=indexLayer;
			},
			init:function(obj){
				this.inOutConfigArr=[];
                this.layerObj=obj;
                this.getAllInOrOutConfig();
            },
            getClass:function(item,inDetail){
	            if(item.detailList.length==0){
	                return 'am-txt-normal';
	            }
	            let findItem=item.detailList.find(al=>{
	            	return al.relateKey==inDetail.dicItemKey;
	            });
	            if(findItem){
	            	return 'am-txt-primary';
	            }else{
	            	return 'am-txt-normal';
	            }
	        },
	        getDisabled:function(){
	        	let that=this;
	        	debugger;
	        	if(this.layerObj&&this.layerObj.activeQuestion&&this.layerObj.activeQuestion.currNode){
	        		let uniqQuestion=this.inOutConfigArr.find(al=>{
	        			return al.detailList.find(dl=>{
	        				return dl.uniqueId==that.layerObj.activeQuestion.currNode.uniqueId;
	        			})
		        	});
		        	let nonQuestion=this.inOutConfigArr.find(al=>{
	        			return !al.detailList||(al.detailList&&al.detailList.length==0);
		        	});
		        	if(uniqQuestion||nonQuestion){
		        		return 'disabledSty';
		        	}	
	        	}
	        	return '';
	        },
	        getBindValue:function(item,inDetail){
	        	if(item.detailList.length==0){
	                return '';
	            }
	            let findItem=item.detailList.find(al=>{
	            	return al.relateKey==inDetail.dicItemKey;
	            });
	            if(findItem){
	            	return '('+findItem.aliasName+')';
	            }else{
	            	return '';
	            }
	        },
	        addDetail:function(item,inDetail){

	        	if(!item.detailList&&(item.detailList&&item.detailList.length==0)){
	        		let detailList=[];
	        		detailList.push({
				          aliasName: this.layerObj.activeQuestion.currNode.aliasName,
				          relateKey: inDetail.dicItemKey,
				          uniqueId: this.layerObj.activeQuestion.uniqueId,
				        });
	        		item.detailList=detailList;
	        	}else{
	        		let findItem=item.detailList.find(al=>{
		            	return al.relateKey==inDetail.dicItemKey;
		            });
		            if(findItem){
		            	item.detailList=item.detailList.filter(al=>{
		            		return al.relateKey!=inDetail.dicItemKey;
		            	});
		            }else{
		            	item.detailList.push({
		            		aliasName: this.layerObj.activeQuestion.currNode.aliasName,
					        relateKey: inDetail.dicItemKey,
					        uniqueId: this.layerObj.activeQuestion.currNode.uniqueId,
		            	});
		            }
	        	}
	        	console.log(item.detailList);
	        	console.log(this.inOutConfigArr);
	        	console.log('44444444');

	        },
	        delItem:function(index){
	        	this.inOutConfigArr.splice(index,1);
	        },
            getAllInOrOutConfig:function(){
            let that=this;
		        common.ajax({
		            url: 'knowledge-service/ioliquid/relate',
		            dataType: "json",
		            type: "get",
		            data:{evaluationId:this.evaluationId},
		            callback: function(data) {
		              	that.inOutConfigArr=data;
		            }
		        });
            },
            //增加出入量配置
            addInOutConfig:function(event){
            	let obj=$(event.currentTarget);
            	if(obj.hasClass('disabledSty')){
            		return;
            	}
            	let inOutItem={
            		detailList: [],
				    ioLiquidRelateName: "",
				    ioLiquidRelateType: "",
				    ioLiquidType: ""
				};
				this.inOutConfigArr.push(inOutItem);
            },
			  selectSort:function(item,type,index){
            if(type=='inoutType'){
              if(!item.dicItemKey){
                this.inOutConfigArr[index].ioLiquidType='';
              }else{
                this.inOutConfigArr[index].ioLiquidType=item.dicItemKey;
              }
              this.inOutConfigArr[index].detailList=[];
            }
	        },
		},
		components:{
			'selectRight':selectRight,
		}

	}
</script>
<style type="text/css">
.disabledSty{
	background: #ccc;
	color:#666;
	border-color: #ccc;
}	
</style>