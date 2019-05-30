<template>
<div>
   <menuTemplate ref="leftmenu"></menuTemplate>
	<div class="page-rcont page-rcont-second">
		<noData content="您还没有权限,请联系管理员!"></noData>
	</div>
  </div>
</template>
<script>
	import noData from '@/components/common/noData';
	import menu from '../components/menu.vue';
	export default{
		components:{
			'menuTemplate':menu,
			'noData':noData
		}
	}
</script>