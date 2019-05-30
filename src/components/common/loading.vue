<template>
<!-- <div class="loading">
      <p v-show="load" class="center">
          <mt-spinner type="fading-circle"></mt-spinner>
          加载中...
      </p>
</div> -->
<div>
  <div :class="['loading_jump',className]" v-if="type=='loading_more'&&load">
    <div class="bird">
      <div class="body"></div>
      <div class="eyes"></div>
      <div class="arms"></div>
      <div class="shadow"></div>
    </div>
    <span class="txt">{{tip || '加载中'}}...</span>
  </div>
  <div :class="['loading_up',className]" v-if="type=='loading'&&load">
    <div class="bird">
      <div class="body"></div>
      <div class="light"></div>
    </div>
    <span class="txt">{{tip || '加载中'}}..<em>.</em></span>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
// import { Spinner} from 'mint-ui';
// Vue.component(Spinner.name, Spinner);

export default {
  name: 'loading',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: ['load','type','className','tip'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.center{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    /* -webkit-box-orient: horizontal; */
    /* -webkit-flex-flow: row nowrap; */
    /* flex-flow: row nowrap; */
    text-align: center;
    align-items: center;
    justify-content: center;padding:20px;
  }
</style>
