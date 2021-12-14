<template>
	<view class="playMv">
		<video id="myVideo" :src="mvUrl" enable-play-gesture="true">
		</video>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue';
	import {MVUrl,getCookie} from '../../common/api.js'
	export default {
		components: {
			musicHead
		},
		data() {
			return {
				mvUrl: ''
			}
		},
		onLoad(options) {
			MVUrl(options.mvId).then(res =>{
				if(res[1].data.code == '200'){
					this.mvUrl = res[1].data.data.url
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style>
	#myVideo{
		width: 100%;
	}
</style>
