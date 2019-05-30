<template>
	 <div class="am-item-inline" style="display:block;padding-right: 26px;">
	 <a class="i-hd-link-minus" title="删除"  @click.stop="deleteMergeOption"></a>

	   <div :class="[{'am-ctr-sel':true},{'w90':true},{'open':isJoinOpen}]" @click.stop="openJoinPop" @mouseleave="leavePop">
	    <a class="caption"  href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{optionObj.joinTypeName}}</a>
	    <div class="am-dropdown" v-show="isJoinOpen">
	     <ul>
	      <li v-for="item in arrJoinType" @click.stop="selectJoinType(item)"><a>{{item.name}}</a></li>
	      
	     </ul>
	    </div>
	   </div>

	   <div class="am-search-bar w120 am-ml-10" style="vertical-align: middle;" @mouseleave="leavePop">
		<div class="am-search-picker" style="width: 100%;" >
			<input  type="text" style="padding-right:10px" :class="[{'input-text':true},{'input-error':optionObj.validQuestion}]" placeholder="搜索问题" v-model="inputSearchValue" maxlength="20" @click.stop="focus_($event)"/>
		</div>
		 <div class="am-dropdown limit" id="searchTemplate" v-show="isSearchOpen" >
			<ul>
				<li v-for="item in searchArray"  @click.stop="AddQuestion(item)">
					<a>{{item.questionName}}</a>
				</li>
			</ul>
		</div>
	</div>

	   <div  :class="[{'am-ctr-sel':true},{'w120':true},{'open':isOptionOpen}]" @click.stop="openOptionPop" class="am-ml-10" @mouseleave="leavePop">
	    <a :class="[{'caption':true},{'input-error':optionObj.validOption}]" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{optionObj.optionName}} </a>
	    <div class="am-dropdown" v-show="isOptionOpen">
	     <ul>
	      <li v-for="item in optionArray" @click.stop="selectOption(item)"><a>{{item.optionName}}</a></li>
	     </ul>
	    </div>
	   </div>
	   <span style="margin: 0 10px;">为</span>
	   <div  :class="[{'am-ctr-sel':true},{'w90':true},{'open':isConditionTypeOpen}]" @click.stop="openConditionType" @mouseleave="leavePop">
	    <a :class="[{'caption':true},{'input-error':optionObj.validCondition}]" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">{{optionObj.conditionName}}</a>
	    <div class="am-dropdown" v-show="isConditionTypeOpen">
	     <ul>
	      <li v-for="item in conditionTypeArray" @click.stop="selectConditionType(item)"><a>{{item.name}}</a></li>
	     </ul>
	    </div>
	   </div>
	  </div>


</template>
<script>
	import search from './searchIssure.vue';
	import common from '../../util/common.js';
	export default{
		data(){
			return{
				isJoinOpen:false,
				isOptionOpen:false,
				isConditionTypeOpen:false,
				inputSearchValue:this.optionObj.questionName,
				isSearchOpen:false,
				searchArray:[],
				arrJoinType:[{'name':'并且','id':'1'},{'name':"或者",'id':'2'}],
				conditionTypeArray:[{"name":"请选择","id":""},{"name":"选中","id":"1"},{"name":"点击","id":"2"}],
				optionArray:[],
				searchBreak:false,
			}
		},
		props:{
			curObj:{
				type:Object,
				default:{},
			},
			optionObj:{
				type:Object,
				default:{},
			},
			nIndex:{},
		},
		methods:{
			openJoinPop(){
				this.isJoinOpen=true;
			},
			openOptionPop(){
				if(this.optionArray.length==0)
					return;
				this.isOptionOpen=true;
			},
			leavePop:function(){
				this.isJoinOpen=false;
				this.isOptionOpen=false;
				this.isSearchOpen=false;
				this.isConditionTypeOpen=false;
				this.leaveSearchPop=false;
			},
			openConditionType(){
				this.isConditionTypeOpen=true;
			},
			selectJoinType:function(item){
				this.optionObj.joinTypeName=item.name;
				this.optionObj.joinType=item.id;
				this.isJoinOpen=false;
			},
			selectOption:function(item){
				
				this.optionObj.optionName=item.optionName;
				this.optionObj.optionId=item.optionId;
				this.optionObj.validOption=false;
				this.isOptionOpen=false;
			},
			selectConditionType:function(item){
				this.optionObj.conditionName=item.name;
				this.optionObj.conditionType=item.id;
				this.isConditionTypeOpen=false;
				this.optionObj.validCondition=false;
			},
			AddQuestion:function(item){
				let arr=item.optionList;
				arr.splice(0,0,{'optionName':"请选择选项",'optionId':0});
				this.optionArray=arr;
				this.optionObj.optionName="请选择选项";
				this.optionObj.validQuestion=false;
				this.optionObj.optionId=0;
				this.isOptionOpen=false;
				this.inputSearchValue=item.questionName;
				this.optionObj.questionId=item.questionId;
				this.searBreak();
			},
			filterByKey(keyvalue){
			  if(keyvalue){
				let that=this;
		 		common.ajax({
				url:"knowledge-service/evaluation/question/search",
				dataType:"json",
				type:"get",
				async:false,
				data:{'keywords':keyvalue,'requestNum':20,'pageNum':0},
				callback:function(data){
					let queationId=that.curObj.curObject.questionId;
					let tempArray=[];
					data.forEach(function(el){
						if(el.questionId!=queationId&&el.optionList&&el.optionList.length>0){
						let name=that.filterName(el);
						let arrOption=[];
						if(el.optionList!=null||el.optionList!=undefined){
							el.optionList.forEach(function(item){
							let oName=that.filterName(item);
							arrOption.push({'optionName':oName,'optionId':item.optionId});
						  });
						}
						tempArray.push({"questionName":name,"questionId":el.questionId,"optionList":arrOption});
						}
					});
						that.searchArray=tempArray;
						that.isSearchOpen=true;
					}
				});
		 		}
			},			
			focus_:function(event){
				this.filterByKey($.trim(this.inputSearchValue));
				event.stopPropagation();
			},
			filterName(item){
        return item.aliasName || item.catalogueName;
			},
			searBreak(){
				let that=this;
				this.searchBreak=true;
				this.isSearchOpen=false;
				this.$nextTick(() => {
			      that.searchBreak=false;
				});
			},
			deleteMergeOption:function(){
				this.$emit("delMergeOption",this.nIndex);
			},
		},
		mounted(){
			let that=this;
			if(this.optionObj.questionId!=0&&this.optionObj.questionId!=undefined){
				
				if(this.curObj.arrQuestion&&this.curObj.arrQuestion.length>0){
					let option=this.curObj.arrQuestion.find(a=>{
						return a.questionId==that.optionObj.questionId;
					})
					if(option){
						option.optionList.map(a=>{
							a.optionName=that.filterName(a)
						})
						that.optionArray=option.optionList;
					}
				}
				this.optionArray.splice(0,0,{'optionName':"请选择选项",'optionId':0});
			}
		},

		watch:{
			optionObj:function(){
				this.searBreak();
				this.inputSearchValue=this.optionObj.questionName;
			},
			inputSearchValue:function(curValue){
				this.optionObj.questionName=curValue;
				if(this.searchBreak)
					return;
				if(curValue!=""){
					this.filterByKey(curValue);
				}else{
					this.isSearchOpen=false;
					 this.searchArray=[];
				}
			},
		},
		components:{
			search,
		}
	}
</script>