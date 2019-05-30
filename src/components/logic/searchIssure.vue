<template>
	<div class="am-search-bar am-mt-10"  style="width: 100%;" @mouseleave="leavePop">
		<div class="am-search-picker" style="width: 100%;" >
			<input  type="text" class="input-text" :placeholder="placehoMsg" v-model="inputValue" maxlength="20" @click.stop="focus_($event)"><i class="i-search" v-show="placehoMsg!=''"></i>
		</div>
		<div class="am-dropdown" id="searchTemplate" v-if="isSearchOpen">
			<ul class="search-remark-item-list">
				<li v-for="(item, index) in searchArrayFilter" :key="index" :class="{active:item.isSelect}" @click.stop="AddIssure(item)">
					<div class="lcont">{{item.aliasName}}</div>
					<div class="rside">
						<div class="remark">{{item.questionRemark}}</div>
						<a class="img" v-if="!item.isSelect"><img src="../../image/i-ring-plus.svg"></a>
						<span class="am-txt-muted" v-else>已添加</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import common from '../../util/common.js'
	export default{
		name:'search',
		data(){
			return{
				searchArrayFilter:[],
				searchBreak:false,
				inputValue:'',
				placehoMsg:this.placeHolderMsg,
				isSearchOpen:false,
			}
		},
		props:{
			placeHolderMsg:{
				type:String,
				default:"搜索添加问题/问题簇"
			},
			questionIdArr:{
				type:Array,
				default:function(){
					return [];
				}
			},
			Lobj:{
				type:Object,
				default:function(){
					return {};
				}
			},
			isLocationLogic:false,
		},
		methods:{
			clearCach(){
				this.inputValue='';
			},
			leavePop:function(){
				this.isSearchOpen=false;
			},
			focus_:function(event){
				this.filterByKey($.trim(this.inputValue));
				event.stopPropagation();
			},
			AddIssure:function(item){
				if(item.isSelect){
					return;
				}
				let that=this;
				item.isSelect=true;
				this.inputValue='';
				this.searchBreak=true;
				this.isSearchOpen=false;
				this.$nextTick(() => {
			      	that.searchBreak=false;
			    });
				this.$emit("addSearchItem",item);
			},
			
			filterByKey(keyvalue){
				if(keyvalue){
				let that=this;
				let url="knowledge-service/evaluation/cluster/search"
				if(this.isLocationLogic){
					url="knowledge-service/evaluation/cluster/search/main";
				}
		 		common.ajax({
				url:"knowledge-service/evaluation/cluster/search",
				dataType:"json",
				type:"get",
				async:true,
				data:{'keywords':keyvalue,'requestNum':20},
				callback:function(data){
					//debugger;
					let queationId=(that.Lobj.curObject&&that.Lobj.curObject.questionId)||that.Lobj.questionId;
					console.log(queationId);
					let tempArray=[];
					data.forEach(function(el){
							if(el.questionId!=queationId){
								tempArray.push($.extend({},el,{"isSelect":false}));
							}
						})

					if(that.Lobj!=undefined&&that.Lobj.arrLogic!=undefined){
						let addArray=that.Lobj.arrLogic;
						if(addArray.length>0){
							for(var i=0;i<addArray.length;i++){
								let item=addArray[i];
								for(var j=0;j<tempArray.length;j++){
									if(item.questionId==tempArray[j].questionId){
										tempArray[j].isSelect=true;
									}
								}
							}
						}
					}
					
					that.searchArrayFilter=tempArray;
					that.isSearchOpen=true;

					}
				});
			}},

		},
		mounted(){
			/**/
		},
		watch:{
			Lobj:function(cur,old){
				if(cur.sValue==old.sValue){
					return;
				}
				let that=this;
				this.inputValue=cur.sValue;
				this.searchBreak=true;
				this.isSearchOpen=false;
				this.$nextTick(() => {
				      that.searchBreak=false;
				});

			},
			inputValue:function(value){
				this.Lobj.sValue=value;
				if(this.searchBreak){
					return;
				}
				if(value!=""){
					this.filterByKey($.trim(value));
				}else{
					this.isSearchOpen=false;
					this.searchArrayFilter=[];
				}
			}
		},	
	}
</script>