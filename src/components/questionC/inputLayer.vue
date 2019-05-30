<template>
	<div class="bd">
	 <div class="hd">
		      <h3>{{inputLayerObj.layerTitle}} </h3>
		      <a class="i-close" @click="closeLayer()"></a>
		    </div>
		<div class="config-bd-pd">
			<textarea name="" rows="3" class="input-text input-textarea am-mt-10" :placeholder="inputLayerObj.placeholder" v-model="textarea_" maxlength="100"></textarea>
			<div class="am-btn-area">
				<a class="am-btn am-btn-primary w120" @click="save_()">保存</a>
				<!-- <a class="am-btn am-btn-primary w120" @click="cancel_()" v-if="inputLayerObj.type=='check'">取消填空</a> -->
			</div>
		</div>
	</div>
</template>
<script>
export default {
	    name: 'inputLayer',
	    props: ['inputLayerObj'],  
	    data () {
	    	return {
	    		textarea_:"",
	    		layerIndex:0,
	    	}
	    },
	    methods:{
	    	save_(){
	    		this.$emit("save",this.textarea_,this.inputLayerObj);
	    	},
	    	cancel_(){
	    		this.$emit("cancel",this.inputLayerObj.index);
	    	},
	    	init(content){
	    		this.textarea_ = content;
	    	},
	    	initLayer(index){
	    		this.layerIndex=index;
	    	},
	    	closeLayer(){
	    		layer.close(this.layerIndex);
	    	}
	    },
	}
</script>
