<!-- 无数据 -->
<template>
	<div class="no-data">
        <div class="img"></div>
        <div class="responsive-txt">
            <div class="txt">{{content}}</div>
        </div>
    </div>
</template>
<script>
	export default{
		name:'noData',
		data(){
			return {
			}
		},
		props:['content']
	}
</script>
