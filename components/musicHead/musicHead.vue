<template>
	<view class="music-head" :style="{color : color}">
		<view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack' : iconblack}">
			<text class="iconfont iconzuojiantou-copy" @tap="handleToBack"></text>
			 | 
			<text class="iconfont iconshouye" @tap="handleToHome"></text>
		</view>
		<text class="music-head-title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name:"musicHead",
		data() {
			return {
				
			};
		},
		props: ['title','icon','color','iconblack'],
		methods:{
			handleToBack(){
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				// console.log(pages)
				uni.navigateBack({
				         delta: 1,
				         success: () => {
				             // beforePage.$vm.$refs.popu.reFresh(); // 执行前一个页面的刷新
							 // beforePage.$vm.popuRefresh()
				         }
				     });
			},
			handleToHome(){
				uni.switchTab({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: black;
		position: relative;
	}
	.music-head-icon{
		position: absolute;
		left: 8px;
		top: 40px;
		width: 90px;
		height: 30px;
		background: rgba(0,0,0,0.4);
		color: white;
		line-height: 30px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}
	.music-head-iconblack{
		color: black;
		border: 1px #eaeaea solid;
		background: white;
	}
	.music-head-title{
		position: relative;
		/* left: 8px; */
		top: 20px;
	}
</style>
