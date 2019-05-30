<template>
	<div class="am-search-bar">
		<input type="text" class="input-text " id="mainQuestion" :style="{width:!source?'330px':'330px'}"  v-model="name_" :placeholder="placeholder_" @click="focus_($event)"/>
		<div class="am-dropdown" style="display:block;max-height:250px;overflow:auto" v-show="list.length > 0"  >
			<ul class="search-item-list" >
				<li  v-for="(el,index) in list" @click="setVal(el,$event)">
					<template v-if="!type">
						<div class="lcont">{{el.catalogueName}}</div>
						<div class="rside">{{el.catalogueRemark}}</div> 
					</template>
					<template v-else>
						<div class="lcont">{{el.aliasName}}</div>
						<div class="rside">{{el.questionRemark}}</div>
					</template>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import common from '@/util/common.js';
import { getCatalogue } from '@/util/util';
export default {
	    name: 'inputLayer',
	    props: ['placeholder_','item','index_','type','source'],  
	    data () {
	    	return {
	    		name_:"",
	    		list:[], //存放查询结果
	    		isQuery:false, //是否要查询列表
	    	}
	    },
	    methods:{
	    	setName_(item){
	    		if(this.type == "cluster"){
	    			this.name_ = item.aliasName;
	    		}else{
	    			this.name_ = item.aliasName || item.catalogueName;
	    		}
	    	},
	    	clear(){
	    		// console.log('qingli');
	    		this.name_ = "";
	    		this.isQuery = false;
	    	},
	    	focus_(event){
	    		//debugger;
	    		if(this.list.length==0){
					this.getList($.trim(this.name_));
	    		}
	    		event.stopPropagation();
	    	},
	    	initName_(){
	    		//debugger;
	    		if(this.type == "cluster"){
    				if(this.item && this.item.questionId){
    					this.name_ = this.item.aliasName;
    				}else{
    					this.name_ = "";
    				}

    			}else{
    				if(this.item && this.item.catalogueCode){
	    				this.name_=this.convertName(this.item);
	    			}else{
	    				this.name_ = "";
	    			}
    			}
	    	},
	    	blur_(){
	    		//debugger;
	    		let name=this.name;
	    		this.list = [];
	    	},
	    	setVal(item,event){
          // console.log('进入');
	    		this.$emit("complete",item,this.index_);
	    		this.setName_(item);
	    		this.list = [];
	    		this.reventRefresh();
	    		event.stopPropagation();
	    	},
	    	reventRefresh(){
	    		this.isQuery = true;
    			let that=this;
    			this.$nextTick(() => {
		     	 that.isQuery=false;
		    	 });
    		},
    		convertName(item){
          return item.aliasName || item.catalogueName;
			  },
	    	getList(val){
	    		if(val){
	    			let that = this;
		    		console.log("查询列表");
		    		let url = "knowledge-service/dictionary/code/search";
		    		let obj = {
		    			catalogueRule:getCatalogue(),
	                	keywords:val,
	                	typeList:'EVALUATION,DIAGNOSIS,INDUCEMENT'
		    		};
		    		if(that.type == 'cluster'){
		    			url = "knowledge-service/evaluation/getCluster";
		    			obj = {keywords:val};
		    		}

		    		common.ajax({
		                url:url,
		                type:"get",
		                data:obj,
		                callback:function(data){
		                	if(that.type == "cluster"){
		                		that.list = data.content;
		                	}else{
		                		that.list = data;
		                	}
		                	console.log('列表为');
		                	console.log(that.list);
		                	
		                }
		            });
	    		}else{
	    			this.list = [];
	    		}
	    	}
	    },
	    mounted(){
	    	this.initName_();
	    	this.reventRefresh();

	    },
	    watch: {
		    name_: function (val, oldVal) {
		     if(this.isQuery)
		    	return;
		      
		      console.log('new: %s, old: %s', val, oldVal)
		      if($.trim(val) != $.trim(oldVal)){
				this.getList($.trim(val));
		      }
		      
		    },
		    item:function(curVal){
		    	if(this.item && this.item.catalogueCode){
		    		this.name_=this.convertName(this.item);
    			}else{
    				this.name_ = "";
    			}
    			this.reventRefresh();
		    },
		}
	    }
</script>
