import App from './App'

import axios from 'axios'
import VueAxios from "vue-axios";
import store from 'store/index.js'
import popuFab from '@/components/popu-fab/popu-fab.vue'
Vue.use(VueAxios,axios)
Vue.filter('formatCount',function(value){
	if(value>=10000 && value<=100000000){
		value /= 1000;
		return value.toFixed(1)+'万';
	}
	else if(value>100000000){
		value /= 100000000;
		return value.toFixed(1)+'亿';
	}
	else{
		return value;
	}
});

Vue.filter('formatTime',function(value){
	let date = new Date(value);
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '号' + date.getHours() + '点'
})

Vue.component('popu-fab', popuFab)
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif