<template>
	<div>
	<menuTemplate ref="leftmenu"></menuTemplate>
	<div class="page-rcont page-rcont-second">
		<div>
			<iframe frameborder=0 style="width:100%;height:100%;position: absolute;top:0;left:0;"  :src="src"></iframe>
		</div>
	</div>
	</div>
</template>
<script>
import menu from '../../components/menu.vue';
import common from '../../util/common.js';
	export default{
		data(){
			return{
				src:'',
				token:common.getUrlParam('token'),
				localDomin:'',
				wardCode:common.getUrlParam("wardCode"),
			}
		},
		mounted(){
			this.initUrl();
		},
		methods:{
			getDomin(){
				let that=this;
				 common.ajax({
					url:"questionnaire-service/util/domain",
					dataType:"text",
					type:"get",
					async:false,
					data:{},
					callback:function(data){
						that.localDomin=data;
					}
				});
			},
			initUrl:function(){
				this.getDomin();
				
				if(this.$route.path=='/questionnaireTemplate'){
					this.src='http://'+this.localDomin+'/#/?wardCode='+this.wardCode;
				}else if(this.$route.path=='/questionnaireCach'){
					this.src='http://'+this.localDomin+'/#/questionList?wardCode='+this.wardCode;

				}else if(this.$route.path=='/questionnaireList'){
					this.src='http://'+this.localDomin+'/#/questionnatePage?wardCode='+this.wardCode;
				}
				let that=this;
				this.$nextTick(() => {
					
					let selectName='';
					if(this.$route.path=='/questionnaireTemplate'){
						selectName='questionnaireTemplate';
					}else if(this.$route.path=='/questionnaireCach'){
						selectName='questionnaireCach';
					}else if(this.$route.path=='/questionnaireList'){
						selectName='questionnaireList';
					}
					that.$refs.leftmenu.initMenus();
					that.$refs.leftmenu.selectClick(selectName);
				  });
			},
		},
		watch:{
		    $route:function(cur){
		      this.initUrl();
		    },
		  },
		  components:{
		  	'menuTemplate':menu,
		  }
	}
</script>