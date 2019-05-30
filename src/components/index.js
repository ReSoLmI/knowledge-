import Vue from 'vue';
import noData from './common/noData';

Vue.component('noData', {
	props:['content'],
    render: function(h) {
    	var a = this.content;
    	return h(noData,{
	      props: {
	        content: a
	      }
	    })
	}
})
